import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import UnauthedHome from "./UnauthedHome";
import AuthedHome from "./AuthedHome";

const HomePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
  return !user ? <UnauthedHome /> : <AuthedHome />;
};

export default HomePage;
