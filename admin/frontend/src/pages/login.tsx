"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MobileAuthCard from "@/component/auth/MobileAuthCard";
import { projectName } from "@/util/config";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("isAuth");
      const role = sessionStorage.getItem("role");
      if (isAuth === "true") {
        if (role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{`Sign In - ${projectName}`}</title>
        <meta name="description" content="Sign in to WUDAO to stream African reels, interact with creators, and share moments." />
      </Head>
      <div className="login-root-container">
        <MobileAuthCard mode="login" isModal={false} />
      </div>
      <style jsx>{`
        .login-root-container {
          min-height: 100vh;
          width: 100%;
          background: #08050e;
        }
      `}</style>
    </>
  );
}
