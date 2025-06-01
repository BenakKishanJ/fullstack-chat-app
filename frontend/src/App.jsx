import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import CreateTempChatPage from "./pages/CreateTempChatPage";
import JoinTempChatPage from "./pages/JoinTempChatPage";
import TempChatPage from "./pages/TempChatPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Routes>
        {/* Landing page - always accessible */}
        <Route path="/welcome" element={<LandingPage />} />
        
        {/* Temporary chat routes - no auth required */}
        <Route path="/create-temp-chat" element={<CreateTempChatPage />} />
        <Route path="/join/:sessionId" element={<JoinTempChatPage />} />
        <Route path="/temp-chat/:sessionId" element={<TempChatPage />} />
        
        {/* Regular app routes */}
        <Route path="/" element={
          <>
            <Navbar />
            {authUser ? <HomePage /> : <Navigate to="/welcome" />}
          </>
        } />
        <Route path="/signup" element={
          <>
            <Navbar />
            {!authUser ? <SignUpPage /> : <Navigate to="/" />}
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            {!authUser ? <LoginPage /> : <Navigate to="/" />}
          </>
        } />
        <Route path="/settings" element={
          <>
            <Navbar />
            <SettingsPage />
          </>
        } />
        <Route path="/profile" element={
          <>
            <Navbar />
            {authUser ? <ProfilePage /> : <Navigate to="/login" />}
          </>
        } />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
