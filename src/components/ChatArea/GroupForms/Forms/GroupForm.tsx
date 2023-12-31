import AddMemberToGroup from "./AddMemberToGroup";
import CreateGroupChat from "./CreateGroupChat";
import DeleteGroupChat from "./DeleteGroupChat";
import LeaveGroup from "./LeaveGroup";
import RemoveGroupMembers from "./RemoveGroupMembers";
import RenameGroupChat from "./RenameGroupChat";

const GroupForm = {
  Create: CreateGroupChat,
  Rename: RenameGroupChat,
  AddMembers: AddMemberToGroup,
  RemoveMember: RemoveGroupMembers,
  Remove: DeleteGroupChat,
  Leave: LeaveGroup,
};
export default GroupForm;
