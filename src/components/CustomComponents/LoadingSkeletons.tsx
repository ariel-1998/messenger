import { Skeleton } from "@mui/material";
import React from "react";

interface LoadingSkeletonsProps {
  amount: number;
  height?: number;
}

const LoadingSkeletons: React.FC<LoadingSkeletonsProps> = ({
  amount,
  height = 100,
}) => {
  return (
    <>
      {Array.from({ length: amount }, (_, index) => (
        <Skeleton key={index} height={height} />
      ))}
    </>
  );
};

export default LoadingSkeletons;
