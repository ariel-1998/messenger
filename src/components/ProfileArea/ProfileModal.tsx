import React, { useState } from "react";
import {
  Typography,
  Avatar,
  Button,
  Theme,
  SxProps,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Box,
  Grid,
  MenuItem,
} from "@mui/material";
import { UserModel } from "../../models/UserModel";
import CustomModal from "../CustomComponents/Modals/CustomModal";
import GroupForm from "../ChatArea/GroupForms/Forms/GroupForm";
import { RootState } from "../../utils/reduxStore";
import { useSelector } from "react-redux";
import CustomMenu from "../CustomComponents/CustomMenu";
import { Settings } from "@mui/icons-material";

type UserProfileModalProps<T> = {
  profile?: T;
  btnText: string;
  sx?: SxProps<Theme>;
  isBtn?: boolean;
};

const UserProfileModal: React.FC<UserProfileModalProps<UserModel | null>> = ({
  profile,
  btnText,
  isBtn = false,
  sx,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      {isBtn ? (
        <Button onClick={handleOpen} sx={{ p: 1, ...sx }}>
          {btnText}
        </Button>
      ) : (
        <Typography onClick={handleOpen} sx={sx}>
          {btnText}
        </Typography>
      )}
      <CustomModal open={open} handleClose={handleClose} sx={{ pr: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} margin={"auto"}>
            <Stack direction="column" alignItems="center">
              <Typography variant="h4" component="h2">
                {profile?.name}
              </Typography>
              {!smallScreen && (
                <Avatar
                  sx={{ flexBasis: 150, width: 150, height: 150 }}
                  src={profile?.image as string}
                />
              )}
              <Box sx={{ mt: 2, width: "100%", overflowWrap: "break-word" }}>
                <Typography variant="h5" textAlign="center">
                  {profile?.email}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          {smallScreen && (
            <Grid item xs={12} sm={5}>
              <Avatar
                sx={{ flexBasis: 150, width: 150, height: 150 }}
                src={profile?.image as string}
              />
            </Grid>
          )}
        </Grid>
      </CustomModal>
    </>
  );
};

const GroupProfileModal: React.FC<UserProfileModalProps<null>> = ({
  btnText,
  sx,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const userId = user?._id;
  const adminId = selectedChat?.groupAdmin?._id;
  const isUserAdmin = adminId === userId;

  return (
    <>
      <Button onClick={handleOpen} sx={{ p: 1, ...sx }}>
        {btnText}
      </Button>
      {selectedChat && (
        <CustomModal open={open} handleClose={handleClose}>
          <Stack
            sx={{
              rowGap: 1,
              py: 1,
              width: "90%",
              margin: "auto",
              boxSizing: "border-box",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography align="center" variant="h6" p={0} m={0}>
              {selectedChat.chatName} <GroupForm.RemoveMember />
            </Typography>
            <Divider flexItem />

            {/* <Avatar sx={{ width: 150, height: 150 }} src={group?.image as string} /> */}
            <GroupForm.Rename
              handleModalClose={handleClose}
              groupName={selectedChat.chatName}
              groupId={selectedChat._id}
            />
            {isUserAdmin ? (
              // <>
              //   <GroupForm.AddMembers handleParentModalClose={handleClose} />
              //   <GroupForm.Remove handleModalClose={handleClose} />
              // </>
              <GroupSettings modalParentClose={handleClose} />
            ) : (
              <GroupForm.Leave />
            )}
          </Stack>

          {/* <CustomMenu icon={<Add />}>
            {isUserAdmin && (
              <><MenuItem
            key={i}
            sx={{ padding: 0 }}
            onClick={()
                <GroupForm.AddMembers handleParentModalClose={handleClose} />
                <GroupForm.Remove handleModalClose={handleClose} />
              </>
            )}
            <GroupForm.Rename
              handleModalClose={handleClose}
              groupName={selectedChat.chatName}
              groupId={selectedChat._id}
            />
            <GroupForm.RemoveMember />
          </CustomMenu> */}
        </CustomModal>
      )}
    </>
  );
};

const ProfileModal = {
  User: UserProfileModal,
  Group: GroupProfileModal,
};

export default ProfileModal;

type GroupSettingsProps = {
  modalParentClose: () => void;
};
function GroupSettings({ modalParentClose }: GroupSettingsProps) {
  const [open, setOpen] = useState(false);
  const handleMenuOpen = () => setOpen(true);
  const handleMenuClose = () => setOpen(false);

  return (
    <CustomMenu
      icon={<Settings sx={{ fill: "#777" }} />}
      open={open}
      onOpen={handleMenuOpen}
    >
      <MenuItem sx={{ padding: 0 }}>
        <GroupForm.AddMembers
          menuClose={handleMenuClose}
          handleParentModalClose={modalParentClose}
        />
      </MenuItem>
      <MenuItem sx={{ padding: 0 }}>
        <GroupForm.Remove
          menuClose={handleMenuClose}
          handleModalClose={modalParentClose}
        />
      </MenuItem>
    </CustomMenu>
  );
}
