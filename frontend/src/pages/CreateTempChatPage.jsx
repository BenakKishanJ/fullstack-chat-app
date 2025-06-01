import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Copy, Share2, Users } from "lucide-react";
import toast from "react-hot-toast";

const CreateTempChatPage = () => {
  const [creatorName, setCreatorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatLink, setChatLink] = useState("");
  const [sessionId, setSessionId] = useState("");

  const handleCreateChat = async (e) => {
    e.preventDefault();
    
    if (!creatorName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/temp-chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorName: creatorName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setChatLink(data.shareLink);
        setSessionId(data.sessionId);
        toast.success("Chat link created successfully!");
      } else {
        toast.error(data.error || "Failed to create chat link");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(chatLink);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my temporary chat",
          text: `${creatorName} invited you to a temporary chat`,
          url: chatLink,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <MessageSquare className="w-12 h-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-base-content">
            Create Temporary Chat
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Create a temporary chat link to share with anyone
          </p>
        </div>

        {!chatLink ? (
          <form className="mt-8 space-y-6" onSubmit={handleCreateChat}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Your Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter your name"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Create Chat Link
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-base-100 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Your Chat Link is Ready!
              </h3>
              
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Share this link:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm"
                      value={chatLink}
                      readOnly
                    />
                    <button
                      onClick={copyToClipboard}
                      className="btn btn-outline btn-square"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={shareLink}
                    className="btn btn-primary flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Link
                  </button>
                  <Link
                    to={`/temp-chat/${sessionId}?type=creator&name=${encodeURIComponent(creatorName)}`}
                    className="btn btn-secondary flex-1"
                  >
                    Start Chat
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setChatLink("");
                  setSessionId("");
                  setCreatorName("");
                }}
                className="btn btn-ghost btn-sm"
              >
                Create Another Chat
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link to="/" className="link link-primary text-sm">
            Back to Home
          </Link>
        </div>

        <div className="mt-8 p-4 bg-info/10 rounded-lg">
          <h4 className="font-semibold text-info mb-2">How it works:</h4>
          <ul className="text-sm text-base-content/70 space-y-1">
            <li>• Share the generated link with anyone</li>
            <li>• They can join without creating an account</li>
            <li>• Chat is temporary and deleted when someone leaves</li>
            <li>• Links expire in 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateTempChatPage;