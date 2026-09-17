const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const User = require("./models/user.model");
const HashTag = require("./models/hashTag.model");
const HashTagUsageHistory = require("./models/hashTagUsageHistory.model");
const SongCategory = require("./models/songCategory.model");
const Song = require("./models/song.model");
const CoinPlan = require("./models/coinplan.model");
const Gift = require("./models/gift.model");
const Banner = require("./models/banner.model");
const Post = require("./models/post.model");
const Video = require("./models/video.model");
const LikeHistoryOfPostOrVideo = require("./models/likeHistoryOfpostOrvideo.model");
const PostOrVideoComment = require("./models/postOrvideoComment.model");
const FollowerFollowing = require("./models/followerFollowing.model");
const LiveUser = require("./models/liveUser.model");
const LiveHistory = require("./models/liveHistory.model");

async function seed() {
  await mongoose.connect(process.env.MongoDb_Connection_String);
  console.log("Connected to MongoDB for seeding authentic WUDAU social media data...");

  // 1. Hashtags
  const hashtagsData = [
    { hashTag: "Trending", hashTagIcon: "storage/thumb1.jpg", hashTagBanner: "storage/banner_bongo_spotlight.jpg" },
    { hashTag: "ZanzibarVibes", hashTagIcon: "storage/post4.jpg", hashTagBanner: "storage/banner_tz_nature.jpg" },
    { hashTag: "BongoDance", hashTagIcon: "storage/thumb2.jpg", hashTagBanner: "storage/category_bongo.jpg" },
    { hashTag: "Singeli300BPM", hashTagIcon: "storage/thumb3.jpg", hashTagBanner: "storage/category_bongo.jpg" },
    { hashTag: "SerengetiMagic", hashTagIcon: "storage/post5.jpg", hashTagBanner: "storage/banner_tz_nature.jpg" },
    { hashTag: "NatureTz", hashTagIcon: "storage/post5.jpg", hashTagBanner: "storage/banner_tz_nature.jpg" },
    { hashTag: "WudauCreatives", hashTagIcon: "storage/thumb4.jpg", hashTagBanner: "storage/category_global.jpg" },
    { hashTag: "DarEsSalaam", hashTagIcon: "storage/post6.jpg", hashTagBanner: "storage/banner_bongo_spotlight.jpg" },
    { hashTag: "AfrobeatsGlobal", hashTagIcon: "storage/thumb5.jpg", hashTagBanner: "storage/category_afrobeats.jpg" },
    { hashTag: "KilimanjaroVibe", hashTagIcon: "storage/banner_tz_nature.jpg", hashTagBanner: "storage/banner_tz_nature.jpg" },
    { hashTag: "SwahiliStyle", hashTagIcon: "storage/post1.jpg", hashTagBanner: "storage/banner_bongo_spotlight.jpg" },
    { hashTag: "StreetFoodDar", hashTagIcon: "storage/post3.jpg", hashTagBanner: "storage/category_bongo.jpg" },
    { hashTag: "EastAfricanArt", hashTagIcon: "storage/post4.jpg", hashTagBanner: "storage/category_global.jpg" },
  ];
  await HashTag.deleteMany({});
  const createdHashtags = await HashTag.insertMany(hashtagsData);
  console.log(`Seeded ${createdHashtags.length} hashtags.`);

  // 2. Song Categories
  const songCategoriesData = [
    { name: "Bongo Flava & Afro-Pop", image: "storage/category_bongo.jpg" },
    { name: "Singeli & Street Rhythms", image: "storage/category_bongo.jpg" },
    { name: "Coastal & Acoustic", image: "storage/category_nature.jpg" },
    { name: "Amapiano & Club", image: "storage/category_afrobeats.jpg" },
    { name: "Serengeti Wildlife & Chants", image: "storage/category_nature.jpg" },
    { name: "Global Fusion & Tokyo Beats", image: "storage/category_global.jpg" },
  ];
  await SongCategory.deleteMany({});
  const createdSongCategories = await SongCategory.insertMany(songCategoriesData);
  console.log(`Seeded ${createdSongCategories.length} song categories.`);

  // 3. Songs
  const songsData = [
    {
      songTitle: "Mapenzi ya Bongo",
      songImage: "storage/category_bongo.jpg",
      singerName: "Kassim ft. Jay Temba",
      songTime: 45,
      songLink: "storage/song_bongo_1.mp3",
      songCategoryId: createdSongCategories[0]._id,
    },
    {
      songTitle: "Kinondoni Singeli Rush 300BPM",
      songImage: "storage/category_bongo.jpg",
      singerName: "Amani Juma",
      songTime: 35,
      songLink: "storage/song_singeli_1.mp3",
      songCategoryId: createdSongCategories[1]._id,
    },
    {
      songTitle: "Serengeti Sunrise Acoustic",
      songImage: "storage/category_nature.jpg",
      singerName: "Zuhura Bakari",
      songTime: 50,
      songLink: "storage/song_acoustic_tz.mp3",
      songCategoryId: createdSongCategories[2]._id,
    },
    {
      songTitle: "Jozi to Dar Amapiano Wave",
      songImage: "storage/category_afrobeats.jpg",
      singerName: "Nolwazi Khumalo",
      songTime: 42,
      songLink: "storage/song_amapiano.mp3",
      songCategoryId: createdSongCategories[3]._id,
    },
    {
      songTitle: "Ngorongoro Dawn Chants",
      songImage: "storage/category_nature.jpg",
      singerName: "Emmanuel Mollel",
      songTime: 40,
      songLink: "storage/song_maasai_chant.mp3",
      songCategoryId: createdSongCategories[4]._id,
    },
    {
      songTitle: "Tokyo to Dar Fusion Beat",
      songImage: "storage/category_global.jpg",
      singerName: "Kenji Takahashi",
      songTime: 48,
      songLink: "storage/song_tokyo_fusion.mp3",
      songCategoryId: createdSongCategories[5]._id,
    },
  ];
  await Song.deleteMany({});
  const createdSongs = await Song.insertMany(songsData);
  console.log(`Seeded ${createdSongs.length} songs.`);

  // 4. Coin Plans
  const coinPlansData = [
    { coin: 100, amount: 0.99, productKey: "com.wudau.coins100", isPopular: false, isActive: true },
    { coin: 500, amount: 4.99, productKey: "com.wudau.coins500", isPopular: true, isActive: true },
    { coin: 1200, amount: 9.99, productKey: "com.wudau.coins1200", isPopular: false, isActive: true },
    { coin: 3000, amount: 19.99, productKey: "com.wudau.coins3000", isPopular: false, isActive: true },
  ];
  await CoinPlan.deleteMany({});
  const createdCoinPlans = await CoinPlan.insertMany(coinPlansData);
  console.log(`Seeded ${createdCoinPlans.length} coin plans.`);

  // 5. Gifts
  const giftsData = [
    { type: 1, image: "storage/avatar_kassim.png", coin: 10, title: "Rose" },
    { type: 1, image: "storage/avatar_zuhura.png", coin: 50, title: "Coffee" },
    { type: 1, image: "storage/avatar_rehema.png", coin: 200, title: "Diamond" },
    { type: 1, image: "storage/avatar_jay.png", coin: 1000, title: "Lion Crown" },
  ];
  await Gift.deleteMany({});
  const createdGifts = await Gift.insertMany(giftsData);
  console.log(`Seeded ${createdGifts.length} gifts.`);

  // 6. Banners
  const bannerData = [
    { image: "storage/banner_tz_nature.jpg", isActive: true },
    { image: "storage/banner_bongo_spotlight.jpg", isActive: true },
    { image: "storage/category_bongo.jpg", isActive: true },
    { image: "storage/category_afrobeats.jpg", isActive: true },
  ];
  await Banner.deleteMany({});
  const createdBanners = await Banner.insertMany(bannerData);
  console.log(`Seeded ${createdBanners.length} banners.`);

  // 7. Authentic Creators (Users)
  const usersData = [
    {
      name: "Kassim Mwambao",
      userName: "@kassim_tz",
      image: "storage/avatar_kassim.png",
      gender: "Male",
      bio: "Kinondoni street choreographer & dance captain 🇹🇿⚡ Welcome to the rhythm!",
      age: 24,
      country: "Tanzania",
      uniqueId: "WUDAU_1001",
      email: "kassim@wudau.tz",
      coin: 3500,
      receivedCoin: 1420,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Zuhura Bakari",
      userName: "@zuhura_znz",
      image: "storage/avatar_zuhura.png",
      gender: "Female",
      bio: "Stone Town stories, ocean sunsets, & coastal culture 🌴 Karibuni Zanzibar!",
      age: 22,
      country: "Tanzania",
      uniqueId: "WUDAU_1002",
      email: "zuhura@wudau.tz",
      coin: 4800,
      receivedCoin: 2890,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Emmanuel Mollel",
      userName: "@mollel_arusha",
      image: "storage/avatar_mollel.png",
      gender: "Male",
      bio: "Arusha native 🏔️ Maasai cultural heritage & Mount Meru hiking guide.",
      age: 28,
      country: "Tanzania",
      uniqueId: "WUDAU_1003",
      email: "mollel@wudau.tz",
      coin: 2200,
      receivedCoin: 950,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Amani Juma",
      userName: "@amani_singeli",
      image: "storage/avatar_amani.png",
      gender: "Male",
      bio: "Fastest Singeli footwork in Dar es Salaam 👟⚡ 300BPM pure energy.",
      age: 21,
      country: "Tanzania",
      uniqueId: "WUDAU_1004",
      email: "amani@wudau.tz",
      coin: 1900,
      receivedCoin: 780,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Rehema Mushi",
      userName: "@rehema_wildlife",
      image: "storage/avatar_rehema.png",
      gender: "Female",
      bio: "Serengeti & Ngorongoro conservationist 🦁 Safari lens storyteller.",
      age: 26,
      country: "Tanzania",
      uniqueId: "WUDAU_1005",
      email: "rehema@wudau.tz",
      coin: 5600,
      receivedCoin: 3400,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Juma Temba",
      userName: "@jay_bongo",
      image: "storage/avatar_jay.png",
      gender: "Male",
      bio: "Music producer & audio engineer 🎧 Taking Bongo Flava to the world.",
      age: 25,
      country: "Tanzania",
      uniqueId: "WUDAU_1006",
      email: "jay@wudau.tz",
      coin: 3100,
      receivedCoin: 1650,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Nolwazi Khumalo",
      userName: "@nolwazi_sa",
      image: "storage/avatar_nolwazi.png",
      gender: "Female",
      bio: "Johannesburg Amapiano dancer & fashion stylist ✨🇿🇦",
      age: 23,
      country: "South Africa",
      uniqueId: "WUDAU_1007",
      email: "nolwazi@wudau.tz",
      coin: 2900,
      receivedCoin: 1100,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Kofi Mensah",
      userName: "@kofi_accra",
      image: "storage/avatar_kofi.png",
      gender: "Male",
      bio: "Pan-African street photographer & visual director 🇬🇭 Accra vibes.",
      age: 27,
      country: "Ghana",
      uniqueId: "WUDAU_1008",
      email: "kofi@wudau.tz",
      coin: 2400,
      receivedCoin: 850,
      loginType: 2,
      isVerified: false,
      isFake: false,
    },
    {
      name: "Kenji Takahashi",
      userName: "@kenji_tokyo",
      image: "storage/avatar_kenji.png",
      gender: "Male",
      bio: "Tokyo beatmaker collaborating with African artists 🇯🇵🎵",
      age: 29,
      country: "Japan",
      uniqueId: "WUDAU_1009",
      email: "kenji@wudau.tz",
      coin: 4200,
      receivedCoin: 2100,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
    {
      name: "Camille Laurent",
      userName: "@camille_paris",
      image: "storage/avatar_camille.png",
      gender: "Female",
      bio: "Travel documentarian exploring East African art & heritage 🇫🇷📸",
      age: 25,
      country: "France",
      uniqueId: "WUDAU_1010",
      email: "camille@wudau.tz",
      coin: 2800,
      receivedCoin: 990,
      loginType: 2,
      isVerified: true,
      isFake: false,
    },
  ];
  await User.deleteMany({});
  const createdUsers = await User.insertMany(usersData);
  console.log(`Seeded ${createdUsers.length} authentic creators.`);

  // 8. Follow Relationships
  const followPairs = [
    { fromUserId: createdUsers[0]._id, toUserId: createdUsers[1]._id },
    { fromUserId: createdUsers[0]._id, toUserId: createdUsers[3]._id },
    { fromUserId: createdUsers[1]._id, toUserId: createdUsers[4]._id },
    { fromUserId: createdUsers[2]._id, toUserId: createdUsers[0]._id },
    { fromUserId: createdUsers[3]._id, toUserId: createdUsers[5]._id },
    { fromUserId: createdUsers[4]._id, toUserId: createdUsers[1]._id },
    { fromUserId: createdUsers[5]._id, toUserId: createdUsers[8]._id },
    { fromUserId: createdUsers[8]._id, toUserId: createdUsers[0]._id },
  ];
  await FollowerFollowing.deleteMany({});
  await FollowerFollowing.insertMany(followPairs);

  // 9. Authentic Posts (with multi-image carousels & rich African culture)
  const postsData = [
    {
      uniquePostId: "POST_1001",
      caption: "Sunset over Stone Town, Zanzibar. Spice island hospitality, wooden dhow boats, and calm turquoise waters. Karibuni sana! 🌴🌊🇹🇿 #ZanzibarVibes #WudauCreatives",
      mainPostImage: "storage/post4.jpg",
      postImage: ["storage/post4.jpg", "storage/post1.jpg"],
      location: "Stone Town, Zanzibar 🇹🇿",
      hashTagId: [createdHashtags[1]._id, createdHashtags[6]._id],
      userId: createdUsers[1]._id, // Zuhura Bakari
      shareCount: 168,
      isFake: false,
    },
    {
      uniquePostId: "POST_1002",
      caption: "Early morning golden hour in Ngorongoro Crater & endless Serengeti plains. Pure breathtaking wonder of African wildlife. 🦁🐘🇹🇿 #NatureTz #SerengetiMagic",
      mainPostImage: "storage/post5.jpg",
      postImage: ["storage/post5.jpg", "storage/banner_tz_nature.jpg", "storage/post2.jpg"],
      location: "Ngorongoro Conservation Area 🇹🇿",
      hashTagId: [createdHashtags[4]._id, createdHashtags[5]._id],
      userId: createdUsers[4]._id, // Rehema Mushi
      shareCount: 245,
      isFake: false,
    },
    {
      uniquePostId: "POST_1003",
      caption: "Kinondoni night rehearsals with the dance crew! Quick footwork, intense rhythm, and positive energy. Big challenge dropping this weekend 🔥👟 #BongoDance #DarEsSalaam",
      mainPostImage: "storage/post6.jpg",
      postImage: ["storage/post6.jpg", "storage/post3.jpg"],
      location: "Kinondoni, Dar es Salaam 🇹🇿",
      hashTagId: [createdHashtags[2]._id, createdHashtags[7]._id],
      userId: createdUsers[0]._id, // Kassim Mwambao
      shareCount: 189,
      isFake: false,
    },
    {
      uniquePostId: "POST_1004",
      caption: "Studio vibes in Masaki! Mixing live acoustic guitar with heavy 808s for the upcoming album. East African sound taking over the airwaves 🎶🎛️ #Trending #WudauCreatives",
      mainPostImage: "storage/post2.jpg",
      postImage: ["storage/post2.jpg", "storage/post1.jpg"],
      location: "Masaki, Dar es Salaam 🇹🇿",
      hashTagId: [createdHashtags[0]._id, createdHashtags[6]._id],
      userId: createdUsers[5]._id, // Juma Temba
      shareCount: 112,
      isFake: false,
    },
    {
      uniquePostId: "POST_1005",
      caption: "Mount Meru sunrise over Arusha. Honoring our ancestors and sharing the living traditions of the Maasai people with travelers from across the globe 🏔️✨ #NatureTz #SerengetiMagic",
      mainPostImage: "storage/banner_tz_nature.jpg",
      postImage: ["storage/banner_tz_nature.jpg", "storage/post5.jpg"],
      location: "Arusha, Tanzania 🇹🇿",
      hashTagId: [createdHashtags[5]._id, createdHashtags[4]._id],
      userId: createdUsers[2]._id, // Emmanuel Mollel
      shareCount: 94,
      isFake: false,
    },
    {
      uniquePostId: "POST_1006",
      caption: "Singeli ya mtaa! 300 beats per minute non-stop adrenaline at the street carnival. No dancers in the world match this speed ⚡🔥 #Singeli300BPM #DarEsSalaam",
      mainPostImage: "storage/post3.jpg",
      postImage: ["storage/post3.jpg", "storage/post6.jpg"],
      location: "Tandale, Dar es Salaam 🇹🇿",
      hashTagId: [createdHashtags[3]._id, createdHashtags[7]._id],
      userId: createdUsers[3]._id, // Amani Juma
      shareCount: 310,
      isFake: false,
    },
    {
      uniquePostId: "POST_1007",
      caption: "Connecting Tokyo to Dar es Salaam! Working with Tanzanian vocalists over high-res stems. The future of sound is global and collaborative 🇯🇵🇹🇿 #AfrobeatsGlobal #WudauCreatives",
      mainPostImage: "storage/category_global.jpg",
      postImage: ["storage/category_global.jpg", "storage/post2.jpg"],
      location: "Shibuya, Tokyo 🇯🇵",
      hashTagId: [createdHashtags[8]._id, createdHashtags[6]._id],
      userId: createdUsers[8]._id, // Kenji Takahashi
      shareCount: 87,
      isFake: false,
    },
    {
      uniquePostId: "POST_1008",
      caption: "Documenting the vibrant textile markets of Stone Town and the warm welcoming smiles of coastal locals. Tanzania, you have my whole heart ❤️📸 #ZanzibarVibes #WudauCreatives",
      mainPostImage: "storage/post1.jpg",
      postImage: ["storage/post1.jpg", "storage/post4.jpg"],
      location: "Forodhani Gardens, Zanzibar 🇹🇿",
      hashTagId: [createdHashtags[1]._id, createdHashtags[6]._id],
      userId: createdUsers[9]._id, // Camille Laurent
      shareCount: 134,
      isFake: false,
    },
    {
      uniquePostId: "POST_1009",
      caption: "Modern Kitenge silhouette with handwoven coastal beads! Celebrating timeless Swahili fashion on the streets of Dar 👗✨ #SwahiliStyle #WudauCreatives",
      mainPostImage: "storage/post2.jpg",
      postImage: ["storage/post2.jpg", "storage/post4.jpg"],
      location: "Oysterbay, Dar es Salaam 🇹🇿",
      hashTagId: [createdHashtags[10]._id, createdHashtags[6]._id],
      userId: createdUsers[6]._id, // Nolwazi Khumalo
      shareCount: 220,
      isFake: false,
    },
    {
      uniquePostId: "POST_1010",
      caption: "Fresh seafood skewers, Zanzibar pizza, and chilled sugarcane ginger juice at the oceanfront night market! Savor the aroma 🍢🔥 #StreetFoodDar #ZanzibarVibes",
      mainPostImage: "storage/post3.jpg",
      postImage: ["storage/post3.jpg", "storage/post1.jpg"],
      location: "Stone Town Waterfront 🇹🇿",
      hashTagId: [createdHashtags[11]._id, createdHashtags[1]._id],
      userId: createdUsers[1]._id, // Zuhura Bakari
      shareCount: 175,
      isFake: false,
    },
    {
      uniquePostId: "POST_1011",
      caption: "Above the sea of clouds at 4,700m! Pushing toward Uhuru Peak with the most resilient mountain guides in the world 🏔️🥾 #KilimanjaroVibe #NatureTz",
      mainPostImage: "storage/banner_tz_nature.jpg",
      postImage: ["storage/banner_tz_nature.jpg", "storage/post5.jpg"],
      location: "Mount Kilimanjaro, Tanzania 🇹🇿",
      hashTagId: [createdHashtags[9]._id, createdHashtags[5]._id],
      userId: createdUsers[2]._id, // Emmanuel Mollel
      shareCount: 388,
      isFake: false,
    },
    {
      uniquePostId: "POST_1012",
      caption: "Traditional Makonde blackwood sculpture and Tingatinga vibrant canvas art in creation. Heritage preserved across generations 🎨🖌️ #EastAfricanArt #WudauCreatives",
      mainPostImage: "storage/post4.jpg",
      postImage: ["storage/post4.jpg", "storage/post6.jpg"],
      location: "Mwenge Carvers Market, Dar es Salaam 🇹🇿",
      hashTagId: [createdHashtags[12]._id, createdHashtags[6]._id],
      userId: createdUsers[9]._id, // Camille Laurent
      shareCount: 142,
      isFake: false,
    },
    {
      uniquePostId: "POST_1013",
      caption: "When Amapiano bassline meets Bongo rhythm in an impromptu Dar beach jam! Music connects our continent 🇿🇦🇹🇿 #AfrobeatsGlobal #BongoDance",
      mainPostImage: "storage/category_afrobeats.jpg",
      postImage: ["storage/category_afrobeats.jpg", "storage/post3.jpg"],
      location: "Coco Beach, Dar es Salaam 🇹🇿",
      hashTagId: [createdHashtags[8]._id, createdHashtags[2]._id],
      userId: createdUsers[6]._id, // Nolwazi Khumalo
      shareCount: 290,
      isFake: false,
    },
    {
      uniquePostId: "POST_1014",
      caption: "Rare afternoon resting on the acacia branch. Golden coat glistening in the Serengeti afternoon sun 🐆🌿 #SerengetiMagic #NatureTz",
      mainPostImage: "storage/post5.jpg",
      postImage: ["storage/post5.jpg", "storage/banner_tz_nature.jpg"],
      location: "Seronera Valley, Serengeti 🇹🇿",
      hashTagId: [createdHashtags[4]._id, createdHashtags[5]._id],
      userId: createdUsers[4]._id, // Rehema Mushi
      shareCount: 410,
      isFake: false,
    },
  ];
  await Post.deleteMany({});
  const createdPosts = await Post.insertMany(postsData);
  console.log(`Seeded ${createdPosts.length} posts.`);

  // 10. Authentic Videos (Reels)
  const videosData = [
    {
      uniqueVideoId: "VID_1001",
      caption: "Kinondoni street dance challenge! Rate this footwork from 1 to 10 🔥🇹🇿 #BongoDance #Trending",
      videoTime: 18,
      videoUrl: "storage/video1.mp4",
      videoImage: "storage/thumb1.jpg",
      location: "Dar es Salaam, Tanzania 🇹🇿",
      hashTagId: [createdHashtags[2]._id, createdHashtags[0]._id],
      songId: createdSongs[0]._id,
      userId: createdUsers[0]._id, // Kassim
      shareCount: 520,
      isFake: false,
      isBanned: false,
    },
    {
      uniqueVideoId: "VID_1002",
      caption: "Serengeti golden sunset dhow glide in Stone Town waters 🌴🌊 #ZanzibarVibes",
      videoTime: 22,
      videoUrl: "storage/video2.mp4",
      videoImage: "storage/thumb2.jpg",
      location: "Stone Town, Zanzibar 🇹🇿",
      hashTagId: [createdHashtags[1]._id],
      songId: createdSongs[2]._id,
      userId: createdUsers[1]._id, // Zuhura
      shareCount: 412,
      isFake: false,
      isBanned: false,
    },
    {
      uniqueVideoId: "VID_1003",
      caption: "Singeli Rush 300BPM! Can your feet keep up with this tempo? ⚡👟 #Singeli300BPM",
      videoTime: 15,
      videoUrl: "storage/video3.mp4",
      videoImage: "storage/thumb3.jpg",
      location: "Kinondoni, Dar es Salaam 🇹🇿",
      hashTagId: [createdHashtags[3]._id],
      songId: createdSongs[1]._id,
      userId: createdUsers[3]._id, // Amani
      shareCount: 680,
      isFake: false,
      isBanned: false,
    },
    {
      uniqueVideoId: "VID_1004",
      caption: "Lion pride morning stroll in the heart of Serengeti National Park 🦁🇹🇿 #SerengetiMagic",
      videoTime: 25,
      videoUrl: "storage/video4.mp4",
      videoImage: "storage/thumb4.jpg",
      location: "Serengeti National Park 🇹🇿",
      hashTagId: [createdHashtags[4]._id, createdHashtags[5]._id],
      songId: createdSongs[4]._id,
      userId: createdUsers[4]._id, // Rehema
      shareCount: 890,
      isFake: false,
      isBanned: false,
    },
  ];
  await Video.deleteMany({});
  const createdVideos = await Video.insertMany(videosData);
  console.log(`Seeded ${createdVideos.length} videos.`);

  // 11. Realistic Likes (for both Posts and Videos)
  await LikeHistoryOfPostOrVideo.deleteMany({});
  const postLikesList = [];

  // Add multiple real user likes to every post
  for (let pIdx = 0; pIdx < createdPosts.length; pIdx++) {
    const post = createdPosts[pIdx];
    // Pick 3 to 7 users who liked this post
    const likersCount = 3 + (pIdx % 5);
    for (let uIdx = 0; uIdx < likersCount; uIdx++) {
      const liker = createdUsers[(pIdx + uIdx + 1) % createdUsers.length];
      postLikesList.push({
        userId: liker._id,
        postId: post._id,
        uploaderId: post.userId,
      });
    }
  }

  // Add likes to videos
  for (let vIdx = 0; vIdx < createdVideos.length; vIdx++) {
    const video = createdVideos[vIdx];
    for (let uIdx = 0; uIdx < 5; uIdx++) {
      const liker = createdUsers[(vIdx + uIdx + 2) % createdUsers.length];
      postLikesList.push({
        userId: liker._id,
        videoId: video._id,
        uploaderId: video.userId,
      });
    }
  }

  await LikeHistoryOfPostOrVideo.insertMany(postLikesList);
  console.log(`Seeded ${postLikesList.length} realistic likes across posts and videos.`);

  // 12. Authentic Post Comments (Rich Swahili and English commentary)
  await PostOrVideoComment.deleteMany({});
  const commentsData = [
    // Comments for Post 1 (Zanzibar Sunset)
    {
      userId: createdUsers[0]._id, // Kassim
      postId: createdPosts[0]._id,
      commentText: "Mambo ni moto sana! Zanzibar tuko pamoja, picha imetulia sana dada yangu! 🌴✨",
    },
    {
      userId: createdUsers[4]._id, // Rehema
      postId: createdPosts[0]._id,
      commentText: "Stone Town is magic. That golden light reflecting on the ocean is perfection 🌊🌅",
    },
    {
      userId: createdUsers[9]._id, // Camille
      postId: createdPosts[0]._id,
      commentText: "I miss Zanzibar so much! Beautiful shot Zuhura ❤️🇹🇿",
    },
    {
      userId: createdUsers[8]._id, // Kenji
      postId: createdPosts[0]._id,
      commentText: "Stunning colors! Sending love from Tokyo 🇯🇵",
    },

    // Comments for Post 2 (Serengeti Safari)
    {
      userId: createdUsers[1]._id, // Zuhura
      postId: createdPosts[1]._id,
      commentText: "Unbelievable nature! Serengeti is truly the pride of Africa 🦁🇹🇿",
    },
    {
      userId: createdUsers[2]._id, // Mollel
      postId: createdPosts[1]._id,
      commentText: "Asante Rehema kwa kuitangaza nchi yetu vizuri! Karibuni pia Arusha 🏔️",
    },
    {
      userId: createdUsers[7]._id, // Kofi
      postId: createdPosts[1]._id,
      commentText: "Next level wildlife photography brother, crisp colors! 📸🔥",
    },
    {
      userId: createdUsers[5]._id, // Jay
      postId: createdPosts[1]._id,
      commentText: "Hii safari lazima nijiunge next month bro! Big respect 🐘",
    },

    // Comments for Post 3 (Kinondoni Dance)
    {
      userId: createdUsers[3]._id, // Amani
      postId: createdPosts[2]._id,
      commentText: "Kassim bro hatua zako hazina mfano! Kinondoni oyeee 👟⚡🔥",
    },
    {
      userId: createdUsers[6]._id, // Nolwazi
      postId: createdPosts[2]._id,
      commentText: "Those transitions are insane! South Africa feels the energy 🇿🇦🤝🇹🇿",
    },
    {
      userId: createdUsers[5]._id, // Jay
      postId: createdPosts[2]._id,
      commentText: "Ngoma mpya inatoka kesho, lazima utengeneze routine nayo kaka! 🎶🔥",
    },

    // Comments for Post 4 (Studio Session)
    {
      userId: createdUsers[8]._id, // Kenji
      postId: createdPosts[3]._id,
      commentText: "Sent the revised stem mixes to your email bro! Check the bassline 🎧🎛️",
    },
    {
      userId: createdUsers[0]._id, // Kassim
      postId: createdPosts[3]._id,
      commentText: "Tunasubiri ngoma iwake bro! Dar es Salaam stand up! 🔥🇹🇿",
    },
    {
      userId: createdUsers[1]._id, // Zuhura
      postId: createdPosts[3]._id,
      commentText: "Can't wait to hear the full track! Sounds incredible ✨",
    },

    // Comments for Post 5 (Arusha / Maasai Heritage)
    {
      userId: createdUsers[4]._id, // Rehema
      postId: createdPosts[4]._id,
      commentText: "Beautiful representation of our culture Mollel! Proudly Tanzanian 🇹🇿❤️",
    },
    {
      userId: createdUsers[9]._id, // Camille
      postId: createdPosts[4]._id,
      commentText: "The warmth and hospitality of Arusha touched my heart deeply. Asante sana!",
    },

    // Comments for Post 6 (Singeli 300BPM)
    {
      userId: createdUsers[0]._id, // Kassim
      postId: createdPosts[5]._id,
      commentText: "Hiyo spidi siyo ya kawaida Amani! Miguu ina motomoto hatari 😂⚡⚡",
    },
    {
      userId: createdUsers[6]._id, // Nolwazi
      postId: createdPosts[5]._id,
      commentText: "Amapiano meets Singeli collaboration needed ASAP! 🇿🇦❤️🇹🇿",
    },

    // Comments for Post 7 (Tokyo Collab)
    {
      userId: createdUsers[5]._id, // Jay
      postId: createdPosts[6]._id,
      commentText: "Arigato Kenji! The blend of Tokyo synth and Bongo groove is unmatched 🇯🇵🇹🇿",
    },

    // Comments for Post 8 (Stone Town Photography)
    {
      userId: createdUsers[1]._id, // Zuhura
      postId: createdPosts[7]._id,
      commentText: "Karibu tena Zanzibar wakati wowote Camille! Picha nzuri sana 🌴❤️",
    },
  ];

  await PostOrVideoComment.insertMany(commentsData);
  console.log(`Seeded ${commentsData.length} authentic post comments.`);

  // 10. Real Live Creators
  await LiveUser.deleteMany({});
  await LiveHistory.deleteMany({});

  const liveCreators = [
    {
      user: createdUsers[0], // Kassim
      view: 2840,
    },
    {
      user: createdUsers[1], // Zuhura
      view: 1920,
    },
    {
      user: createdUsers[4], // Rehema
      view: 4510,
    },
    {
      user: createdUsers[3], // Amani
      view: 3260,
    },
  ];

  for (const lc of liveCreators) {
    const lh = new LiveHistory({
      userId: lc.user._id,
      startTime: "14:00:00",
    });
    await lh.save();

    const lu = new LiveUser({
      name: lc.user.name,
      userName: lc.user.userName,
      image: lc.user.image,
      userId: lc.user._id,
      liveHistoryId: lh._id,
      view: lc.view,
      isFake: false,
    });
    await lu.save();

    await User.updateOne({ _id: lc.user._id }, { $set: { isLive: true, liveHistoryId: lh._id } });
  }
  console.log("Seeded 4 real active live creator broadcasts.");

  console.log("==================================================");
  console.log("WUDAU authentic social media data seeded successfully!");
  console.log("==================================================");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
