// Comprehensive Seed Script for WUDAU Platform
// Realistic Tanzanian, African, and Global Demo Content

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Models
const User = require("../models/user.model");
const SongCategory = require("../models/songCategory.model");
const Song = require("../models/song.model");
const HashTag = require("../models/hashTag.model");
const HashTagUsageHistory = require("../models/hashTagUsageHistory.model");
const Video = require("../models/video.model");
const Post = require("../models/post.model");
const PostOrVideoComment = require("../models/postOrvideoComment.model");
const LikeHistoryOfPostOrVideo = require("../models/likeHistoryOfpostOrvideo.model");
const FollowerFollowing = require("../models/followerFollowing.model");
const Banner = require("../models/banner.model");
const Currency = require("../models/currency.model");

const { generateUniqueId } = require("./generateUniqueId");
const { generateUniqueVideoOrPostId } = require("./generateUniqueVideoOrPostId");

const fs = require("fs");

async function seedDemoData(force = false) {
  try {
    // 0. Ensure demo assets exist in storage (e.g. if running in Docker with persistent volume)
    const seedStorageDir = path.join(__dirname, "../seed_storage");
    const targetStorageDir = path.join(__dirname, "../storage");
    if (fs.existsSync(seedStorageDir) && fs.existsSync(targetStorageDir)) {
      const seedFiles = fs.readdirSync(seedStorageDir);
      for (const file of seedFiles) {
        const dest = path.join(targetStorageDir, file);
        if (!fs.existsSync(dest)) {
          try {
            fs.copyFileSync(path.join(seedStorageDir, file), dest);
            console.log(`    + Synchronized missing demo asset to volume: ${file}`);
          } catch (e) {
            console.warn(`    ! Could not sync asset ${file}:`, e.message);
          }
        }
      }
    }

    const existingDemoUsers = await User.countDocuments({ email: /@wudau\.tz$/ });
    const existingVideos = await Video.countDocuments();

    if (!force && existingDemoUsers > 0 && existingVideos >= 6) {
      console.log(">>> [WUDAU Seed] Demo data already exists in database. Skipping seed.");
      return;
    }

    console.log(">>> [WUDAU Seed] Starting demo data generation & migration...");

    // --------------------------------------------------------------------------
    // 1. Currencies
    // --------------------------------------------------------------------------
    const tzsExists = await Currency.findOne({ currencyCode: "TZS" });
    if (!tzsExists) {
      await Currency.create({
        name: "TZS",
        symbol: "TSh",
        countryCode: "TZ",
        currencyCode: "TZS",
        isDefault: false,
      });
      console.log("    + Added TZS (Tanzanian Shilling) currency");
    }

    // --------------------------------------------------------------------------
    // 2. Song Categories
    // --------------------------------------------------------------------------
    const categoriesData = [
      { name: "Bongo Flava & Singeli", image: "storage/category_bongo.jpg" },
      { name: "Serengeti & Coastal Vibes", image: "storage/category_nature.jpg" },
      { name: "Afrobeats & Amapiano", image: "storage/category_afrobeats.jpg" },
      { name: "Global Fusion (Tokyo & Paris)", image: "storage/category_global.jpg" },
    ];

    const categoryDocs = {};
    for (const cat of categoriesData) {
      let doc = await SongCategory.findOne({ name: cat.name });
      if (!doc) {
        doc = await SongCategory.create(cat);
      }
      categoryDocs[cat.name] = doc;
    }
    console.log(`    + Song categories verified: ${Object.keys(categoryDocs).length}`);

    // --------------------------------------------------------------------------
    // 3. Songs
    // --------------------------------------------------------------------------
    const songsData = [
      {
        songTitle: "Mapenzi ya Bongo",
        singerName: "Kassim ft. Jay Temba",
        songTime: 45,
        songImage: "storage/thumb2.jpg",
        songLink: "storage/song_bongo_1.mp3",
        songCategoryId: categoryDocs["Bongo Flava & Singeli"]._id,
      },
      {
        songTitle: "Kinondoni Singeli Rush 300BPM",
        singerName: "Amani Juma",
        songTime: 35,
        songImage: "storage/thumb3.jpg",
        songLink: "storage/song_singeli_1.mp3",
        songCategoryId: categoryDocs["Bongo Flava & Singeli"]._id,
      },
      {
        songTitle: "Serengeti Sunrise Acoustic",
        singerName: "Zuhura Bakari",
        songTime: 50,
        songImage: "storage/thumb1.jpg",
        songLink: "storage/song_acoustic_tz.mp3",
        songCategoryId: categoryDocs["Serengeti & Coastal Vibes"]._id,
      },
      {
        songTitle: "Ngorongoro Dawn Chants",
        singerName: "Emmanuel Mollel",
        songTime: 40,
        songImage: "storage/thumb5.jpg",
        songLink: "storage/song_maasai_chant.mp3",
        songCategoryId: categoryDocs["Serengeti & Coastal Vibes"]._id,
      },
      {
        songTitle: "Durban Sunset Amapiano",
        singerName: "Nolwazi Khumalo",
        songTime: 55,
        songImage: "storage/thumb6.jpg",
        songLink: "storage/song_amapiano.mp3",
        songCategoryId: categoryDocs["Afrobeats & Amapiano"]._id,
      },
      {
        songTitle: "Shibuya Afro Groove",
        singerName: "Kenji Takahashi",
        songTime: 42,
        songImage: "storage/thumb7.jpg",
        songLink: "storage/song_tokyo_fusion.mp3",
        songCategoryId: categoryDocs["Global Fusion (Tokyo & Paris)"]._id,
      },
    ];

    const songDocs = [];
    for (const s of songsData) {
      let doc = await Song.findOne({ songTitle: s.songTitle });
      if (!doc) {
        doc = await Song.create(s);
      }
      songDocs.push(doc);
    }
    console.log(`    + Songs verified: ${songDocs.length}`);

    // --------------------------------------------------------------------------
    // 4. Hashtags
    // --------------------------------------------------------------------------
    const hashtagList = [
      "TanzaniaUnforgettable",
      "SerengetiMagic",
      "BongoFlava",
      "SingeliDance",
      "ZanzibarVibes",
      "DarEsSalaam",
      "Kilimanjaro",
      "AfroDance",
      "WudauChallenge",
      "TokyoMeetsAfrica",
      "ParisianGroove",
      "NatureTz",
    ];

    const hashtagDocs = {};
    for (const tag of hashtagList) {
      let doc = await HashTag.findOne({ hashTag: tag });
      if (!doc) {
        doc = await HashTag.create({
          hashTag: tag,
          hashTagBanner: "storage/banner_tz_nature.jpg",
          hashTagIcon: "storage/category_nature.jpg",
        });
      }
      hashtagDocs[tag] = doc;
    }
    console.log(`    + Hashtags verified: ${Object.keys(hashtagDocs).length}`);

    // --------------------------------------------------------------------------
    // 5. Users (Tanzanian Focus + Continental African + Asian & European Mix)
    // --------------------------------------------------------------------------
    const demoUsersData = [
      // Tanzanian talent
      {
        name: "Kassim Mwambao",
        userName: "@kassim_tz",
        email: "kassim@wudau.tz",
        image: "storage/avatar_kassim.png",
        gender: "Male",
        bio: "🔥 Dar es Salaam Street Dancer & Afro-fusion Choreographer | Kinondoni to the World 🇹🇿 Rep WUDAU",
        age: 23,
        country: "Tanzania",
        countryFlagImage: "🇹🇿",
        coin: 15400,
        receivedCoin: 8200,
        isVerified: true,
      },
      {
        name: "Zuhura Bakari",
        userName: "@zuhura_znz",
        email: "zuhura@wudau.tz",
        image: "storage/avatar_zuhura.png",
        gender: "Female",
        bio: "Spice Island Queen 🌴 Zanzibar vibes, coastal fashion & acoustic soul 🎵✨ Karibu Unguja!",
        age: 22,
        country: "Tanzania",
        countryFlagImage: "🇹🇿",
        coin: 12800,
        receivedCoin: 9500,
        isVerified: true,
      },
      {
        name: "Emmanuel Mollel",
        userName: "@mollel_arusha",
        email: "mollel@wudau.tz",
        image: "storage/avatar_mollel.png",
        gender: "Male",
        bio: "Maasai warrior rhythm meets modern beats 🏔️ Arusha & Ngorongoro Ambassador 🇹🇿",
        age: 26,
        country: "Tanzania",
        countryFlagImage: "🇹🇿",
        coin: 18900,
        receivedCoin: 11400,
        isVerified: true,
      },
      {
        name: "Amani Juma",
        userName: "@amani_singeli",
        email: "amani@wudau.tz",
        image: "storage/avatar_amani.png",
        gender: "Male",
        bio: "⚡ Singeli footwork master 300BPM! Mbagala to Kariakoo 🇹🇿 Mambo ni moto! 🔥",
        age: 21,
        country: "Tanzania",
        countryFlagImage: "🇹🇿",
        coin: 22400,
        receivedCoin: 14600,
        isVerified: true,
      },
      {
        name: "Rehema Mushi",
        userName: "@rehema_wildlife",
        email: "rehema@wudau.tz",
        image: "storage/avatar_rehema.png",
        gender: "Female",
        bio: "Wild Tanzania 🦁 Wildlife Photographer & Serengeti expedition guide | Kilimanjaro summit 🏔️",
        age: 25,
        country: "Tanzania",
        countryFlagImage: "🇹🇿",
        coin: 14200,
        receivedCoin: 7900,
        isVerified: true,
      },
      {
        name: "Juma Temba",
        userName: "@jay_bongo",
        email: "jay@wudau.tz",
        image: "storage/avatar_jay.png",
        gender: "Male",
        bio: "Bongo Flava vocalist & lifestyle creator 🎙️ Chapa kazi, furahia maisha! Dar es Salaam 🇹🇿",
        age: 24,
        country: "Tanzania",
        countryFlagImage: "🇹🇿",
        coin: 9600,
        receivedCoin: 4300,
        isVerified: true,
      },
      // Continental African talent
      {
        name: "Nolwazi Khumalo",
        userName: "@nolwazi_sa",
        email: "nolwazi@wudau.tz",
        image: "storage/avatar_nolwazi.png",
        gender: "Female",
        bio: "Amapiano groove goddess 🇿🇦 Durban & Jozi energy | Pan-African dance movement",
        age: 24,
        country: "South Africa",
        countryFlagImage: "🇿🇦",
        coin: 8900,
        receivedCoin: 5100,
        isVerified: true,
      },
      {
        name: "Kofi Mensah",
        userName: "@kofi_accra",
        email: "kofi@wudau.tz",
        image: "storage/avatar_kofi.png",
        gender: "Male",
        bio: "West Africa energy 🇬🇭 Highlife & Afrobeats percussionist | Accra vibes",
        age: 27,
        country: "Ghana",
        countryFlagImage: "🇬🇭",
        coin: 6500,
        receivedCoin: 3200,
        isVerified: false,
      },
      // Asian talent
      {
        name: "Kenji Takahashi",
        userName: "@kenji_tokyo",
        email: "kenji@wudau.tz",
        image: "storage/avatar_kenji.png",
        gender: "Male",
        bio: "Tokyo loop pedal artist & beatmaker 🇯🇵 Exploring African polyrhythms in Shibuya",
        age: 26,
        country: "Japan",
        countryFlagImage: "🇯🇵",
        coin: 7200,
        receivedCoin: 3800,
        isVerified: true,
      },
      // European talent
      {
        name: "Camille Laurent",
        userName: "@camille_paris",
        email: "camille@wudau.tz",
        image: "storage/avatar_camille.png",
        gender: "Female",
        bio: "Parisian contemporary dancer & world choreography collector 🇫🇷 Montmartre vibes",
        age: 23,
        country: "France",
        countryFlagImage: "🇫🇷",
        coin: 5800,
        receivedCoin: 2900,
        isVerified: false,
      },
    ];

    const userDocs = {};
    for (const u of demoUsersData) {
      let doc = await User.findOne({ email: u.email });
      if (!doc) {
        const uid = await generateUniqueId();
        doc = await User.create({
          ...u,
          uniqueId: uid,
          loginType: 3, // QUICK/IDENTITY
          identity: `demo_${u.userName.replace("@", "")}`,
          isBlock: false,
          isOnline: true,
          isFake: false,
        });
      }
      userDocs[u.userName] = doc;
    }
    console.log(`    + Creators verified: ${Object.keys(userDocs).length}`);

    // Create follower network
    const userList = Object.values(userDocs);
    for (let i = 0; i < userList.length; i++) {
      const fromUser = userList[i];
      const toUser = userList[(i + 1) % userList.length];
      const exists = await FollowerFollowing.findOne({ fromUserId: fromUser._id, toUserId: toUser._id });
      if (!exists) {
        await FollowerFollowing.create({ fromUserId: fromUser._id, toUserId: toUser._id });
      }
    }

    // --------------------------------------------------------------------------
    // 6. Videos / Reels
    // --------------------------------------------------------------------------
    const videoDefinitions = [
      {
        userHandle: "@rehema_wildlife",
        caption: "Serengeti sunset golden hour with wild zebras running free! Unforgettable Tanzania 🦁🇹🇿 #SerengetiMagic #TanzaniaUnforgettable #NatureTz",
        videoTime: 20,
        videoUrl: "storage/video1.mp4",
        videoImage: "storage/thumb1.jpg",
        location: "Serengeti National Park, Tanzania",
        coordinates: { latitude: "-2.3333", longitude: "34.8333" },
        tags: ["SerengetiMagic", "TanzaniaUnforgettable", "NatureTz"],
        songIndex: 2,
        shareCount: 142,
      },
      {
        userHandle: "@kassim_tz",
        caption: "Dar es Salaam street dance battle at Coco Beach! Kinondoni crew representing WUDAU 🔥🇹🇿 #DarEsSalaam #BongoFlava #AfroDance #WudauChallenge",
        videoTime: 18,
        videoUrl: "storage/video2.mp4",
        videoImage: "storage/thumb2.jpg",
        location: "Coco Beach, Dar es Salaam, Tanzania",
        coordinates: { latitude: "-6.7725", longitude: "39.2803" },
        tags: ["DarEsSalaam", "BongoFlava", "AfroDance", "WudauChallenge"],
        songIndex: 0,
        shareCount: 389,
      },
      {
        userHandle: "@amani_singeli",
        caption: "Singeli fast-feet challenge! Can you keep up with 300 BPM in Mbagala? ⚡👟 #SingeliDance #DarEsSalaam #WudauChallenge",
        videoTime: 25,
        videoUrl: "storage/video3.mp4",
        videoImage: "storage/thumb3.jpg",
        location: "Mbagala, Dar es Salaam, Tanzania",
        coordinates: { latitude: "-6.9030", longitude: "39.2612" },
        tags: ["SingeliDance", "DarEsSalaam", "WudauChallenge"],
        songIndex: 1,
        shareCount: 512,
      },
      {
        userHandle: "@zuhura_znz",
        caption: "Sunset dhow sail in Stone Town Zanzibar with acoustic Swahili tunes ⛵🌅 #ZanzibarVibes #TanzaniaUnforgettable",
        videoTime: 22,
        videoUrl: "storage/video4.mp4",
        videoImage: "storage/thumb4.jpg",
        location: "Stone Town, Zanzibar, Tanzania",
        coordinates: { latitude: "-6.1622", longitude: "39.1878" },
        tags: ["ZanzibarVibes", "TanzaniaUnforgettable"],
        songIndex: 2,
        shareCount: 278,
      },
      {
        userHandle: "@mollel_arusha",
        caption: "Maasai rhythm and traditional vocal harmony under Mount Meru & Kilimanjaro 🏔️ #Kilimanjaro #TanzaniaUnforgettable #AfroDance",
        videoTime: 19,
        videoUrl: "storage/video1.mp4",
        videoImage: "storage/thumb5.jpg",
        location: "Arusha, Mount Meru, Tanzania",
        coordinates: { latitude: "-3.3869", longitude: "36.6830" },
        tags: ["Kilimanjaro", "TanzaniaUnforgettable", "AfroDance"],
        songIndex: 3,
        shareCount: 204,
      },
      {
        userHandle: "@nolwazi_sa",
        caption: "Amapiano energy direct from Johannesburg! Connecting with our East African brothers & sisters 🇿🇦❤️🇹🇿 #AfroDance #WudauChallenge",
        videoTime: 24,
        videoUrl: "storage/video2.mp4",
        videoImage: "storage/thumb6.jpg",
        location: "Johannesburg, South Africa",
        coordinates: { latitude: "-26.2041", longitude: "28.0473" },
        tags: ["AfroDance", "WudauChallenge"],
        songIndex: 4,
        shareCount: 165,
      },
      {
        userHandle: "@kenji_tokyo",
        caption: "Mixing Tokyo synths with traditional East African percussion in Shibuya crosswalk! 🇯🇵🎧🇹🇿 #TokyoMeetsAfrica #WudauChallenge",
        videoTime: 28,
        videoUrl: "storage/video3.mp4",
        videoImage: "storage/thumb7.jpg",
        location: "Shibuya, Tokyo, Japan",
        coordinates: { latitude: "35.6595", longitude: "139.7004" },
        tags: ["TokyoMeetsAfrica", "WudauChallenge"],
        songIndex: 5,
        shareCount: 198,
      },
      {
        userHandle: "@camille_paris",
        caption: "Contemporary choreography along the Seine river inspired by Swahili coastal rhythms 🇫🇷💃 #ParisianGroove #AfroDance",
        videoTime: 21,
        videoUrl: "storage/video4.mp4",
        videoImage: "storage/thumb8.jpg",
        location: "Paris, France",
        coordinates: { latitude: "48.8566", longitude: "2.3522" },
        tags: ["ParisianGroove", "AfroDance"],
        songIndex: 0,
        shareCount: 130,
      },
    ];

    const videoDocs = [];
    for (const v of videoDefinitions) {
      const u = userDocs[v.userHandle];
      if (!u) continue;

      let doc = await Video.findOne({ caption: v.caption });
      if (!doc) {
        const uniqueVideoId = generateUniqueVideoOrPostId();
        const tagIds = v.tags.map((t) => hashtagDocs[t]?._id).filter(Boolean);
        const songId = songDocs[v.songIndex]?._id || null;

        doc = await Video.create({
          uniqueVideoId: uniqueVideoId,
          caption: v.caption,
          videoTime: v.videoTime,
          videoUrl: v.videoUrl,
          videoImage: v.videoImage,
          location: v.location,
          locationCoordinates: v.coordinates,
          hashTagId: tagIds,
          songId: songId,
          userId: u._id,
          shareCount: v.shareCount,
          isFake: false,
          isBanned: false,
        });

        // Record hashtag history
        for (const tagId of tagIds) {
          await HashTagUsageHistory.create({
            userId: u._id,
            hashTagId: tagId,
            videoId: doc._id,
          });
        }
      }
      videoDocs.push(doc);
    }
    console.log(`    + Video reels verified: ${videoDocs.length}`);

    // --------------------------------------------------------------------------
    // 7. Community Posts
    // --------------------------------------------------------------------------
    const postDefinitions = [
      {
        userHandle: "@zuhura_znz",
        caption: "Sunset over Stone Town, Zanzibar. Spice island hospitality and calm ocean waters. Karibuni sana! 🌴🌊🇹🇿 #ZanzibarVibes #TanzaniaUnforgettable",
        mainPostImage: "storage/post4.jpg",
        postImage: ["storage/post4.jpg", "storage/post1.jpg"],
        location: "Stone Town, Zanzibar, Tanzania",
        coordinates: { latitude: "-6.1622", longitude: "39.1878" },
        tags: ["ZanzibarVibes", "TanzaniaUnforgettable"],
        shareCount: 88,
      },
      {
        userHandle: "@rehema_wildlife",
        caption: "Early morning game drive in Ngorongoro Crater. Pure breathtaking wonder of African wildlife. 🦁🐘🇹🇿 #NatureTz #SerengetiMagic",
        mainPostImage: "storage/post5.jpg",
        postImage: ["storage/post5.jpg", "storage/post2.jpg"],
        location: "Ngorongoro Conservation Area, Tanzania",
        coordinates: { latitude: "-3.2433", longitude: "35.4878" },
        tags: ["NatureTz", "SerengetiMagic"],
        shareCount: 145,
      },
      {
        userHandle: "@kassim_tz",
        caption: "Kinondoni night market dance practice with the team! Big moves coming to WUDAU this weekend 🔥🇹🇿 #DarEsSalaam #WudauChallenge",
        mainPostImage: "storage/post6.jpg",
        postImage: ["storage/post6.jpg", "storage/post3.jpg"],
        location: "Kinondoni, Dar es Salaam, Tanzania",
        coordinates: { latitude: "-6.7825", longitude: "39.2603" },
        tags: ["DarEsSalaam", "WudauChallenge"],
        shareCount: 97,
      },
      {
        userHandle: "@kenji_tokyo",
        caption: "Collaboration sessions across continents! Listening to Tanzanian Singeli beats in Shibuya studio 🇯🇵🎧 #TokyoMeetsAfrica",
        mainPostImage: "storage/post2.jpg",
        postImage: ["storage/post2.jpg"],
        location: "Shibuya, Tokyo, Japan",
        coordinates: { latitude: "35.6595", longitude: "139.7004" },
        tags: ["TokyoMeetsAfrica"],
        shareCount: 54,
      },
    ];

    const postDocs = [];
    for (const p of postDefinitions) {
      const u = userDocs[p.userHandle];
      if (!u) continue;

      let doc = await Post.findOne({ caption: p.caption });
      if (!doc) {
        const uniquePostId = generateUniqueVideoOrPostId();
        const tagIds = p.tags.map((t) => hashtagDocs[t]?._id).filter(Boolean);

        doc = await Post.create({
          uniquePostId: uniquePostId,
          caption: p.caption,
          mainPostImage: p.mainPostImage,
          postImage: p.postImage,
          location: p.location,
          locationCoordinates: p.coordinates,
          hashTagId: tagIds,
          userId: u._id,
          shareCount: p.shareCount,
          isFake: false,
        });

        for (const tagId of tagIds) {
          await HashTagUsageHistory.create({
            userId: u._id,
            hashTagId: tagId,
            postId: doc._id,
          });
        }
      }
      postDocs.push(doc);
    }
    console.log(`    + Community posts verified: ${postDocs.length}`);

    // --------------------------------------------------------------------------
    // 8. Comments (Authentic Swahili & English Feedback)
    // --------------------------------------------------------------------------
    const commentsData = [
      { text: "Hii ni kali sana bro! Dar es Salaam stand up! 🔥🇹🇿", user: "@jay_bongo" },
      { text: "Mambo ni moto sana, Zanzibar tuko pamoja! 🌴✨", user: "@zuhura_znz" },
      { text: "Unbelievable nature, Serengeti is truly the pride of Africa 🦁❤️", user: "@camille_paris" },
      { text: "Huyo mshkaji anapiga hatua kali sana, Singeli oyeee! ⚡👟", user: "@kassim_tz" },
      { text: "Greetings from Tokyo! Absolutely love the rhythm and energy of WUDAU 🇯🇵🇹🇿", user: "@kenji_tokyo" },
      { text: "Ngoma inabamba mbaya! Saluti tele kutoka Arusha 🏔️", user: "@mollel_arusha" },
      { text: "Pure African excellence, keep shining family! 🇿🇦🇹🇿", user: "@nolwazi_sa" },
      { text: "Zanzibar vibe never disappoints! Safari njema ndugu zangu.", user: "@rehema_wildlife" },
    ];

    let commentCount = 0;
    for (let i = 0; i < videoDocs.length; i++) {
      const vid = videoDocs[i];
      const commentSample = [
        commentsData[i % commentsData.length],
        commentsData[(i + 2) % commentsData.length],
      ];

      for (const c of commentSample) {
        const u = userDocs[c.user];
        if (!u) continue;
        const exists = await PostOrVideoComment.findOne({ videoId: vid._id, commentText: c.text });
        if (!exists) {
          await PostOrVideoComment.create({
            userId: u._id,
            videoId: vid._id,
            commentText: c.text,
          });
          commentCount++;
        }
      }
    }

    for (let i = 0; i < postDocs.length; i++) {
      const pst = postDocs[i];
      const c = commentsData[(i + 1) % commentsData.length];
      const u = userDocs[c.user];
      if (u) {
        const exists = await PostOrVideoComment.findOne({ postId: pst._id, commentText: c.text });
        if (!exists) {
          await PostOrVideoComment.create({
            userId: u._id,
            postId: pst._id,
            commentText: c.text,
          });
          commentCount++;
        }
      }
    }
    console.log(`    + Comments seeded: ${commentCount}`);

    // --------------------------------------------------------------------------
    // 9. Likes & Engagement
    // --------------------------------------------------------------------------
    let likeCount = 0;
    for (const vid of videoDocs) {
      for (const commenter of userList.slice(0, 4)) {
        if (commenter._id.toString() === vid.userId.toString()) continue;
        const exists = await LikeHistoryOfPostOrVideo.findOne({ userId: commenter._id, videoId: vid._id });
        if (!exists) {
          await LikeHistoryOfPostOrVideo.create({
            userId: commenter._id,
            uploaderId: vid.userId,
            videoId: vid._id,
          });
          likeCount++;
        }
      }
    }
    console.log(`    + Video & post likes seeded: ${likeCount}`);

    // --------------------------------------------------------------------------
    // 10. Featured Banners
    // --------------------------------------------------------------------------
    const banners = [
      { image: "storage/banner_tz_nature.jpg", isActive: true },
      { image: "storage/banner_bongo_spotlight.jpg", isActive: true },
    ];
    for (const b of banners) {
      const exists = await Banner.findOne({ image: b.image });
      if (!exists) {
        await Banner.create(b);
      }
    }
    console.log("    + Featured banners verified");

    console.log(">>> [WUDAU Seed] Successfully completed demo content migration! 🎉");
  } catch (error) {
    console.error(">>> [WUDAU Seed] Error seeding demo data:", error);
  }
}

// Standalone execution support
if (require.main === module) {
  const connectionString = process.env.MongoDb_Connection_String || "mongodb://mongo:27017/shortie";
  mongoose
    .connect(connectionString)
    .then(async () => {
      console.log("MongoDB connected for seeding.");
      await seedDemoData(process.argv.includes("--force"));
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      process.exit(1);
    });
}

module.exports = { seedDemoData };
