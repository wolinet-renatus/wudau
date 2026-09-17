"use client";
import { Providers } from "@/Provider";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useCallback, useEffect, useRef } from "react";
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
  return (
    <Providers>
      <div className="mainContainer d-flex w-100">
        <div className="containerLeft">
          <Sidebar />
        </div>
        <div className="containerRight w-100 ">
          <Navbar />
          <div className="mainAdmin ml-4">
            <div className="mobSidebar-bg  d-none"></div>
            <main className="comShow">{children}</main>
          </div>
        </div>
      </div>
    </Providers>
  );
};

export default RootLayout;
