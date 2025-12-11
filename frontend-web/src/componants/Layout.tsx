import type { ReactNode } from "react";
import "../css/Layout.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-container">
      <div className="content">
        {children}
      </div>
    </div>
  );
}