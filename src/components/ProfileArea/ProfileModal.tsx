import React, { ReactNode, useState } from "react";
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
import { urlImageOptimize } from "../../utils/urlImageOptimize";

export type UserProfileModalProps<T> = {
  profile?: T;
  btnText?: string;
  sx?: SxProps<Theme>;
  isBtn?: boolean;
  CustomBtn?: ReactNode;
};

const UserProfileModal: React.FC<UserProfileModalProps<UserModel | null>> = ({
  profile,
  btnText,
  isBtn = false,
  CustomBtn,
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
      {!!CustomBtn && <span onClick={handleOpen}>{CustomBtn}</span>}
      <CustomModal open={open} handleClose={handleClose} sx={{ minHeight: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} margin={"auto"}>
            <Stack direction="column" alignItems="center">
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontWeight: "600" }}
              >
                {profile?.name}
              </Typography>
              {!smallScreen && (
                <Avatar
                  sx={{ flexBasis: 150, width: 150, height: 150 }}
                  src={urlImageOptimize.generateProfileCardUrl(
                    profile?.image as string
                  )}
                  // src={profile?.image as string}
                />
              )}
              <Box sx={{ mt: 2, width: "100%", overflowWrap: "break-word" }}>
                <Typography
                  variant="h5"
                  textAlign="center"
                  sx={{ color: "#666", fontWeight: "600" }}
                >
                  {profile?.email}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          {smallScreen && (
            <Grid item xs={12} sm={5}>
              <Avatar
                sx={{ flexBasis: 150, width: 150, height: 150 }}
                src={urlImageOptimize.generateProfileCardUrl(
                  profile?.image as string
                )}
                // src={profile?.image as string}
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
        <CustomModal
          className="modal-background"
          open={open}
          handleClose={handleClose}
          sx={{
            backgroundImage: `url(${urlImageOptimize.generateProfileCardUrl(
              selectedChat?.groupImg as string
            )})`,
            backgroundSize: "100% 100%;",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
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
            <Typography
              sx={{ zIndex: 1, fontWeight: "bold" }}
              align="center"
              color={"white"}
              variant="h6"
              p={0}
              m={0}
            >
              {selectedChat.chatName} <GroupForm.RemoveMember />
            </Typography>
            <Divider
              flexItem
              sx={{ backgroundColor: "whitesmoke", zIndex: 1 }}
            />
            <GroupForm.Rename
              handleModalClose={handleClose}
              groupName={selectedChat.chatName}
              groupId={selectedChat._id}
            />
            {isUserAdmin ? (
              <GroupSettings modalParentClose={handleClose} />
            ) : (
              <GroupForm.Leave />
            )}
          </Stack>
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
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        ":hover": { background: "rgba(255,255,255,0.2)" },
      }}
      icon={<Settings sx={{ fill: "white" }} />}
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
