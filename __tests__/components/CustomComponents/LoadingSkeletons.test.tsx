import { render, screen } from "@testing-library/react";
import LoadingSkeletons, {
  SkeletonMessage,
  SkeletonUser,
} from "../../../src/components/CustomComponents/LoadingSkeletons";
import * as messageMethods from "../../../src/utils/messageMethods";

describe("LoadingSkeletons", () => {
  it("should render properly", () => {
    const amount = 3;
    render(
      <LoadingSkeletons amount={amount}>
        <div>child</div>
      </LoadingSkeletons>
    );

    const children = screen.getAllByText("child");
    expect(children).toHaveLength(amount);
  });
});

describe("SkeletonUser", () => {
  it("should render properly", () => {
    render(<SkeletonUser />);
    const ListItem = screen.getByTestId("ListItem");
    const skeletonCircle = screen.getByTestId("skeleton-user-circle");
    const skeletonWave1 = screen.getByTestId("skeleton-user-wave-1");
    const skeletonWave2 = screen.getByTestId("skeleton-user-wave-2");

    expect(ListItem).toBeInTheDocument();
    expect(skeletonCircle).toBeInTheDocument();
    expect(skeletonWave1).toBeInTheDocument();
    expect(skeletonWave2).toBeInTheDocument();
  });
});

describe("SkeletonMessage", () => {
  it("should render properly if not a group chat", () => {
    render(<SkeletonMessage isGroupChat={false} />);
    const wrapper = screen.getByTestId("wrapper");
    const circleAnimation = screen.queryByTestId("circle");
    const wavesWrapper = screen.getByTestId("waves-wrapper");
    const waveAnimations = screen.getAllByTestId("wave");

    expect(wrapper).toBeInTheDocument();
    expect(circleAnimation).not.toBeInTheDocument();
    expect(waveAnimations).toHaveLength(3);
    expect(wavesWrapper).toBeInTheDocument();
  });
  it("should render properly when its a group chat and the generated random sender is not me", () => {
    jest
      .spyOn(messageMethods, "skeletonRandomSender")
      .mockReturnValueOnce(false);
    render(<SkeletonMessage isGroupChat={true} />);
    const wrapper = screen.getByTestId("wrapper");
    const circleAnimation = screen.getByTestId("circle");
    const wavesWrapper = screen.getByTestId("waves-wrapper");
    const waveAnimations = screen.getAllByTestId("wave");

    expect(wrapper).toBeInTheDocument();
    expect(circleAnimation).toBeInTheDocument();
    expect(waveAnimations).toHaveLength(3);
    expect(wavesWrapper).toBeInTheDocument();
  });
  it("should render properly when its a group chat and the generated random sender is me", () => {
    jest
      .spyOn(messageMethods, "skeletonRandomSender")
      .mockReturnValueOnce(true);
    render(<SkeletonMessage isGroupChat={true} />);
    const wrapper = screen.getByTestId("wrapper");
    const circleAnimation = screen.queryByTestId("circle");
    const wavesWrapper = screen.getByTestId("waves-wrapper");
    const waveAnimations = screen.getAllByTestId("wave");

    expect(wrapper).toBeInTheDocument();
    expect(circleAnimation).not.toBeInTheDocument();
    expect(waveAnimations).toHaveLength(3);
    expect(wavesWrapper).toBeInTheDocument();
  });
});
