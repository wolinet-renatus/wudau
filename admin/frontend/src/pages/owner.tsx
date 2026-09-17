"use-client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import {
  adminProfileGet,
  adminProfileUpdate,
  updateAdminPassword,
} from "../store/adminSlice";
import Input from "../extra/Input";
import EditIcon from "@mui/icons-material/Edit";
import Button from "../extra/Button";
import UserImage from "../assets/images/8.jpg";
import { RootStore, useAppDispatch } from "@/store/store";
import RootLayout from "@/component/layout/Layout";
import { baseURL } from "@/util/config";

import Image from "next/image";

interface ErrorState {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const getAdminData =
  typeof window !== "undefined" && JSON.parse(sessionStorage.getItem("admin_"));
const Owner = () => {
  const { admin } = useSelector((state: RootStore) => state.admin);


  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>();
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [oldPassword, setOldPassword] = useState<string | undefined>();
  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();
  const [image, setImage] = useState<File[]>([]);
  const [imagePath, setImagePath] = useState<string | undefined>();
  const [error, setError] = useState<ErrorState>({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const payload: any = {
      adminId: getAdminData?._id,
    };
    dispatch(adminProfileGet(payload));
  }, []);

  useEffect(() => {
    setData(admin);
  }, [admin]);

  useEffect(() => {
    setName(admin?.name);
    setEmail(admin?.email);
    setOldPassword(admin?.password);
    setImagePath(baseURL + admin?.image);
  }, [admin]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {


    if (event.target.files && event.target.files[0]) {
      setImage([event.target.files[0]]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result as string);
      });
      reader.readAsDataURL(event.target.files[0]);

      const formData = new FormData();
      formData.append("image", event.target.files[0]);

      const payload = {
        adminId: admin?._id,
        data: formData,
      };

      dispatch(adminProfileUpdate(payload));
    }
  };

  const handleEditProfile = () => {


    if (!email || !name) {
      const error = {} as ErrorState;
      if (!email) error.email = "Email Is Required!";
      if (!name) error.name = "Name Is Required!";
      return setError({ ...error });
    } else {
      const formData = new FormData();
      formData.append("email", email as string);
      formData.append("name", name as string);
      formData.append("image", image[0]);
      const payload: any = {
        adminId: admin?._id,
        data: formData,
      };
      dispatch(adminProfileUpdate(payload));
    }
  };

  const handlePassword = () => {


    if (!newPassword || !oldPassword || !confirmPassword) {
      const error = {} as ErrorState;
      if (!newPassword) error.newPassword = "New Password Is Required!";
      if (!oldPassword) error.oldPassword = "Old Password Is Required!";
      if (!confirmPassword)
        error.confirmPassword = "Confirm Password Is Required!";
      return setError({ ...error });
    } else {
      if (newPassword !== confirmPassword) {
        setError({ ...error, confirmPassword: "Passwords do not match!" });
      }
      const payload = {
        adminId: admin?._id,
        data: {
          oldPass: oldPassword,
          newPass: newPassword,
          confirmPass: confirmPassword,
        },
      };
      dispatch(updateAdminPassword(payload));
    }
  };

  return (
    <div>
      <div className="profile-page payment-setting">
        <div className="dashboardHeader primeHeader mb-3 p-0"></div>
        <div className="payment-setting-box p-3">
          <div className="row" style={{ padding: "15px" }}>
            <div className="col-lg-6 col-sm-12 ">
              <div className="mb-4 ">
                <div className="withdrawal-box  profile-img d-flex flex-column align-items-center">
                  <h6 className="text-start custom-text-color">
                    Profile Avatar
                  </h6>
                  <div style={{ paddingTop: "14px" }}>
                    <label
                      htmlFor="image"
                      onChange={(e: any) => handleFileUpload(e)}
                    >
                      <div className="avatar-img-icon">
                        <EditIcon className=" cursorPointer" />
                      </div>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        style={{ display: "none" }}
                      />

                      <img
                        height={150}
                        width={150}
                        src={imagePath}
                        onError={(e) => {
                          const target: any = e.target as HTMLImageElement;
                          target.src = UserImage;
                        }}
                        alt="Profile Avatar"
                      />
                    </label>
                  </div>
                  <h5 className="fw-semibold boxCenter mt-2">{data?.name}</h5>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="mb-4">
                <div className="withdrawal-box payment-box">
                  <h6 className="mb-0 custom-text-color">Edit Profile</h6>
                  <div className="row">
                    <form>
                      <div className="row">
                        <div className="col-12 withdrawal-input">
                          <Input
                            label={"Name"}
                            name={"name"}
                            type={"text"}
                            value={name}
                            errorMessage={error.name && error.name}
                            placeholder={"Enter Detail...."}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  name: "Name Is Required",
                                });
                              } else {
                                return setError({
                                  ...error,
                                  name: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 withdrawal-input border-0 mt-2">
                          <Input
                            label={"Email"}
                            name={"email"}
                            value={email}
                            type={"text"}
                            errorMessage={error.email && error.email}
                            placeholder={"Enter Detail...."}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  email: "Email Is Required",
                                });
                              } else {
                                return setError({
                                  ...error,
                                  email: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 d-flex mt-3 justify-content-end">
                          <Button
                            btnName={"Submit"}
                            type={"button"}
                            onClick={handleEditProfile}
                            newClass={"submit-btn"}
                            style={{
                              borderRadius: "0.5rem",
                              width: "88px",
                              marginLeft: "10px",
                            }}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="mb-4">
                <div className="withdrawal-box payment-box">
                  <h6 className="mb-0 custom-text-color">Change Password</h6>
                  <div className="row">
                    <form>
                      <div className="row">
                        <div className="col-12 withdrawal-input">
                          <Input
                            label={"Old Password"}
                            name={"oldPassword"}
                            value={oldPassword}
                            type={"password"}
                            errorMessage={
                              error.oldPassword && error.oldPassword
                            }
                            placeholder={"Enter Old Password"}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  oldPassword: "Old Password Is Required",
                                });
                              } else {
                                return setError({
                                  ...error,
                                  oldPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 withdrawal-input border-0 mt-2">
                          <Input
                            label={"New Password"}
                            name={"newPassword"}
                            value={newPassword}
                            errorMessage={
                              error.newPassword && error.newPassword
                            }
                            type={"password"}
                            placeholder={"Enter New Password"}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  newPassword: "New Password Is Required",
                                });
                              } else {
                                return setError({
                                  ...error,
                                  newPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 withdrawal-input border-0 mt-2">
                          <Input
                            label={"Confirm Password"}
                            name={"confirmPassword"}
                            value={confirmPassword}
                            className={`form-control`}
                            type={"password"}
                            errorMessage={
                              error.confirmPassword && error.confirmPassword
                            }
                            placeholder={"Enter Confirm Password"}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  confirmPassword:
                                    "Confirm Password Is Required",
                                });
                              } else {
                                return setError({
                                  ...error,
                                  confirmPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 d-flex mt-3 justify-content-end">
                          <Button
                            btnName={"Submit"}
                            type={"button"}
                            onClick={handlePassword}
                            newClass={"submit-btn"}
                            style={{
                              borderRadius: "0.5rem",
                              width: "88px",
                              marginLeft: "10px",
                            }}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Owner.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default Owner;
