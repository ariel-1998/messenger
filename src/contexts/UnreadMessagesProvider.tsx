import React, { ReactNode, createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";

type UnreaMessagesContextProps = {
  // messages:
  message: null;
};
const UnreaMessagesContext = createContext(null);

type UnreadMessagesProviderProps = {
  children: ReactNode;
};
const useUnreadMessages = () => {
  const context = useContext(UnreaMessagesContext);
};
const UnreadMessagesProvider: React.FC<UnreadMessagesProviderProps> = ({
  children,
}) => {
  const { chats } = useSelector((state: RootState) => state.chat);

  useEffect(() => {}, []);
  return (
    <UnreaMessagesContext.Provider value={{ message: null }}>
      {children}
    </UnreaMessagesContext.Provider>
  );
};

export default UnreadMessagesProvider;
