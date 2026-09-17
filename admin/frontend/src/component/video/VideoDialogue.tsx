import { RootStore, useAppDispatch } from "@/store/store";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/extra/Button";
import { closeDialog } from "@/store/dialogSlice";
import { baseURL } from "@/util/config";
import { getVideoDetails } from "@/store/videoSlice";

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
const VideoDialogue: React.FC = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  const [addPostOpen, setAddPostOpen] = useState(false);
  const { videoData }: any = useSelector((state: RootStore) => state?.video);

  useEffect(() => {
    dispatch(getVideoDetails(dialogueData?._id));
  }, []);

  useEffect(() => {
    setAddPostOpen(dialogue);
  }, [dialogue]);

  const handleCloseAddCategory = () => {
    setAddPostOpen(false);
    dispatch(closeDialog());
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const maxLength = 10; // Number of characters to show initially
  const caption = dialogueData?.caption || "";

  return (
    <div>
      <Modal
        open={addPostOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography
            id="modal-modal-title"
            style={{ borderBottom: "1px solid #000" }}
            variant="h6"
            component="h2"
          >
            View Video
          </Typography>

          <div
            className="col-12 mt-2"
           
          >
            <span className="fw-bold ">
              {caption ? "Video Description" : ""}
            </span>
            <p className="mt-2"  style={{
              overflow: `${isExpanded ? "scroll" : ""}`,
              height: `${isExpanded ? "200px" : ""} `,
            }}>
              {isExpanded
                ? caption
                : `${caption.substring(0, maxLength)}${
                    caption.length > maxLength ? "..." : ""
                  }`}
            </p>
            {caption.length > maxLength && (
              <span className="button" onClick={toggleReadMore}>
                {isExpanded ? "Read Less" : "Read More"}
              </span>
            )}
          </div>

          <div className="row mt-3">
            <video
              controls
              src={baseURL + dialogueData?.videoUrl}
              width={0}
              height={350}
              style={{ objectFit: "contain", width: "full" }}
            />
          </div>

          <div className="mt-3 pt-3 d-flex justify-content-end">
            <Button
              onClick={handleCloseAddCategory}
              btnName={"Close"}
              newClass={"close-model-btn"}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default VideoDialogue;
