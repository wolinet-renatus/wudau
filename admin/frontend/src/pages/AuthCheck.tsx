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
    if ((!isAuth || isAuth !== "true") && !publicPaths.includes(router.pathname)) {
      router.push("/login");
    }
  }, [isAuth, router.pathname]);

  return <>{props.children}</>;
};

export default AuthCheck;
