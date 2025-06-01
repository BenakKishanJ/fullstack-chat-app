import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Send, Image, LogOut, Users, AlertCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const TempChatPage = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userType = searchParams.get("type"); // "creator" or "participant"
  const userName = searchParams.get("name");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!sessionId || !userType || !userName) {
      navigate("/");
      return;
    }

    initializeChat();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [sessionId, userType, userName, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      // First, get session info and messages
      const [sessionResponse, messagesResponse] = await Promise.all([
        fetch(`/api/temp-chat/session/${sessionId}`),
        fetch(`/api/temp-chat/messages/${sessionId}`),
      ]);

      const sessionData = await sessionResponse.json();
      const messagesData = await messagesResponse.json();

      if (!sessionResponse.ok) {
        setSessionError(sessionData.error || "Session not found");
        setIsLoading(false);
        return;
      }

      if (messagesResponse.ok) {
        setMessages(messagesData);
      }

      // Set other user info
      const otherUserName =
        userType === "creator"
          ? sessionData.participantName
          : sessionData.creatorName;

      setOtherUser(otherUserName);

      // Initialize socket connection
      const isProduction = window.location.hostname !== "localhost" && 
                          window.location.hostname !== "127.0.0.1" && 
                          !window.location.hostname.includes("5173") &&
                          !window.location.hostname.includes("5174");
      const socketUrl = isProduction ? window.location.origin : "http://localhost:5001";

      const newSocket = io(socketUrl, {
        query: {
          sessionId,
          userType,
        },
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        setIsLoading(false);
        console.log("Connected to temp chat");
      });

      newSocket.on("connectedToTempChat", (data) => {
        setIsOtherUserOnline(data.otherUserConnected);
      });

      newSocket.on("userJoined", (data) => {
        if (data.userType !== userType) {
          setIsOtherUserOnline(true);
          setOtherUser(data.userName);
          toast.success(`${data.userName} joined the chat`);
        }
      });

      newSocket.on("userDisconnected", (data) => {
        if (data.userType !== userType) {
          setIsOtherUserOnline(false);
          toast.error("Other user disconnected");
        }
      });

      newSocket.on("newTempMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on("chatSessionEnded", () => {
        toast.error("Chat session has ended");
        navigate("/");
      });

      newSocket.on("error", (error) => {
        toast.error(error);
        setSessionError(error);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("Error initializing chat:", error);
      setSessionError("Failed to load chat");
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket) return;

    try {
      const response = await fetch(`/api/temp-chat/send/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newMessage,
          senderName: userName,
          senderType: userType,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleLeaveChat = async () => {
    if (
      window.confirm(
        "Are you sure you want to leave? This will end the chat session for both users.",
      )
    ) {
      try {
        await fetch(`/api/temp-chat/leave/${sessionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userType }),
        });

        if (socket) {
          socket.disconnect();
        }

        toast.success("Left chat session");
        navigate("/");
      } catch (error) {
        console.error("Error leaving chat:", error);
        toast.error("Failed to leave chat");
      }
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="w-full max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Chat Session Error</h2>
          <p className="text-base-content/70 mb-6">{sessionError}</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Chat Header */}
      <div className="bg-base-100 border-b border-base-300 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-sm">
                  {otherUser ? otherUser[0].toUpperCase() : "?"}
                </span>
              </div>
            </div>
            <div>
              <h2 className="font-semibold">
                {otherUser || "Waiting for participant..."}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${isOtherUserOnline ? "bg-success" : "bg-error"}`}
                ></div>
                <span className="text-base-content/70">
                  {isOtherUserOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="badge badge-warning badge-sm">Temporary Chat</div>
            <button onClick={handleLeaveChat} className="btn btn-error btn-sm">
              <LogOut className="w-4 h-4" />
              Leave
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-base-content/50 mt-8">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = message.senderType === userType;
                return (
                  <div
                    key={index}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? "bg-primary text-primary-content"
                          : "bg-base-100 border border-base-300"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!isOwnMessage && (
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-6">
                              <span className="text-xs">
                                {message.senderName[0].toUpperCase()}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          {!isOwnMessage && (
                            <div className="text-xs opacity-70 mb-1">
                              {message.senderName}
                            </div>
                          )}
                          {message.image && (
                            <img
                              src={message.image}
                              alt="Shared image"
                              className="max-w-full rounded mb-2"
                            />
                          )}
                          {message.text && (
                            <p className="text-sm">{message.text}</p>
                          )}
                          <div
                            className={`text-xs mt-1 opacity-70 ${isOwnMessage ? "text-right" : ""}`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-base-100 border-t border-base-300">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!isConnected}
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                className="btn btn-outline btn-square"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isConnected}
              >
                <Image className="w-5 h-5" />
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!newMessage.trim() || !isConnected}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempChatPage;
