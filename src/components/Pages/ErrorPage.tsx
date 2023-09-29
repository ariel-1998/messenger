import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  path?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  path = "/",
}: ErrorPageProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(path);
    }, 2000);
  }, []);

  return <div>ErrorPage</div>;
};

export default ErrorPage;
