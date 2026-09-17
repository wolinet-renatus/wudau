"use-client";

import React, { useEffect, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { closeDialog } from "../../store/dialogSlice";
import { useSelector } from "react-redux";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { addGift, updateGift, allGiftCategory } from "../../store/giftSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { baseURL } from "@/util/config";


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
  coin: String;
}
interface giftCategoryData {
  _id: string;
  name: string;
  image: string;
}
const CreateGift = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );



  const dispatch = useAppDispatch();
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [mongoId, setMongoId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [coin, setCoin] = useState<string>("");
  const [categoryDataSelect, setCategoryDataSelect] =
    useState<giftCategoryData>();
  const [imagePath, setImagePath] = useState<any>(null);

  const [error, setError] = useState<ErrorState>({
    image: "",
    giftCategory: "",
    coin: "",
  });

  useEffect(() => {
    const payload: any = {};
    dispatch(allGiftCategory(payload));
  }, []);

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData?.giftData?._id);
      setName(dialogueData?.giftData?.name);
      setCoin(dialogueData?.giftData?.coin);
      setImagePath(baseURL + dialogueData?.giftData.image);
    }
    setAddCategoryOpen(dialogue);
  }, [dialogue, dialogueData]);

  const handleCloseAddCategory = () => {
    setAddCategoryOpen(false);
    dispatch(closeDialog());
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData));
  };

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

  const handleSubmit = () => {


    if (!coin || !imagePath) {
      let error = {} as ErrorState;
      if (!coin) error.coin = "Coin is required";
      if (!imagePath) error.image = "Image is required";
      return setError({ ...error });
    } else {
      let formData = new FormData();
      formData.append("coin", coin);
      formData.append("image", image);
      if (image?.type === "image/gif") {
        formData.append("type", `${2}`);
      } else {
        formData.append("type", `${1}`);
      }

      if (mongoId) {
        const payload: any = {
          data: formData,
          giftId: mongoId,
        };

        dispatch(updateGift(payload));
      } else {
        const payload: any = {
          data: formData,
          giftCategoryId: categoryDataSelect?._id,
        };
        dispatch(addGift(payload));
      }

      dispatch(closeDialog());
    }
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
            {dialogueData ? "Edit Image (GIF) Gift" : "Add Image (GIF) Gift"}
          </Typography>
          <form>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <div className="col-12 mt-2">
                <Input
                  label={"Coin"}
                  name={"coin"}
                  placeholder={"Enter Coin..."}
                  value={coin}
                  type={"number"}
                  errorMessage={error.coin && error.coin}
                  onChange={(e) => {
                    setCoin(e.target.value);
                    if (!e.target.value) {
                      setError({
                        ...error,
                        coin: "Coin Is Required",
                      });
                    } else {
                      setError({
                        ...error,
                        coin: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-12 mt-2">
                <Input
                  type={"file"}
                  label={"Gift Image (GIF) Image"}
                  accept={"image/png, image/jpeg,image/gif"}
                  errorMessage={error.image && error.image}
                  onChange={handleFileUpload}
                />
              </div>
              <div className="col-12 d-flex justify-content-center">
                {imagePath && (
                  <img
                    src={imagePath}
                    className="mt-3 rounded float-left mb-2"
                    height="100px"
                    width="100px"
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

export default CreateGift;
