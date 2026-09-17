"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { login } from "../store/adminSlice";
import Input from "../extra/Input";
import Logo from "../assets/images/wudau-icon.jpg";
import LogoBg from "../assets/images/loginPageBg.png";
import LoginImg from "../assets/images/loginPage.png";
import Image from "next/image";
import { useAppDispatch } from "@/store/store";
import Button from "../extra/Button";
import { projectName } from "@/util/config";
import { useRouter } from "next/router";

interface RootState {
  admin: {
    isAuth: boolean;
    admin: Object;
  };
}

export default function Login() {
  const dispatch = useAppDispatch();
  const { isAuth, admin } = useSelector((state: RootState) => state.admin);
  const router = useRouter();

  useEffect(() => {}, [isAuth, admin]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleredirecttoForgotPassword = () => {
    router.push({
      pathname: "/forgotPassword",
    });
  };

  const handleSubmit = () => {
    if (!email || !password) {
      let errorObj: any = {};
      if (!email) errorObj = { ...errorObj, email: "Email Is Required !" };
      if (!password)
        errorObj = { ...errorObj, password: "Password is required !" };
      return setError(errorObj);
    } else {
      let payload: any = {
        email,
        password,
      };

      dispatch(login(payload));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="login-page-content">
        <div className="bg-login">
          <div className="bg-showLogin">
            <Image src={LogoBg} layout="fill" alt="bg" objectFit="cover" />
          </div>
          <div className="login-page-box">
            <div className="row">
              <div className="col-12 col-md-6 right-login-img">
                <Image src={LoginImg} alt="Login" width={369} />
              </div>
              <div className="col-12 col-md-6 text-login">
                <div className="heading-login">
                  <Image src={Logo} alt="Logo" />
                  <h6 className="custom-wudau-color">{projectName}</h6>
                </div>
                <div className="login-left-form login-right-form">
                  <span>Welcome back !!!</span>
                  <h5>Sign in</h5>
                  <Input
                    label={`Email`}
                    id={`loginEmail`}
                    type={`email`}
                    value={email}
                    errorMessage={error.email && error.email}
                    onChange={(e: any) => {
                      setEmail(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          email: `Email Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          email: "",
                        });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label={`Password`}
                    id={`loginPassword`}
                    type={`password`}
                    value={password}
                    className={`form-control`}
                    errorMessage={error.password && error.password}
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          password: `Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          password: "",
                        });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <div
                    className="w-100"
                    onClick={handleredirecttoForgotPassword}
                  >
                    <h4 className="text-black" style={{ fontWeight: 700 }}>
                      Forgot Password ?
                    </h4>
                  </div>
                  <div
                    className="d-flex justify-content-center w-100"
                    style={{ width: "400px" }}
                  >
                    <Button
                      btnName={"LOGIN"}
                      newClass={"login-btn ms-2 login"}
                      onClick={handleSubmit}
                      style={{
                        background: "linear-gradient(135deg, #FF4B1F 0%, #FF9F00 100%)",
                        border: "none",
                        color: "#fff",
                        fontWeight: 700,
                        boxShadow: "0 4px 15px rgba(255, 75, 31, 0.35)",
                      }}
                    />
                  </div>
                  <div className="w-100 text-center mt-3" style={{ width: "400px" }}>
                    <span style={{ fontSize: "14px", color: "#6c757d" }}>
                      Don&apos;t have an account?{" "}
                    </span>
                    <span
                      onClick={() => router.push("/Registration")}
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#FF4B1F",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Sign Up
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
