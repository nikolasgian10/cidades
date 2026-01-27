import { ReactNode, forwardRef } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, hideFooter = false }, ref) => {
    return (
      <div ref={ref} className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        {!hideFooter && <Footer />}
      </div>
    );
  }
);

Layout.displayName = "Layout";
