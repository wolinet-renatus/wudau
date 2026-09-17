import React, { useEffect, useState, useMemo, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
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
  // Navigation & Viewport Modes
  const [currentTab, setCurrentTab] = useState<"reels" | "live" | "social" | "music" | "explore" | "profile">("reels");
  const [viewMode, setViewMode] = useState<"phone" | "wide">("phone");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("all");
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

  // Auto-Scrolling & Reel Playback Progress
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  // Social Interactions & Modals
  const [likedReelIds, setLikedReelIds] = useState<{ [id: string]: boolean }>({});
  const [reelLikesCount, setReelLikesCount] = useState<{ [id: string]: number }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState<boolean>(false);
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalTitle, setAuthModalTitle] = useState<string>("");
  const [commentInput, setCommentInput] = useState<string>("");

  // Music Preview in Sound Tab
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Comments map initialized with realistic Swahili and English commentary
  const [commentsMap, setCommentsMap] = useState<{ [videoId: string]: CommentItem[] }>({
    default: [
      { id: "c1", userName: "@jay_bongo", text: "Hii ni kali sana bro! Dar es Salaam stand up! 🔥🇹🇿", time: "2m ago" },
      { id: "c2", userName: "@zuhura_znz", text: "Mambo ni moto sana, Zanzibar tuko pamoja! 🌴✨", time: "8m ago" },
      { id: "c3", userName: "@rehema_wildlife", text: "Unbelievable nature, Serengeti is truly the pride of Africa 🦁❤️", time: "15m ago" },
      { id: "c4", userName: "@kenji_tokyo", text: "Greetings from Tokyo! Absolutely love the energy of WUDAU 🇯🇵🇹🇿", time: "25m ago" },
      { id: "c5", userName: "@mollel_arusha", text: "Ngoma inabamba mbaya! Saluti tele kutoka Arusha 🏔️", time: "1h ago" },
    ],
  });

  // Client-side authentication check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      setIsAuth(!!token);
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
        console.warn("Client data fetch error, using SSR data:", err);
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
      }
      if (currentTab === "reels" && !showCommentsDrawer && !showGiftModal && !showAuthModal) {
        if (e.key === "ArrowDown") {
          handleNextReel();
        } else if (e.key === "ArrowUp") {
          handlePrevReel();
        } else if (e.key === " " || e.key === "k") {
          e.preventDefault();
          togglePlay();
        } else if (e.key === "m") {
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
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
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
    setTimeout(() => setToastMessage(null), 3500);
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
      if (isAutoScroll && target.duration > 1 && (target.duration - target.currentTime) < 0.25) {
        handleNextReel();
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;
    if (Math.abs(e.deltaY) > 25) {
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
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNextReel(); // Swiped up -> next reel
      } else {
        handlePrevReel(); // Swiped down -> prev reel
      }
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
      navigator.clipboard?.writeText(url);
      showToast("🔗 Reel link copied to clipboard!");
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
    const newComment: CommentItem = {
      id: "c_" + Date.now(),
      userName: "@You (Visitor)",
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

      {/* MAIN CONTAINER */}
      <div className="app-viewport">
        {/* ==================================================================== */}
        {/* TOP MENU NAVIGATION BAR (OPEN & CLOSE NAVIGATION ON TOP)            */}
        {/* ==================================================================== */}
        <header className="top-nav-bar">
          <div className="top-nav-left">
            {/* Menu Open/Close Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`menu-hamburger-btn ${isMenuOpen ? "active" : ""}`}
              aria-label="Toggle Menu"
              title="Open Navigation Menu"
            >
              <div className="hamburger-box">
                <span className="ham-line top"></span>
                <span className="ham-line mid"></span>
                <span className="ham-line bot"></span>
              </div>
              <span className="menu-btn-text">Menu</span>
            </button>

            {/* Brand Logo & Tag */}
            <Link href="/" className="brand-logo-wrap">
              <div className="brand-icon-badge">W</div>
              <div className="brand-name-wrap">
                <span className="brand-title">WUDAU</span>
                <span className="brand-sub">RHYTHM & TALENT</span>
              </div>
            </Link>
          </div>

          {/* Quick Filter Categories (Tanzania, Serengeti, Bongo, Global) */}
          <div className="top-nav-center">
            <div className="filter-chips-scroll">
              {[
                { id: "all", label: "🔥 All" },
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
                  className={`filter-chip ${currentFilter === chip.id ? "active" : ""}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Action Tools: Search, View Mode, Language, and Login */}
          <div className="top-nav-right">
            {/* Search Input (Expandable) */}
            <div className="search-pill">
              <span className="search-icon">🔍</span>
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
                <button onClick={() => setSearchQuery("")} className="search-clear-btn">
                  ✕
                </button>
              )}
            </div>

            {/* Auto-Scroll Toggle Button */}
            <button
              onClick={() => {
                setIsAutoScroll(!isAutoScroll);
                showToast(!isAutoScroll ? "🔄 Auto-Scroll: ON (Next reel on finish)" : "🔁 Auto-Scroll: OFF (Video loops)");
              }}
              className={`auto-scroll-nav-pill ${isAutoScroll ? "active" : ""}`}
              title={isAutoScroll ? "Auto-Scroll: Enabled (Click to switch to loop mode)" : "Auto-Scroll: Disabled (Click to enable auto-advance)"}
            >
              <span className={`auto-scroll-dot ${isAutoScroll ? "active" : ""}`}></span>
              <span className="auto-scroll-text">Auto: <strong>{isAutoScroll ? "ON" : "OFF"}</strong></span>
            </button>

            {/* Viewport Fitness Toggle (Desktop/Tablet: Native Phone vs Wide) */}
            <div className="view-mode-toggle d-none-mobile">
              <button
                onClick={() => setViewMode("phone")}
                className={`mode-btn ${viewMode === "phone" ? "active" : ""}`}
                title="Native Smartphone Mockup View"
              >
                📱 Phone
              </button>
              <button
                onClick={() => setViewMode("wide")}
                className={`mode-btn ${viewMode === "wide" ? "active" : ""}`}
                title="Expanded Wide Studio View"
              >
                💻 Wide
              </button>
            </div>

            {/* Language Dropdown */}
            <div className="lang-dropdown-wrap">
              <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className="lang-btn">
                🌐 {language} <span className="caret">▾</span>
              </button>
              {showLanguageDropdown && (
                <div className="lang-menu">
                  {["English", "Swahili (Kiswahili) 🇹🇿", "Français", "中文 (Chinese)"].map((lang) => (
                    <div
                      key={lang}
                      onClick={() => {
                        setLanguage(lang.split(" ")[0]);
                        setShowLanguageDropdown(false);
                        showToast(`Language set to ${lang.split(" ")[0]}`);
                      }}
                      className={`lang-item ${language === lang.split(" ")[0] ? "selected" : ""}`}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Login / Dashboard Action */}
            <Link href={isAuth ? "/admin/dashboard" : "/login"} className="header-login-btn">
              <span>👤</span>
              <span>{isAuth ? "Dashboard" : "Sign In"}</span>
            </Link>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* SLIDE-OVER NAVIGATION DRAWER (OPEN & CLOSE OPTIONS)                 */}
        {/* ==================================================================== */}
        {isMenuOpen && (
          <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}>
            <aside className="nav-drawer" onClick={(e) => e.stopPropagation()}>
              {/* Drawer Top Bar */}
              <div className="drawer-header">
                <div className="drawer-brand">
                  <div className="brand-icon-badge mini">W</div>
                  <div>
                    <h3 className="drawer-title">{projectName}</h3>
                    <p className="drawer-tagline">Where Rhythm Meets Potential</p>
                  </div>
                </div>
                {/* Close Button */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="drawer-close-btn"
                  aria-label="Close Menu"
                  title="Close Navigation"
                >
                  ✕
                </button>
              </div>

              {/* Guest / User Profile Box */}
              <div className="drawer-user-card">
                <div className="drawer-user-info">
                  <div className="user-avatar-circle">
                    {isAuth ? "👑" : "🌍"}
                  </div>
                  <div>
                    <h4 className="user-name">{isAuth ? "WUDAU Creator" : "Welcome to WUDAU"}</h4>
                    <p className="user-status">{isAuth ? "Authenticated Creator" : "Guest Explorer • Tanzania & Global"}</p>
                  </div>
                </div>
                <Link
                  href={isAuth ? "/admin/dashboard" : "/login"}
                  onClick={() => setIsMenuOpen(false)}
                  className="drawer-auth-cta"
                >
                  {isAuth ? "Go to Dashboard →" : "Sign In / Register →"}
                </Link>
              </div>

              {/* Primary Feed Navigation */}
              <div className="drawer-section">
                <span className="drawer-section-title">EXPLORE CONTENT</span>
                <nav className="drawer-nav-list">
                  {[
                    { id: "reels", label: "🎬 Reels & Shorts", desc: "Tanzanian & African Video Feed" },
                    { id: "live", label: "🔴 Live Streams", desc: "Coco Beach & Stone Town Stages" },
                    { id: "social", label: "🤍 Community Social Feed", desc: "Photos & Stories from Creators" },
                    { id: "music", label: "🎵 Sound & Music Library", desc: "Bongo Flava, Singeli, Serengeti Audio" },
                    { id: "explore", label: "🦁 Discover Tanzania", desc: "#TanzaniaUnforgettable Showcase" },
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

              {/* Feed Playback Settings */}
              <div className="drawer-section">
                <span className="drawer-section-title">FEED SETTINGS</span>
                <div className="drawer-setting-row">
                  <div className="drawer-setting-text">
                    <span className="setting-title">🔄 Auto-Scroll Reels</span>
                    <span className="setting-desc">{isAutoScroll ? "Advances automatically when video ends" : "Current reel loops continuously"}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsAutoScroll(!isAutoScroll);
                      showToast(!isAutoScroll ? "🔄 Auto-Scroll: ON" : "🔁 Auto-Scroll: OFF (Loop Mode)");
                    }}
                    className={`drawer-switch-btn ${isAutoScroll ? "active" : ""}`}
                    aria-label="Toggle Auto-Scroll"
                  >
                    <span className="switch-knob"></span>
                  </button>
                </div>
              </div>

              {/* Quick Actions & Links */}
              <div className="drawer-section">
                <span className="drawer-section-title">QUICK ACTIONS</span>
                <div className="quick-action-row">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setAuthModalTitle("Upload Reel");
                      setShowAuthModal(true);
                    }}
                    className="action-btn-outline"
                  >
                    ➕ Upload Reel
                  </button>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="action-btn-outline"
                  >
                    ⚙️ Admin Portal
                  </Link>
                </div>
              </div>

              {/* Mobile App Download Badges */}
              <div className="drawer-footer">
                <span className="drawer-footer-title">GET WUDAU FOR MOBILE</span>
                <div className="app-store-badges">
                  <a
                    href="#android"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("Android APK download available in /app directory");
                    }}
                    className="store-badge-card"
                  >
                    <span>🤖</span>
                    <div>
                      <span className="badge-small">GET IT ON</span>
                      <span className="badge-bold">Google Play</span>
                    </div>
                  </a>
                  <a
                    href="#ios"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("iOS app package available in /app directory");
                    }}
                    className="store-badge-card"
                  >
                    <span>🍎</span>
                    <div>
                      <span className="badge-small">DOWNLOAD ON</span>
                      <span className="badge-bold">App Store</span>
                    </div>
                  </a>
                </div>
                <p className="drawer-copyright">
                  © 2026 WUDAU Technologies • Built for Tanzania & Global Creators
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MAIN BODY: NATIVE FITNESS DEVICE STAGE                               */}
        {/* ==================================================================== */}
        <main className={`main-stage ${viewMode === "wide" ? "wide-layout" : "phone-layout"}`}>
          {/* TAB 1: REELS EXPERIENCE (WELL-FITTED NATIVE REEL VIEWER) */}
          {currentTab === "reels" && (
            <div className="reels-stage-wrapper">
              {filteredVideos.length === 0 ? (
                <div className="empty-state-card">
                  <span style={{ fontSize: "44px" }}>🔍</span>
                  <h3>No reels found for this category</h3>
                  <p>Try clearing your filter or searching for another hashtag.</p>
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
                  <div className="stage-device-container">
                    {/* Flagship Native Phone Mockup Frame */}
                    <div className="phone-device-frame">
                      {/* Top Phone Speaker & Dynamic Island */}
                      <div className="device-status-notch">
                        <span className="status-clock">09:41</span>
                        <div className="dynamic-island">
                          <span className="dynamic-indicator"></span>
                        </div>
                        <div className="status-icons">
                          <span>5G</span>
                          <span>📶</span>
                          <span>🔋</span>
                        </div>
                      </div>

                      {/* Video Player Box with Wheel and Swipe Gestures */}
                      <div
                        className="reel-player-box"
                        onClick={togglePlay}
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                      >
                        <video
                          ref={videoRef}
                          key={activeVideo._id}
                          src={resolveMedia(activeVideo.videoUrl)}
                          poster={resolveMedia(activeVideo.videoImage)}
                          autoPlay
                          loop={!isAutoScroll}
                          muted={isMuted}
                          playsInline
                          onEnded={handleVideoEnded}
                          onTimeUpdate={handleTimeUpdate}
                          className="reel-video-element"
                        />

                        {/* Sound Mute/Unmute Floating Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                            showToast(isMuted ? "🔊 Sound Enabled" : "🔇 Muted");
                          }}
                          className="reel-sound-btn"
                          aria-label="Toggle Sound"
                        >
                          {isMuted ? "🔇" : "🔊"}
                        </button>

                        {/* Centered Play/Pause Indicator */}
                        {!isPlaying && (
                          <div className="reel-play-indicator">
                            <div className="play-icon-glow">▶</div>
                          </div>
                        )}

                        {/* Top Overlay Badge (Culture Tag) */}
                        <div className="reel-top-tag">
                          <span>🇹🇿 WUDAU LIVE REELS</span>
                        </div>

                        {/* Right Floating Actions Column (Like, Comment, Gift, Share, Sound) */}
                        <div className="reel-actions-column" onClick={(e) => e.stopPropagation()}>
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
                            >
                              +
                            </button>
                          </div>

                          {/* Like Button */}
                          <button
                            onClick={(e) => handleLike(activeVideo._id, e)}
                            className={`action-btn-bubble ${likedReelIds[activeVideo._id] ? "liked" : ""}`}
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
                          >
                            <span className="bubble-icon">🎁</span>
                            <span className="bubble-count">Gift</span>
                          </button>

                          {/* Share Button */}
                          <button
                            onClick={(e) => handleShare(activeVideo, e)}
                            className="action-btn-bubble"
                          >
                            <span className="bubble-icon">↗️</span>
                            <span className="bubble-count">{activeVideo.shareCount || 0}</span>
                          </button>

                          {/* Auto-Scroll Toggle Bubble */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAutoScroll(!isAutoScroll);
                              showToast(!isAutoScroll ? "🔄 Auto-Scroll ON (Advances automatically)" : "🔁 Auto-Scroll OFF (Loop Mode)");
                            }}
                            className={`action-btn-bubble auto-scroll-bubble ${isAutoScroll ? "active" : ""}`}
                            title={isAutoScroll ? "Auto-Scroll: ON (Click for loop mode)" : "Auto-Scroll: OFF (Click for auto-scroll)"}
                          >
                            <span className="bubble-icon">{isAutoScroll ? "🔄" : "🔁"}</span>
                            <span className="bubble-count">{isAutoScroll ? "Auto" : "Loop"}</span>
                          </button>

                          {/* Rotating Vinyl Record */}
                          <div
                            onClick={() => handleToggleMusic(activeVideo.songLink)}
                            className={`spinning-record ${isPlaying ? "spinning" : ""}`}
                            title={activeVideo.songTitle || "Original Soundtrack"}
                          >
                            <div className="record-center">🎵</div>
                          </div>
                        </div>

                        {/* Bottom Metadata Overlay */}
                        <div className="reel-metadata-vignette" onClick={(e) => e.stopPropagation()}>
                          <div className="creator-meta-row">
                            <span className="creator-display-name">{activeVideo.name}</span>
                            {activeVideo.isVerified && <span className="verified-badge">✓</span>}
                            <span className="creator-handle">{activeVideo.userName}</span>
                          </div>

                          {/* Geolocation Tag */}
                          {activeVideo.location && (
                            <div className="location-pin-row">
                              <span>📍</span>
                              <span>{activeVideo.location}</span>
                            </div>
                          )}

                          {/* Caption & Hashtags */}
                          <p className="reel-caption-text">{activeVideo.caption}</p>

                          {/* Sound Ticker Row */}
                          <div className="sound-ticker-row">
                            <span className="ticker-icon">🎵</span>
                            <div className="ticker-marquee">
                              <span>
                                {activeVideo.songTitle || "Original Sound"} • {activeVideo.singerName || activeVideo.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Auto-Scroll Playback Progress Bar */}
                        <div
                          className="reel-progress-track"
                          title={`Auto-Scroll: ${isAutoScroll ? "ON (Advances automatically at 100%)" : "OFF (Loop Mode)"}`}
                        >
                          <div
                            className={`reel-progress-bar ${isAutoScroll ? "auto-active" : ""}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        {/* Native Bottom Navigation Bar Inside Mobile Mockup */}
                        <div className="device-bottom-nav">
                          <button
                            onClick={() => setCurrentTab("reels")}
                            className="dev-nav-btn active"
                          >
                            <span>▶</span>
                            <span>Reels</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab("live")}
                            className="dev-nav-btn"
                          >
                            <span>🔴</span>
                            <span>Live</span>
                          </button>
                          <button
                            onClick={() => {
                              setAuthModalTitle("Create Reel");
                              setShowAuthModal(true);
                            }}
                            className="dev-nav-btn create-btn"
                          >
                            <span>➕</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab("social")}
                            className="dev-nav-btn"
                          >
                            <span>🤍</span>
                            <span>Feed</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab("profile")}
                            className="dev-nav-btn"
                          >
                            <span>👤</span>
                            <span>Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Side Companion Controls (Only visible on wide/tablet screens) */}
                    <aside className="desktop-companion-controls">
                      {/* Auto-Scroll Desktop Switch Card */}
                      <div className="companion-autoscroll-card">
                        <div className="autoscroll-card-left">
                          <span className="autoscroll-icon-badge">{isAutoScroll ? "🔄" : "🔁"}</span>
                          <div>
                            <span className="autoscroll-title">Auto-Scroll</span>
                            <span className="autoscroll-desc">{isAutoScroll ? "Auto-advancing" : "Looping reel"}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsAutoScroll(!isAutoScroll);
                            showToast(!isAutoScroll ? "🔄 Auto-Scroll: ON" : "🔁 Auto-Scroll: OFF (Loop Mode)");
                          }}
                          className={`comp-toggle-switch ${isAutoScroll ? "active" : ""}`}
                          title="Toggle Auto-Scroll"
                          aria-label="Toggle Auto-Scroll"
                        >
                          <span className="comp-switch-slider"></span>
                        </button>
                      </div>

                      {/* Up/Down Reel Switcher */}
                      <div className="reel-arrow-controls">
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

                      {/* Creator Spotlight Box */}
                      <div className="companion-creator-box">
                        <div className="comp-avatar-row">
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
                            {playingAudioUrl === resolveMedia(activeVideo.songLink) ? "⏸ Stop Audio" : "▶ Play Soundtrack"}
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
                      <p>{track.singer} • <span className="genre-tag">{track.genre}</span></p>
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
                    {isAuth ? "👑" : "🌍"}
                  </div>
                </div>
                <div className="profile-info-body">
                  <h3>{isAuth ? "WUDAU Creator" : "Guest Explorer"}</h3>
                  <p>{isAuth ? "creator@wudau.tz" : "Connect with creators, send gifts, and upload reels."}</p>
                  
                  <div className="wallet-balance-card">
                    <div className="wallet-left">
                      <span>💎 WUDAU COINS BALANCE</span>
                      <h2>1,500 Coins</h2>
                    </div>
                    <button
                      onClick={() => showToast("Recharge coins package via Flutterwave / Stripe")}
                      className="primary-gradient-btn"
                    >
                      + Top Up Coins
                    </button>
                  </div>

                  <div className="profile-cta-actions">
                    <Link href={isAuth ? "/admin/dashboard" : "/login"} className="full-width-btn">
                      {isAuth ? "Open Admin Management Portal" : "Sign In to Your Account"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ==================================================================== */}
        {/* SLIDE-OVER COMMENTS DRAWER (NATIVE MOBILE BOTTOM-SHEET / MODAL)      */}
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

              {/* Comments Feed */}
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

              {/* Add Comment Input Bar */}
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
        {/* QUICK AUTH / UPLOAD MODAL                                            */}
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
                  Log In with Email / ID
                </Link>
                <Link
                  href="/Registration"
                  onClick={() => setShowAuthModal(false)}
                  className="secondary-outline-btn full-width"
                >
                  Create New Creator Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* GLOBAL HIGH-PERFORMANCE RESPONSIVE & WELL-FITTED NATIVE STYLES       */}
      {/* ==================================================================== */}
      <style jsx global>{`
        :root {
          --brand-orange: #ff4b1f;
          --brand-gold: #ff9f00;
          --brand-gradient: linear-gradient(135deg, #ff4b1f 0%, #ff9f00 100%);
          --bg-dark: #0f172a;
          --bg-card: #1e293b;
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

        body, html {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          background-color: #f8fafc;
          color: var(--text-main);
        }

        /* App Viewport Root */
        .app-viewport {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          position: relative;
        }

        /* ------------------------------------------------------------------ */
        /* TOP NAVIGATION BAR                                                 */
        /* ------------------------------------------------------------------ */
        .top-nav-bar {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(229, 231, 235, 0.8);
          gap: 12px;
        }

        .top-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Menu Hamburger Button with Open/Close Animation */
        .menu-hamburger-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-hamburger-btn:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .hamburger-box {
          width: 18px;
          height: 14px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .ham-line {
          width: 100%;
          height: 2px;
          background-color: #1f2937;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .menu-hamburger-btn.active .ham-line.top {
          transform: translateY(6px) rotate(45deg);
        }
        .menu-hamburger-btn.active .ham-line.mid {
          opacity: 0;
        }
        .menu-hamburger-btn.active .ham-line.bot {
          transform: translateY(-6px) rotate(-45deg);
        }

        .menu-btn-text {
          font-size: 13px;
          font-weight: 700;
          color: #1f2937;
        }

        /* Brand Logo */
        .brand-logo-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .brand-icon-badge {
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
          box-shadow: 0 4px 10px rgba(255, 75, 31, 0.35);
        }

        .brand-icon-badge.mini {
          width: 28px;
          height: 28px;
          font-size: 15px;
        }

        .brand-name-wrap {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: var(--brand-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-sub {
          font-size: 8px;
          font-weight: 800;
          color: #9ca3af;
          letter-spacing: 0.8px;
        }

        /* Center Filter Chips */
        .top-nav-center {
          display: flex;
          align-items: center;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          max-width: 460px;
        }
        .top-nav-center::-webkit-scrollbar {
          display: none;
        }

        .filter-chips-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-chip {
          white-space: nowrap;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-chip:hover {
          background: #f3f4f6;
        }

        .filter-chip.active {
          background: var(--brand-gradient);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 2px 8px rgba(255, 75, 31, 0.3);
        }

        /* Right Nav Tools */
        .top-nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .search-pill {
          display: flex;
          align-items: center;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 6px 12px;
          gap: 6px;
          width: 220px;
        }

        .search-pill input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 12px;
          color: #1f2937;
          width: 100%;
        }

        .search-clear-btn {
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          font-size: 11px;
        }

        /* Top Navigation Auto-Scroll Pill */
        .auto-scroll-nav-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .auto-scroll-nav-pill:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .auto-scroll-nav-pill.active {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #065f46;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);
        }

        .auto-scroll-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #94a3b8;
          transition: all 0.2s ease;
        }

        .auto-scroll-dot.active {
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Viewport Mode Switcher */
        .view-mode-toggle {
          display: flex;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 2px;
          border: 1px solid #e5e7eb;
        }

        .mode-btn {
          border: none;
          background: transparent;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
          color: #6b7280;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mode-btn.active {
          background: #ffffff;
          color: #1f2937;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Language Menu */
        .lang-dropdown-wrap {
          position: relative;
        }

        .lang-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .lang-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 6px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          min-width: 160px;
          z-index: 120;
          overflow: hidden;
        }

        .lang-item {
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
          color: #374151;
        }

        .lang-item:hover {
          background: #f3f4f6;
        }

        .lang-item.selected {
          background: #fff0eb;
          color: #ff4b1f;
          font-weight: 700;
        }

        .header-login-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--brand-gradient);
          color: #ffffff;
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 3px 10px rgba(255, 75, 31, 0.35);
          transition: transform 0.15s ease;
        }

        .header-login-btn:hover {
          transform: translateY(-1px);
        }

        /* ------------------------------------------------------------------ */
        /* SLIDE-OVER NAVIGATION DRAWER (OPEN / CLOSE OPTIONS)                */
        /* ------------------------------------------------------------------ */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          animation: fadeIn 0.2s ease-out;
        }

        .nav-drawer {
          width: 340px;
          max-width: 85vw;
          height: 100%;
          background: #ffffff;
          box-shadow: 4px 0 30px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 20px 18px;
          animation: slideRight 0.25s ease-out;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .drawer-title {
          font-size: 18px;
          font-weight: 800;
          color: #1f2937;
        }

        .drawer-tagline {
          font-size: 11px;
          color: #9ca3af;
        }

        .drawer-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #4b5563;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .drawer-close-btn:hover {
          background: #ef4444;
          color: #fff;
          border-color: #ef4444;
        }

        .drawer-user-card {
          margin-top: 14px;
          padding: 14px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
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
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }

        .user-status {
          font-size: 11px;
          color: #64748b;
        }

        .drawer-auth-cta {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 700;
          color: var(--brand-orange);
          text-decoration: none;
        }

        .drawer-section {
          margin-top: 20px;
        }

        .drawer-section-title {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #9ca3af;
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
          padding: 10px 12px;
          border-radius: 10px;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .drawer-nav-item:hover {
          background: #f1f5f9;
        }

        .drawer-nav-item.active {
          background: #fff0eb;
        }

        .drawer-nav-item.active .nav-item-label {
          color: var(--brand-orange);
          font-weight: 800;
        }

        .nav-item-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
        }

        .nav-item-desc {
          display: block;
          font-size: 10px;
          color: #64748b;
        }

        .nav-item-arrow {
          color: #cbd5e1;
          font-size: 14px;
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
          border: 1px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          font-size: 12px;
          color: #334155;
          font-weight: 600;
          text-align: left;
        }

        .channel-pill-card:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .chan-count {
          font-size: 10px;
          color: #94a3b8;
        }

        /* Drawer Settings & Switches */
        .drawer-setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          margin-bottom: 8px;
        }

        .drawer-setting-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .setting-title {
          font-size: 12px;
          font-weight: 700;
          color: #1e293b;
        }

        .setting-desc {
          font-size: 10px;
          color: #64748b;
        }

        .drawer-switch-btn {
          width: 42px;
          height: 24px;
          border-radius: 9999px;
          background: #cbd5e1;
          border: none;
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }

        .drawer-switch-btn.active {
          background: #10b981;
        }

        .drawer-switch-btn .switch-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: transform 0.2s ease;
        }

        .drawer-switch-btn.active .switch-knob {
          transform: translateX(18px);
        }

        .quick-action-row {
          display: flex;
          gap: 8px;
        }

        .action-btn-outline {
          flex: 1;
          padding: 9px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
        }

        .action-btn-outline:hover {
          background: #f1f5f9;
        }

        .drawer-footer {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }

        .drawer-footer-title {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #9ca3af;
          margin-bottom: 8px;
        }

        .app-store-badges {
          display: flex;
          gap: 8px;
        }

        .store-badge-card {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #000000;
          color: #ffffff;
          border-radius: 6px;
          padding: 6px 8px;
          text-decoration: none;
        }

        .badge-small {
          display: block;
          font-size: 7px;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .badge-bold {
          display: block;
          font-size: 10px;
          font-weight: 700;
        }

        .drawer-copyright {
          font-size: 10px;
          color: #94a3b8;
          margin-top: 12px;
          line-height: 1.4;
        }

        /* ------------------------------------------------------------------ */
        /* MAIN STAGE & DEVICE FITNESS LAYOUT                                 */
        /* ------------------------------------------------------------------ */
        .main-stage {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          background: radial-gradient(circle at 50% 30%, #ffffff 0%, #f1f5f9 100%);
          padding: 16px;
          overflow: hidden;
          min-height: calc(100vh - 64px);
        }

        .reels-stage-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .stage-device-container {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        /* Flagship Smartphone Mockup Frame */
        .phone-device-frame {
          position: relative;
          width: 380px;
          height: calc(100vh - 96px);
          max-height: 780px;
          min-height: 580px;
          background: #000000;
          border-radius: 44px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 10px #1e293b, 0 0 0 12px #334155;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Top Notch / Status Bar */
        .device-status-notch {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 38px;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          pointer-events: none;
        }

        .status-clock {
          letter-spacing: -0.2px;
        }

        .dynamic-island {
          width: 90px;
          height: 22px;
          background: #000000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dynamic-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }

        .status-icons {
          display: flex;
          gap: 4px;
          font-size: 10px;
        }

        /* Reel Video Box */
        .reel-player-box {
          position: relative;
          width: 100%;
          height: 100%;
          background: #000000;
          overflow: hidden;
          cursor: pointer;
        }

        .reel-video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .reel-sound-btn {
          position: absolute;
          top: 48px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          z-index: 30;
          transition: transform 0.15s ease;
        }

        .reel-sound-btn:hover {
          transform: scale(1.08);
        }

        .reel-play-indicator {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.25);
          z-index: 25;
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

        .reel-top-tag {
          position: absolute;
          top: 48px;
          left: 16px;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 10px;
          font-weight: 800;
          color: #ffffff;
          z-index: 30;
          letter-spacing: 0.5px;
        }

        /* Right Floating Action Column */
        .reel-actions-column {
          position: absolute;
          right: 12px;
          bottom: 74px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
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
          display: block;
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
          border: 2px solid #ffffff;
          font-size: 12px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .action-btn-bubble {
          border: none;
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          color: #ffffff;
        }

        .bubble-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .action-btn-bubble:hover .bubble-icon {
          transform: scale(1.12);
        }

        .action-btn-bubble.liked .bubble-icon {
          color: #ef4444;
          transform: scale(1.2);
        }

        .bubble-count {
          font-size: 11px;
          font-weight: 700;
          margin-top: 3px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }

        .auto-scroll-bubble .bubble-icon {
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .auto-scroll-bubble.active .bubble-icon {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.35);
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
          color: #34d399;
          transform: scale(1.08);
        }

        .spinning-record {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #111827;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          cursor: pointer;
        }

        .spinning-record.spinning {
          animation: spin 4s linear infinite;
        }

        .record-center {
          font-size: 14px;
        }

        /* Bottom Metadata Overlay */
        .reel-metadata-vignette {
          position: absolute;
          left: 0;
          right: 68px;
          bottom: 60px;
          padding: 16px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%);
          z-index: 30;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
        }

        .creator-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .creator-display-name {
          font-size: 15px;
          font-weight: 800;
        }

        .verified-badge {
          color: #38bdf8;
          font-size: 13px;
        }

        .creator-handle {
          font-size: 12px;
          opacity: 0.85;
        }

        .location-pin-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #fbbf24;
          margin: 3px 0;
          font-weight: 600;
        }

        .reel-caption-text {
          font-size: 13px;
          line-height: 1.35;
          margin: 4px 0 6px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sound-ticker-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          opacity: 0.9;
        }

        .ticker-marquee {
          overflow: hidden;
          white-space: nowrap;
        }

        /* Auto-Scroll Playback Progress Track & Fill Indicator */
        .reel-progress-track {
          position: absolute;
          bottom: 56px;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.25);
          z-index: 38;
          pointer-events: none;
          overflow: hidden;
        }

        .reel-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff4b1f 0%, #fbbf24 100%);
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.8);
          transition: width 0.1s linear;
          border-radius: 0 2px 2px 0;
        }

        .reel-progress-bar.auto-active {
          background: linear-gradient(90deg, #ff4b1f 0%, #00e5ff 60%, #10b981 100%);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
        }

        /* Native Device Bottom Nav inside Smartphone Frame */
        .device-bottom-nav {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 35;
          padding-bottom: 6px;
        }

        .dev-nav-btn {
          border: none;
          background: transparent;
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 9px;
          font-weight: 700;
          cursor: pointer;
        }

        .dev-nav-btn span:first-child {
          font-size: 16px;
        }

        .dev-nav-btn.active {
          color: #ffffff;
        }

        .dev-nav-btn.create-btn {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: var(--brand-gradient);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(255, 75, 31, 0.4);
        }

        .dev-nav-btn.create-btn span {
          font-size: 18px !important;
        }

        /* Desktop Companion Controls Beside Phone */
        .desktop-companion-controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 260px;
        }

        .companion-autoscroll-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }

        .autoscroll-card-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .autoscroll-icon-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .autoscroll-title {
          display: block;
          font-size: 12px;
          font-weight: 800;
          color: #1e293b;
        }

        .autoscroll-desc {
          display: block;
          font-size: 10px;
          color: #64748b;
        }

        .comp-toggle-switch {
          width: 44px;
          height: 24px;
          border-radius: 9999px;
          background: #cbd5e1;
          border: none;
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
          padding: 2px;
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
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.2s ease;
        }

        .comp-toggle-switch.active .comp-switch-slider {
          transform: translateX(20px);
        }

        .reel-arrow-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          padding: 8px 14px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }

        .arrow-nav-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .arrow-nav-btn:hover {
          background: #e2e8f0;
          transform: scale(1.05);
        }

        .reel-counter-badge {
          flex: 1;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }

        .companion-creator-box {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }

        .comp-avatar-row {
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
          color: #1f2937;
        }

        .comp-handle {
          font-size: 11px;
          color: #64748b;
        }

        .comp-stats-grid {
          display: flex;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
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
          color: #1f2937;
        }

        .comp-stat span {
          font-size: 10px;
          color: #94a3b8;
        }

        .comp-follow-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          background: var(--brand-gradient);
          color: #ffffff;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .companion-sound-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
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
          color: #1f2937;
        }

        .sound-card-header p {
          font-size: 10px;
          color: #64748b;
        }

        .sound-play-preview-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: #334155;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        /* ------------------------------------------------------------------ */
        /* TAB PAGES (LIVE, SOCIAL, MUSIC, EXPLORE, PROFILE)                  */
        /* ------------------------------------------------------------------ */
        .tab-page-container {
          max-width: 960px;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 16px;
        }

        .tab-header-banner {
          margin-bottom: 20px;
          text-align: left;
        }

        .tab-header-banner h2 {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .tab-header-banner p {
          font-size: 13px;
          color: #64748b;
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
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
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
          background: rgba(0,0,0,0.6);
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
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
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
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
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
          color: #0f172a;
        }

        .author-location {
          display: block;
          font-size: 11px;
          color: #64748b;
        }

        .post-time-badge {
          font-size: 10px;
          color: #94a3b8;
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
          color: #334155;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .post-action-bar {
          display: flex;
          gap: 12px;
        }

        .post-heart-btn, .post-comment-btn {
          border: none;
          background: transparent;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
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
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
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
          color: #0f172a;
        }

        .track-text p {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        .genre-tag {
          color: var(--brand-orange);
          font-weight: 600;
        }

        .track-duration {
          font-size: 11px;
          color: #94a3b8;
        }

        .track-play-btn {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          cursor: pointer;
        }

        /* Explore Grid */
        .explore-destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .explore-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
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
          background: rgba(0,0,0,0.7);
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
          color: #0f172a;
        }

        .explore-card-info h4 {
          font-size: 11px;
          font-weight: 700;
          color: var(--brand-orange);
          margin: 2px 0 6px 0;
        }

        .explore-card-info p {
          font-size: 12px;
          color: #64748b;
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
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
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
          background: #ffffff;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }

        .profile-info-body {
          padding: 44px 20px 24px 20px;
          text-align: center;
        }

        .wallet-balance-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px;
          margin: 20px 0;
          text-align: left;
        }

        .wallet-left span {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: #64748b;
        }

        .wallet-left h2 {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 2px;
        }

        /* Comments Bottom Sheet / Drawer */
        .comments-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 210;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .comments-sheet-container {
          width: 100%;
          max-width: 440px;
          max-height: 70vh;
          background: #ffffff;
          border-radius: 24px 24px 0 0;
          display: flex;
          flex-direction: column;
          padding: 16px 18px 24px 18px;
          animation: slideUp 0.25s ease-out;
        }

        .sheet-handle-bar {
          width: 40px;
          height: 4px;
          border-radius: 2px;
          background: #cbd5e1;
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
          background: #f1f5f9;
          width: 28px;
          height: 28px;
          border-radius: 50%;
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
          background: #f8fafc;
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
          color: #0f172a;
        }

        .c-time {
          font-size: 9px;
          color: #94a3b8;
        }

        .c-text {
          font-size: 12px;
          color: #334155;
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
          border: 1px solid #cbd5e1;
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

        /* Gift Tray Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 220;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .gift-tray-card, .auth-modal-card {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          animation: scaleUp 0.2s ease-out;
        }

        .gift-tray-header, .auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .gift-subhead, .auth-sub {
          font-size: 12px;
          color: #64748b;
          margin: 4px 0 16px 0;
        }

        .gifts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .gift-option-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .gift-option-card:hover {
          border-color: var(--brand-orange);
          background: #fff0eb;
          transform: translateY(-2px);
        }

        .gift-icon {
          font-size: 26px;
        }

        .gift-name {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
        }

        .gift-price {
          font-size: 10px;
          color: var(--brand-orange);
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
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #cbd5e1;
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
        }

        /* Toast Popup */
        .wudau-toast {
          position: fixed;
          top: 76px;
          left: 50%;
          transform: translateX(-50%);
          background: #111827;
          color: #ffffff;
          padding: 9px 18px;
          border-radius: 24px;
          font-size: 12px;
          font-weight: 700;
          z-index: 300;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          animation: dropIn 0.25s ease-out;
        }

        /* ------------------------------------------------------------------ */
        /* RESPONSIVE MEDIA QUERIES (MOBILE FITNESS & TABLET/DESKTOP SCALING) */
        /* ------------------------------------------------------------------ */
        @media (max-width: 768px) {
          .top-nav-bar {
            padding: 0 10px;
            height: 58px;
          }

          .brand-sub {
            display: none;
          }

          .search-pill {
            display: none;
          }

          .d-none-mobile {
            display: none !important;
          }

          .main-stage {
            padding: 0;
            background: #000000;
          }

          .stage-device-container {
            width: 100%;
            height: calc(100dvh - 58px);
            margin: 0;
          }

          .phone-device-frame {
            width: 100vw;
            height: 100%;
            max-height: none;
            min-height: none;
            border-radius: 0;
            box-shadow: none;
          }

          .device-status-notch {
            display: none;
          }

          .reel-sound-btn {
            top: 14px;
            right: 14px;
          }

          .reel-top-tag {
            top: 14px;
            left: 14px;
          }

          .desktop-companion-controls {
            display: none;
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

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
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
