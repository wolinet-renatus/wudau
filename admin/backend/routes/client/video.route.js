//express
const express = require("express");
const route = express.Router();

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({ storage });

const checkAccessWithSecretKey = require("../../checkAccess");

//controller
const VideoController = require("../../controllers/client/video.controller");

//upload video by particular user
route.post(
  "/uploadvideo",
  checkAccessWithSecretKey(),
  upload.fields([
    { name: "videoImage", maxCount: 5 },
    { name: "videoUrl", maxCount: 5 },
  ]),
  VideoController.uploadvideo
);

//update video by particular user
route.patch("/updateVideoByUser", checkAccessWithSecretKey(), upload.single("videoImage"), VideoController.updateVideoByUser);

//get particular user's videos
route.get("/videosOfUser", checkAccessWithSecretKey(), VideoController.videosOfUser);

//if isFakeData on then real+fake videos otherwise fake videos
route.get("/getAllVideos", checkAccessWithSecretKey(), VideoController.getAllVideos);

// High-efficiency zero-delay cursor-based stream feed
const StreamFeedController = require("../../controllers/client/streamFeed.controller");
route.get("/stream-feed", checkAccessWithSecretKey(), StreamFeedController.getStreamFeed);
route.post("/stream-feed", checkAccessWithSecretKey(), StreamFeedController.getStreamFeed);

// Download video with official WUDAO brand watermark
route.get("/download", VideoController.downloadWatermarkedVideo);
route.get("/downloadVideo", VideoController.downloadWatermarkedVideo);

// Safe Mock Data Cleanup
route.all("/cleanupMockData", checkAccessWithSecretKey(), async (req, res) => {
  try {
    const { cleanMockData } = require("../../util/cleanMockData");
    const result = await cleanMockData();
    return res.status(200).json({ status: true, message: "Mock data purged successfully", data: result });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
});

//delete video
route.delete("/deleteVideoOfUser", checkAccessWithSecretKey(), VideoController.deleteVideoOfUser);

//like or dislike of particular video by the particular user
route.post("/likeOrDislikeOfVideo", checkAccessWithSecretKey(), VideoController.likeOrDislikeOfVideo);

//when user share the video then shareCount of the particular video increased
route.post("/shareCountOfVideo", checkAccessWithSecretKey(), VideoController.shareCountOfVideo);

//delete video
route.delete("/deleteParticularVideo", checkAccessWithSecretKey(), VideoController.deleteParticularVideo);

//get videos of the particular song by particular user
route.get("/fetchVideosOfParticularSong", checkAccessWithSecretKey(), VideoController.fetchVideosOfParticularSong);

module.exports = route;
