"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { login, signUpAdmin } from "../store/adminSlice";
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

export default function Registration() {
  const dispatch = useAppDispatch();
  const { isAuth, admin } = useSelector((state: RootState) => state.admin);
  const router = useRouter();

  useEffect(() => {}, [isAuth, admin]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  //const [code, setCode] = useState("");

  const [error, setError] = useState({
    email: "",
    password: "",
    //code: "",
    newPassword: "",
  });

  const handleSubmit = () => {
    if (
      !email ||
      !password ||
      //!code ||
      !newPassword ||
      newPassword !== password
    ) {
      let error: any = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      //if (!code) error.code = "Purchase code is required !";
      if (!newPassword) error.newPassword = "Confirm password is required !";
      if (newPassword !== password)
        error.newPassword = "Doesn't match password to confirm password !";
      return setError({ ...error });
    } else {
      let payload : any = {
        email,
        newPassword,
        password,
        //code,
      };

         dispatch(signUpAdmin(payload));
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
                  <h5>Sign Up</h5>
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
                  />
                  <Input
                    label={`Confirm Password`}
                    id={`confirmPassword`}
                    type={`password`}
                    value={newPassword}
                    className={`form-control`}
                    errorMessage={error.newPassword && error.newPassword}
                    onChange={(e: any) => {
                      setNewPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          newPassword: `Confirm Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          newPassword: "",
                        });
                      }
                    }}
                  />
                  
                  

                  <div
                    className="d-flex justify-content-center w-100"
                    style={{ width: "400px" }}
                  >
                    <Button
                      btnName={"SIGN UP"}
                      newClass={"login-btn ms-2 login"}
                      onClick={handleSubmit}
                      style={{ backgroundColor: "#FE0952" }}
                    />
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
