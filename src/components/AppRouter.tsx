import React, { useEffect, lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
const ChatPage = lazy(() => import("./Pages/AuthedPages/ChatPage"));
const AuthPage = lazy(() => import("./Pages/AuthPage"));
// import ChatPage from "./Pages/AuthedPages/ChatPage";
// import AuthPage from "./Pages/AuthPage";
import SocketProvider from "../contexts/SocketProvider";
import UnreadMessagesProvider from "../contexts/UnreadMessagesProvider";
import { Box, CircularProgress } from "@mui/material";

const AppRouter: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {!user ? (
        <>
          <Route
            path="/auth"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <AuthPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to={"/auth"} />} />
        </>
      ) : (
        <>
          <Route path="/" element={<AuthedProviders />}>
            <Route
              path="chat"
              element={
                <Suspense fallback={<SuspenseFallback />}>
                  <ChatPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to={"/"} />} />
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
  }, [navigate]);
  return (
    <UnreadMessagesProvider>
      <SocketProvider>
        <Outlet />
      </SocketProvider>
    </UnreadMessagesProvider>
  );
}

function SuspenseFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={30} />
    </Box>
  );
}
