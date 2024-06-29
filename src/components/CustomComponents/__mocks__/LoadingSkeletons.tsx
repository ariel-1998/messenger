import { ReactNode } from "react";

const LoadingSkeletons: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div data-testid="mock-loading-skeletons">{children}</div>;
};

export default LoadingSkeletons;

export function SkeletonUser() {
  return <div data-testid="mock-skeleton-user">Mock Skeleton User</div>;
}

//need to add SkeletonMessage
