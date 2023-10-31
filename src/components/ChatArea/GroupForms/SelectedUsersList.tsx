import React, { useEffect, useRef, useState } from "react";
import { UserModel } from "../../../models/UserModel";
import { Box, Stack, Typography } from "@mui/material";
import SelectedUser from "./SelectedUser";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface SelectedUsersListProps {
  users: UserModel[];
  setSelectedUsers: (user: UserModel) => void;
}
const SelectedUsersList: React.FC<SelectedUsersListProps> = ({
  users,
  setSelectedUsers,
}) => {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [translate, setTranslate] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const TRANSLET_AMOUNT = containerRef.current
    ? Math.max(containerRef.current.clientWidth - 50, 100)
    : 100;

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const container = containerRef.current;
      if (!container) return;
      setIsLeftVisible(translate > 0);
      setIsRightVisible(
        translate + container.clientWidth < container.scrollWidth
      );
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [translate, users]);
  const LeftBtn = () => {
    return (
      <Box
        sx={{
          position: "absolute",
          borderRadius: 15,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "hidden",
          background: "#bbb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ":hover": { background: "#aaa" },
        }}
      >
        <button
          onClick={() => {
            setTranslate((translate) => {
              const newTranslate = translate - TRANSLET_AMOUNT;
              if (newTranslate < 0) return 0;
              return newTranslate;
            });
          }}
          style={{
            cursor: "pointer",
            height: "100%",
            aspectRatio: "1 / 1",
            width: "auto",
            background: "none",
            border: "none",
          }}
        >
          <ChevronLeft />
        </button>
      </Box>
    );
  };
  const RightBtn = () => {
    return (
      <Box
        sx={{
          position: "absolute",
          right: 0,
          overflow: "hidden",
          top: 0,
          bottom: 0,
          background: "#bbb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 15,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          ":hover": { background: "#aaa" },
        }}
      >
        <button
          onClick={() => {
            const container = containerRef.current;
            if (!container) return;
            setTranslate((translate) => {
              const newTranslate = translate + TRANSLET_AMOUNT;
              const edge = container.scrollWidth;
              const width = container.clientWidth;
              if (newTranslate + width >= edge) return edge - width;
              return newTranslate;
            });
          }}
          style={{
            cursor: "pointer",
            height: "100%",
            aspectRatio: "1 / 1",
            width: "auto",
            background: "none",
            border: "none",
          }}
        >
          <ChevronRight />
        </button>
      </Box>
    );
  };

  return (
    <Box
      position={"relative"}
      ref={containerRef}
      sx={{
        overflowX: "hidden",
        width: "100%",
      }}
    >
      {!users.length ? (
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Typography>Select users</Typography>
        </Box>
      ) : (
        <>
          <Stack
            whiteSpace={"nowrap"}
            direction={"row"}
            gap={1}
            sx={{
              width: "max-content",
              transform: `translateX(-${translate}px)`,
              transition: "transform 0.5s ease", // Add transition for smooth animation
            }}
          >
            {users.map((user) => (
              <SelectedUser
                key={user._id}
                onDelete={setSelectedUsers}
                user={user}
              />
            ))}
          </Stack>
        </>
      )}
      {isLeftVisible && <LeftBtn />}
      {isRightVisible && <RightBtn />}
    </Box>
  );
};

export default SelectedUsersList;
