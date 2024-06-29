const useDrawer = jest.fn();

export default useDrawer;

const defaultMock = {
  open: false,
  openDrawer: jest.fn(),
  closeDrawer: jest.fn(),
};

beforeEach(() => {
  useDrawer.mockReturnValue(defaultMock);
});
