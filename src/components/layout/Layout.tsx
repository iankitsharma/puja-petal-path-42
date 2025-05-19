
import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  hideNavigation?: boolean;
}

const Layout = ({ children, hideNavigation = false }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavigation && <Navigation />}
      <main className="flex-1 pt-16 md:pt-20 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
