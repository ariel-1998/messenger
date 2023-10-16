import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import ChatPage from "./Pages/AuthedPages/ChatPage";
import ErrorPage from "./Pages/ErrorPage";
import AuthedHeader from "./Pages/AuthedPages/AuthedHeader";
import { chatService } from "../services/chatService";
import { getAllChats } from "../utils/chatSlice";
import { toastifyService } from "../services/toastifyService";

const AppRouter: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    chatService.getAllChats().catch((e) => toastifyService.error(e));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {user && (
        <Route path="/chat" element={<AuthedHeader />}>
          <Route path="" element={<ChatPage />} />
        </Route>
      )}

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRouter;
