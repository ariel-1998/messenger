import { Skeleton, Stack } from "@mui/material";
import React, { ReactNode, useState } from "react";
import CustomListItem from "./CustomListItem";
import { ChatModel } from "../../models/ChatModel";

interface LoadingSkeletonsProps {
  amount: number;
  children: ReactNode;
}

const LoadingSkeletons: React.FC<LoadingSkeletonsProps> = ({
  amount,
  children,
}) => {
  return (
    <>
      {Array.from({ length: amount }, (_, index) => (
        <span key={index}>{children}</span>
      ))}
    </>
  );
};

export default LoadingSkeletons;

export function SkeletonUser() {
  return (
    <CustomListItem disableRipple disableBtnProps>
      <Stack width={"100%"} height={"100%"}>
        <Stack direction={"row"} width={"100%"}>
          <Stack
            flexDirection={"row"}
            width={"100%"}
            pt={1}
            alignItems={"start"}
          >
            <Skeleton
              animation="wave"
              height={"1rem"}
              sx={{ width: "50%", alignSelf: "start" }}
            />
            <Stack width={"50%"} alignItems={"end"}>
              <Skeleton
                animation="wave"
                variant="circular"
                width={50}
                height={50}
              />
            </Stack>
          </Stack>
        </Stack>

        <Skeleton animation="wave" height={"1.2rem"} sx={{ width: "100%" }} />
      </Stack>
    </CustomListItem>
  );
}

type SkeletonMessageProps = { chat: ChatModel };

export function SkeletonMessage({ chat }: SkeletonMessageProps) {
  const [senderIsMe] = useState(Boolean(Math.round(Math.random())));
  const alignMessage = senderIsMe ? "end" : "start";
  return (
    <Stack
      mt={1}
      spacing={0.5}
      direction={"row"}
      justifyContent={alignMessage}
      boxSizing={"border-box"}
      width={"100%"}
    >
      {!senderIsMe && chat.isGroupChat && (
        <Skeleton
          animation="wave"
          variant="circular"
          sx={{ width: 35, height: 35, ml: 35 }}
        />
      )}

      <div className={`bubble ${alignMessage}`}>
        <Skeleton animation="wave" height={10} width="15ch" />
        <Skeleton animation="wave" height={10} width="19ch" />
        <Skeleton animation="wave" height={10} width="20ch" />
      </div>
    </Stack>
  );
}
