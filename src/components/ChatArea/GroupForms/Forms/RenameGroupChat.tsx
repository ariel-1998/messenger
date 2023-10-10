import { Button, Stack } from "@mui/material";
import React, { useRef } from "react";
import GroupFormInput from "../GroupFormInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../../../../services/chatService";
import {
  ErrorModels,
  toastifyService,
} from "../../../../services/toastifyService";
import { ChatModel, groupNameSchema } from "../../../../models/ChatModel";
import { extractZodErrors } from "../../../../utils/zodMetods";
import { ZodError } from "zod";

interface RenameGroupChatProps {
  groupName: string;
  groupId: string;
}

const RenameGroupChat: React.FC<RenameGroupChatProps> = ({
  groupName,
  groupId,
}) => {
  const renameRef = useRef<HTMLDivElement>();
  const queryClient = useQueryClient();

  const renameMutation = useMutation({
    mutationFn: chatService.renameGroup,
    onError: (error: ErrorModels) => toastifyService.error(error),
    onSuccess: onRenameSuccess,
  });

  function onRenameSuccess(renamedGroup: ChatModel) {
    queryClient.setQueryData<ChatModel[]>(["chatList"], (oldData) => {
      if (!oldData) return [renamedGroup];
      const newChatList = oldData.map((chat) => {
        if (chat._id !== renamedGroup._id) return chat;
        return renamedGroup;
      });
      return newChatList;
    });

    queryClient.setQueryData(
      ["chatList", `{chat: ${renamedGroup._id}}`],
      renamedGroup
    );
  }

  const onClick = () => {
    const input = renameRef.current?.firstChild as HTMLInputElement;
    const newName = input.value;
    if (newName === groupName) return;
    try {
      groupNameSchema.parse(newName);
      renameMutation.mutate({ chatName: newName, groupId });
    } catch (error) {
      extractZodErrors(error as ZodError);
    }
  };

  return (
    <Stack direction={"row"}>
      <GroupFormInput label="Reanme" ref={renameRef} defaultValue={groupName} />
      <Button variant="outlined" onClick={onClick}>
        rename
      </Button>
    </Stack>
  );
};

export default RenameGroupChat;
