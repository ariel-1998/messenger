import React, { ReactNode, createContext, useContext, useState } from "react";

type DrawerContextProps = {
  open: boolean;
  closeDrawer(): void;
  openDrawer(): void;
};

const DrawerContext = createContext<DrawerContextProps | null>(null);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === null) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};

type DrawerProviderProps = {
  children: ReactNode;
};
const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  return (
    <DrawerContext.Provider value={{ open, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export default DrawerProvider;
