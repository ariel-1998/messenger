import { useContext } from "react";
import { DrawerContext } from "../contexts/DrawerProvider";

const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === null) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};
export default useDrawer;
