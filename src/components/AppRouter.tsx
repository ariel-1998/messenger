import React, { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import ErrorPage from "./Pages/ErrorPage";
import ChatPage from "./Pages/AuthedPages/ChatPage";
import AuthPage from "./Pages/AuthPage";
import SocketProvider from "../contexts/SocketProvider";
import UnreadMessagesProvider from "../contexts/UnreadMessagesProvider";

const AppRouter: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to={"/auth"} />} />
        </>
      ) : (
        <>
          <Route path="/" element={<AuthedProviders />}>
            <Route path="chat" element={<ChatPage />} />
            <Route path="*" element={<ErrorPage navigatTo={"/chat"} />} />
          </Route>
        </>
      )}
    </Routes>
  );
};

export default AppRouter;

function AuthedProviders() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/chat");
  }, []);
  return (
    <UnreadMessagesProvider>
      <SocketProvider>
        <Outlet />
      </SocketProvider>
    </UnreadMessagesProvider>
  );
}
