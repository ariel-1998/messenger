import AddMemberToGroup from "./AddMemberToGroup";
import CreateGroupChat from "./CreateGroupChat";
import DeleteGroupChat from "./DeleteGroupChat";
import GroupMembersWHandleClose from "./GroupMembersWHandleClose";
import RenameGroupChat from "./RenameGroupChat";

const GroupForm = {
  Create: CreateGroupChat,
  Rename: RenameGroupChat,
  AddMembers: AddMemberToGroup,
  RemoveMember: GroupMembersWHandleClose,
  Remove: DeleteGroupChat,
};
export default GroupForm;
