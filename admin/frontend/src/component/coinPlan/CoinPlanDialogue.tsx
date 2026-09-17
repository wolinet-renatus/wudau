import Button from "@/extra/Button";
import Input from "@/extra/Input";
import { addCoinPlan, updateCoinPlan } from "@/store/coinPlanSlice";
import { closeDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";

import { baseURL } from "@/util/config";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  coin: String;
  amount: String;
  image: string;
  productKey: string;
}
const CoinPlanDialogue = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );


  const dispatch = useAppDispatch();
  const [addcoinPlanOpen, setAddcoinPlanOpen] = useState(false);

  const [coin, setCoin] = useState<string>();
  const [mongoId, setMongoId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<any>(null);
  const [amount, setAmount] = useState<string>();
  const [productKey, setProductKey] = useState<string>();

  const [error, setError] = useState<ErrorState>({
    coin: "",
    amount: "",
    image: "",
    productKey: "",
  });

  useEffect(() => {
    if (dialogue) {
      setAddcoinPlanOpen(dialogue);
    }
  }, [dialogue]);

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData._id);
      setCoin(dialogueData.coin);
      setAmount(dialogueData.amount);
      setProductKey(dialogueData.productKey);
      setImagePath(baseURL + dialogueData?.icon);
    }
  }, [dialogueData]);

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


    if (!coin || !amount || !productKey) {
      let error = {} as ErrorState;
      if (!coin) error.coin = "Coin Is Required !";
      if (!productKey) error.productKey = "Product Key Is Required !";
      if (!amount) error.amount = "amount Is Required !";

      return setError({ ...error });
    } else {
      const formData: any = new FormData();
      formData.append("coin", coin);
      formData.append("amount", amount);
      formData.append("icon", image);
      formData.append("productKey", productKey);
      if (dialogueData) {
        let data: any = {
          data: formData,
          coinPlanId: mongoId,
        };
        dispatch(updateCoinPlan(data));
      } else {
        dispatch(addCoinPlan(formData));
      }
      handleCloseAddcoinPlan();
    }
  };

  const handleCloseAddcoinPlan = () => {
    setAddcoinPlanOpen(false);
    dispatch(closeDialog());
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData));
  };

  return (
    <div>
      <Modal
        open={addcoinPlanOpen}
        onClose={handleCloseAddcoinPlan}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Edit Coin Plan" : "Add Coin Plan"}
          </Typography>
          <form>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <Input
                type={"number"}
                label={"Coin"}
                name={"coin"}
                placeholder={"Enter coin"}
                value={coin}
                errorMessage={error.coin && error.coin}
                onChange={(e: any) => {
                  setCoin(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      coin: `coin Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      coin: "",
                    });
                  }
                }}
              />
              <Input
                type={"number"}
                label={"Amount"}
                name={"Amount"}
                placeholder={"Enter Amount"}
                value={amount}
                newClass={`mt-3`}
                errorMessage={error.amount && error.amount}
                onChange={(e: any) => {
                  setAmount(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      amount: `Amount Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      amount: "",
                    });
                  }
                }}
              />
              <Input
                type={"text"}
                label={"Product Key"}
                name={"Product Key"}
                placeholder={"Enter Product Key"}
                value={productKey}
                newClass={`mt-3`}
                errorMessage={error.productKey && error.productKey}
                onChange={(e: any) => {
                  setProductKey(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      productKey: `ProductKey Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      productKey: "",
                    });
                  }
                }}
              />
              <div className=" mt-2">
                <Input
                  type={"file"}
                  label={"Icon"}
                  accept={"image/*"}
                  errorMessage={error.image && error.image}
                  onChange={handleFileUpload}
                />
              </div>
              <div className="">
                {imagePath && (
                  <img
                    src={imagePath}
                    className="mt-3 rounded float-left mb-2"
                    height="100px"
                    width="100px"
                  />
                )}
              </div>
            </div>

            <div className="mt-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseAddcoinPlan}
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
    </div>
  );
};

export default CoinPlanDialogue;
