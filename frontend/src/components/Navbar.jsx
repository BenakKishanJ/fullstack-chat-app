import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Clock, Home } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const isOnTempChatPage = location.pathname.includes('/temp-chat');

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to={authUser ? "/" : "/welcome"} className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
            
            {isOnTempChatPage && (
              <div className="badge badge-warning gap-2">
                <Clock className="w-3 h-3" />
                Temporary Chat
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isOnTempChatPage && (
              <>
                <Link to="/create-temp-chat" className="btn btn-sm btn-outline gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Quick Chat</span>
                </Link>
                
                <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                {authUser && (
                  <>
                    <Link to="/profile" className="btn btn-sm gap-2">
                      <User className="size-5" />
                      <span className="hidden sm:inline">Profile</span>
                    </Link>

                    <button className="btn btn-sm gap-2" onClick={logout}>
                      <LogOut className="size-5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                )}

                {!authUser && (
                  <>
                    <Link to="/login" className="btn btn-sm btn-primary">
                      Sign In
                    </Link>
                    <Link to="/signup" className="btn btn-sm btn-outline">
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}

            {isOnTempChatPage && (
              <Link to="/welcome" className="btn btn-sm gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
