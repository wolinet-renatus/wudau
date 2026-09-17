import Button from "@/extra/Button";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import Input from "@/extra/Input";
import Selector from "@/extra/Selector";
import { closeDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { updateFakeUser } from "@/store/userSlice";
import { baseURL } from "@/util/config";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";

import { getUserPost } from "@/store/postSlice";
import { getUserVideo } from "@/store/videoSlice";

export default function UserProfile(props) {
  useClearSessionStorageOnPopState("multiButton");

  const AgeNumber = Array.from(
    { length: 100 - 18 + 1 },
    (_, index) => index + 18
  );
  const { dialogueData } = useSelector((state: any) => state.dialogue);



  const [hasMounted, setHasMounted] = useState(false);
  const [postData, setPostData] = useState(null);

  console.log("postData" , postData)

  useEffect(() => {
    setHasMounted(true);
    // Retrieve postData from localStorage on the client side
    const storedData =   typeof window !== "undefined" && localStorage.getItem("postData");
    if (storedData) setPostData(JSON.parse(storedData));
  }, []);

  const { countryData } = useSelector((state: any) => state.user);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [gender, setGender] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [countryDataSelect, setCountryDataSelect] = useState<any>();
  const [image, setImage] = useState<any[]>([]);
  const [bio, setBio] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>(
    dialogueData ? dialogueData?.image : ""
  );
  const [age, setAge] = useState<string>("");

  const id = router.query.id

  const [error, setError] = useState<any>({
    name: "",
    nickName: "",
    bio: "",
    mobileNumber: "",
    email: "",
    ipAddress: "",
    gender: "",
    country: "",
    age: "",
    image: "",
  });

  useEffect(() => {
    if (postData) {
      setName(postData?.name);
      setNickName(postData?.userName);
      setGender(postData?.gender);
      setAge(postData?.age);
      setEmail(postData?.email);
      setIpAddress(postData?.ipAddress);
      setBio(postData?.bio);
      setMobileNumber(postData?.mobileNumber);
      setImagePath(
        postData?.image
          ? baseURL + postData?.image
          : baseURL + postData?.userImage
      );
      const filterData = countryData?.filter(
        (item: any) =>
          item?.name?.common?.toLowerCase() === postData?.country?.toString()
      );
      if (filterData) {
        setCountryDataSelect(filterData[0]);
      }
    }
  }, [postData , id]);

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    if (!name || !nickName || !email || !age || !gender) {
      let errors: any = {};
      if (!name) errors.name = "Name Is Required !";
      if (!nickName) errors.nickName = "User name Is Required !";

      if (!email) errors.email = "Email Is Required !";
      if (!gender) errors.gender = "Gender Is Required !";

      if (!age) errors.age = "Age is required !";

      setError(errors);
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userName", nickName);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      formData.append("image", image[0]);
      const payload: any = {
        id: postData?._id,
        data: formData,
      };

      dispatch(updateFakeUser(payload));
      dispatch(closeDialog());
      router.back();

      localStorage.setItem("multiButton", JSON.stringify("Fake User"));
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage([e.target.files[0]]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      setError("");
    }
  };

  return (
    <div
      style={{
        paddingLeft: "35px",
        paddingRight: "35px",
        maxHeight: "400px",
      }}
    >
      <div
        className="row"
        style={{
          borderRadius: "5px",
          paddingLeft: "10px",
        }}
      >
        <div className="avatar-setting col-3">
          <div className="userSettingBox">
            <div className="image-avatar-box">
              <div className="cover-img-user"></div>
              <div className="avatar-img-user" style={{ cursor: "pointer" }}>
                <div className="profile-img" style={{ paddingTop: "14px" }}>
                  {postData?.isFake === true && (
                    <label
                      htmlFor="image"
                      onChange={(e: any) => handleImage(e)}
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
                      {imagePath ? (
                        <img src={imagePath} alt="Profile Avatar" />
                      ) : (
                        <img src={imagePath} />
                      )}
                    </label>
                  )}
                  {postData?.isFake === false && (
                    <img src={imagePath} alt="Profile Avatar" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="general-setting fake-user col-9">
          <div className=" userSettingBox">
            <form>
              <div className="row d-flex  align-items-center">
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-1 mb-sm-0">
                  <h5 className="mb-0">General Setting</h5>
                </div>

                <div className="col-12 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-end">
                  {postData?.isFake == true && (
                    <Button
                      newClass={"submit-btn"}
                      btnName={"Submit"}
                      type={"button"}
                      onClick={(e: any) => handleSubmit(e)}
                    />
                  )}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    type={"text"}
                    label={"Name"}
                    name={"name"}
                    placeholder={"Enter Details..."}
                    value={name}
                    readOnly={postData?.isFake === false}
                    errorMessage={error.name && error.name}
                    onChange={(e: any) => {
                      setName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          name: `Name Is Required`,
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
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"User name"}
                    name={"nickName"}
                    value={nickName}
                    readOnly={postData?.isFake === false}
                    placeholder={"Enter Details..."}
                    errorMessage={error.nickName && error.nickName}
                    onChange={(e) => {
                      setNickName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          nickName: `User name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          nickName: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"E-mail Address"}
                    name={"email"}
                    value={email}
                    readOnly={postData?.isFake === false}
                    errorMessage={error.email && error.email}
                    placeholder={"Enter Details..."}
                    onChange={(e) => {
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
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Gender"}
                    selectValue={gender}
                    placeholder={"Select Gender"}
                    selectData={["Male", "Female"]}
                    readOnly={postData?.isFake === false}
                    errorMessage={error.gender && error.gender}
                    data={postData}
                    onChange={(e) => {
                      setGender(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          gender: `Gender Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          gender: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Age"}
                    selectValue={age}
                    placeholder={"Select Age"}
                    errorMessage={error.age && error.age}
                    readOnly={postData?.isFake === false}
                    data={postData}
                    selectData={AgeNumber}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          age: `Age Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          age: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-3">
                  <Input
                    label={"Login Type"}
                    name={"email"}
                    value={
                      postData?.loginType === 1
                        ? "Mobile Number "
                        : postData?.loginType === 2
                        ? "Google "
                        : "Quick"
                    }
                    readOnly={postData?.isFake === false}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
