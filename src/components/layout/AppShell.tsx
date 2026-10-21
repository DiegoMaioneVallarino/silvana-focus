
import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

import { ProgressionSync } from "../../features/progression/components/ProgressionSync";

import "./AppShell.css";

export function AppShell() {
  return (
    <div className="sf-app">
      <ProgressionSync />

      <Sidebar />

      <main className="sf-main">
        <Header />

        <div className="sf-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
