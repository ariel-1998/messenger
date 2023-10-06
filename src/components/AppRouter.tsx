import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import ChatPage from "./Pages/AuthedPages/ChatPage";
import ErrorPage from "./Pages/ErrorPage";
import AuthedHeader from "./Pages/AuthedPages/AuthedHeader";

const AppRouter: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {user && (
        <Route path="/chat" element={<AuthedHeader />}>
          <Route path="" element={<ChatPage />} />
          <Route path=":chatId" element={<ChatPage />} />
        </Route>
      )}

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRouter;
