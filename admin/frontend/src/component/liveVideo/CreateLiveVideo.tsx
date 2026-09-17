import React, { useEffect, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import Selector from "../../extra/Selector";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { useSelector } from "react-redux";
import { allUsers } from "../../store/userSlice";
import { closeDialog } from "../../store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { baseURL } from "@/util/config";
import { addLiveVideo, updateLiveVideo } from "@/store/liveVideoSlice";


interface CreateFakeVideoProps {}

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

const CreateLiveVideo: React.FC<CreateFakeVideoProps> = () => {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: any) => state.dialogue
  );


  const { fakeUserData } = useSelector((state: RootStore) => state.user);
  const [mongoId, setMongoId] = useState<string>("");
  const [addVideoOpen, setAddVideoOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [videoTime, setVideoTime] = useState<number>();
  const [fakePostDataGet, setFakeUserDataGet] = useState<any[]>([]);
  const [video, setVideo] = useState<{
    file: File | null;
    thumbnailBlob: File | null;
  }>({
    file: null,
    thumbnailBlob: null,
  });
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File[]>([]);
  const [thumbnailKey, setThumbnailKey] = useState<number>(0);
  const [error, setError] = useState({
    video: "",
    userId: "",
    country: "",
  });

  console.log("userId", userId);
  console.log("fakePostDataGet", fakePostDataGet);
  console.log("fakeUserData", fakeUserData);

  const dispatch = useAppDispatch();
  useEffect(() => {
    setAddVideoOpen(dialogue);
    if (dialogueData) {
      setMongoId(dialogueData?._id);
      setUserId(dialogueData?.userId || "");
      setVideoPath(baseURL + dialogueData?.videoUrl || null);
      setThumbnail(dialogueData?.videoImage || []);
      setVideoTime(dialogueData?.videoTime || 0);
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
  }, []);

  useEffect(() => {
    setFakeUserDataGet(fakeUserData);
  }, [fakeUserData]);

  const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoPath(URL.createObjectURL(e.target.files?.[0]));

    if (file) {
      const thumbnailBlob: any = await generateThumbnailBlob(file);

      if (thumbnailBlob) {
        const videoFileName = file ? file?.name : "video";
        const thumbnailFileName = `${videoFileName.replace(
          /\.[^/.]+$/,
          ""
        )}.jpeg`;

        const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
          type: "image/jpeg",
        });
        setThumbnail([thumbnailFile]);
        setVideo({
          file: file,
          thumbnailBlob: thumbnailFile,
        });
      }
      setThumbnailKey((prevKey) => prevKey + 1);
    } else {
      setError((prevErrors) => ({
        ...prevErrors,
        video: "Please select a video!",
      }));
    }
    const selectedFile = e.target.files?.[0];

    const videoElement = document.createElement("video");
    if (selectedFile) {
      videoElement.src = URL.createObjectURL(selectedFile);
      videoElement.addEventListener("loadedmetadata", () => {
        const durationInSeconds = videoElement.duration;
        const durationInMilliseconds = durationInSeconds;
        setVideoTime(durationInMilliseconds);
      });
    }
  };

  const generateThumbnailBlob = async (file: File) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        video.currentTime = 1; // Set to capture the frame at 1 second
      };

      video.onseeked = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };

      const objectURL = URL.createObjectURL(file);
      video.src = objectURL;

      return () => {
        URL.revokeObjectURL(objectURL);
      };
    });
  };

  const handleCloseAddCategory = () => {
    setAddVideoOpen(false);
    dispatch(closeDialog());
  };

  const handleSubmit = () => {
    if (!userId || !videoPath) {
      let error: any = {};
      if (!userId) error.userId = "User Is Required !";
      if (!video.file) error.video = "Please select video!";
      return setError({ ...error });
    } else {
      let formData = new FormData();

      formData.append("videoUrl", video.file);
      formData.append("videoImage", thumbnail[0]);
      formData.append("videoTime", videoTime?.toString() || "");
      formData.append("userId", userId);
      formData.append("videoId", mongoId);
      if (mongoId) {
        let payload: any = {
          data: formData,
          id: mongoId,
        };
        dispatch(updateLiveVideo(payload));
      } else {
        let payload: any = { data: formData };
        dispatch(addLiveVideo(payload));
      }
      dispatch(closeDialog());
    }
  };

  return (
    <div>
      <Modal
        open={addVideoOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Edit Video" : "Add Video"}
          </Typography>
          <form>
            <div className="row sound-add-box videoCreateModel d-flex align-items-end">
              {!dialogueData && (
                <div className="col-12 col-lg-6 col-sm-6 mt-2 country-dropdown">
                  <Selector
                    label={"Fake User"}
                    selectValue={userId}
                    placeholder={"Enter Details..."}
                    selectData={fakePostDataGet}
                    selectId={true}
                    errorMessage={error.userId}
                    onChange={(e: any) => {
                      setUserId(e.target.value);
                      if (!e.target.value) {
                        setError({
                          ...error,
                          userId: "UserId Is Required",
                        });
                      } else {
                        setError({ ...error, userId: "" });
                      }
                    }}
                  />
                </div>
              )}

              <div className="col-12 col-lg-6 col-sm-6 mt-2">
                <Input
                  label={"Video Time (Seconds)"}
                  name={"videoTime"}
                  accept={"video/*"}
                  placeholder={"Video Time"}
                  value={videoTime?.toString() || ""}
                  disabled={true}
                />
              </div>

              <div className="col-12 mt-2">
                <Input
                  label={`Video`}
                  id={`video`}
                  type={`file`}
                  accept={`video/*`}
                  errorMessage={error.video}
                  onChange={handleVideo}
                />
              </div>

              {video.file ? (
                <div className="col-12 d-flex mt-4 videoShow">
                  <video
                    controls
                    style={{ width: "150px", height: "150px" }}
                    src={video.file ? URL?.createObjectURL(video.file) : ""}
                  />
                  <img
                    src={
                      video.thumbnailBlob
                        ? URL?.createObjectURL(video.thumbnailBlob)
                        : ""
                    }
                    style={{
                      width: "150px",
                      height: "150px",
                      marginLeft: "20px",
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="col-12 d-flex mt-4">
                    <video
                      controls
                      style={{ width: "200px", height: "200px" }}
                      src={videoPath}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="mt-3 pt-3 d-flex justify-content-end">
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
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default CreateLiveVideo;
