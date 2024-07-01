import { LoadingSkeletonsProps } from "../LoadingSkeletons";

const LoadingSkeletons: React.FC<LoadingSkeletonsProps> = ({ children }) => {
  return <div data-testid="mock-loading-skeletons">{children}</div>;
};

export default LoadingSkeletons;

export function SkeletonUser() {
  return <div data-testid="mock-skeleton-user">Mock Skeleton User</div>;
}
export function SkeletonMessage({ isGroupChat }: { isGroupChat: boolean }) {
  return (
    <div>
      {isGroupChat && <div data-testid="isGroupChat">group chat</div>}{" "}
      <div data-testid="mock-skeleton-message">Mock Skeleton Message</div>
    </div>
  );
}
