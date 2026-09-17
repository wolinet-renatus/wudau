"use client";
import { Providers } from "@/Provider";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const RootLayout = ({ children }) => {
  const sessionTimeout = 10 * 60 * 1000; // 10 minute in milliseconds
  const activityTimeoutRef = useRef();

  const resetTimeout = useCallback(() => {
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(() => {
      axios.defaults.headers.common["Authorization"] = "";
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.href = "/";
    }, sessionTimeout);
  }, [sessionTimeout]);

  const handleActivity = () => {
    resetTimeout();
  };

  useEffect(() => {
    if (window !== undefined) {
      resetTimeout();

      // Add event listeners for user activity
      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("keydown", handleActivity);
      window.addEventListener("click", handleActivity);

      // Clean up event listeners on component unmount
      return () => {
        window.removeEventListener("mousemove", handleActivity);
        window.removeEventListener("keydown", handleActivity);
        window.removeEventListener("click", handleActivity);
        if (activityTimeoutRef.current)
          clearTimeout(activityTimeoutRef.current);
      };
    }
  }, [resetTimeout]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Providers>
      <div className={`mainContainer d-flex w-100 ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className={`containerLeft ${isSidebarOpen ? "mobSidebar-show" : ""}`}>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
        <div className="containerRight w-100 ">
          <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <div className="mainAdmin ml-4">
            <div
              className={`mobSidebar-bg ${isSidebarOpen ? "responsive-bg d-block" : "d-none"}`}
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <main className="comShow">{children}</main>
          </div>
        </div>
      </div>
    </Providers>
  );
};

export default RootLayout;
