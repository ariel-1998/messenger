import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import ErrorPage from "./Pages/ErrorPage";
import ChatPage from "./Pages/AuthedPages/ChatPage";
import AuthPage from "./Pages/AuthPage";

const AppRouter: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {!user ? (
        <Route path="/auth" element={<AuthPage />} />
      ) : (
        <Route path="/chat" element={<ChatPage />} />
      )}

      <Route
        path="*"
        element={<ErrorPage navigatTo={!user ? "/auth" : "/chat"} />}
      />
    </Routes>
  );
};

export default AppRouter;
