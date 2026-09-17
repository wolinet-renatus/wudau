import React, { useEffect, useState, useMemo, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { baseURL, secretKey } from "@/util/config";

interface VideoItem {
  _id: string;
  caption: string;
  videoUrl: string;
  videoImage: string;
  shareCount: number;
  hashTag: string[];
  userId: string;
  name: string;
  userName: string;
  userImage: string;
  isVerified: boolean;
  totalLikes: number;
  totalComments: number;
  time: string;
}

interface PostItem {
  _id: string;
  caption: string;
  postImage: string[];
  shareCount: number;
  createdAt: string;
  userId: string;
  name: string;
  userName: string;
  userImage: string;
  isVerified: boolean;
  hashTag: string[];
  totalLikes: number;
  totalComments: number;
  time: string;
}

interface CommentItem {
  id: string;
  userName: string;
  text: string;
  time: string;
}

interface GiftItem {
  id: string;
  name: string;
  icon: string;
  coins: number;
}

const GIFTS_LIST: GiftItem[] = [
  { id: "g1", name: "Rose", icon: "🌹", coins: 10 },
  { id: "g2", name: "Love Heart", icon: "💖", coins: 50 },
  { id: "g3", name: "Party Popper", icon: "🎉", coins: 100 },
  { id: "g4", name: "Diamond", icon: "💎", coins: 500 },
  { id: "g5", name: "Crown", icon: "👑", coins: 1000 },
  { id: "g6", name: "Rocket", icon: "🚀", coins: 2000 },
];

export default function Home({
  initialVideos = [],
  initialPosts = [],
}: {
  initialVideos?: VideoItem[];
  initialPosts?: PostItem[];
}) {
  // Navigation
  const [currentTab, setCurrentTab] = useState<"reels" | "live" | "social" | "upload" | "chat" | "profile">("reels");
  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [language, setLanguage] = useState<string>("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);

  // Content Data
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAuth, setIsAuth] = useState<boolean>(false);

  // Video Controls & Audio
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Social Interactions
  const [likedReelIds, setLikedReelIds] = useState<{ [id: string]: boolean }>({});
  const [reelLikesCount, setReelLikesCount] = useState<{ [id: string]: number }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals / Drawers
  const [showCommentsDrawer, setShowCommentsDrawer] = useState<boolean>(false);
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalTitle, setAuthModalTitle] = useState<string>("");
  const [commentInput, setCommentInput] = useState<string>("");

  // Comments map
  const [commentsMap, setCommentsMap] = useState<{ [id: string]: CommentItem[] }>({
    VID_SOFIA: [
      { id: "c1", userName: "@lucas_fitness", text: "Incredible rhythm & choreography! 🔥", time: "2m ago" },
      { id: "c2", userName: "@liam_carter", text: "That city backdrop is unmatched 🌆", time: "5m ago" },
    ],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuth(sessionStorage.getItem("isAuth") === "true");
    }

    // Refresh client data
    const refreshData = async () => {
      try {
        const [videosRes, postsRes] = await Promise.all([
          axios.get("client/video/getAllVideos?start=1&limit=30").catch(() => ({ data: { data: [] } })),
          axios.get("client/post/getAllPosts?start=1&limit=30").catch(() => ({ data: { post: [] } })),
        ]);

        if (videosRes.data?.data && videosRes.data.data.length > 0) {
          // Ensure Sofia Martinez is prioritized to match demo screenshot if present
          const list: VideoItem[] = videosRes.data.data;
          list.sort((a, b) => {
            if (a.userName === "@Sofia_Martinez_0") return -1;
            if (b.userName === "@Sofia_Martinez_0") return 1;
            return 0;
          });
          setVideos(list);
        }
        if (postsRes.data?.post && postsRes.data.post.length > 0) {
          setPosts(postsRes.data.post);
        }
      } catch (err) {
        console.error("Failed to refresh home data:", err);
      }
    };

    refreshData();
  }, []);

  // Filtered videos based on search
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const q = searchQuery.toLowerCase();
    return videos.filter(
      (v) =>
        v.caption?.toLowerCase().includes(q) ||
        v.name?.toLowerCase().includes(q) ||
        v.userName?.toLowerCase().includes(q) ||
        v.hashTag?.some((t) => t.toLowerCase().includes(q))
    );
  }, [videos, searchQuery]);

  // Current active reel video
  const activeVideo = useMemo(() => {
    if (filteredVideos.length === 0) return null;
    return filteredVideos[currentReelIndex % filteredVideos.length];
  }, [filteredVideos, currentReelIndex]);

  // Navigation handlers
  const handleNextReel = () => {
    if (filteredVideos.length === 0) return;
    setCurrentReelIndex((prev) => (prev + 1) % filteredVideos.length);
    setIsPlaying(true);
  };

  const handlePrevReel = () => {
    if (filteredVideos.length === 0) return;
    setCurrentReelIndex((prev) => (prev - 1 + filteredVideos.length) % filteredVideos.length);
    setIsPlaying(true);
  };

  // Keyboard navigation & Wheel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentTab === "reels" && !showCommentsDrawer && !showGiftModal && !showAuthModal) {
        if (e.key === "ArrowDown") handleNextReel();
        if (e.key === "ArrowUp") handlePrevReel();
        if (e.key === " " || e.key === "k") {
          e.preventDefault();
          togglePlay();
        }
        if (e.key === "m") {
          setIsMuted((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTab, showCommentsDrawer, showGiftModal, showAuthModal, filteredVideos]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Like handler
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeVideo) return;
    const id = activeVideo._id;
    const isLiked = !likedReelIds[id];
    setLikedReelIds((prev) => ({ ...prev, [id]: isLiked }));
    setReelLikesCount((prev) => ({
      ...prev,
      [id]: (prev[id] !== undefined ? prev[id] : activeVideo.totalLikes || 0) + (isLiked ? 1 : -1),
    }));
    showToast(isLiked ? "❤️ Liked reel!" : "Removed like");
  };

  // Share handler
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("🔗 Link copied to clipboard!");
    }
  };

  // Add Comment
  const handleAddComment = () => {
    if (!commentInput.trim() || !activeVideo) return;
    const newComment: CommentItem = {
      id: "guest_" + Date.now(),
      userName: "@WudauGuest",
      text: commentInput.trim(),
      time: "Just now",
    };
    const key = activeVideo._id;
    setCommentsMap((prev) => ({
      ...prev,
      [key]: [newComment, ...(prev[key] || [])],
    }));
    setCommentInput("");
    showToast("💬 Comment posted!");
  };

  // Send Gift
  const handleSendGift = (gift: GiftItem) => {
    setShowGiftModal(false);
    showToast(`🎁 Sent ${gift.name} ${gift.icon} (${gift.coins} coins) to creator!`);
  };

  // Protected tabs handler
  const handleSidebarClick = (tab: "reels" | "live" | "social" | "upload" | "chat" | "profile") => {
    if (tab === "upload" || tab === "chat" || tab === "profile") {
      setAuthModalTitle(
        tab === "upload"
          ? "Upload Your Rhythm Reel"
          : tab === "chat"
          ? "Direct Messaging & Chat"
          : "Your Creator Profile"
      );
      setShowAuthModal(true);
    } else {
      setCurrentTab(tab);
    }
  };

  const resolveMedia = (path: string | undefined, fallback: string = "/assets/images/female.png") => {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanBase = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${cleanBase}${cleanPath}`;
  };

  return (
    <>
      <Head>
        <title>WUDAU | Reels</title>
        <meta name="description" content="Watch trending reels and shorts on WUDAU without logging in." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#111827" }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              top: "84px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: "30px",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* TOP NAVBAR (Identical to screenshot) */}
        <header
          style={{
            height: "72px",
            borderBottom: "1px solid #edf0f5",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          {/* Logo Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            {/* Stylized Logo Icon (matching Solar Blaze ribbon) */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #FF4B1F 0%, #FF9F00 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "900",
                fontSize: "20px",
                boxShadow: "0 4px 12px rgba(255, 75, 31, 0.3)",
              }}
            >
              W
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                color: "#FF4B1F",
              }}
            >
              WUDAU
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginLeft: "2px",
              }}
            >
              WUDAU
            </span>
          </Link>

          {/* Search Bar + Live Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: "1", maxWidth: "440px", margin: "0 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#F3F4F6",
                borderRadius: "30px",
                padding: "8px 18px",
                width: "100%",
                border: "1px solid #E5E7EB",
              }}
            >
              <span style={{ color: "#9CA3AF", fontSize: "15px", marginRight: "8px" }}>🔍</span>
              <span style={{ color: "#D1D5DB", marginRight: "10px" }}>|</span>
              <input
                type="text"
                placeholder="Search users , hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  fontSize: "14px",
                  color: "#1F2937",
                  width: "100%",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: "14px" }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Camera Button (matching red pill in screenshot) */}
            <button
              onClick={() => setCurrentTab("live")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #FF4B1F 0%, #FF9F00 100%)",
                border: "none",
                borderRadius: "30px",
                padding: "8px 18px",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(225, 29, 72, 0.3)",
                whiteSpace: "nowrap",
              }}
            >
              <span>📹</span>
              <span>Live</span>
            </button>
          </div>

          {/* Right Header Actions: Language & App Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Language Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                <span>🌐</span>
                <span>{language}</span>
                <span style={{ fontSize: "10px", color: "#9CA3AF" }}>⌄</span>
              </button>

              {showLanguageDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "6px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    border: "1px solid #E5E7EB",
                    minWidth: "120px",
                    zIndex: 200,
                    overflow: "hidden",
                  }}
                >
                  {["English", "中文 (Chinese)", "Español", "Français"].map((lang) => (
                    <div
                      key={lang}
                      onClick={() => {
                        setLanguage(lang.split(" ")[0]);
                        setShowLanguageDropdown(false);
                      }}
                      style={{
                        padding: "8px 14px",
                        fontSize: "13px",
                        cursor: "pointer",
                        color: "#374151",
                        backgroundColor: language === lang.split(" ")[0] ? "#F3F4F6" : "transparent",
                      }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Google Play Store Badge (exact button match) */}
            <a
              href="#google-play"
              onClick={(e) => {
                e.preventDefault();
                showToast("WUDAU for Android download package available in /app directory");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "6px",
                textDecoration: "none",
                gap: "8px",
                height: "38px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3.6 1.8L13.8 12L3.6 22.2C3.2 21.8 3 21.2 3 20.5V3.5C3 2.8 3.2 2.2 3.6 1.8Z" fill="#2196F3" />
                <path d="M17.4 8.4L13.8 12L17.4 15.6L20.8 13.6C21.7 13.1 21.7 10.9 20.8 10.4L17.4 8.4Z" fill="#FFC107" />
                <path d="M3.6 22.2L17.4 15.6L13.8 12L3.6 22.2Z" fill="#F44336" />
                <path d="M3.6 1.8L13.8 12L17.4 8.4L3.6 1.8Z" fill="#4CAF50" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: "1" }}>
                <span style={{ fontSize: "8px", textTransform: "uppercase", color: "#9CA3AF" }}>GET IT ON</span>
                <span style={{ fontSize: "12px", fontWeight: "700" }}>Google Play</span>
              </div>
            </a>

            {/* Apple App Store Badge (exact button match) */}
            <a
              href="#app-store"
              onClick={(e) => {
                e.preventDefault();
                showToast("WUDAU for iOS app package available in /app directory");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "6px",
                textDecoration: "none",
                gap: "8px",
                height: "38px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-.99 1.74-.88 2.76 1.01.08 2.04-.54 2.6-1.26z" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: "1" }}>
                <span style={{ fontSize: "8px", textTransform: "uppercase", color: "#9CA3AF" }}>Download on the</span>
                <span style={{ fontSize: "12px", fontWeight: "700" }}>App Store</span>
              </div>
            </a>
          </div>
        </header>

        {/* MAIN BODY: SIDEBAR + CENTER CONTENT */}
        <div style={{ display: "flex", flex: "1", height: "calc(100vh - 72px)", overflow: "hidden" }}>
          {/* LEFT SIDEBAR (Matching screenshot items and active purple highlight) */}
          <aside
            style={{
              width: "230px",
              backgroundColor: "#ffffff",
              borderRight: "1px solid #edf0f5",
              padding: "20px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            {[
              { id: "reels", label: "Reels", icon: "▶" },
              { id: "live", label: "Live Stream", icon: "📶" },
              { id: "social", label: "Social Feed", icon: "🤍" },
              { id: "upload", label: "Upload", icon: "➕" },
              { id: "chat", label: "Chat", icon: "💬" },
              { id: "profile", label: "Profile", icon: "👤" },
            ].map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSidebarClick(item.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 18px",
                    borderRadius: "14px",
                    border: "none",
                    backgroundColor: isActive ? "#FFF0EB" : "transparent",
                    color: isActive ? "#FF4B1F" : "#374151",
                    fontWeight: isActive ? "800" : "600",
                    fontSize: "15px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span style={{ fontSize: "16px", color: isActive ? "#FF4B1F" : "#6B7280" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Bottom brand credit */}
            <div style={{ marginTop: "auto", padding: "16px 10px", fontSize: "11px", color: "#9CA3AF", textAlign: "left", lineHeight: "1.4" }}>
              <strong style={{ color: "#FF4B1F" }}>WUDAU</strong>
              <p style={{ margin: "2px 0 0 0" }}>Where Rhythm Meets Raw Potential</p>
            </div>
          </aside>

          {/* CENTER STAGE (THE REELS VIEWER - IDENTICAL TO SCREENSHOT) */}
          <main
            style={{
              flex: "1",
              backgroundColor: "#F9FAFB",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {currentTab === "reels" && (
              <>
                {filteredVideos.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#6B7280" }}>
                    <p style={{ fontSize: "18px", fontWeight: "700" }}>No reels found matching &quot;{searchQuery}&quot;</p>
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        padding: "8px 20px",
                        borderRadius: "20px",
                        backgroundColor: "#FF4B1F",
                        color: "#fff",
                        border: "none",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  activeVideo && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                      }}
                    >
                      {/* Vertical Phone Card (The Reel) */}
                      <div
                        onClick={togglePlay}
                        style={{
                          position: "relative",
                          width: "390px",
                          height: "calc(100vh - 110px)",
                          maxHeight: "720px",
                          minHeight: "560px",
                          backgroundColor: "#000000",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                          cursor: "pointer",
                        }}
                      >
                        {/* Video Element */}
                        <video
                          ref={videoRef}
                          key={activeVideo._id}
                          src={resolveMedia(activeVideo.videoUrl)}
                          poster={resolveMedia(activeVideo.videoImage)}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />

                        {/* Top-Right Sound Button (identical to circle button in screenshot) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                          }}
                          style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            backdropFilter: "blur(4px)",
                            border: "none",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "16px",
                            zIndex: 10,
                          }}
                        >
                          {isMuted ? "🔇" : "🔊"}
                        </button>

                        {/* Play/Pause Center Indicator */}
                        {!isPlaying && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(0, 0, 0, 0.2)",
                              zIndex: 5,
                            }}
                          >
                            <div
                              style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "28px",
                              }}
                            >
                              ▶
                            </div>
                          </div>
                        )}

                        {/* Bottom-Left Creator Overlay (Identical to Sofia Martinez in screenshot) */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "16px",
                            right: "72px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            zIndex: 10,
                          }}
                        >
                          <img
                            src={resolveMedia(activeVideo.userImage)}
                            alt={activeVideo.name}
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "50%",
                              border: "2px solid #ffffff",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ overflow: "hidden", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ color: "#ffffff", fontSize: "16px", fontWeight: "700" }}>
                                {activeVideo.name || "Sofia Martinez"}
                              </span>
                              {activeVideo.isVerified && (
                                <span style={{ color: "#38BDF8", fontSize: "13px" }}>✓</span>
                              )}
                            </div>
                            <span style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12px", display: "block" }}>
                              {activeVideo.userName || "@Sofia_Martinez_0"}
                            </span>
                            <p
                              style={{
                                color: "#ffffff",
                                fontSize: "13px",
                                margin: "4px 0 0 0",
                                lineHeight: "1.3",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {activeVideo.caption}
                            </p>
                          </div>
                        </div>

                        {/* Right Vertical Action Icons (Identical to screenshot: Gift, Heart, Comment, Share, Music Disc) */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "24px",
                            right: "14px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "16px",
                            zIndex: 10,
                          }}
                        >
                          {/* Gift Box Icon */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowGiftModal(true);
                            }}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(6px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                              }}
                            >
                              🎁
                            </div>
                          </div>

                          {/* Like Heart */}
                          <div
                            onClick={handleLike}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(6px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                                color: likedReelIds[activeVideo._id] ? "#EF4444" : "#ffffff",
                              }}
                            >
                              {likedReelIds[activeVideo._id] ? "❤️" : "🤍"}
                            </div>
                            <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: "700", marginTop: "3px", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                              {reelLikesCount[activeVideo._id] !== undefined
                                ? reelLikesCount[activeVideo._id]
                                : activeVideo.totalLikes || 0}
                            </span>
                          </div>

                          {/* Comments */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCommentsDrawer(true);
                            }}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(6px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "19px",
                                color: "#ffffff",
                              }}
                            >
                              💬
                            </div>
                            <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: "700", marginTop: "3px", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                              {(commentsMap[activeVideo._id]?.length || 0) +
                                (activeVideo.totalComments || 0)}
                            </span>
                          </div>

                          {/* Share Arrow */}
                          <div
                            onClick={handleShare}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(6px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                color: "#ffffff",
                              }}
                            >
                              ↪️
                            </div>
                          </div>

                          {/* Spinning Music Vinyl Disc */}
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              backgroundColor: "#111827",
                              border: "2px solid #ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              animation: "spin 4s linear infinite",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                              fontSize: "14px",
                            }}
                          >
                            🎵
                          </div>
                        </div>
                      </div>

                      {/* UP / DOWN NAVIGATION BUTTONS (Outside to the right, matching screenshot) */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Up Arrow */}
                        <button
                          onClick={handlePrevReel}
                          title="Previous Reel (Up Arrow)"
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            backgroundColor: "#4B5563",
                            border: "none",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B5563")}
                        >
                          ↑
                        </button>

                        {/* Down Arrow */}
                        <button
                          onClick={handleNextReel}
                          title="Next Reel (Down Arrow)"
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            backgroundColor: "#4B5563",
                            border: "none",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B5563")}
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  )
                )}
              </>
            )}

            {/* LIVE STREAM TAB */}
            {currentTab === "live" && (
              <div style={{ maxWidth: "800px", width: "100%", padding: "24px", textAlign: "center" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
                  🔴 Live Broadcasts
                </h2>
                <p style={{ color: "#6B7280", marginBottom: "24px" }}>
                  Watch live creator streams, interactive music stages, and dance competitions.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {filteredVideos.slice(0, 2).map((v) => (
                    <div
                      key={v._id}
                      onClick={() => setCurrentTab("reels")}
                      style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        backgroundColor: "#000",
                        position: "relative",
                        height: "360px",
                        cursor: "pointer",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      }}
                    >
                      <img src={resolveMedia(v.videoImage)} alt="live" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: "14px", left: "14px", backgroundColor: "#EF4444", color: "#fff", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "800" }}>
                        LIVE
                      </div>
                      <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                        <span style={{ fontWeight: "700", fontSize: "15px", display: "block" }}>{v.name}</span>
                        <span style={{ fontSize: "12px", opacity: 0.8 }}>{v.caption}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL FEED TAB */}
            {currentTab === "social" && (
              <div style={{ maxWidth: "900px", width: "100%", height: "100%", overflowY: "auto", padding: "30px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#111827", marginBottom: "20px" }}>
                  🤍 Community Social Feed
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {posts.map((post) => (
                    <div key={post._id} style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={resolveMedia(post.userImage)} alt={post.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: "700", display: "block", color: "#111827" }}>{post.name}</span>
                          <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{post.userName}</span>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: "240px", backgroundColor: "#000" }}>
                        <img src={resolveMedia(post.postImage?.[0])} alt="post" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ padding: "14px" }}>
                        <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 10px 0" }}>{post.caption}</p>
                        <span style={{ fontSize: "12px", color: "#6B7280" }}>❤️ {post.totalLikes || 0} Likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FLOATING LOGIN BUTTON (Bottom-Right corner, matching screenshot) */}
            <Link
              href={isAuth ? "/dashboard" : "/login"}
              style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 26px",
                borderRadius: "30px",
                background: "linear-gradient(135deg, #EC4899 0%, #A855F7 100%)",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "15px",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(236, 72, 153, 0.45)",
                zIndex: 90,
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span>👤</span>
              <span>{isAuth ? "Dashboard" : "Login"}</span>
            </Link>
          </main>
        </div>

        {/* COMMENTS SLIDE-OVER DRAWER */}
        {showCommentsDrawer && activeVideo && (
          <div
            onClick={() => setShowCommentsDrawer(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 300,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "360px",
                backgroundColor: "#ffffff",
                height: "100%",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "-10px 0 30px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>Comments</h3>
                <button
                  onClick={() => setShowCommentsDrawer(false)}
                  style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: "#6B7280" }}
                >
                  ✕
                </button>
              </div>

              {/* Comment list */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                {(commentsMap[activeVideo._id] || []).length === 0 ? (
                  <p style={{ color: "#9CA3AF", textAlign: "center", margin: "auto 0" }}>No comments yet. Be the first!</p>
                ) : (
                  (commentsMap[activeVideo._id] || []).map((c) => (
                    <div key={c.id} style={{ backgroundColor: "#F9FAFB", padding: "10px 14px", borderRadius: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#FF4B1F" }}>{c.userName}</span>
                        <span style={{ fontSize: "10px", color: "#9CA3AF" }}>{c.time}</span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment input */}
              <div style={{ display: "flex", gap: "8px", paddingTop: "14px", borderTop: "1px solid #E5E7EB" }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  style={{
                    flex: 1,
                    padding: "8px 14px",
                    borderRadius: "20px",
                    border: "1px solid #E5E7EB",
                    outline: "none",
                    fontSize: "13px",
                  }}
                />
                <button
                  onClick={handleAddComment}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    backgroundColor: "#FF4B1F",
                    color: "#fff",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEND GIFT MODAL */}
        {showGiftModal && (
          <div
            onClick={() => setShowGiftModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                maxWidth: "440px",
                width: "100%",
                padding: "24px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 6px 0", color: "#111827" }}>
                Send Gift To Creator 🎁
              </h3>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 20px 0" }}>
                Show appreciation for this rhythm performance on WUDAU!
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
                {GIFTS_LIST.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => handleSendGift(gift)}
                    style={{
                      padding: "16px 10px",
                      borderRadius: "16px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#F9FAFB",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      transition: "transform 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF4B1F")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                  >
                    <span style={{ fontSize: "28px" }}>{gift.icon}</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#111827" }}>{gift.name}</span>
                    <span style={{ fontSize: "11px", color: "#F59E0B", fontWeight: "600" }}>🪙 {gift.coins}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowGiftModal(false)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "20px",
                  backgroundColor: "#E5E7EB",
                  color: "#374151",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* AUTH PROMPT MODAL (for protected sidebar actions) */}
        {showAuthModal && (
          <div
            onClick={() => setShowAuthModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                maxWidth: "420px",
                width: "100%",
                padding: "28px",
                textAlign: "center",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔐</div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", margin: "0 0 8px 0" }}>
                {authModalTitle}
              </h3>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.5", margin: "0 0 24px 0" }}>
                Sign in to your WUDAU account to post content, message other artists, and manage your dashboard.
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/login"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "24px",
                    backgroundColor: "#374151",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/Registration"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, #FF4B1F 0%, #FF9F00 100%)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "14px",
                    boxShadow: "0 4px 14px rgba(255, 75, 31, 0.4)",
                  }}
                >
                  Create Account
                </Link>
                <button
                  onClick={() => setShowAuthModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "24px",
                    backgroundColor: "#F3F4F6",
                    color: "#4B5563",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Browse
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

// Pre-render with SSR for instant load
export async function getServerSideProps() {
  try {
    const apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_BASE_URL || baseURL;
    const cleanBase = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;
    const [videosRes, postsRes] = await Promise.all([
      fetch(`${cleanBase}client/video/getAllVideos?start=1&limit=30`, {
        headers: { key: secretKey },
      }).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`${cleanBase}client/post/getAllPosts?start=1&limit=30`, {
        headers: { key: secretKey },
      }).then((r) => r.json()).catch(() => ({ post: [] })),
    ]);

    const videoList: VideoItem[] = videosRes.data || [];
    videoList.sort((a, b) => {
      if (a.userName === "@Sofia_Martinez_0") return -1;
      if (b.userName === "@Sofia_Martinez_0") return 1;
      return 0;
    });

    return {
      props: {
        initialVideos: videoList,
        initialPosts: postsRes.post || [],
      },
    };
  } catch (e) {
    return {
      props: {
        initialVideos: [],
        initialPosts: [],
      },
    };
  }
}
