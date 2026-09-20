// Safe Cleanup Utility for WUDAU Platform
// Purges all mock/seeded demo data while protecting real user accounts & uploads

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/user.model");
const Video = require("../models/video.model");
const Post = require("../models/post.model");
const Song = require("../models/song.model");
const SongCategory = require("../models/songCategory.model");
const HashTag = require("../models/hashTag.model");
const PostOrVideoComment = require("../models/postOrvideoComment.model");
const LikeHistoryOfPostOrVideo = require("../models/likeHistoryOfpostOrvideo.model");
const FollowerFollowing = require("../models/followerFollowing.model");
const Admin = require("../models/admin.model");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");

const MOCK_USERNAMES = [
  "@amani_singeli",
  "@kassim_tz",
  "@mollel_arusha",
  "@kenji_tokyo",
  "@zuhura_znz",
  "@nolwazi_sa",
  "@camille_paris",
  "@rehema_wildlife",
  "@sophiab",
  "@liam_carter",
  "@noah_d",
  "@olivia_dance",
  "@lucas_m",
];

const MOCK_VIDEO_URLS = [
  "storage/video1.mp4",
  "storage/video2.mp4",
  "storage/video3.mp4",
  "storage/video4.mp4",
];

const MOCK_VIDEO_THUMBS = [
  "storage/thumb1.jpg",
  "storage/thumb2.jpg",
  "storage/thumb3.jpg",
  "storage/thumb4.jpg",
  "storage/thumb5.jpg",
  "storage/thumb6.jpg",
  "storage/thumb7.jpg",
];

const MOCK_POST_IMAGES = [
  "storage/post1.jpg",
  "storage/post2.jpg",
  "storage/post3.jpg",
  "storage/post4.jpg",
  "storage/post5.jpg",
  "storage/post6.jpg",
];

async function ensureDefaultAdmins() {
  const defaultAdmins = [
    { email: "admin@wudau.com", name: "WUDAU Admin" },
    { email: "admin@shortie.com", name: "Administrator" },
  ];
  for (const adm of defaultAdmins) {
    const existing = await Admin.findOne({ email: adm.email });
    if (!existing) {
      await Admin.create({
        name: adm.name,
        email: adm.email,
        password: cryptr.encrypt("admin123"),
        image: "storage/male.png",
        flag: true,
      });
      console.log(`[WUDAU] Admin account ensured: ${adm.email}`);
    }
  }
}

async function cleanMockData() {
  console.log(">>> [WUDAU Clean] Starting safe cleanup of mock/seeded data...");

  // 1. Identify mock users
  const mockUsers = await User.find({
    $or: [
      { email: { $regex: /@wudau\.tz$/i } },
      { email: { $regex: /@example\.com$/i } },
      { userName: { $in: MOCK_USERNAMES } },
    ],
  }).select("_id userName email");

  const mockUserIds = mockUsers.map((u) => u._id);
  console.log(`    Found ${mockUsers.length} mock users to purge`);

  // 2. Identify mock videos
  const mockVideos = await Video.find({
    $or: [
      { userId: { $in: mockUserIds } },
      { videoUrl: { $in: MOCK_VIDEO_URLS } },
      { videoImage: { $in: MOCK_VIDEO_THUMBS } },
      { uniqueVideoId: { $regex: /^VID_100[1-9]$/ } },
    ],
  }).select("_id caption videoUrl");

  const mockVideoIds = mockVideos.map((v) => v._id);
  console.log(`    Found ${mockVideos.length} mock videos to purge`);

  // 3. Identify mock posts
  const mockPosts = await Post.find({
    $or: [
      { userId: { $in: mockUserIds } },
      { postImage: { $in: MOCK_POST_IMAGES } },
      { uniquePostId: { $regex: /^POST_100[1-9]$/ } },
    ],
  }).select("_id");

  const mockPostIds = mockPosts.map((p) => p._id);
  console.log(`    Found ${mockPosts.length} mock posts to purge`);

  // 4. Delete mock comments, likes, and follows
  const deletedComments = await PostOrVideoComment.deleteMany({
    $or: [
      { userId: { $in: mockUserIds } },
      { videoId: { $in: mockVideoIds } },
      { postId: { $in: mockPostIds } },
    ],
  });

  const deletedLikes = await LikeHistoryOfPostOrVideo.deleteMany({
    $or: [
      { userId: { $in: mockUserIds } },
      { videoId: { $in: mockVideoIds } },
      { postId: { $in: mockPostIds } },
    ],
  });

  const deletedFollows = await FollowerFollowing.deleteMany({
    $or: [
      { fromUserId: { $in: mockUserIds } },
      { toUserId: { $in: mockUserIds } },
    ],
  });

  // 5. Delete mock videos & posts
  const delVideosRes = await Video.deleteMany({ _id: { $in: mockVideoIds } });
  const delPostsRes = await Post.deleteMany({ _id: { $in: mockPostIds } });

  // 6. Delete mock songs
  const delSongsRes = await Song.deleteMany({
    $or: [
      { songLink: { $regex: /storage\/song_/ } },
      { singerName: { $in: ["Amani Juma", "Kassim ft. Jay Temba", "Emmanuel Mollel", "Kenji Takahashi", "Zuhura Bakari", "Nolwazi Khumalo"] } },
    ],
  });

  // 7. Delete mock users
  const delUsersRes = await User.deleteMany({ _id: { $in: mockUserIds } });

  // 8. Ensure legitimate real user videos are cleanly flagged as not fake
  await Video.updateMany({ isFake: true }, { $set: { isFake: false } });

  // 9. Ensure default admins are still present
  await ensureDefaultAdmins();

  const summary = {
    deletedUsers: delUsersRes.deletedCount,
    deletedVideos: delVideosRes.deletedCount,
    deletedPosts: delPostsRes.deletedCount,
    deletedSongs: delSongsRes.deletedCount,
    deletedComments: deletedComments.deletedCount,
    deletedLikes: deletedLikes.deletedCount,
    deletedFollows: deletedFollows.deletedCount,
  };

  console.log(">>> [WUDAU Clean] Purge complete! Summary:", summary);
  return summary;
}

// Standalone execution support
if (require.main === module) {
  const db = require("./connection");
  db.once("open", async () => {
    try {
      const summary = await cleanMockData();
      console.log("Clean completed successfully:", summary);
      process.exit(0);
    } catch (e) {
      console.error("Clean failed:", e);
      process.exit(1);
    }
  });
}

module.exports = { cleanMockData, ensureDefaultAdmins };
