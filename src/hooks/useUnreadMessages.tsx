import { useContext } from "react";
import { UnreadMessagesContext } from "../contexts/UnreadMessagesProvider";

const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (context === null) {
    throw new Error(
      "useUnreadMessages must be used within a UnreadMessagesProvider"
    );
  }
  return context;
};

export default useUnreadMessages;
