import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import ChatPage from "./Pages/ChatPage";
import ErrorPage from "./Pages/ErrorPage";

const AppRouter: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {user && (
          <>
            <Route path="/chat" element={<ChatPage />} />
          </>
        )}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
