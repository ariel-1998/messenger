import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  FormHelperText,
  Stack,
} from "@mui/material";
import React, { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatService } from "../../../../services/chatService";
import { toastifyService } from "../../../../services/toastifyService";
import { groupNameSchema } from "../../../../models/ChatModel";
import { extractZodErrors } from "../../../../utils/zodMetods";
import { ZodError } from "zod";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";

interface RenameGroupChatProps {
  groupName: string;
  groupId: string;
  handleModalClose: () => void;
}

const RenameGroupChat: React.FC<RenameGroupChatProps> = ({
  groupName,
  groupId,
  handleModalClose,
}) => {
  const renameRef = useRef<HTMLDivElement>();

  const renameMutation = useMutation({
    mutationFn: chatService.renameGroup,
    onError: (error) => toastifyService.error(error),
    onSuccess: handleModalClose,
  });

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
    <>
      <Stack direction={"row"} alignItems={"center"} spacing={0}>
        <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
          <Input
            disabled={renameMutation.isLoading}
            ref={renameRef}
            defaultValue={groupName}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={onClick}
                  disabled={renameMutation.isLoading}
                >
                  <RenameIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="outlined-weight-helper-text">
            Rename
          </FormHelperText>
        </FormControl>
      </Stack>
    </>
  );
};

export default RenameGroupChat;
