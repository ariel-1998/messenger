import { messages } from "../../../mocks/mockData";
import { UnreadMessages } from "../../contexts/UnreadMessagesProvider";

function addMessageToObj() {
  const messagesObj: UnreadMessages = {};
  messages.forEach((message) => {
    const chatId = message.chat._id;
    if (!messagesObj[chatId]) messagesObj[chatId] = [];
    messagesObj[chatId].push(message);
  });
  return messagesObj;
}

const useUnreadMessages = jest.fn();
export default useUnreadMessages;

const defaultMock = {
  unreadMessages: addMessageToObj(),
  unreadAmount: messages.length,
  addUnreadMessage: jest.fn(),
  removeUnreadMessages: jest.fn(),
  fetchingChats: false,
};

beforeEach(() => {
  useUnreadMessages.mockReturnValue(defaultMock);
});
