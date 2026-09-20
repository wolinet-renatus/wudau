"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import MobileAuthCard from "@/component/auth/MobileAuthCard";
import { projectName } from "@/util/config";

export default function RegistrationPage() {
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
        <title>{`Sign Up - ${projectName}`}</title>
        <meta name="description" content="Create a free WUDAO account to stream reels, like videos, and connect with African creators." />
      </Head>
      <div className="registration-root-container">
        <MobileAuthCard mode="signup" isModal={false} />
      </div>
      <style jsx>{`
        .registration-root-container {
          min-height: 100vh;
          width: 100%;
          background: #08050e;
        }
      `}</style>
    </>
  );
}
