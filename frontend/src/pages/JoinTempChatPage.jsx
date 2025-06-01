import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MessageSquare, Users, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const JoinTempChatPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [participantName, setParticipantName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`/api/temp-chat/session/${sessionId}`);
        const data = await response.json();

        if (response.ok) {
          setSessionInfo(data);
        } else {
          setSessionError(data.error || "Session not found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setSessionError("Failed to load session");
      }
    };

    if (sessionId) {
      checkSession();
    }
  }, [sessionId]);

  const handleJoinChat = async (e) => {
    e.preventDefault();
    
    if (!participantName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/temp-chat/join/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participantName: participantName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Successfully joined the chat!");
        navigate(`/temp-chat/${sessionId}?type=participant&name=${encodeURIComponent(participantName.trim())}`);
      } else {
        toast.error(data.error || "Failed to join chat");
      }
    } catch (error) {
      console.error("Error joining chat:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Chat Session Not Found
          </h2>
          <p className="text-base-content/70 mb-6">
            {sessionError}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-base-content/60">
              The chat link may have expired or been deleted.
            </p>
            <Link to="/create-temp-chat" className="btn btn-primary">
              Create Your Own Chat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <MessageSquare className="w-12 h-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-base-content">
            Join Chat
          </h2>
          {sessionInfo && (
            <p className="mt-2 text-sm text-base-content/70">
              <span className="font-medium">{sessionInfo.creatorName}</span> invited you to chat
            </p>
          )}
        </div>

        {sessionInfo && (
          <div className="bg-base-100 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Chat with {sessionInfo.creatorName}</h3>
                <p className="text-sm text-base-content/70">
                  This is a temporary chat session
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleJoinChat}>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Your Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter your name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              required
              disabled={!sessionInfo}
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading || !sessionInfo}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Joining...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Join Chat
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/create-temp-chat" className="link link-primary text-sm">
            Create your own chat instead
          </Link>
        </div>

        <div className="mt-8 p-4 bg-warning/10 rounded-lg">
          <h4 className="font-semibold text-warning mb-2">Privacy Notice:</h4>
          <ul className="text-sm text-base-content/70 space-y-1">
            <li>• This chat is temporary and anonymous</li>
            <li>• Messages will be deleted when either person leaves</li>
            <li>• No registration or personal info required</li>
            <li>• Chat expires automatically in 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JoinTempChatPage;