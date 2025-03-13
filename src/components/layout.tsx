import type { PropsWithChildren } from "react";
import Header from "./header";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="text-center text-sm text-gray-400 py-12">
        Inspired from Roadsidecoder youtube channel
      </footer>
    </div>
  );
};

export default Layout;
