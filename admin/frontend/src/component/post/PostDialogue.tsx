import { RootStore, useAppDispatch } from "@/store/store";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/extra/Button";
import { closeDialog } from "@/store/dialogSlice";
import { baseURL } from "@/util/config";
import { getPostDetails } from "@/store/postSlice";

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
const PostDialogue: React.FC = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const { postData }: any = useSelector((state: RootStore) => state?.post);

  const dispatch = useAppDispatch();

  const [data, setData] = useState<any>();
  const [isExpanded, setIsExpanded] = useState(false);

  const [addPostOpen, setAddPostOpen] = useState(false);
  


  useEffect(() => {
    setData(postData);
  }, [dialogueData]);

  useEffect(() => {
    dispatch(getPostDetails(dialogueData?._id));
  }, [dialogueData]);

  useEffect(() => {
    if (dialogue) {
      setAddPostOpen(true);
    }
  }, [dialogue]);

  const handleCloseAddCategory = async () => {
    dispatch(closeDialog());
    await setAddPostOpen(false);
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
            View Post
          </Typography>
          <div className="col-12 mt-2">
            <span className="fw-bold">{caption ? "Post Description" : ""}</span>
            <p
              className="mt-2"
              style={{
                overflow: `${isExpanded ? "scroll" : ""}`,
                height: `${isExpanded ? "200px" : ""} `,
              }}
            >
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
            <span className="fw-bold">Post</span>

            <img
              src={baseURL + dialogueData?.mainPostImage}
              alt="Post"
              height={400}
              style={{ objectFit: "contain", width: "100%", height: "350px" }}
            />
          </div>

          <div className="mt-3 pt-3 d-flex justify-content-end">
            <Button
              onClick={() => handleCloseAddCategory()}
              btnName={"Close"}
              newClass={"close-model-btn"}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PostDialogue;
