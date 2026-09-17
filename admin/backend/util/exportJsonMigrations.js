const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const DB_DIR = path.join(__dirname, "../../../DB");

async function exportCollections() {
  const connectionString = process.env.MongoDb_Connection_String || "mongodb://127.0.0.1:27017/shortie";
  await mongoose.connect(connectionString);
  console.log("Connected to MongoDB for export...");

  const db = mongoose.connection.db;

  const collections = [
    "users",
    "songcategories",
    "songs",
    "hashtags",
    "videos",
    "posts",
    "postorvideocomments",
    "likehistoryofpostorvideos",
    "followerfollowings",
    "banners",
    "currencies",
  ];

  for (const colName of collections) {
    const docs = await db.collection(colName).find({}).toArray();
    if (docs.length > 0) {
      // Format as EJSON compatible with mongoimport
      const filePath = path.join(DB_DIR, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), "utf8");
      console.log(`Exported ${docs.length} documents to ${filePath}`);
    }
  }

  await mongoose.disconnect();
  console.log("Export complete!");
}

exportCollections().catch(console.error);
