import { Link } from "react-router-dom";
import { MessageSquare, Users, Clock, Shield, Zap, Globe } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/20 rounded-full">
              <MessageSquare className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-base-content mb-6">
            Chat Your Way
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
            Choose between permanent account-based chats or quick temporary anonymous conversations. 
            Connect with anyone, anywhere, instantly.
          </p>
        </div>

        {/* Chat Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Temporary Chat Option */}
          <div className="bg-base-100 rounded-2xl p-8 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-secondary/20 rounded-full">
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">Quick Chat</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-base-content/80">
                <Zap className="w-5 h-5 text-success" />
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/80">
                <Shield className="w-5 h-5 text-success" />
                <span>Anonymous and private</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/80">
                <Globe className="w-5 h-5 text-success" />
                <span>Share link with anyone</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/80">
                <Clock className="w-5 h-5 text-warning" />
                <span>Auto-deletes after 24 hours</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/create-temp-chat"
                className="btn btn-secondary w-full"
              >
                <Users className="w-5 h-5 mr-2" />
                Create Temporary Chat
              </Link>
              <p className="text-sm text-base-content/60 text-center">
                Perfect for quick conversations with friends, support, or strangers
              </p>
            </div>
          </div>

          {/* Regular Chat Option */}
          <div className="bg-base-100 rounded-2xl p-8 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/20 rounded-full">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">Full Chat</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-base-content/80">
                <Shield className="w-5 h-5 text-success" />
                <span>Secure user accounts</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/80">
                <Users className="w-5 h-5 text-success" />
                <span>Persistent conversations</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/80">
                <MessageSquare className="w-5 h-5 text-success" />
                <span>Message history saved</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/80">
                <Globe className="w-5 h-5 text-success" />
                <span>Find and connect with users</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                className="btn btn-primary w-full"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn btn-outline w-full"
              >
                Create Account
              </Link>
              <p className="text-sm text-base-content/60 text-center">
                For ongoing conversations with friends and contacts
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-base-content mb-8">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
              <p className="text-base-content/70">
                Real-time messaging with instant delivery and notifications
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Privacy First</h4>
              <p className="text-base-content/70">
                Your data is protected with end-to-end encryption and privacy controls
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Universal Access</h4>
              <p className="text-base-content/70">
                Works on any device, anywhere in the world, no downloads required
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-base-100 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              Ready to Start Chatting?
            </h3>
            <p className="text-base-content/70 mb-6">
              Whether you need a quick anonymous chat or a full-featured messaging experience, 
              we&apos;ve got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-temp-chat"
                className="btn btn-secondary btn-lg"
              >
                Try Quick Chat
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-lg"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;