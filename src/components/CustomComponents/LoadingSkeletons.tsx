import { Skeleton, Stack } from "@mui/material";
import React, { ReactNode } from "react";
import CustomListItem from "./CustomListItem";
import { ChatModel } from "../../models/ChatModel";
import { skeletonRandomSender } from "../../utils/messageMethods";

export interface LoadingSkeletonsProps {
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
              data-testid="skeleton-user-wave-1"
              animation="wave"
              height={"1rem"}
              sx={{ width: "50%", alignSelf: "start" }}
            />
            <Stack width={"50%"} alignItems={"end"}>
              <Skeleton
                data-testid="skeleton-user-circle"
                animation="wave"
                variant="circular"
                width={50}
                height={50}
              />
            </Stack>
          </Stack>
        </Stack>

        <Skeleton
          data-testid="skeleton-user-wave-2"
          animation="wave"
          height={"1.2rem"}
          sx={{ width: "100%" }}
        />
      </Stack>
    </CustomListItem>
  );
}

type SkeletonMessageProps = {
  isGroupChat: ChatModel["isGroupChat"];
};

export function SkeletonMessage({ isGroupChat }: SkeletonMessageProps) {
  const senderIsMe = skeletonRandomSender();
  const alignMessage = senderIsMe ? "end" : "start";
  return (
    <Stack
      mt={1}
      data-testid="wrapper"
      spacing={0.5}
      direction={"row"}
      justifyContent={alignMessage}
      boxSizing={"border-box"}
      width={"100%"}
    >
      {!senderIsMe && isGroupChat && (
        <Skeleton
          animation="wave"
          variant="circular"
          data-testid="circle"
          sx={{ width: 35, height: 35, ml: 35 }}
        />
      )}

      <div className={`bubble ${alignMessage}`} data-testid="waves-wrapper">
        <Skeleton
          data-testid="wave"
          animation="wave"
          height={10}
          width="15ch"
        />
        <Skeleton
          data-testid="wave"
          animation="wave"
          height={10}
          width="19ch"
        />
        <Skeleton
          data-testid="wave"
          animation="wave"
          height={10}
          width="20ch"
        />
      </div>
    </Stack>
  );
}
