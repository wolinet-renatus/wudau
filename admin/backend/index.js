// Node 26 compatibility shim for SlowBuffer
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

//express
const express = require("express");
const app = express();

//cors
const cors = require("cors");

app.use(cors());
app.use(express.json());

//logging middleware
const logger = require("morgan");
app.use(logger("dev"));

//path
const path = require("path");

//fs
const fs = require("fs");

//dotenv
require("dotenv").config({ path: ".env" });

//import model
const Setting = require("./models/setting.model");

//settingJson
const settingJson = require("./setting");

//Declare global variable
global.settingJSON = {};

//handle global.settingJSON when pm2 restart
async function initializeSettings() {
  try {
    const setting = await Setting.findOne().sort({ createdAt: -1 });
    if (setting) {
      console.log("In setting initialize Settings");
      global.settingJSON = setting;
    } else {
      global.settingJSON = settingJson;
    }
  } catch (error) {
    console.error("Failed to initialize settings:", error);
  }
}

module.exports = initializeSettings();

//Declare the function as a global variable to update the setting.js file
global.updateSettingFile = (settingData) => {
  const settingJSON = JSON.stringify(settingData, null, 2);
  fs.writeFileSync("setting.js", `module.exports = ${settingJSON};`, "utf8");

  global.settingJSON = settingData; // Update global variable
  console.log("Settings file updated.");
};

//connection.js
const db = require("./util/connection");

//route.js
const routes = require("./routes/route");
app.use(routes);

//socket io
const http = require("http");
const server = http.createServer(app);
global.io = require("socket.io")(server);

//socket.js
require("./socket");

// Serve non-video static assets normally
app.use("/storage", (req, res, next) => {
  let reqPath = req.path;
  try {
    reqPath = decodeURIComponent(req.path);
  } catch (e) {}

  let filePath = path.join(__dirname, "storage", reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, "storage", req.path);
  }
  const ext = path.extname(filePath).toLowerCase();
  const videoExts = [".mp4", ".webm", ".mov", ".m4v", ".mkv"];

  if (!videoExts.includes(ext)) {
    return express.static(path.join(__dirname, "storage"))(req, res, next);
  }

  // Byte-range streaming for video — enables instant browser playback
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return next();

    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      // No range header — serve full file with streaming headers
      res.writeHead(200, {
        "Content-Type": `video/${ext.slice(1) === "mov" ? "quicktime" : ext.slice(1)}`,
        "Content-Length": fileSize,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=86400",
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Parse Range header (e.g. "bytes=0-1023")
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    // Instant streaming burst: default to 10MB chunk so full reel is buffered immediately without roundtrip lag
    const DEFAULT_CHUNK_SIZE = 10 * 1024 * 1024;
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + DEFAULT_CHUNK_SIZE, fileSize - 1);
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": `video/${ext.slice(1) === "mov" ? "quicktime" : ext.slice(1)}`,
      "Cache-Control": "public, max-age=86400",
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
  });
});

db.on("error", () => {
  console.log("Connection Error: ");
});

const { seedDemoData } = require("./util/seedDemoData");

db.once("open", async () => {
  console.log("Mongo: successfully connected to db");
  try {
    await seedDemoData();
  } catch (err) {
    console.error("Failed to run demo data migration:", err);
  }
});

//set port and listen the request
const port = process.env.PORT || 5050;
server.listen(port, () => {
  console.log("Hello World ! listening on " + port);
});

// Graceful shutdown handling for Docker and Dokploy containers
const handleShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP/Socket server closed.");
    if (db) db.close(false);
    process.exit(0);
  });
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

