import React, { useEffect, useState, useMemo, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { baseURL, secretKey, projectName } from "@/util/config";

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
  songTitle?: string;
  songImage?: string;
  songLink?: string;
  singerName?: string;
  location?: string;
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
  location?: string;
  mainPostImage?: string;
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
  { id: "g3", name: "African Drum", icon: "🪘", coins: 100 },
  { id: "g4", name: "Diamond", icon: "💎", coins: 500 },
  { id: "g5", name: "Crown", icon: "👑", coins: 1000 },
  { id: "g6", name: "Safari Lion", icon: "🦁", coins: 2500 },
];

export default function Home({
  initialVideos = [],
  initialPosts = [],
}: {
  initialVideos?: VideoItem[];
  initialPosts?: PostItem[];
}) {
  const router = useRouter();

  // Navigation & Viewport State
  const [currentTab, setCurrentTab] = useState<"reels" | "live" | "social" | "music" | "explore" | "profile">("reels");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [language, setLanguage] = useState<string>("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);

  // Content Data
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // User & Authentication State
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("guest");

  // Video Controls & Audio
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-Scrolling & Reel Playback Progress
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);

  // Social Interactions & Modals
  const [likedReelIds, setLikedReelIds] = useState<{ [id: string]: boolean }>({});
  const [reelLikesCount, setReelLikesCount] = useState<{ [id: string]: number }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState<boolean>(false);
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalTitle, setAuthModalTitle] = useState<string>("");
  const [commentInput, setCommentInput] = useState<string>("");
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Music Preview in Sound Tab
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Authentic Tanzanian & Global Commentary
  const [commentsMap, setCommentsMap] = useState<{ [videoId: string]: CommentItem[] }>({
    default: [
      { id: "c1", userName: "@jay_bongo", text: "Hii ni kali sana bro! Dar es Salaam stand up! 🔥🇹🇿", time: "2m ago" },
      { id: "c2", userName: "@zuhura_znz", text: "Mambo ni moto sana, Zanzibar tuko pamoja! 🌴✨", time: "8m ago" },
      { id: "c3", userName: "@rehema_wildlife", text: "Unbelievable nature, Serengeti is truly the pride of Africa 🦁❤️", time: "15m ago" },
      { id: "c4", userName: "@kenji_tokyo", text: "Greetings from Tokyo! Absolutely love the energy of WUDAU 🇯🇵🇹🇿", time: "25m ago" },
      { id: "c5", userName: "@mollel_arusha", text: "Ngoma inabamba mbaya! Saluti tele kutoka Arusha 🏔️", time: "1h ago" },
    ],
  });

  // Client-side authentication & user state check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
      const role = sessionStorage.getItem("role") || "guest";
      setIsAuth(!!token);
      setUserRole(role);
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.warn("Error parsing user session:", e);
        }
      }
    }
  }, []);

  // Fetch updated data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, pRes] = await Promise.all([
          axios.get("client/video/getAllVideos?start=1&limit=30", { headers: { key: secretKey } }),
          axios.get("client/post/getAllPosts?start=1&limit=30", { headers: { key: secretKey } }),
        ]);
        if (vRes.data?.data?.length) setVideos(vRes.data.data);
        if (pRes.data?.post?.length) setPosts(pRes.data.post);
      } catch (err) {
        console.warn("Client data fetch error, using fallback data:", err);
      }
    };
    fetchData();
  }, []);

  // Keyboard navigation for reels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setShowCommentsDrawer(false);
        setShowGiftModal(false);
        setShowAuthModal(false);
        setMobileSearchOpen(false);
      }
      if (currentTab === "reels" && !showCommentsDrawer && !showGiftModal && !showAuthModal) {
        if (e.key === "ArrowDown") {
          handleNextReel();
        } else if (e.key === "ArrowUp") {
          handlePrevReel();
        } else if (e.key === " " || e.key === "k") {
          e.preventDefault();
          togglePlay();
        } else if (e.key === "m" || e.key === "M") {
          setIsMuted((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTab, currentReelIndex, videos.length, showCommentsDrawer, showGiftModal, showAuthModal]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Resolve media URLs
  const resolveMedia = (path?: string): string => {
    if (!path) return "storage/thumb1.jpg";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${base}${cleanPath}`;
  };

  // Toast Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("isAuth");
      sessionStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuth(false);
      setCurrentUser(null);
      setUserRole("guest");
      showToast("Logged out successfully");
    }
  };

  // Quick Filter Logic
  const filteredVideos = useMemo(() => {
    let list = videos;
    if (currentFilter === "tanzania") {
      list = list.filter((v) =>
        (v.caption + " " + v.location + " " + v.name + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("tanzania") ||
        (v.location || "").toLowerCase().includes("dar") ||
        (v.location || "").toLowerCase().includes("zanzibar") ||
        (v.location || "").toLowerCase().includes("arusha")
      );
    } else if (currentFilter === "serengeti") {
      list = list.filter((v) =>
        (v.caption + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("serengeti") ||
        (v.caption + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("nature")
      );
    } else if (currentFilter === "singeli") {
      list = list.filter((v) =>
        (v.caption + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("singeli") ||
        (v.caption + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("bongo")
      );
    } else if (currentFilter === "zanzibar") {
      list = list.filter((v) =>
        (v.caption + " " + v.location + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("zanzibar")
      );
    } else if (currentFilter === "global") {
      list = list.filter((v) =>
        (v.caption + " " + v.location + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("tokyo") ||
        (v.caption + " " + v.location + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("paris") ||
        (v.caption + " " + v.location + " " + (v.hashTag || []).join(" ")).toLowerCase().includes("johannesburg")
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          (v.caption || "").toLowerCase().includes(q) ||
          (v.name || "").toLowerCase().includes(q) ||
          (v.userName || "").toLowerCase().includes(q) ||
          (v.location || "").toLowerCase().includes(q) ||
          (v.hashTag || []).some((h) => h.toLowerCase().includes(q))
      );
    }
    return list;
  }, [videos, currentFilter, searchQuery]);

  const activeVideo = filteredVideos[currentReelIndex] || filteredVideos[0];

  // Reset playback progress when switching reel or category
  useEffect(() => {
    setProgressPercent(0);
    setIsBuffering(false);
  }, [currentReelIndex, currentFilter]);

  const handleNextReel = () => {
    if (filteredVideos.length === 0) return;
    setProgressPercent(0);
    setCurrentReelIndex((prev) => (prev + 1) % filteredVideos.length);
    setIsPlaying(true);
  };

  const handlePrevReel = () => {
    if (filteredVideos.length === 0) return;
    setProgressPercent(0);
    setCurrentReelIndex((prev) => (prev - 1 + filteredVideos.length) % filteredVideos.length);
    setIsPlaying(true);
  };

  const handleVideoEnded = () => {
    if (isAutoScroll) {
      handleNextReel();
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const target = e.currentTarget;
    if (target.duration && !isNaN(target.duration)) {
      const pct = (target.currentTime / target.duration) * 100;
      setProgressPercent(Math.min(100, Math.max(0, pct)));
      // Auto-advance safely if video reaches within 0.25s of duration
      if (isAutoScroll && target.duration > 1 && target.duration - target.currentTime < 0.25) {
        handleNextReel();
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 350) return;
    if (Math.abs(e.deltaY) > 20) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        handleNextReel();
      } else {
        handlePrevReel();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const diffX = (touchStartX.current || 0) - e.changedTouches[0].clientX;
    touchStartY.current = null;
    touchStartX.current = null;

    // Check for vertical swipe (scroll reel)
    if (Math.abs(diffY) > 40 && Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 0) {
        handleNextReel(); // Swiped up -> next reel
      } else {
        handlePrevReel(); // Swiped down -> prev reel
      }
    }
  };

  // Double tap to like on video surface
  const handleSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      // Double tap detected: trigger like with floating heart animation
      if (activeVideo) {
        if (!likedReelIds[activeVideo._id]) {
          handleLike(activeVideo._id);
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const heartId = Date.now();
        setFloatingHearts((prev) => [...prev, { id: heartId, x, y }]);
        setTimeout(() => {
          setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
        }, 800);
      }
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = now;
      setTimeout(() => {
        if (lastTapTime.current !== 0) {
          togglePlay();
          lastTapTime.current = 0;
        }
      }, 300);
    }
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const wasLiked = likedReelIds[id];
    const currentCount = reelLikesCount[id] !== undefined ? reelLikesCount[id] : activeVideo?.totalLikes || 0;
    setLikedReelIds((prev) => ({ ...prev, [id]: !wasLiked }));
    setReelLikesCount((prev) => ({ ...prev, [id]: wasLiked ? Math.max(0, currentCount - 1) : currentCount + 1 }));
    showToast(wasLiked ? "Removed like" : "❤️ Liked reel!");
  };

  const handleShare = (video: VideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/?videoId=${video._id}`;
      if (navigator.share) {
        navigator
          .share({
            title: video.caption || "Watch on WUDAU",
            url,
          })
          .catch(() => {});
      } else {
        navigator.clipboard?.writeText(url);
        showToast("🔗 Reel link copied to clipboard!");
      }
    }
  };

  const handleSendGift = (gift: GiftItem) => {
    setShowGiftModal(false);
    showToast(`🎁 Sent ${gift.icon} ${gift.name} (${gift.coins} coins) to ${activeVideo?.name || "Creator"}!`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const vidId = activeVideo?._id || "default";
    const currentList = commentsMap[vidId] || commentsMap["default"] || [];
    const commenterName = currentUser?.userName || "@You";
    const newComment: CommentItem = {
      id: "c_" + Date.now(),
      userName: commenterName,
      text: commentInput.trim(),
      time: "Just now",
    };
    setCommentsMap({ ...commentsMap, [vidId]: [newComment, ...currentList] });
    setCommentInput("");
    showToast("💬 Comment posted!");
  };

  const handleToggleMusic = (songUrl?: string) => {
    if (!songUrl) return;
    const fullUrl = resolveMedia(songUrl);
    if (playingAudioUrl === fullUrl) {
      audioPreviewRef.current?.pause();
      setPlayingAudioUrl(null);
    } else {
      setPlayingAudioUrl(fullUrl);
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = fullUrl;
        audioPreviewRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <>
      <Head>
        <title>{projectName} - African Rhythm & Global Talent Discovery</title>
        <meta
          name="description"
          content="Experience vibrant Tanzanian street dance, Bongo Flava, Singeli 300BPM, Serengeti wildlife safari, and global creative reels on WUDAU."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Audio preview element */}
      <audio ref={audioPreviewRef} onEnded={() => setPlayingAudioUrl(null)} />

      {/* Toast alert */}
      {toastMessage && (
        <div className="wudau-toast" role="alert">
          {toastMessage}
        </div>
      )}

      {/* APP ROOT */}
      <div className="app-shell">
        {/* ==================================================================== */}
        {/* TOP HEADER NAVIGATION                                                */}
        {/* ==================================================================== */}
        <header className="site-header">
          <div className="header-left">
            {/* Slide-over menu hamburger button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`hamburger-btn ${isMenuOpen ? "active" : ""}`}
              aria-label="Toggle navigation menu"
              title="Menu"
            >
              <div className="hamburger-bars">
                <span className="bar top"></span>
                <span className="bar mid"></span>
                <span className="bar bot"></span>
              </div>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="brand-logo">
              <div className="brand-badge">W</div>
              <div className="brand-text-block">
                <span className="brand-title">WUDAU</span>
                <span className="brand-tagline">RHYTHM & TALENT</span>
              </div>
            </Link>
          </div>

          {/* Quick Filter Categories Carousel */}
          <div className="header-center">
            <nav className="filter-nav">
              {[
                { id: "all", label: "🔥 For You" },
                { id: "tanzania", label: "🇹🇿 Tanzania" },
                { id: "serengeti", label: "🦁 Serengeti" },
                { id: "singeli", label: "⚡ Singeli & Bongo" },
                { id: "zanzibar", label: "🌴 Zanzibar" },
                { id: "global", label: "🌍 Global" },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => {
                    setCurrentFilter(chip.id);
                    setCurrentReelIndex(0);
                  }}
                  className={`filter-tab ${currentFilter === chip.id ? "active" : ""}`}
                >
                  {chip.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Header Right Tools: Search, Auto-Scroll, Auth/Profile */}
          <div className="header-right">
            {/* Desktop Search Bar */}
            <div className="search-bar-desktop">
              <span className="search-glass">🔍</span>
              <input
                type="text"
                placeholder="Search reels, artists, #tags..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentReelIndex(0);
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="search-clear">
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Search Icon Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="mobile-search-btn"
              aria-label="Search"
            >
              🔍
            </button>

            {/* Auto-Scroll Toggle */}
            <button
              onClick={() => {
                setIsAutoScroll(!isAutoScroll);
                showToast(!isAutoScroll ? "🔄 Auto-Scroll: ON (Next reel on finish)" : "🔁 Auto-Scroll: OFF (Video loops)");
              }}
              className={`auto-scroll-pill ${isAutoScroll ? "active" : ""}`}
              title={isAutoScroll ? "Auto-Scroll: Enabled (Advances automatically)" : "Auto-Scroll: Disabled (Click to advance automatically)"}
            >
              <span className={`scroll-dot ${isAutoScroll ? "active" : ""}`}></span>
              <span className="scroll-label">Auto: {isAutoScroll ? "ON" : "OFF"}</span>
            </button>

            {/* User Session Profile / Login CTA */}
            {isAuth ? (
              <div className="user-profile-pill">
                <button
                  onClick={() => setCurrentTab("profile")}
                  className="user-avatar-btn"
                  title="My Account"
                >
                  {currentUser?.image ? (
                    <img src={resolveMedia(currentUser.image)} alt="User" className="user-avatar-img" />
                  ) : (
                    <span className="user-avatar-initial">
                      {currentUser?.name ? currentUser.name[0].toUpperCase() : "👤"}
                    </span>
                  )}
                  <span className="user-display-name">{currentUser?.name || "Account"}</span>
                </button>
                <button onClick={handleLogout} className="logout-icon-btn" title="Log Out">
                  🚪
                </button>
              </div>
            ) : (
              <div className="auth-buttons-group">
                <Link href="/login" className="login-link-btn">
                  Log In
                </Link>
                <Link href="/Registration" className="signup-link-btn">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Expandable Search Row */}
        {mobileSearchOpen && (
          <div className="mobile-search-row">
            <input
              type="text"
              placeholder="Search reels, artists, #tags..."
              value={searchQuery}
              autoFocus
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentReelIndex(0);
              }}
            />
            <button onClick={() => setMobileSearchOpen(false)} className="mobile-search-close">
              ✕
            </button>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SLIDE-OVER NAVIGATION DRAWER                                         */}
        {/* ==================================================================== */}
        {isMenuOpen && (
          <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}>
            <aside className="nav-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <div className="drawer-brand">
                  <div className="brand-badge mini">W</div>
                  <div>
                    <h3 className="drawer-title">{projectName}</h3>
                    <p className="drawer-tagline">Where Rhythm Meets Potential</p>
                  </div>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="drawer-close" aria-label="Close Menu">
                  ✕
                </button>
              </div>

              {/* User Session Profile Card */}
              <div className="drawer-user-card">
                <div className="drawer-user-info">
                  <div className="user-avatar-circle">
                    {currentUser?.image ? (
                      <img src={resolveMedia(currentUser.image)} alt="Avatar" className="drawer-avatar-img" />
                    ) : isAuth ? (
                      "👑"
                    ) : (
                      "🌍"
                    )}
                  </div>
                  <div>
                    <h4 className="user-name">{currentUser?.name || (isAuth ? "Authenticated Creator" : "Welcome to WUDAU")}</h4>
                    <p className="user-status">{currentUser?.userName || (isAuth ? "Creator Account" : "Guest Explorer • Tanzania & Global")}</p>
                  </div>
                </div>
                {isAuth ? (
                  <div className="drawer-user-quick-actions">
                    <button
                      onClick={() => {
                        setCurrentTab("profile");
                        setIsMenuOpen(false);
                      }}
                      className="drawer-quick-btn"
                    >
                      View Profile
                    </button>
                    {userRole === "admin" && (
                      <Link href="/dashboard" className="drawer-quick-btn admin-link" onClick={() => setIsMenuOpen(false)}>
                        Admin Portal
                      </Link>
                    )}
                    <button onClick={handleLogout} className="drawer-quick-btn logout-text">
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="drawer-auth-actions">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="drawer-auth-btn login">
                      Sign In
                    </Link>
                    <Link href="/Registration" onClick={() => setIsMenuOpen(false)} className="drawer-auth-btn register">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Primary Content Feeds */}
              <div className="drawer-section">
                <span className="drawer-section-title">CONTENT DISCOVERY</span>
                <nav className="drawer-nav-list">
                  {[
                    { id: "reels", label: "🎬 Reels & Shorts", desc: "Tanzanian & African Video Feed" },
                    { id: "live", label: "🔴 Live Stages", desc: "Coco Beach & Stone Town Broadcasts" },
                    { id: "social", label: "🤍 Community Feed", desc: "Creator Photos & Stories" },
                    { id: "music", label: "🎵 Sounds & Audio", desc: "Bongo Flava, Singeli, Serengeti" },
                    { id: "explore", label: "🦁 Discover Tanzania", desc: "#TanzaniaUnforgettable" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id as any);
                        setIsMenuOpen(false);
                      }}
                      className={`drawer-nav-item ${currentTab === item.id ? "active" : ""}`}
                    >
                      <div className="nav-item-content">
                        <span className="nav-item-label">{item.label}</span>
                        <span className="nav-item-desc">{item.desc}</span>
                      </div>
                      <span className="nav-item-arrow">→</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Cultural Channels */}
              <div className="drawer-section">
                <span className="drawer-section-title">CULTURAL CHANNELS 🇹🇿</span>
                <div className="channel-pills-grid">
                  {[
                    { tag: "tanzania", name: "🇹🇿 Dar Street Dance", count: "Kinondoni" },
                    { tag: "singeli", name: "⚡ Singeli 300BPM", count: "Mbagala" },
                    { tag: "serengeti", name: "🦁 Serengeti Safari", count: "Mara" },
                    { tag: "zanzibar", name: "🌴 Zanzibar Taarab", count: "Stone Town" },
                    { tag: "global", name: "🇯🇵 Tokyo & Paris Loops", count: "World Beats" },
                  ].map((chan) => (
                    <button
                      key={chan.tag}
                      onClick={() => {
                        setCurrentFilter(chan.tag);
                        setCurrentTab("reels");
                        setCurrentReelIndex(0);
                        setIsMenuOpen(false);
                      }}
                      className="channel-pill-card"
                    >
                      <span className="chan-name">{chan.name}</span>
                      <span className="chan-count">{chan.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="drawer-section">
                <span className="drawer-section-title">LANGUAGE</span>
                <div className="drawer-lang-selector">
                  {["English", "Swahili (Kiswahili) 🇹🇿", "Français", "中文"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang.split(" ")[0]);
                        showToast(`Language set to ${lang.split(" ")[0]}`);
                      }}
                      className={`drawer-lang-chip ${language === lang.split(" ")[0] ? "active" : ""}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Links */}
              <div className="drawer-footer">
                <p className="drawer-copyright">© 2026 WUDAU Technologies • African Rhythm & Global Creators</p>
              </div>
            </aside>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MAIN BODY: FLUID RESPONSIVE FEED & CONTENT STAGE                     */}
        {/* ==================================================================== */}
        <main className="content-stage">
          {/* TAB 1: REELS EXPERIENCE (CLEAN, FLUID, NO HARDCODED FRAMES) */}
          {currentTab === "reels" && (
            <div className="reels-viewport">
              {filteredVideos.length === 0 ? (
                <div className="empty-state-card">
                  <span style={{ fontSize: "44px" }}>🔍</span>
                  <h3>No reels found for this category</h3>
                  <p>Try clearing your filter or searching for another artist or hashtag.</p>
                  <button
                    onClick={() => {
                      setCurrentFilter("all");
                      setSearchQuery("");
                    }}
                    className="primary-gradient-btn"
                  >
                    View All Reels
                  </button>
                </div>
              ) : (
                activeVideo && (
                  <div className="reel-main-layout">
                    {/* Centered Reel Card (Fluid on Mobile, Focused on Desktop) */}
                    <div
                      className="reel-card-container"
                      onClick={handleSurfaceClick}
                      onWheel={handleWheel}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Video Element */}
                      <video
                        ref={videoRef}
                        key={activeVideo._id}
                        src={resolveMedia(activeVideo.videoUrl)}
                        poster={resolveMedia(activeVideo.videoImage)}
                        autoPlay
                        loop={!isAutoScroll}
                        muted={isMuted}
                        playsInline
                        preload="metadata"
                        onWaiting={() => setIsBuffering(true)}
                        onCanPlay={() => setIsBuffering(false)}
                        onPlaying={() => setIsBuffering(false)}
                        onEnded={handleVideoEnded}
                        onTimeUpdate={handleTimeUpdate}
                        className="reel-video"
                      />

                      {/* Buffering Spinner */}
                      {isBuffering && (
                        <div className="buffering-spinner-wrap">
                          <div className="buffering-ring"></div>
                        </div>
                      )}

                      {/* Floating Hearts Animation from Double-Tap */}
                      {floatingHearts.map((heart) => (
                        <div
                          key={heart.id}
                          className="double-tap-heart"
                          style={{ left: `${heart.x - 28}px`, top: `${heart.y - 28}px` }}
                        >
                          ❤️
                        </div>
                      ))}

                      {/* Sound Toggle Floating Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                          showToast(isMuted ? "🔊 Sound Enabled" : "🔇 Muted");
                        }}
                        className="reel-sound-toggle"
                        aria-label="Toggle Sound"
                      >
                        {isMuted ? "🔇" : "🔊"}
                      </button>

                      {/* Play / Pause Indicator */}
                      {!isPlaying && (
                        <div className="reel-paused-indicator">
                          <div className="play-icon-glow">▶</div>
                        </div>
                      )}

                      {/* Right Floating Actions Bar */}
                      <div className="reel-actions-rail" onClick={(e) => e.stopPropagation()}>
                        {/* Creator Avatar with follow + badge */}
                        <div className="action-avatar-wrap">
                          <img
                            src={resolveMedia(activeVideo.userImage)}
                            alt={activeVideo.name}
                            className="action-creator-avatar"
                          />
                          <button
                            onClick={() => showToast(`Followed ${activeVideo.name}!`)}
                            className="avatar-follow-badge"
                            title="Follow Creator"
                          >
                            +
                          </button>
                        </div>

                        {/* Like Button */}
                        <button
                          onClick={(e) => handleLike(activeVideo._id, e)}
                          className={`action-btn-bubble ${likedReelIds[activeVideo._id] ? "liked" : ""}`}
                          title="Like Reel"
                        >
                          <span className="bubble-icon">❤️</span>
                          <span className="bubble-count">
                            {reelLikesCount[activeVideo._id] !== undefined
                              ? reelLikesCount[activeVideo._id]
                              : activeVideo.totalLikes || 0}
                          </span>
                        </button>

                        {/* Comments Button */}
                        <button
                          onClick={() => setShowCommentsDrawer(true)}
                          className="action-btn-bubble"
                          title="View Comments"
                        >
                          <span className="bubble-icon">💬</span>
                          <span className="bubble-count">
                            {(commentsMap[activeVideo._id] || commentsMap["default"] || []).length}
                          </span>
                        </button>

                        {/* Gift Button */}
                        <button
                          onClick={() => setShowGiftModal(true)}
                          className="action-btn-bubble gift-bubble"
                          title="Send Gift"
                        >
                          <span className="bubble-icon">🎁</span>
                          <span className="bubble-count">Gift</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={(e) => handleShare(activeVideo, e)}
                          className="action-btn-bubble"
                          title="Share Reel"
                        >
                          <span className="bubble-icon">↗️</span>
                          <span className="bubble-count">{activeVideo.shareCount || 0}</span>
                        </button>

                        {/* Auto-Scroll Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAutoScroll(!isAutoScroll);
                            showToast(!isAutoScroll ? "🔄 Auto-Scroll: ON" : "🔁 Auto-Scroll: OFF (Loop Mode)");
                          }}
                          className={`action-btn-bubble auto-bubble ${isAutoScroll ? "active" : ""}`}
                          title={isAutoScroll ? "Auto-Scroll: ON (Click for loop mode)" : "Auto-Scroll: OFF (Click for auto-scroll)"}
                        >
                          <span className="bubble-icon">{isAutoScroll ? "🔄" : "🔁"}</span>
                          <span className="bubble-count">{isAutoScroll ? "Auto" : "Loop"}</span>
                        </button>

                        {/* Rotating Vinyl Soundtrack Disc */}
                        <div
                          onClick={() => handleToggleMusic(activeVideo.songLink)}
                          className={`spinning-record ${isPlaying ? "spinning" : ""}`}
                          title={activeVideo.songTitle || "Original Soundtrack"}
                        >
                          <div className="record-center">🎵</div>
                        </div>
                      </div>

                      {/* Bottom Vignette Overlay (Metadata, Caption, Sound) */}
                      <div className="reel-metadata-vignette" onClick={(e) => e.stopPropagation()}>
                        <div className="creator-meta-row">
                          <span className="creator-display-name">{activeVideo.name}</span>
                          {activeVideo.isVerified && <span className="verified-badge">✓</span>}
                          <span className="creator-handle">{activeVideo.userName}</span>
                        </div>

                        {activeVideo.location && (
                          <div className="location-pin-row">
                            <span>📍</span>
                            <span>{activeVideo.location}</span>
                          </div>
                        )}

                        <p className="reel-caption-text">{activeVideo.caption}</p>

                        <div className="sound-ticker-row">
                          <span className="ticker-icon">🎵</span>
                          <div className="ticker-marquee">
                            <span>
                              {activeVideo.songTitle || "Original Sound"} • {activeVideo.singerName || activeVideo.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Track at Bottom */}
                      <div className="reel-progress-track">
                        <div
                          className={`reel-progress-bar ${isAutoScroll ? "auto-active" : ""}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Desktop Companion Controls (Displayed beside the player on desktop) */}
                    <aside className="desktop-companion-panel">
                      {/* Up/Down Reel Navigation */}
                      <div className="reel-nav-card">
                        <span className="nav-card-title">REEL NAVIGATION</span>
                        <div className="nav-arrow-group">
                          <button
                            onClick={handlePrevReel}
                            className="arrow-nav-btn"
                            title="Previous Reel (Arrow Up)"
                          >
                            ▲
                          </button>
                          <div className="reel-counter-badge">
                            {currentReelIndex + 1} / {filteredVideos.length}
                          </div>
                          <button
                            onClick={handleNextReel}
                            className="arrow-nav-btn"
                            title="Next Reel (Arrow Down)"
                          >
                            ▼
                          </button>
                        </div>
                        <p className="nav-hint-text">Use ↑ and ↓ arrows or spacebar to play/pause</p>
                      </div>

                      {/* Auto-Scroll Setting Card */}
                      <div className="companion-setting-card">
                        <div className="setting-card-text">
                          <span className="setting-card-title">{isAutoScroll ? "🔄 Auto-Scroll" : "🔁 Video Looping"}</span>
                          <span className="setting-card-sub">
                            {isAutoScroll ? "Advances to next reel automatically" : "Repeats current video"}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setIsAutoScroll(!isAutoScroll);
                            showToast(!isAutoScroll ? "🔄 Auto-Scroll: ON" : "🔁 Auto-Scroll: OFF (Loop Mode)");
                          }}
                          className={`comp-toggle-switch ${isAutoScroll ? "active" : ""}`}
                          aria-label="Toggle Auto-Scroll"
                        >
                          <span className="comp-switch-slider"></span>
                        </button>
                      </div>

                      {/* Creator Profile Spotlight */}
                      <div className="companion-creator-card">
                        <div className="comp-creator-row">
                          <img
                            src={resolveMedia(activeVideo.userImage)}
                            alt={activeVideo.name}
                            className="comp-avatar"
                          />
                          <div>
                            <h4 className="comp-name">{activeVideo.name}</h4>
                            <p className="comp-handle">{activeVideo.userName}</p>
                          </div>
                        </div>
                        <div className="comp-stats-grid">
                          <div className="comp-stat">
                            <strong>{activeVideo.totalLikes || 1420}</strong>
                            <span>Likes</span>
                          </div>
                          <div className="comp-stat">
                            <strong>{activeVideo.shareCount || 389}</strong>
                            <span>Shares</span>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast(`Followed ${activeVideo.name}!`)}
                          className="comp-follow-btn"
                        >
                          + Follow Artist
                        </button>
                      </div>

                      {/* Soundtrack Preview Card */}
                      {activeVideo.songTitle && (
                        <div className="companion-sound-card">
                          <div className="sound-card-header">
                            <span>🎵</span>
                            <div>
                              <h5>{activeVideo.songTitle}</h5>
                              <p>{activeVideo.singerName || "WUDAU Sound"}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleMusic(activeVideo.songLink)}
                            className="sound-play-preview-btn"
                          >
                            {playingAudioUrl === resolveMedia(activeVideo.songLink) ? "⏸ Stop Audio" : "▶ Play Audio"}
                          </button>
                        </div>
                      )}
                    </aside>
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 2: LIVE BROADCASTS */}
          {currentTab === "live" && (
            <div className="tab-page-container">
              <div className="tab-header-banner">
                <h2>🔴 WUDAU Live Stages</h2>
                <p>Real-time interactive streams, coastal music sessions, and street dance competitions.</p>
              </div>
              <div className="live-streams-grid">
                {[
                  {
                    id: "l1",
                    title: "Coco Beach Street Dance Battle 2026",
                    host: "Kassim Mwambao (Dar es Salaam)",
                    viewers: "2.8k",
                    image: "storage/thumb2.jpg",
                    tag: "DANCE LIVE",
                  },
                  {
                    id: "l2",
                    title: "Stone Town Acoustic Dhow Sunset Live",
                    host: "Zuhura Bakari (Zanzibar)",
                    viewers: "1.9k",
                    image: "storage/thumb4.jpg",
                    tag: "MUSIC LIVE",
                  },
                  {
                    id: "l3",
                    title: "Serengeti Dawn Wildlife Migration Patrol",
                    host: "Rehema Mushi (Serengeti)",
                    viewers: "4.5k",
                    image: "storage/thumb1.jpg",
                    tag: "SAFARI LIVE",
                  },
                  {
                    id: "l4",
                    title: "Singeli 300BPM Speed Challenge Live",
                    host: "Amani Juma (Mbagala)",
                    viewers: "3.2k",
                    image: "storage/thumb3.jpg",
                    tag: "BEAT LIVE",
                  },
                ].map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => {
                      setCurrentTab("reels");
                      showToast(`Entering live broadcast: ${stream.title}`);
                    }}
                    className="live-card-item"
                  >
                    <img src={resolveMedia(stream.image)} alt={stream.title} className="live-card-img" />
                    <div className="live-badge-overlay">🔴 {stream.tag}</div>
                    <div className="live-viewers-count">👁️ {stream.viewers}</div>
                    <div className="live-card-details">
                      <h4>{stream.title}</h4>
                      <p>Hosted by {stream.host}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY SOCIAL FEED */}
          {currentTab === "social" && (
            <div className="tab-page-container">
              <div className="tab-header-banner">
                <h2>🤍 Community Social Feed</h2>
                <p>Authentic creator photography, behind-the-scenes culture, and community moments.</p>
              </div>
              <div className="social-feed-grid">
                {posts.map((post) => (
                  <article key={post._id} className="social-post-card">
                    <div className="post-author-row">
                      <img
                        src={resolveMedia(post.userImage)}
                        alt={post.name}
                        className="post-author-avatar"
                      />
                      <div className="post-author-text">
                        <span className="author-name">{post.name}</span>
                        <span className="author-location">{post.location || post.userName}</span>
                      </div>
                      <span className="post-time-badge">{post.time || "Recently"}</span>
                    </div>
                    <div className="post-photo-frame">
                      <img
                        src={resolveMedia(post.postImage?.[0] || post.mainPostImage)}
                        alt="Community Post"
                        className="post-image-element"
                      />
                    </div>
                    <div className="post-body">
                      <p className="post-caption">{post.caption}</p>
                      <div className="post-action-bar">
                        <button
                          onClick={() => showToast("Liked community post!")}
                          className="post-heart-btn"
                        >
                          ❤️ {post.totalLikes || 18} Likes
                        </button>
                        <button
                          onClick={() => {
                            setShowCommentsDrawer(true);
                          }}
                          className="post-comment-btn"
                        >
                          💬 Comments
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOUNDS & MUSIC LIBRARY */}
          {currentTab === "music" && (
            <div className="tab-page-container">
              <div className="tab-header-banner">
                <h2>🎵 WUDAU Sounds & Audio Tracks</h2>
                <p>Discover original African rhythms, Bongo Flava, Singeli, and global collaborations.</p>
              </div>
              <div className="music-tracks-list">
                {[
                  {
                    title: "Mapenzi ya Bongo",
                    singer: "Kassim ft. Jay Temba",
                    time: "0:45",
                    genre: "Bongo Flava",
                    link: "storage/song_bongo_1.mp3",
                    image: "storage/category_bongo.jpg",
                  },
                  {
                    title: "Kinondoni Singeli Rush 300BPM",
                    singer: "Amani Juma",
                    time: "0:35",
                    genre: "Singeli",
                    link: "storage/song_singeli_1.mp3",
                    image: "storage/category_bongo.jpg",
                  },
                  {
                    title: "Serengeti Sunrise Acoustic",
                    singer: "Zuhura Bakari",
                    time: "0:50",
                    genre: "Coastal Acoustic",
                    link: "storage/song_acoustic_tz.mp3",
                    image: "storage/category_nature.jpg",
                  },
                  {
                    title: "Ngorongoro Dawn Chants",
                    singer: "Emmanuel Mollel",
                    time: "0:40",
                    genre: "Traditional Maasai",
                    link: "storage/song_maasai_chant.mp3",
                    image: "storage/category_nature.jpg",
                  },
                  {
                    title: "Durban Sunset Amapiano",
                    singer: "Nolwazi Khumalo",
                    time: "0:55",
                    genre: "Amapiano",
                    link: "storage/song_amapiano.mp3",
                    image: "storage/category_afrobeats.jpg",
                  },
                  {
                    title: "Shibuya Afro Groove",
                    singer: "Kenji Takahashi",
                    time: "0:42",
                    genre: "Tokyo Fusion",
                    link: "storage/song_tokyo_fusion.mp3",
                    image: "storage/category_global.jpg",
                  },
                ].map((track, idx) => (
                  <div key={idx} className="music-track-card">
                    <img src={resolveMedia(track.image)} alt={track.title} className="track-cover-art" />
                    <div className="track-text">
                      <h4>{track.title}</h4>
                      <p>
                        {track.singer} • <span className="genre-tag">{track.genre}</span>
                      </p>
                    </div>
                    <span className="track-duration">{track.time}</span>
                    <button
                      onClick={() => handleToggleMusic(track.link)}
                      className="track-play-btn"
                    >
                      {playingAudioUrl === resolveMedia(track.link) ? "⏸ Pause" : "▶ Play"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DISCOVER TANZANIA SHOWCASE */}
          {currentTab === "explore" && (
            <div className="tab-page-container">
              <div className="tab-header-banner">
                <h2>🦁 Discover Tanzania Unforgettable</h2>
                <p>Explore the natural beauty, cultural rhythm, and untamed spirit of Tanzania.</p>
              </div>
              <div className="explore-destinations-grid">
                {[
                  {
                    name: "Serengeti National Park",
                    subtitle: "Great Migration & Lion Prides",
                    desc: "Witness the greatest wildlife spectacle on Earth across the endless savanna plains.",
                    image: "storage/thumb1.jpg",
                    tag: "#SerengetiMagic",
                  },
                  {
                    name: "Stone Town, Zanzibar",
                    subtitle: "Spice Island & Swahili Soul",
                    desc: "Labyrinthine alleys, acoustic coastal melodies, and sunset dhow sails on turquoise waters.",
                    image: "storage/post4.jpg",
                    tag: "#ZanzibarVibes",
                  },
                  {
                    name: "Mount Kilimanjaro & Meru",
                    subtitle: "The Roof of Africa",
                    desc: "Towering snow peaks meeting vibrant Maasai culture and rhythmic footwork traditions.",
                    image: "storage/thumb5.jpg",
                    tag: "#Kilimanjaro",
                  },
                  {
                    name: "Dar es Salaam & Coco Beach",
                    subtitle: "Street Dance & Singeli Capital",
                    desc: "Electric urban vibes, beach dance battles, and high-energy music production.",
                    image: "storage/thumb2.jpg",
                    tag: "#DarEsSalaam",
                  },
                ].map((item, i) => (
                  <div key={i} className="explore-card">
                    <div className="explore-card-img-wrap">
                      <img src={resolveMedia(item.image)} alt={item.name} />
                      <span className="explore-tag-chip">{item.tag}</span>
                    </div>
                    <div className="explore-card-info">
                      <h3>{item.name}</h3>
                      <h4>{item.subtitle}</h4>
                      <p>{item.desc}</p>
                      <button
                        onClick={() => {
                          setCurrentFilter("tanzania");
                          setCurrentTab("reels");
                        }}
                        className="explore-view-reels-btn"
                      >
                        Watch Reels From Here →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE & WALLET */}
          {currentTab === "profile" && (
            <div className="tab-page-container">
              <div className="profile-dashboard-card">
                <div className="profile-banner-top">
                  <div className="profile-avatar-large">
                    {currentUser?.image ? (
                      <img src={resolveMedia(currentUser.image)} alt="User Avatar" className="profile-avatar-img" />
                    ) : isAuth ? (
                      "👑"
                    ) : (
                      "🌍"
                    )}
                  </div>
                </div>
                <div className="profile-info-body">
                  <h3>{currentUser?.name || (isAuth ? "Authenticated Creator" : "Guest Explorer")}</h3>
                  <p className="profile-handle">{currentUser?.userName || (isAuth ? "@wudau_creator" : "Guest Mode")}</p>
                  <p className="profile-email">{currentUser?.email || "Connect with creators, send gifts, and share reels."}</p>

                  <div className="wallet-balance-card">
                    <div className="wallet-left">
                      <span>💎 WUDAU COINS BALANCE</span>
                      <h2>{currentUser?.coin !== undefined ? currentUser.coin.toLocaleString() : "1,000"} Coins</h2>
                    </div>
                    <button
                      onClick={() => showToast("Coins recharge package ready")}
                      className="primary-gradient-btn"
                    >
                      + Top Up Coins
                    </button>
                  </div>

                  <div className="profile-cta-actions">
                    {isAuth ? (
                      <>
                        {userRole === "admin" && (
                          <Link href="/dashboard" className="full-width-btn mb-2">
                            Open Admin Management Portal
                          </Link>
                        )}
                        <button onClick={handleLogout} className="secondary-outline-btn full-width">
                          Log Out of Account
                        </button>
                      </>
                    ) : (
                      <div className="profile-auth-buttons">
                        <Link href="/login" className="full-width-btn mb-2">
                          Sign In to Your Account
                        </Link>
                        <Link href="/Registration" className="secondary-outline-btn full-width">
                          Create Free Creator Account
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ==================================================================== */}
        {/* MOBILE BOTTOM NAVIGATION BAR (FIXED AT SCREEN BOTTOM)                */}
        {/* ==================================================================== */}
        <nav className="mobile-bottom-nav">
          <button
            onClick={() => setCurrentTab("reels")}
            className={`bottom-nav-item ${currentTab === "reels" ? "active" : ""}`}
          >
            <span className="nav-icon">🎬</span>
            <span className="nav-label">Reels</span>
          </button>

          <button
            onClick={() => setCurrentTab("live")}
            className={`bottom-nav-item ${currentTab === "live" ? "active" : ""}`}
          >
            <span className="nav-icon">🔴</span>
            <span className="nav-label">Live</span>
          </button>

          <button
            onClick={() => {
              if (isAuth) {
                showToast("Opening Reel Creator Studio...");
              } else {
                setAuthModalTitle("Create Reel");
                setShowAuthModal(true);
              }
            }}
            className="bottom-nav-item create-center-btn"
            title="Create Reel"
          >
            <span className="plus-symbol">➕</span>
          </button>

          <button
            onClick={() => setCurrentTab("social")}
            className={`bottom-nav-item ${currentTab === "social" ? "active" : ""}`}
          >
            <span className="nav-icon">🤍</span>
            <span className="nav-label">Feed</span>
          </button>

          <button
            onClick={() => setCurrentTab("profile")}
            className={`bottom-nav-item ${currentTab === "profile" ? "active" : ""}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </nav>

        {/* ==================================================================== */}
        {/* SLIDE-OVER COMMENTS DRAWER                                           */}
        {/* ==================================================================== */}
        {showCommentsDrawer && activeVideo && (
          <div className="comments-drawer-backdrop" onClick={() => setShowCommentsDrawer(false)}>
            <div className="comments-sheet-container" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle-bar"></div>
              <div className="sheet-header-row">
                <h3>Comments ({(commentsMap[activeVideo._id] || commentsMap["default"] || []).length})</h3>
                <button onClick={() => setShowCommentsDrawer(false)} className="sheet-close-btn">
                  ✕
                </button>
              </div>

              <div className="comments-list-scroll">
                {(commentsMap[activeVideo._id] || commentsMap["default"] || []).map((c) => (
                  <div key={c.id} className="comment-bubble-item">
                    <div className="comment-avatar-bubble">
                      {c.userName.slice(1, 3).toUpperCase()}
                    </div>
                    <div className="comment-text-wrap">
                      <div className="comment-author-row">
                        <span className="c-author">{c.userName}</span>
                        <span className="c-time">{c.time}</span>
                      </div>
                      <p className="c-text">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="comment-input-form">
                <input
                  type="text"
                  placeholder="Add an authentic comment... (e.g. Kali sana! 🔥)"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="comment-text-input"
                />
                <button type="submit" className="comment-send-btn">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* GIFT TRAY MODAL                                                      */}
        {/* ==================================================================== */}
        {showGiftModal && (
          <div className="modal-backdrop" onClick={() => setShowGiftModal(false)}>
            <div className="gift-tray-card" onClick={(e) => e.stopPropagation()}>
              <div className="gift-tray-header">
                <h3>🎁 Send Creator Gift</h3>
                <button onClick={() => setShowGiftModal(false)} className="sheet-close-btn">
                  ✕
                </button>
              </div>
              <p className="gift-subhead">Support {activeVideo?.name} with virtual tokens & gifts!</p>
              <div className="gifts-grid">
                {GIFTS_LIST.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSendGift(g)}
                    className="gift-option-card"
                  >
                    <span className="gift-icon">{g.icon}</span>
                    <span className="gift-name">{g.name}</span>
                    <span className="gift-price">{g.coins} Coins</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* QUICK AUTH MODAL                                                     */}
        {/* ==================================================================== */}
        {showAuthModal && (
          <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
            <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="auth-header">
                <h3>{authModalTitle}</h3>
                <button onClick={() => setShowAuthModal(false)} className="sheet-close-btn">
                  ✕
                </button>
              </div>
              <p className="auth-sub">Sign in or create a creator profile to upload videos and interact.</p>
              <div className="auth-actions-group">
                <Link
                  href="/login"
                  onClick={() => setShowAuthModal(false)}
                  className="primary-gradient-btn full-width"
                >
                  Log In to WUDAU
                </Link>
                <Link
                  href="/Registration"
                  onClick={() => setShowAuthModal(false)}
                  className="secondary-outline-btn full-width"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* MODERN RESPONSIVE STYLES (CLEAN, FLUID, NO FAKE MOCKUPS)             */}
      {/* ==================================================================== */}
      <style jsx global>{`
        :root {
          --brand-orange: #ff4b1f;
          --brand-gold: #ff9f00;
          --brand-gradient: linear-gradient(135deg, #ff4b1f 0%, #ff9f00 100%);
          --bg-dark: #090e17;
          --bg-surface: #111827;
          --text-main: #1f2937;
          --text-muted: #6b7280;
          --border-color: #e5e7eb;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }

        body,
        html {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          background-color: #0f172a;
          color: #ffffff;
        }

        .app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          background-color: #0b1120;
          position: relative;
        }

        /* ------------------------------------------------------------------ */
        /* TOP HEADER NAVIGATION                                              */
        /* ------------------------------------------------------------------ */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          gap: 12px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .hamburger-btn:hover {
          background: rgba(255, 255, 255, 0.16);
        }

        .hamburger-bars {
          width: 18px;
          height: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .bar {
          width: 100%;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .hamburger-btn.active .bar.top {
          transform: translateY(6px) rotate(45deg);
        }
        .hamburger-btn.active .bar.mid {
          opacity: 0;
        }
        .hamburger-btn.active .bar.bot {
          transform: translateY(-6px) rotate(-45deg);
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .brand-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--brand-gradient);
          color: #fff;
          font-weight: 900;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(255, 75, 31, 0.4);
        }

        .brand-badge.mini {
          width: 28px;
          height: 28px;
          font-size: 15px;
        }

        .brand-text-block {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.5px;
          background: var(--brand-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-tagline {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #94a3b8;
        }

        /* Filter Carousel */
        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
          overflow: hidden;
          padding: 0 8px;
        }

        .filter-nav {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 0;
        }

        .filter-nav::-webkit-scrollbar {
          display: none;
        }

        .filter-tab {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .filter-tab:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .filter-tab.active {
          background: var(--brand-gradient);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(255, 75, 31, 0.3);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .search-bar-desktop {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 6px 12px;
          gap: 6px;
          width: 200px;
        }

        .search-bar-desktop input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 12px;
          color: #ffffff;
          width: 100%;
        }

        .search-bar-desktop input::placeholder {
          color: #94a3b8;
        }

        .search-clear {
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          font-size: 11px;
        }

        .mobile-search-btn {
          display: none;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 50%;
          width: 34px;
          height: 34px;
          color: #ffffff;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .mobile-search-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #1e293b;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideDown 0.2s ease-out;
        }

        .mobile-search-row input {
          flex: 1;
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          outline: none;
          font-size: 13px;
        }

        .mobile-search-close {
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 16px;
          padding: 6px;
          cursor: pointer;
        }

        /* Auto-scroll toggle pill */
        .auto-scroll-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .auto-scroll-pill.active {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #10b981;
        }

        .scroll-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #64748b;
        }

        .scroll-dot.active {
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        /* Auth and User profile badges */
        .user-profile-pill {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-avatar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 4px 10px;
          cursor: pointer;
          color: #ffffff;
        }

        .user-avatar-img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-initial {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--brand-orange);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-display-name {
          font-size: 12px;
          font-weight: 700;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
          opacity: 0.8;
        }

        .logout-icon-btn:hover {
          opacity: 1;
        }

        .auth-buttons-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-link-btn {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          transition: background 0.15s ease;
        }

        .login-link-btn:hover {
          background: rgba(255, 255, 255, 0.16);
        }

        .signup-link-btn {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 20px;
          background: var(--brand-gradient);
          box-shadow: 0 2px 8px rgba(255, 75, 31, 0.35);
          transition: transform 0.15s ease;
        }

        .signup-link-btn:hover {
          transform: translateY(-1px);
        }

        /* ------------------------------------------------------------------ */
        /* SLIDE-OVER NAVIGATION DRAWER                                       */
        /* ------------------------------------------------------------------ */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 200;
          display: flex;
          animation: fadeIn 0.2s ease-out;
        }

        .nav-drawer {
          width: 320px;
          max-width: 85vw;
          height: 100%;
          background: #111827;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 6px 0 35px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 20px 16px;
          animation: slideRight 0.25s ease-out;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .drawer-title {
          font-size: 17px;
          font-weight: 900;
          color: #ffffff;
        }

        .drawer-tagline {
          font-size: 10px;
          color: #94a3b8;
        }

        .drawer-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .drawer-user-card {
          margin-top: 14px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .drawer-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          overflow: hidden;
        }

        .drawer-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .user-status {
          font-size: 11px;
          color: #94a3b8;
        }

        .drawer-user-quick-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .drawer-quick-btn {
          flex: 1;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }

        .drawer-quick-btn.admin-link {
          background: var(--brand-gradient);
          border: none;
        }

        .drawer-quick-btn.logout-text {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .drawer-auth-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .drawer-auth-btn {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .drawer-auth-btn.login {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .drawer-auth-btn.register {
          background: var(--brand-gradient);
          color: #ffffff;
        }

        .drawer-section {
          margin-top: 18px;
        }

        .drawer-section-title {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .drawer-nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .drawer-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 10px;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .drawer-nav-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .drawer-nav-item.active {
          background: rgba(255, 75, 31, 0.15);
        }

        .drawer-nav-item.active .nav-item-label {
          color: var(--brand-orange);
          font-weight: 800;
        }

        .nav-item-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
        }

        .nav-item-desc {
          display: block;
          font-size: 10px;
          color: #94a3b8;
        }

        .nav-item-arrow {
          color: #475569;
          font-size: 13px;
        }

        .channel-pills-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .channel-pill-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          font-size: 12px;
          color: #e2e8f0;
          font-weight: 600;
          text-align: left;
        }

        .channel-pill-card:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .chan-count {
          font-size: 10px;
          color: #64748b;
        }

        .drawer-lang-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .drawer-lang-chip {
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          cursor: pointer;
        }

        .drawer-lang-chip.active {
          background: var(--brand-gradient);
          color: #ffffff;
          border-color: transparent;
        }

        .drawer-footer {
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .drawer-copyright {
          font-size: 10px;
          color: #64748b;
          line-height: 1.4;
        }

        /* ------------------------------------------------------------------ */
        /* MAIN BODY & REEL PLAYER                                            */
        /* ------------------------------------------------------------------ */
        .content-stage {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 100%;
          min-height: calc(100vh - 60px);
          overflow: hidden;
        }

        .reels-viewport {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .reel-main-layout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          width: 100%;
          height: 100%;
          padding: 16px;
        }

        /* Real Responsive Reel Player Card (NO Fake Phone Bezels) */
        .reel-card-container {
          position: relative;
          width: 440px;
          max-width: 100%;
          height: calc(100vh - 96px);
          max-height: 820px;
          background: #000000;
          border-radius: 20px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .reel-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .buffering-spinner-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          z-index: 25;
          pointer-events: none;
        }

        .buffering-ring {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: var(--brand-orange);
          animation: spin 0.8s linear infinite;
        }

        .double-tap-heart {
          position: absolute;
          font-size: 56px;
          pointer-events: none;
          z-index: 50;
          animation: heartBurst 0.75s ease-out forwards;
        }

        @keyframes heartBurst {
          0% { transform: scale(0.2); opacity: 0; }
          40% { transform: scale(1.3); opacity: 1; }
          70% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.4) translateY(-30px); opacity: 0; }
        }

        .reel-sound-toggle {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          z-index: 30;
          transition: transform 0.15s ease;
        }

        .reel-sound-toggle:hover {
          transform: scale(1.08);
        }

        .reel-paused-indicator {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.25);
          z-index: 24;
          pointer-events: none;
        }

        .play-icon-glow {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.65);
          border: 2px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 24px;
        }

        /* Right Floating Action Rail */
        .reel-actions-rail {
          position: absolute;
          right: 12px;
          bottom: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          z-index: 35;
        }

        .action-avatar-wrap {
          position: relative;
          margin-bottom: 4px;
        }

        .action-creator-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        }

        .avatar-follow-badge {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--brand-orange);
          color: #ffffff;
          border: 1.5px solid #ffffff;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .action-btn-bubble {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #ffffff;
          gap: 2px;
        }

        .bubble-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: transform 0.15s ease;
        }

        .action-btn-bubble:hover .bubble-icon {
          transform: scale(1.1);
        }

        .action-btn-bubble.liked .bubble-icon {
          background: rgba(239, 68, 68, 0.3);
          border-color: #ef4444;
        }

        .action-btn-bubble.gift-bubble .bubble-icon {
          background: rgba(255, 159, 0, 0.3);
          border-color: #ff9f00;
        }

        .action-btn-bubble.auto-bubble.active .bubble-icon {
          background: rgba(16, 185, 129, 0.35);
          border-color: #10b981;
        }

        .bubble-count {
          font-size: 10px;
          font-weight: 700;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }

        .spinning-record {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #111827;
          border: 2px solid #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          margin-top: 4px;
        }

        .spinning-record.spinning {
          animation: spin 3.5s linear infinite;
        }

        .record-center {
          font-size: 14px;
        }

        /* Bottom Metadata Overlay */
        .reel-metadata-vignette {
          position: absolute;
          left: 0;
          right: 70px;
          bottom: 0;
          padding: 20px 16px 20px 16px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%);
          z-index: 30;
          pointer-events: auto;
        }

        .creator-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .creator-display-name {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
        }

        .verified-badge {
          background: #3b82f6;
          color: #fff;
          font-size: 9px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .creator-handle {
          font-size: 12px;
          color: #94a3b8;
        }

        .location-pin-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #ff9f00;
          margin-bottom: 4px;
        }

        .reel-caption-text {
          font-size: 13px;
          color: #f1f5f9;
          line-height: 1.35;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sound-ticker-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
          width: fit-content;
          max-width: 90%;
        }

        .ticker-marquee {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        /* Progress Bar */
        .reel-progress-track {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          z-index: 40;
        }

        .reel-progress-bar {
          height: 100%;
          background: var(--brand-gradient);
          transition: width 0.15s linear;
        }

        .reel-progress-bar.auto-active {
          background: linear-gradient(90deg, #ff4b1f 0%, #10b981 100%);
        }

        /* ------------------------------------------------------------------ */
        /* DESKTOP COMPANION PANEL (SIDE CONTROLS BESIDE PLAYER)               */
        /* ------------------------------------------------------------------ */
        .desktop-companion-panel {
          width: 280px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .reel-nav-card {
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .nav-card-title {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
        }

        .nav-arrow-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .arrow-nav-btn {
          flex: 1;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .arrow-nav-btn:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .reel-counter-badge {
          font-size: 12px;
          font-weight: 800;
          color: #cbd5e1;
          padding: 0 4px;
        }

        .nav-hint-text {
          font-size: 10px;
          color: #64748b;
          margin-top: 8px;
          text-align: center;
        }

        .companion-setting-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 12px 14px;
        }

        .setting-card-title {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .setting-card-sub {
          display: block;
          font-size: 10px;
          color: #94a3b8;
        }

        .comp-toggle-switch {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: #475569;
          border: none;
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }

        .comp-toggle-switch.active {
          background: #10b981;
        }

        .comp-switch-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          transition: transform 0.2s ease;
        }

        .comp-toggle-switch.active .comp-switch-slider {
          transform: translateX(20px);
        }

        .companion-creator-card {
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .comp-creator-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .comp-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--brand-orange);
        }

        .comp-name {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
        }

        .comp-handle {
          font-size: 11px;
          color: #94a3b8;
        }

        .comp-stats-grid {
          display: flex;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 0;
          margin-bottom: 12px;
        }

        .comp-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .comp-stat strong {
          font-size: 13px;
          color: #ffffff;
        }

        .comp-stat span {
          font-size: 10px;
          color: #94a3b8;
        }

        .comp-follow-btn {
          width: 100%;
          padding: 9px;
          border-radius: 10px;
          background: var(--brand-gradient);
          color: #ffffff;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .companion-sound-card {
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px;
        }

        .sound-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .sound-card-header h5 {
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
        }

        .sound-card-header p {
          font-size: 10px;
          color: #94a3b8;
        }

        .sound-play-preview-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        /* ------------------------------------------------------------------ */
        /* MOBILE BOTTOM NAVIGATION BAR                                       */
        /* ------------------------------------------------------------------ */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(15, 23, 42, 0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 95;
          align-items: center;
          justify-content: space-around;
          padding: 0 4px env(safe-area-inset-bottom, 0px) 4px;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          gap: 2px;
          flex: 1;
        }

        .bottom-nav-item.active {
          color: var(--brand-orange);
        }

        .nav-icon {
          font-size: 18px;
        }

        .nav-label {
          font-size: 10px;
          font-weight: 700;
        }

        .bottom-nav-item.create-center-btn {
          flex: 0 0 46px;
        }

        .plus-symbol {
          width: 44px;
          height: 32px;
          border-radius: 12px;
          background: var(--brand-gradient);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          box-shadow: 0 2px 10px rgba(255, 75, 31, 0.4);
        }

        /* ------------------------------------------------------------------ */
        /* TAB PAGES (LIVE, SOCIAL, MUSIC, EXPLORE, PROFILE)                  */
        /* ------------------------------------------------------------------ */
        .tab-page-container {
          max-width: 960px;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 20px 16px 80px 16px;
        }

        .tab-header-banner {
          margin-bottom: 20px;
          text-align: left;
        }

        .tab-header-banner h2 {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }

        .tab-header-banner p {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .live-streams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .live-card-item {
          position: relative;
          height: 320px;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }

        .live-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .live-card-item:hover .live-card-img {
          transform: scale(1.05);
        }

        .live-badge-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ef4444;
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 800;
        }

        .live-viewers-count {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
        }

        .live-card-details {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, transparent 100%);
          color: #fff;
        }

        .live-card-details h4 {
          font-size: 14px;
          font-weight: 700;
        }

        .live-card-details p {
          font-size: 11px;
          opacity: 0.8;
          margin-top: 2px;
        }

        /* Social Feed Cards */
        .social-feed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .social-post-card {
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .post-author-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
        }

        .post-author-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .post-author-text {
          flex: 1;
        }

        .author-name {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .author-location {
          display: block;
          font-size: 11px;
          color: #94a3b8;
        }

        .post-time-badge {
          font-size: 10px;
          color: #64748b;
        }

        .post-photo-frame {
          width: 100%;
          height: 240px;
          background: #000;
        }

        .post-image-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .post-body {
          padding: 12px;
        }

        .post-caption {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .post-action-bar {
          display: flex;
          gap: 12px;
        }

        .post-heart-btn,
        .post-comment-btn {
          border: none;
          background: transparent;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          cursor: pointer;
        }

        /* Music Track Cards */
        .music-tracks-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .music-track-card {
          display: flex;
          align-items: center;
          background: #1e293b;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 14px;
          gap: 12px;
        }

        .track-cover-art {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
        }

        .track-text {
          flex: 1;
        }

        .track-text h4 {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .track-text p {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .genre-tag {
          color: var(--brand-orange);
          font-weight: 600;
        }

        .track-duration {
          font-size: 11px;
          color: #64748b;
        }

        .track-play-btn {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
        }

        /* Explore Grid */
        .explore-destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .explore-card {
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .explore-card-img-wrap {
          position: relative;
          height: 180px;
          background: #000;
        }

        .explore-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .explore-tag-chip {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
        }

        .explore-card-info {
          padding: 14px;
        }

        .explore-card-info h3 {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
        }

        .explore-card-info h4 {
          font-size: 11px;
          font-weight: 700;
          color: var(--brand-orange);
          margin: 2px 0 6px 0;
        }

        .explore-card-info p {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.4;
          margin-bottom: 10px;
        }

        .explore-view-reels-btn {
          border: none;
          background: transparent;
          color: var(--brand-orange);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        /* Profile Tab Card */
        .profile-dashboard-card {
          background: #1e293b;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          max-width: 500px;
          margin: 0 auto;
        }

        .profile-banner-top {
          height: 120px;
          background: var(--brand-gradient);
          position: relative;
          display: flex;
          justify-content: center;
        }

        .profile-avatar-large {
          position: absolute;
          bottom: -32px;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #111827;
          border: 3px solid #111827;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          overflow: hidden;
        }

        .profile-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info-body {
          padding: 44px 20px 24px 20px;
          text-align: center;
        }

        .profile-handle {
          font-size: 12px;
          color: var(--brand-orange);
          font-weight: 700;
          margin-top: 2px;
        }

        .profile-email {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .wallet-balance-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 14px;
          margin: 20px 0;
          text-align: left;
        }

        .wallet-left span {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: #94a3b8;
        }

        .wallet-left h2 {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          margin-top: 2px;
        }

        .profile-cta-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Comments Bottom Sheet */
        .comments-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 210;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .comments-sheet-container {
          width: 100%;
          max-width: 440px;
          max-height: 70vh;
          background: #1e293b;
          border-radius: 24px 24px 0 0;
          display: flex;
          flex-direction: column;
          padding: 16px 18px 24px 18px;
          animation: slideUp 0.25s ease-out;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sheet-handle-bar {
          width: 40px;
          height: 4px;
          border-radius: 2px;
          background: #475569;
          margin: 0 auto 12px auto;
        }

        .sheet-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .sheet-close-btn {
          border: none;
          background: rgba(255, 255, 255, 0.1);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          color: #ffffff;
          cursor: pointer;
        }

        .comments-list-scroll {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 44vh;
          padding-right: 4px;
        }

        .comment-bubble-item {
          display: flex;
          gap: 10px;
        }

        .comment-avatar-bubble {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--brand-orange);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .comment-text-wrap {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 8px 12px;
        }

        .comment-author-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .c-author {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
        }

        .c-time {
          font-size: 9px;
          color: #64748b;
        }

        .c-text {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.35;
        }

        .comment-input-form {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .comment-text-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          outline: none;
          font-size: 12px;
        }

        .comment-send-btn {
          padding: 8px 18px;
          border-radius: 20px;
          background: var(--brand-gradient);
          color: #fff;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Modal Overlays */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 220;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .gift-tray-card,
        .auth-modal-card {
          width: 100%;
          max-width: 400px;
          background: #1e293b;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: scaleUp 0.2s ease-out;
        }

        .gift-tray-header,
        .auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .gift-subhead,
        .auth-sub {
          font-size: 12px;
          color: #94a3b8;
          margin: 4px 0 16px 0;
        }

        .gifts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .gift-option-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          color: #ffffff;
        }

        .gift-option-card:hover {
          border-color: var(--brand-orange);
          background: rgba(255, 75, 31, 0.15);
          transform: translateY(-2px);
        }

        .gift-icon {
          font-size: 26px;
        }

        .gift-name {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
        }

        .gift-price {
          font-size: 10px;
          color: var(--brand-gold);
          font-weight: 800;
        }

        .auth-actions-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Buttons & Utility Styles */
        .primary-gradient-btn {
          background: var(--brand-gradient);
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(255, 75, 31, 0.35);
        }

        .secondary-outline-btn {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }

        .full-width {
          width: 100%;
        }

        .full-width-btn {
          display: block;
          width: 100%;
          background: var(--brand-gradient);
          color: #fff;
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          text-align: center;
        }

        .empty-state-card {
          text-align: center;
          padding: 40px 20px;
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-state-card h3 {
          margin: 14px 0 6px 0;
          font-size: 18px;
        }

        .empty-state-card p {
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 16px;
        }

        /* Toast Popup */
        .wudau-toast {
          position: fixed;
          top: 72px;
          left: 50%;
          transform: translateX(-50%);
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 24px;
          font-size: 12px;
          font-weight: 700;
          z-index: 300;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
          animation: dropIn 0.25s ease-out;
        }

        /* ------------------------------------------------------------------ */
        /* RESPONSIVE LAYOUT & MOBILE FITNESS                                 */
        /* ------------------------------------------------------------------ */
        @media (max-width: 768px) {
          .site-header {
            padding: 0 10px;
            height: 56px;
          }

          .brand-tagline {
            display: none;
          }

          .search-bar-desktop {
            display: none;
          }

          .mobile-search-btn {
            display: flex;
          }

          .desktop-companion-panel {
            display: none;
          }

          .content-stage {
            min-height: calc(100dvh - 56px - 60px);
            padding-bottom: 60px;
          }

          .reel-main-layout {
            padding: 0;
            width: 100%;
            height: calc(100dvh - 56px - 60px);
          }

          .reel-card-container {
            width: 100vw;
            height: 100%;
            max-height: none;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }

          .reel-actions-rail {
            bottom: 70px;
            right: 8px;
            gap: 10px;
          }

          .reel-metadata-vignette {
            right: 64px;
            padding: 16px 12px 14px 12px;
          }

          .mobile-bottom-nav {
            display: flex;
          }

          .tab-page-container {
            padding: 16px 12px 76px 12px;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes dropIn {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Server-Side Props for Instant First Paint
export async function getServerSideProps() {
  try {
    const apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_BASE_URL || baseURL;
    const cleanBase = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;
    const [videosRes, postsRes] = await Promise.all([
      fetch(`${cleanBase}client/video/getAllVideos?start=1&limit=30`, {
        headers: { key: secretKey },
      })
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
      fetch(`${cleanBase}client/post/getAllPosts?start=1&limit=30`, {
        headers: { key: secretKey },
      })
        .then((r) => r.json())
        .catch(() => ({ post: [] })),
    ]);

    const videoList: VideoItem[] = videosRes.data || [];

    // Prioritize Tanzanian & African creators first
    videoList.sort((a, b) => {
      const aIsTz = (a.userName || "").includes("_tz") || (a.userName || "").includes("_znz");
      const bIsTz = (b.userName || "").includes("_tz") || (b.userName || "").includes("_znz");
      if (aIsTz && !bIsTz) return -1;
      if (!aIsTz && bIsTz) return 1;
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
