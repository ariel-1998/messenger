import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  navigatTo: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ navigatTo }: ErrorPageProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(navigatTo);
    }, 2000);
  }, []);

  return <div>ErrorPage</div>;
};

export default ErrorPage;
