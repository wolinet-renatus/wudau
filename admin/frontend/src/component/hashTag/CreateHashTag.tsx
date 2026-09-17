"use-client";

import React, { useEffect, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { closeDialog } from "../../store/dialogSlice";
import { useSelector } from "react-redux";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { addHashTag, updateHashTag } from "../../store/hashTagSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { baseURL } from "@/util/config";
import Image from "next/image";
import HashtagIcon from "@/assets/images/HashtagIcon.png";
import HashtagaBanner from "@/assets/images/hashtagbanner.png";


const style: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  backgroundColor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: "24px",
  padding: "19px",
};

interface ErrorState {
  image: String;
  giftCategory: String;
  hashTag: String;
  hashTagIcon: string;
}
const CreatehashTag = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );


  const dispatch = useAppDispatch();
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [mongoId, setMongoId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [hashTag, setHashTag] = useState<string>("");
  const [hashTagIcon, setHashTagIcon] = useState<File | null>(null);
  const [hashTagIconpath, setHashTagIconpath] = useState<any>(null);
  const [imagePath, setImagePath] = useState<any>(null);
  const [error, setError] = useState<ErrorState>({
    image: "",
    giftCategory: "",
    hashTag: "",
    hashTagIcon: "",
  });

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData?._id);
      setHashTag(dialogueData?.hashTag);
      setImagePath(
        dialogueData?.hashTagBanner
          ? baseURL + dialogueData?.hashTagBanner
          : null
      );
      setHashTagIconpath(
        dialogueData?.hashTagIcon ? baseURL + dialogueData?.hashTagIcon : null
      );
    }
  }, [dialogue, dialogueData]);

  const handleCloseAddCategory = () => {
    setAddCategoryOpen(false);
    dispatch(closeDialog());
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData));
  };

  useEffect(() => {
    setAddCategoryOpen(dialogue);
  }, [dialogue]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setImage(file);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImagePath(reader.result as string);
    });
    reader.readAsDataURL(file);
    setError({ ...error, image: "" });
  };
  const handleFileUploadIcon = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setHashTagIcon(file);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setHashTagIconpath(reader.result as string);
    });
    reader.readAsDataURL(file);
    setError({ ...error, hashTagIcon: "" });
  };

  const handleSubmit = () => {


    if (!hashTag || !imagePath || !hashTagIconpath) {
      let error = {} as ErrorState;
      if (!hashTag) {
        error.hashTag = "hashTag is required";
      }
      if (!imagePath) error.image = "Image is required";
      if (!hashTagIconpath) error.hashTagIcon = "Image is required";
      return setError({ ...error });
    } else {
      let formData = new FormData();
      formData.append("hashTag", hashTag);
      formData.append("hashTagBanner", image);
      formData.append("hashTagIcon", hashTagIcon);
      if (mongoId) {
        const payload: any = {
          data: formData,
          hashTagId: mongoId,
        };
        dispatch(updateHashTag(payload));
      } else {
        const payload: any = {
          data: formData,
        };
        dispatch(addHashTag(payload));
      }
    }

    dispatch(closeDialog());
  };

  return (
    <div>
      <Modal
        open={addCategoryOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Edit HashTag" : "Add HashTag"}
          </Typography>
          <form>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <div className="col-12 mt-2">
                <Input
                  label={"HashTag"}
                  name={"hashTag"}
                  placeholder={"Enter One HashTag..."}
                  value={hashTag}
                  type={"text"}
                  errorMessage={error.hashTag && error.hashTag}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHashTag(value);
                    if (!value) {
                      setError({
                        ...error,
                        hashTag: "HashTag Is Required",
                      });
                    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                      setError({
                        ...error,
                        hashTag:
                          "HashTag can only contain letters, numbers, and underscores",
                      });
                    } else {
                      setError({
                        ...error,
                        hashTag: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-12 col-md-6 mt-3">
                <Input
                  type={"file"}
                  label={"HashTag  Icon"}
                  accept={"image/png, image/jpeg,image/gif"}
                  errorMessage={error.image && error.image}
                  onChange={handleFileUploadIcon}
                />
                {hashTagIconpath && hashTagIconpath !== "" ? (
                  <img
                    src={hashTagIconpath}
                    className="mt-3 rounded float-left mb-2"
                    height={100}
                    width={100}
                    onError={(e) => {
                      const target: any = e.target as HTMLImageElement;
                      target.src = HashtagIcon;
                    }}
                    alt="HashTagIcon"
                  />
                ) : (
                  <img
                    src={HashtagIcon.src}
                    className="mt-3 rounded float-left mb-2"
                    height={100}
                    width={100}
                    alt="HashTagIcon"
                  />
                )}
              </div>

              <div className="col-12 col-md-6 mt-3">
                <Input
                  type={"file"}
                  label={"HashTag Banner Image"}
                  accept={"image/png, image/jpeg,image/gif"}
                  errorMessage={error.image && error.image}
                  onChange={handleFileUpload}
                />
                {imagePath && imagePath !== "" ? (
                  <img
                    src={imagePath}
                    className="mt-3 rounded float-left mb-2"
                    height={100}
                    width={100}
                    alt="HashTagBanner"
                  />
                ) : (
                  <img
                    src={HashtagaBanner.src}
                    className="mt-3 rounded float-left mb-2"
                    height={100}
                    width={100}
                    alt="HashTagBanner"
                  />
                )}
              </div>

              <div className="mt-3 d-flex justify-content-end">
                <Button
                  onClick={handleCloseAddCategory}
                  btnName={"Close"}
                  newClass={"close-model-btn"}
                />
                <Button
                  onClick={handleSubmit}
                  btnName={dialogueData ? "Update" : "Submit"}
                  type={"button"}
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
        </Box>
      </Modal>
    </div>
  );
};

export default CreatehashTag;
