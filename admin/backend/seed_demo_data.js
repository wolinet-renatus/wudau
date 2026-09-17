const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const User = require("./models/user.model");
const HashTag = require("./models/hashTag.model");
const SongCategory = require("./models/songCategory.model");
const CoinPlan = require("./models/coinplan.model");
const Gift = require("./models/gift.model");
const Banner = require("./models/banner.model");
const Post = require("./models/post.model");
const Video = require("./models/video.model");

async function seed() {
  await mongoose.connect(process.env.MongoDb_Connection_String);
  console.log("Connected to MongoDB for seeding demo data...");

  // 1. Hashtags
  const hashtagsData = [
    { hashTag: "Trending", hashTagIcon: "storage/male.png", hashTagBanner: "storage/male.png" },
    { hashTag: "DanceViral", hashTagIcon: "storage/female.png", hashTagBanner: "storage/female.png" },
    { hashTag: "Comedy", hashTagIcon: "storage/male.png", hashTagBanner: "storage/male.png" },
    { hashTag: "ShortieVibes", hashTagIcon: "storage/female.png", hashTagBanner: "storage/female.png" },
    { hashTag: "FitnessMotivation", hashTagIcon: "storage/male.png", hashTagBanner: "storage/male.png" },
  ];
  await HashTag.deleteMany({});
  const createdHashtags = await HashTag.insertMany(hashtagsData);
  console.log(`Seeded ${createdHashtags.length} hashtags.`);

  // 2. Song Categories
  const songCategoriesData = [
    { name: "Trending Beats", image: "storage/male.png" },
    { name: "Pop & Dance", image: "storage/female.png" },
    { name: "Acoustic & Chill", image: "storage/male.png" },
    { name: "Hip Hop Vibes", image: "storage/female.png" },
  ];
  await SongCategory.deleteMany({});
  const createdSongCategories = await SongCategory.insertMany(songCategoriesData);
  console.log(`Seeded ${createdSongCategories.length} song categories.`);

  // 3. Coin Plans
  const coinPlansData = [
    { coin: 100, amount: 0.99, productKey: "com.shortie.coins100", isPopular: false, isActive: true },
    { coin: 500, amount: 4.99, productKey: "com.shortie.coins500", isPopular: true, isActive: true },
    { coin: 1200, amount: 9.99, productKey: "com.shortie.coins1200", isPopular: false, isActive: true },
    { coin: 3000, amount: 19.99, productKey: "com.shortie.coins3000", isPopular: false, isActive: true },
  ];
  await CoinPlan.deleteMany({});
  const createdCoinPlans = await CoinPlan.insertMany(coinPlansData);
  console.log(`Seeded ${createdCoinPlans.length} coin plans.`);

  // 4. Gifts
  const giftsData = [
    { type: 1, image: "storage/female.png", coin: 10 },
    { type: 1, image: "storage/male.png", coin: 50 },
    { type: 1, image: "storage/female.png", coin: 200 },
    { type: 1, image: "storage/male.png", coin: 1000 },
  ];
  await Gift.deleteMany({});
  const createdGifts = await Gift.insertMany(giftsData);
  console.log(`Seeded ${createdGifts.length} gifts.`);

  // 5. Banners
  const bannerData = [
    { image: "storage/male.png", isActive: true },
    { image: "storage/female.png", isActive: true },
  ];
  await Banner.deleteMany({});
  const createdBanners = await Banner.insertMany(bannerData);
  console.log(`Seeded ${createdBanners.length} banners.`);

  // 6. Users
  const usersData = [
    {
      name: "Sophia Bennett",
      userName: "@sophiab",
      image: "storage/female.png",
      gender: "Female",
      bio: "Lifestyle creator & traveler ✨",
      age: 22,
      country: "United States",
      uniqueId: "SHORTIE_1001",
      email: "sophia@example.com",
      coin: 1500,
      receivedCoin: 450,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Liam Carter",
      userName: "@liam_carter",
      image: "storage/male.png",
      gender: "Male",
      bio: "Music producer & DJ 🎧",
      age: 25,
      country: "Canada",
      uniqueId: "SHORTIE_1002",
      email: "liam@example.com",
      coin: 2400,
      receivedCoin: 800,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Emma Watson",
      userName: "@emma_dance",
      image: "storage/female.png",
      gender: "Female",
      bio: "Dancing through life 💃",
      age: 20,
      country: "United Kingdom",
      uniqueId: "SHORTIE_1003",
      email: "emma@example.com",
      coin: 850,
      receivedCoin: 120,
      loginType: 2,
      isVerified: false,
      isFake: true,
    },
    {
      name: "Lucas Silva",
      userName: "@lucas_fitness",
      image: "storage/male.png",
      gender: "Male",
      bio: "Daily workouts & motivation 💪",
      age: 27,
      country: "Brazil",
      uniqueId: "SHORTIE_1004",
      email: "lucas@example.com",
      coin: 500,
      receivedCoin: 60,
      loginType: 2,
      isVerified: false,
      isFake: true,
    },
  ];
  await User.deleteMany({});
  const createdUsers = await User.insertMany(usersData);
  console.log(`Seeded ${createdUsers.length} users.`);

  // 7. Posts
  const postsData = [
    {
      uniquePostId: "POST_1001",
      caption: "Golden hour sunset vibes 🌅 #Trending #ShortieVibes",
      mainPostImage: "storage/female.png",
      postImage: ["storage/female.png"],
      location: "Los Angeles, CA",
      hashTagId: [createdHashtags[0]._id, createdHashtags[3]._id],
      userId: createdUsers[0]._id,
      shareCount: 42,
      isFake: false,
    },
    {
      uniquePostId: "POST_1002",
      caption: "Studio recording day! New beats dropping soon 🎶 #Trending",
      mainPostImage: "storage/male.png",
      postImage: ["storage/male.png"],
      location: "Toronto, ON",
      hashTagId: [createdHashtags[0]._id],
      userId: createdUsers[1]._id,
      shareCount: 19,
      isFake: false,
    },
    {
      uniquePostId: "POST_1003",
      caption: "Morning choreography rehearsal 💃 #DanceViral",
      mainPostImage: "storage/female.png",
      postImage: ["storage/female.png"],
      location: "London, UK",
      hashTagId: [createdHashtags[1]._id],
      userId: createdUsers[2]._id,
      shareCount: 88,
      isFake: true,
    },
  ];
  await Post.deleteMany({});
  const createdPosts = await Post.insertMany(postsData);
  console.log(`Seeded ${createdPosts.length} posts.`);

  console.log("Demo data seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
