import React, { ReactNode, createContext, useState } from "react";

type DrawerContextProps = {
  open: boolean;
  closeDrawer(): void;
  openDrawer(): void;
};

export const DrawerContext = createContext<DrawerContextProps | null>(null);

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
