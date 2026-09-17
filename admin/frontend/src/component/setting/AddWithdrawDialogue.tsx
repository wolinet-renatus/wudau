import Button from "@/extra/Button";
import Input from "@/extra/Input";
import { closeDialog } from "@/store/dialogSlice";
import {
  createWithdrawMethod,
  updateWithdrawMethod,
} from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";

import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: 24,
  p: "19px",
};
interface ErrorState {
  name: string;
  image: string;
  detail: string;
}

const AddWithdrawDialogue = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const [addCategory, setAddCategory] = useState(false);
  const [name, setName] = useState();
  const [imagePath, setImagePath] = useState();
  const [image, setImage] = useState();
  const [detail, setDetail] = useState("");
  const [error, setError] = useState({
    name: "",
    image: "",
    detail: "",
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (dialogue) {
      setAddCategory(dialogue);
    }
  }, [dialogue]);
  useEffect(() => {
    if (dialogueData) {
      setName(dialogueData?.name);
      setImagePath(dialogueData?.image);
      setDetail(dialogueData?.details);
    }
  }, [dialogue, dialogueData]);

  const handleCloseAddCategory = () => {
    setAddCategory(false);
    dispatch(closeDialog());
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: any = event.target.files && event.target.files[0];
    if (!file) return;
    setImage(file);

    const reader: any = new FileReader();
    reader.addEventListener("load", () => {
      setImagePath(reader.result);
    });
    reader.readAsDataURL(file);
    setError({ ...error, image: "" });
  };
  const handleSubmit = () => {


    if (!name || (dialogueData ? "" : !image) || !detail) {
      let error = {} as ErrorState;
      if (!name) error.name = "Name Is Required !";
      if (!image) error.image = "Image Is Required !";
      if (!detail) error.detail = "Detail Is Required !";
      return setError({ ...error });
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("details", detail);

      if (dialogueData) {
        let payload: any = {
          data: formData,
          id: dialogueData?._id,
        };
        dispatch(updateWithdrawMethod(payload));
      } else {
        dispatch(createWithdrawMethod(formData));
      }
      handleCloseAddCategory();
    }
  };
  return (
    <>
      <Modal
        open={addCategory}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData
              ? "Update Payment Gateway Dialogue" 
              : "Create Payment Gateway Dialogue"}
          </Typography>
          <form>
            <Input
              label={"Name"}
              name={"name"}
              placeholder={"Enter Details..."}
              value={name}
              errorMessage={error.name && error.name}
              onChange={(e) => {
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
            <div className="mt-2 add-details">
              <Input
                label={"Detail"}
                name={"detail"}
                placeholder={"Enter Details..."}
                value={detail}
                onChange={(e) => {
                  setDetail(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      detail: `Details Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      detail: "",
                    });
                  }
                }}
              />
            </div>
            <div>
            <span style={{color : "red"}}>Note : Enter details Coma (,) separated string.</span>

              {error?.detail && <p className="errorMessage">{error?.detail}</p>}
            </div>
            <div className="mt-2 ">
              <Input
                type={"file"}
                label={"Image"}
                accept={"image/png, image/jpeg"}
                errorMessage={error.image && error.image}
                onChange={handleFileUpload}
              />
            </div>
            <div className=" mt-2 fake-create-img mb-2">
              {imagePath && (
                <img
                  src={imagePath}
                  style={{ width: "96px", height: "auto" }}
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
                btnName={"Submit"}
                type={"button"}
                newClass={"submit-btn"}
                style={{
                  borderRadius: "0.5rem",
                  width: "80px",
                  marginLeft: "10px",
                }}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddWithdrawDialogue;
