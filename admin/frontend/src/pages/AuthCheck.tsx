"use-client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck = (props: any) => {
  const router = useRouter();

  let isAuth: any = "";
  if (typeof window !== "undefined") {
    isAuth = sessionStorage.getItem("isAuth");
  }
  useEffect(() => {
    const publicPaths = ["/", "/login", "/Registration", "/forgotPassword"];
    const role = typeof window !== "undefined" ? sessionStorage.getItem("role") : null;
    
    if ((!isAuth || isAuth !== "true") && !publicPaths.includes(router.pathname)) {
      router.push("/login");
      return;
    }

    const adminOnlyPaths = [
      "/dashboard",
      "/userTable",
      "/videoTable",
      "/postTable",
      "/coinPlan",
      "/settingPage",
      "/withdrawRequest",
      "/banner",
      "/giftPage",
      "/hashTagTable",
      "/songTable",
      "/verificationRequestTable",
      "/reportType",
      "/liveVideo",
      "/owner",
    ];

    if (isAuth === "true" && role === "user" && adminOnlyPaths.includes(router.pathname)) {
      router.push("/");
    }
  }, [isAuth, router.pathname]);

  return <>{props.children}</>;
};

export default AuthCheck;
