import {
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Selector from "../../extra/Selector";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import ReactSelect from "react-select";
import { allUsers } from "../../store/userSlice";
import { closeDialog } from "../../store/dialogSlice";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReactDropzone, { FileWithPath, Accept } from "react-dropzone";
import { addFakePost, updateFakePost } from "../../store/postSlice";
import { allHashTag } from "../../store/postSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import Image from "next/image";
import { baseURL } from "@/util/config";
import hashTagIcon from "@/assets/images/hashTagPlace.png";
import {  warning } from "../../util/Alert";


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

const CreateFakePost: React.FC = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const { fakeUserData } = useSelector((state: RootStore) => state.user);
  const { allHashTagData } = useSelector((state: RootStore) => state.post);
  const [mongoId, setMongoId] = useState<string>("");
  const [addPostOpen, setAddPostOpen] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>("");
  const [selectedHashtag, setSelectedHashtag] = useState<any>();
  const [selectedHashTagId, setSelectedHashTagId] = useState<any>([]);
  const [fakeUserId, setFakeUserId] = useState<string>();
  const [fakeUserDataGet, setFakeUserDataGet] = useState<any[]>([]);


  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState({
    caption: "",
    images: "",
    fakeUserId: "",
    country: "",
    hashTag: "",
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    setAddPostOpen(dialogue);
    if (dialogueData) {
      setMongoId(dialogueData?._id);
      setCaption(dialogueData?.caption);
      setFakeUserId(dialogueData?.userId);
      setImages(dialogueData?.postImage);
      setSelectedHashtag(dialogueData?.hashTags);
    }
  }, [dialogue, dialogueData]);

  useEffect(() => {
    const payload: any = {
      type: "fakeUser",
      start: 1,
      limit: 100,
      startDate: "All",
      endDate: "All",
    };
    dispatch(allUsers(payload));
  }, [dispatch]);

  useEffect(() => {
    setFakeUserDataGet(fakeUserData);
  }, [fakeUserData]);

  const onPreviewDrop = (acceptedFiles: FileWithPath[]) => {
    const updatedImages = [...images, ...acceptedFiles];

    setImages(updatedImages);
    if (!acceptedFiles || acceptedFiles.length === 0) {
      setError({
        ...error,
        images: "Image Is Required",
      });
    } else {
      setError({
        ...error,
        images: "",
      });
    }
  };

  const removeImage = (file: File) => {
    const updatedImages = images.filter((ele) => ele !== file);
    setImages(updatedImages);
  };

  const handleCloseAddCategory = () => {
    setAddPostOpen(false);
    dispatch(closeDialog());
  };

  const handleSelectChangeHashTag = (selected: any | null) => {
    setSelectedHashtag(selected || []);
    const selectedIds = selected?.map((option: any) => option?._id);
    const updatedData = selectedIds?.join(",");
    setSelectedHashTagId(updatedData);
    if (!selected) {
      return setError({
        ...error,
        hashTag: `HashTag Is Required`,
      });
    } else {
      return setError({
        ...error,
        hashTag: "",
      });
    }
  };

  const handleRemoveApp = (removedOption: any) => {
    const updatedOptions = selectedHashtag?.filter(
      (option: any) => option._id !== removedOption?._id
    );
    setSelectedHashtag(updatedOptions);
    const selectedIds = updatedOptions?.map((option: any) => option?._id);
    const updatedData = selectedIds?.join(",");
    setSelectedHashTagId(updatedData);
  };

  useEffect(() => {
    const payload: any = {};
    dispatch(allHashTag(payload));
  }, []);

  const CustomOptionHashTag: React.FC<{
    innerProps: any;
    label: string;
    data: any;
  }> = ({ innerProps, data }) => (
    <div
      {...innerProps}
      className="country-optionList"
      style={{ height: "40px" }}
    >
      <img
        src={
          data?.hashTagBanner !== ""
            ? baseURL + data?.hashTagBanner
            : hashTagIcon?.src
        }
        onError={(e) => {
          const target: any = e.target as HTMLImageElement;
          target.src = hashTagIcon;
        }}
        alt="hashTagBanner"
        height={25}
        width={25}
        style={{ objectFit: "cover", width: "25px", height: "25px" }}
      />
      <span>{data?.hashTag && data?.hashTag}</span>
    </div>
  );

  const CustomMultiValueHashTag: React.FC<{
    children: React.ReactNode;
    data: any;
  }> = ({ children, data }) => (
    <div className="custom-multi-value">
      {children}
      <span
        className="custom-multi-value-remove"
        onClick={() => handleRemoveApp(data)}
      >
        <HighlightOffIcon />
      </span>
    </div>
  );

  const handleSubmit = () => {
    

    if (
      !caption ||
      !fakeUserId ||
      images?.length === 0 ||
      images?.length > 5 ||
      selectedHashtag?.length === 0
    ) {
      let errorObj: { [key: string]: string } = {};
      if (!caption) errorObj.caption = "Caption Is Required !";
      if (!fakeUserId) errorObj.fakeUserId = "User Is Required !";
      if (images?.length === 0) errorObj.images = "Please select an Image!";
      if (images?.length > 5)
        errorObj.images = "Please select maximum 5 Image!";
      if (selectedHashtag?.length === 0)
        errorObj.hashTag = "Please select hashTag!";
      return setError({
        caption: errorObj.caption || "",
        images: errorObj.images || "",
        fakeUserId: errorObj.fakeUserId || "",
        country: errorObj.country || "",
        hashTag: errorObj.hashTag || "",
      });
    } else {
      let formData = new FormData();

      formData.append("caption", caption);
      for (let i = 0; i < images?.length; i++) {
        formData.append("postImage", images[i]);
      }
      formData.append("hashTagId", selectedHashTagId);
      if (mongoId) {
        let payload: any = {
          data: formData,
          fakeUserId: fakeUserId,
          id: mongoId,
        };

        dispatch(updateFakePost(payload));
      } else {
        let payload: any = { data: formData, fakeUserId: fakeUserId };
        dispatch(addFakePost(payload));
      }
      dispatch(closeDialog());
    }
  };

  const renderSelectedHashtags = () => {
    return selectedHashtag?.map((option: any) => (
      <div
        key={option?._id}
        className="optionShow-option mx-2"
        style={{ display: "flex", alignItems: "center" }}
      >
        <img
          src={
            option?.hashTagBanner !== ""
              ? baseURL + option?.hashTagBanner
              : hashTagIcon?.src
          }
          onError={(e) => {
            const target: any = e.target as HTMLImageElement;
            target.src = hashTagIcon?.src;
          }}
          height={25}
          width={25}
          style={{
            objectFit: "cover",
            width: "25px",
            height: "25px",
            marginRight: "8px",
          }}
          alt="Banner"
        />
        <span>{option?.hashTag ? option?.hashTag : "Demo"}</span>
      </div>
    ));
  };

  return (
    <div>
      <Modal
        open={addPostOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Edit Post" : "Add Post"}
          </Typography>
          <form>
            <div className="row sound-add-box">
              {!dialogueData && (
                <div className="col-12 col-lg-6 col-sm-6  mt-2 country-dropdown">
                  <Selector
                    label={"Fake User"}
                    selectValue={fakeUserId}
                    placeholder={"Enter Details..."}
                    selectData={fakeUserDataGet}
                    selectId={true}
                    errorMessage={error.fakeUserId && error.fakeUserId}
                    onChange={(e) => {
                      setFakeUserId(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          fakeUserId: `Fake User Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          fakeUserId: "",
                        });
                      }
                    }}
                  />
                </div>
              )}
              <div
                className={`${
                  dialogueData ? "col-12" : "col-lg-6"
                }  col-sm-12 `}
              >
                <Input
                  label={"Caption"}
                  name={"caption"}
                  placeholder={"Enter Details..."}
                  value={caption}
                  errorMessage={error.caption && error.caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        caption: `Caption Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        caption: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-12 mt-2 country-dropdown">
                <label>HashTag</label>
                {dialogueData ? (
                  <div
                    className="readonly-hashtags d-flex align-items-center"
                    style={{
                      borderRadius: "30px",
                      padding: "10px",
                      border: "1px solid #cbd5e1",
                      minHeight: "40px",
                    }}
                  >
                    {renderSelectedHashtags()}
                  </div>
                ) : (
                  <ReactSelect
                    isMulti
                    options={allHashTagData || []}
                    value={selectedHashtag}
                    isClearable={false}
                    onChange={(selected) => handleSelectChangeHashTag(selected)}
                    getOptionValue={(option) => option?._id}
                    formatOptionLabel={(option) => (
                      <div
                        className="optionShow-option"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <img
                          src={option?.hashTagBanner !== '' ? baseURL + option?.hashTagBanner : hashTagIcon?.src}
                          onError={(e) => {
                            const target: any = e.target as HTMLImageElement;
                            target.src = hashTagIcon;
                          }}
                          height={25}
                          width={25}
                          style={{
                            objectFit: "cover",
                            width: "25px",
                            height: "25px",
                          }}
                          alt="hashtag"
                        />
                        <span>{option?.hashTag ? option?.hashTag : ""}</span>
                      </div>
                    )}
                    components={{
                      Option: CustomOptionHashTag,
                      MultiValue: CustomMultiValueHashTag,
                    }}
                  />
                )}
                {error.hashTag && (
                  <p className="errorMessage">
                    {error.hashTag && error.hashTag}
                  </p>
                )}
              </div>
              <div className="col-12 mt-2">
                <div className="custom-input">
                  <label htmlFor="">Images</label>
                  <>
                    <ReactDropzone
                      onDrop={(acceptedFiles: FileWithPath[]) =>
                        onPreviewDrop(acceptedFiles)
                      }
                      accept={"image/*" as unknown as Accept}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="mt-4">
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div
                              style={{
                                height: "130px",
                                width: "130px",
                                borderRadius: "11px",
                                border: "2px dashed rgb(185 191 199)",
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "10px",
                              }}
                            >
                              <AddIcon
                                sx={{
                                  fontSize: "40px",
                                  color: "rgb(185 191 199)",
                                }}
                              />
                            </div>
                          </div>
                        </section>
                      )}
                    </ReactDropzone>

                    {error.images && (
                      <div className="ml-2 mt-1">
                        {error.images && (
                          <div className="pl-1 text__left">
                            <span className="text-red">{error.images}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-center">
                <div className="row image-show-multi">
                  {images?.length > 0 && (
                    <>
                      {images?.map((file: any, index: number) => {
                        return (
                          <div key={index} className="image-grid-multi ">
                            <div className="image-show-multi-box">
                              {typeof file === "object" ? (
                                <img
                                  src={file ? URL.createObjectURL(file) : ""}
                                  alt=""
                                  className="mt-3 ms-3 rounded float-left mb-2"
                                  height="100px"
                                  width="100px"
                                />
                              ) : (
                                <img
                                  src={file ? baseURL + file : ""}
                                  alt=""
                                  className="mt-3 ms-3 rounded float-left mb-2"
                                  height="100px"
                                  width="100px"
                                />
                              )}

                              <IconButton
                                onClick={() => removeImage(file)}
                                style={{
                                  position: "absolute",
                                  left: "106px",
                                  top: "-112px",
                                  cursor: "pointer",
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseAddCategory}
                btnName={"Close"}
                newClass={"close-model-btn"}
              />
              {dialogueData ? (
                <Button
                  onClick={handleSubmit}
                  btnName={"Update"}
                  type={"button"}
                  newClass={"submit-btn"}
                  style={{
                    borderRadius: "0.5rem",
                    width: "88px",
                    marginLeft: "10px",
                  }}
                />
              ) : (
                <Button
                  onClick={handleSubmit}
                  btnName={"Submit"}
                  type={"button"}
                  newClass={"submit-btn"}
                  style={{
                    borderRadius: "0.5rem",
                    width: "88px",
                    marginLeft: "10px",
                  }}
                />
              )}
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateFakePost;
