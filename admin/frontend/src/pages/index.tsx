import React, { useEffect, useState, useMemo, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { baseURL, secretKey, projectName } from "@/util/config";

// ============================================================================
// SLEEK VECTOR SVG ICONS (NO AMATEUR EMOJIS)
// ============================================================================
const SvgIcon = ({
  children,
  size = 20,
  className = "",
}: {
  children: React.ReactNode;
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ flexShrink: 0 }}
  >
    {children}
  </svg>
);

const IconReels = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <rect x="2" y="2" width="20" height="20" rx="4" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
  </SvgIcon>
);

const IconLive = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M4.93 4.93a10 10 0 0 1 14.14 0" />
    <path d="M7.76 7.76a6 6 0 0 1 8.48 0" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </SvgIcon>
);

const IconCommunity = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </SvgIcon>
);

const IconMusic = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </SvgIcon>
);

const IconCompass = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </SvgIcon>
);

const IconHeart = ({ filled = false, size = 20 }: { filled?: boolean; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "#ff2d55" : "none"}
    stroke={filled ? "#ff2d55" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconMessage = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </SvgIcon>
);

const IconShare = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </SvgIcon>
);

const IconGift = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </SvgIcon>
);

const IconRepeat = ({ size = 18 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </SvgIcon>
);

const IconVolume = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </SvgIcon>
);

const IconVolumeX = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </SvgIcon>
);

const IconSearch = ({ size = 16 }: { size?: number }) => (
  <SvgIcon size={size}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </SvgIcon>
);

const IconUser = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SvgIcon>
);

const IconPlus = ({ size = 18 }: { size?: number }) => (
  <SvgIcon size={size}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </SvgIcon>
);

const IconChevronUp = ({ size = 18 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polyline points="18 15 12 9 6 15" />
  </SvgIcon>
);

const IconChevronDown = ({ size = 18 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polyline points="6 9 12 15 18 9" />
  </SvgIcon>
);

const IconLogOut = ({ size = 16 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </SvgIcon>
);

const IconMapPin = ({ size = 13 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </SvgIcon>
);

// ============================================================================
// DATA MODELS
// ============================================================================
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
  coins: number;
}

const GIFTS_LIST: GiftItem[] = [
  { id: "g1", name: "Rose", coins: 10 },
  { id: "g2", name: "Love Heart", coins: 50 },
  { id: "g3", name: "African Drum", coins: 100 },
  { id: "g4", name: "Diamond", coins: 500 },
  { id: "g5", name: "Crown", coins: 1000 },
  { id: "g6", name: "Safari Lion", coins: 2500 },
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

  // Realistic Comments
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
    setTimeout(() => setToastMessage(null), 2500);
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

  // Clean Filter Logic
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

    if (Math.abs(diffY) > 40 && Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 0) {
        handleNextReel();
      } else {
        handlePrevReel();
      }
    }
  };

  // Double tap to like on video surface
  const handleSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
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
    showToast(wasLiked ? "Unliked" : "Liked reel");
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
        showToast("Link copied to clipboard");
      }
    }
  };

  const handleSendGift = (gift: GiftItem) => {
    setShowGiftModal(false);
    showToast(`Sent ${gift.name} (${gift.coins} coins) to ${activeVideo?.name || "Creator"}`);
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
    showToast("Comment posted");
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
        <title>{projectName} — Watch & Discover Short Videos</title>
        <meta
          name="description"
          content="Discover trending Tanzanian street dance, Bongo Flava, Singeli 300BPM, Serengeti wildlife, and global creative reels on WUDAU."
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
              className={`menu-trigger-btn ${isMenuOpen ? "active" : ""}`}
              aria-label="Toggle navigation menu"
              title="Menu"
            >
              <div className="hamburger-box">
                <span className="ham-line top"></span>
                <span className="ham-line mid"></span>
                <span className="ham-line bot"></span>
              </div>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="brand-link">
              <div className="brand-logo-mark">W</div>
              <span className="brand-name">WUDAU</span>
            </Link>
          </div>

          {/* Clean Category Tabs (NO Childish Emojis) */}
          <div className="header-center">
            <nav className="category-tabs-track">
              {[
                { id: "all", label: "For You" },
                { id: "tanzania", label: "Tanzania" },
                { id: "serengeti", label: "Serengeti" },
                { id: "singeli", label: "Singeli & Bongo" },
                { id: "zanzibar", label: "Zanzibar" },
                { id: "global", label: "Global" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentFilter(tab.id);
                    setCurrentReelIndex(0);
                  }}
                  className={`category-tab-btn ${currentFilter === tab.id ? "active" : ""}`}
                >
                  {tab.label}
                  {currentFilter === tab.id && <span className="tab-active-indicator" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Header Right Tools */}
          <div className="header-right">
            {/* Desktop Search Bar */}
            <div className="header-search-bar">
              <IconSearch size={16} />
              <input
                type="text"
                placeholder="Search reels, sounds, creators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentReelIndex(0);
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="search-clear-btn" aria-label="Clear search">
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Search Icon Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="icon-action-btn mobile-only"
              aria-label="Search"
              title="Search"
            >
              <IconSearch size={18} />
            </button>

            {/* Auto-advance Icon Button (CLEAN ICON SWITCH, NO BOLD 'AUTO: ON' TEXT) */}
            <button
              onClick={() => {
                setIsAutoScroll(!isAutoScroll);
                showToast(!isAutoScroll ? "Continuous Play Enabled" : "Loop Mode Enabled");
              }}
              className={`icon-action-btn ${isAutoScroll ? "active-glow" : ""}`}
              aria-label="Toggle auto-play next video"
              title={isAutoScroll ? "Continuous Play: ON (Advances automatically)" : "Continuous Play: OFF (Loops video)"}
            >
              <IconRepeat size={18} />
            </button>

            {/* Create / Upload Shortcut */}
            <button
              onClick={() => {
                if (isAuth) {
                  showToast("Opening upload studio...");
                } else {
                  setAuthModalTitle("Upload Reel");
                  setShowAuthModal(true);
                }
              }}
              className="create-shortcut-btn"
              title="Create new reel"
            >
              <IconPlus size={16} />
              <span className="btn-label">Create</span>
            </button>

            {/* User Profile / Login Link */}
            {isAuth ? (
              <div className="header-profile-cluster">
                <button
                  onClick={() => setCurrentTab("profile")}
                  className="profile-avatar-trigger"
                  title="Profile & Settings"
                >
                  {currentUser?.image ? (
                    <img src={resolveMedia(currentUser.image)} alt="User" className="user-thumb" />
                  ) : (
                    <span className="user-initial">
                      {currentUser?.name ? currentUser.name[0].toUpperCase() : "U"}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="guest-auth-actions">
                <Link href="/login" className="nav-login-btn">
                  Log in
                </Link>
                <Link href="/Registration" className="nav-signup-btn">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="mobile-search-overlay">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search reels, sounds, creators..."
              value={searchQuery}
              autoFocus
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentReelIndex(0);
              }}
            />
            <button onClick={() => setMobileSearchOpen(false)} className="search-close-btn">
              ✕
            </button>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SLIDE-OVER NAVIGATION DRAWER (CLEAN, SPACIOUS, ZERO OVERLAPS)        */}
        {/* ==================================================================== */}
        {isMenuOpen && (
          <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}>
            <aside className="nav-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-top-bar">
                <Link href="/" className="drawer-brand" onClick={() => setIsMenuOpen(false)}>
                  <div className="brand-logo-mark mini">W</div>
                  <span className="brand-name">WUDAU</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="drawer-close-btn" aria-label="Close menu">
                  ✕
                </button>
              </div>

              {/* User Account Snippet */}
              <div className="drawer-user-box">
                {isAuth ? (
                  <div className="user-logged-in-row">
                    <div className="user-avatar-wrap">
                      {currentUser?.image ? (
                        <img src={resolveMedia(currentUser.image)} alt="Avatar" className="user-avatar-img" />
                      ) : (
                        <span className="user-avatar-fallback">
                          {currentUser?.name ? currentUser.name[0].toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <div className="user-meta-column">
                      <span className="user-profile-name">{currentUser?.name || "Creator"}</span>
                      <span className="user-profile-handle">{currentUser?.userName || "@creator"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="drawer-guest-prompt">
                    <p className="guest-prompt-title">Sign in to WUDAU</p>
                    <p className="guest-prompt-sub">Follow creators, like reels, and share your talent.</p>
                    <div className="drawer-guest-btn-row">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)} className="drawer-btn primary">
                        Log in
                      </Link>
                      <Link href="/Registration" onClick={() => setIsMenuOpen(false)} className="drawer-btn secondary">
                        Sign up
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Content Feeds (CLEAN TITLES, NO CRAMMED SUBTITLES) */}
              <div className="drawer-nav-group">
                <span className="drawer-group-label">EXPLORE</span>
                <nav className="drawer-nav-items">
                  {[
                    { id: "reels", label: "Reels", icon: <IconReels size={18} /> },
                    { id: "live", label: "Live Streams", icon: <IconLive size={18} /> },
                    { id: "social", label: "Community Feed", icon: <IconCommunity size={18} /> },
                    { id: "music", label: "Sounds & Music", icon: <IconMusic size={18} /> },
                    { id: "explore", label: "Discover Tanzania", icon: <IconCompass size={18} /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id as any);
                        setIsMenuOpen(false);
                      }}
                      className={`drawer-link-btn ${currentTab === item.id ? "active" : ""}`}
                    >
                      <span className="drawer-link-icon">{item.icon}</span>
                      <span className="drawer-link-text">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Cultural Channels (CLEAN LIST WITH REGION PILLS, NO EMOJIS) */}
              <div className="drawer-nav-group">
                <span className="drawer-group-label">CULTURAL HIGHLIGHTS</span>
                <div className="cultural-channels-list">
                  {[
                    { tag: "tanzania", name: "Dar es Salaam Dance", region: "Kinondoni" },
                    { tag: "singeli", name: "Singeli 300BPM", region: "Mbagala" },
                    { tag: "serengeti", name: "Serengeti Safari", region: "Mara" },
                    { tag: "zanzibar", name: "Zanzibar Taarab", region: "Stone Town" },
                    { tag: "global", name: "Global Rhythms", region: "World" },
                  ].map((chan) => (
                    <button
                      key={chan.tag}
                      onClick={() => {
                        setCurrentFilter(chan.tag);
                        setCurrentTab("reels");
                        setCurrentReelIndex(0);
                        setIsMenuOpen(false);
                      }}
                      className="cultural-channel-row"
                    >
                      <span className="channel-title">{chan.name}</span>
                      <span className="channel-region-pill">{chan.region}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="drawer-nav-group">
                <span className="drawer-group-label">LANGUAGE</span>
                <div className="language-selector-pills">
                  {["English", "Kiswahili", "Français", "中文"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        showToast(`Language set to ${lang}`);
                      }}
                      className={`lang-pill ${language === lang ? "active" : ""}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              {isAuth && (
                <div className="drawer-bottom-actions">
                  {userRole === "admin" && (
                    <Link href="/dashboard" className="drawer-admin-portal-link" onClick={() => setIsMenuOpen(false)}>
                      Admin Portal
                    </Link>
                  )}
                  <button onClick={handleLogout} className="drawer-logout-row">
                    <IconLogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}

              <div className="drawer-footer-note">
                <p>© 2026 WUDAU Technologies • Made for African & Global Creators</p>
              </div>
            </aside>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MAIN BODY: FLUID FEED & PLAYER STAGE                                 */}
        {/* ==================================================================== */}
        <main className="content-stage">
          {/* TAB 1: REELS EXPERIENCE (REAL FLUID REELS, NO MOCKUP BEZELS) */}
          {currentTab === "reels" && (
            <div className="reels-stage">
              {filteredVideos.length === 0 ? (
                <div className="empty-state-card">
                  <IconSearch size={40} />
                  <h3>No reels found</h3>
                  <p>Try resetting the category filter or searching for another creator or sound.</p>
                  <button
                    onClick={() => {
                      setCurrentFilter("all");
                      setSearchQuery("");
                    }}
                    className="action-accent-btn"
                  >
                    View All Reels
                  </button>
                </div>
              ) : (
                activeVideo && (
                  <div className="player-presentation-layout">
                    {/* Centered Video Player Card */}
                    <div
                      className="video-player-card"
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
                        className="main-reel-video"
                      />

                      {/* Buffering Spinner */}
                      {isBuffering && (
                        <div className="buffering-overlay">
                          <div className="buffering-spinner" />
                        </div>
                      )}

                      {/* Floating Hearts Animation from Double-Tap */}
                      {floatingHearts.map((heart) => (
                        <div
                          key={heart.id}
                          className="floating-tap-heart"
                          style={{ left: `${heart.x - 24}px`, top: `${heart.y - 24}px` }}
                        >
                          <IconHeart filled size={48} />
                        </div>
                      ))}

                      {/* Sound Toggle Floating Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                          showToast(isMuted ? "Sound Enabled" : "Muted");
                        }}
                        className="player-sound-btn"
                        aria-label="Toggle Sound"
                      >
                        {isMuted ? <IconVolumeX size={18} /> : <IconVolume size={18} />}
                      </button>

                      {/* Pause / Play Fade Indicator */}
                      {!isPlaying && (
                        <div className="player-pause-indicator">
                          <div className="pause-icon-pill">
                            <polygon points="5 3 19 12 5 21 5 3" fill="#ffffff" />
                          </div>
                        </div>
                      )}

                      {/* Floating Right Actions Column */}
                      <div className="player-actions-column" onClick={(e) => e.stopPropagation()}>
                        {/* Creator Avatar with follow + badge */}
                        <div className="creator-avatar-wrap">
                          <img
                            src={resolveMedia(activeVideo.userImage)}
                            alt={activeVideo.name}
                            className="creator-avatar-img"
                          />
                          <button
                            onClick={() => showToast(`Followed ${activeVideo.name}`)}
                            className="follow-plus-badge"
                            title="Follow Creator"
                          >
                            +
                          </button>
                        </div>

                        {/* Like Button */}
                        <button
                          onClick={(e) => handleLike(activeVideo._id, e)}
                          className={`action-icon-pill ${likedReelIds[activeVideo._id] ? "liked" : ""}`}
                          title="Like"
                        >
                          <IconHeart filled={likedReelIds[activeVideo._id]} size={22} />
                          <span className="action-pill-count">
                            {reelLikesCount[activeVideo._id] !== undefined
                              ? reelLikesCount[activeVideo._id]
                              : activeVideo.totalLikes || 0}
                          </span>
                        </button>

                        {/* Comments Button */}
                        <button
                          onClick={() => setShowCommentsDrawer(true)}
                          className="action-icon-pill"
                          title="Comments"
                        >
                          <IconMessage size={22} />
                          <span className="action-pill-count">
                            {(commentsMap[activeVideo._id] || commentsMap["default"] || []).length}
                          </span>
                        </button>

                        {/* Gift Button */}
                        <button
                          onClick={() => setShowGiftModal(true)}
                          className="action-icon-pill"
                          title="Send Gift"
                        >
                          <IconGift size={22} />
                          <span className="action-pill-count">Gift</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={(e) => handleShare(activeVideo, e)}
                          className="action-icon-pill"
                          title="Share"
                        >
                          <IconShare size={22} />
                          <span className="action-pill-count">{activeVideo.shareCount || 0}</span>
                        </button>

                        {/* Auto-Scroll Toggle Bubble */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAutoScroll(!isAutoScroll);
                            showToast(!isAutoScroll ? "Continuous Play ON" : "Loop Mode ON");
                          }}
                          className={`action-icon-pill ${isAutoScroll ? "active-repeat" : ""}`}
                          title={isAutoScroll ? "Auto-play next reel: ON" : "Loop current reel: ON"}
                        >
                          <IconRepeat size={20} />
                        </button>

                        {/* Rotating Vinyl Soundtrack Disc */}
                        <div
                          onClick={() => handleToggleMusic(activeVideo.songLink)}
                          className={`vinyl-sound-disc ${isPlaying ? "spinning" : ""}`}
                          title={activeVideo.songTitle || "Original Audio"}
                        >
                          <div className="disc-groove">
                            <IconMusic size={14} />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Overlay Vignette */}
                      <div className="player-bottom-vignette" onClick={(e) => e.stopPropagation()}>
                        <div className="creator-details-row">
                          <span className="creator-full-name">{activeVideo.name}</span>
                          {activeVideo.isVerified && <span className="verified-check">✓</span>}
                          <span className="creator-handle-text">{activeVideo.userName}</span>
                        </div>

                        {activeVideo.location && (
                          <div className="location-tag-row">
                            <IconMapPin size={12} />
                            <span>{activeVideo.location}</span>
                          </div>
                        )}

                        <p className="caption-text">{activeVideo.caption}</p>

                        <div className="audio-sound-pill">
                          <IconMusic size={12} />
                          <div className="audio-marquee-track">
                            <span>
                              {activeVideo.songTitle || "Original Sound"} • {activeVideo.singerName || activeVideo.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subtle Playback Progress Bar */}
                      <div className="playback-progress-track">
                        <div
                          className={`playback-progress-fill ${isAutoScroll ? "auto-mode" : ""}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Desktop Companion Controls (Clean, Minimalist, No Clutter) */}
                    <aside className="desktop-companion-rail">
                      {/* Playlist Switcher */}
                      <div className="companion-box nav-switcher-box">
                        <span className="companion-box-label">UP NEXT</span>
                        <div className="nav-arrow-pair">
                          <button
                            onClick={handlePrevReel}
                            className="arrow-button"
                            title="Previous (Arrow Up)"
                          >
                            <IconChevronUp size={18} />
                          </button>
                          <div className="counter-tag">
                            {currentReelIndex + 1} / {filteredVideos.length}
                          </div>
                          <button
                            onClick={handleNextReel}
                            className="arrow-button"
                            title="Next (Arrow Down)"
                          >
                            <IconChevronDown size={18} />
                          </button>
                        </div>
                        <span className="companion-subtext">Use ↑ and ↓ arrows or spacebar to control</span>
                      </div>

                      {/* Creator Spotlight */}
                      <div className="companion-box creator-spotlight-box">
                        <div className="spotlight-author-row">
                          <img
                            src={resolveMedia(activeVideo.userImage)}
                            alt={activeVideo.name}
                            className="spotlight-avatar"
                          />
                          <div className="spotlight-text">
                            <h4>{activeVideo.name}</h4>
                            <p>{activeVideo.userName}</p>
                          </div>
                        </div>
                        <div className="spotlight-stats-row">
                          <div className="spotlight-stat">
                            <strong>{activeVideo.totalLikes || 1420}</strong>
                            <span>Likes</span>
                          </div>
                          <div className="spotlight-stat">
                            <strong>{activeVideo.shareCount || 389}</strong>
                            <span>Shares</span>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast(`Followed ${activeVideo.name}`)}
                          className="spotlight-follow-btn"
                        >
                          Follow Artist
                        </button>
                      </div>

                      {/* Sound Track Card */}
                      {activeVideo.songTitle && (
                        <div className="companion-box soundtrack-box">
                          <div className="soundtrack-head">
                            <IconMusic size={16} />
                            <div>
                              <h5>{activeVideo.songTitle}</h5>
                              <p>{activeVideo.singerName || "WUDAU Audio"}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleMusic(activeVideo.songLink)}
                            className="soundtrack-preview-btn"
                          >
                            {playingAudioUrl === resolveMedia(activeVideo.songLink) ? "Pause Audio" : "Play Soundtrack"}
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
            <div className="tab-surface-page">
              <div className="page-header-row">
                <h2>Live Stages</h2>
                <p>Real-time interactive video broadcasts from creators across Tanzania and the world.</p>
              </div>
              <div className="live-streams-grid">
                {[
                  {
                    id: "l1",
                    title: "Coco Beach Street Dance Battle 2026",
                    host: "Kassim Mwambao (Dar es Salaam)",
                    viewers: "2.8k",
                    image: "storage/thumb2.jpg",
                    tag: "LIVE",
                  },
                  {
                    id: "l2",
                    title: "Stone Town Acoustic Dhow Sunset Live",
                    host: "Zuhura Bakari (Zanzibar)",
                    viewers: "1.9k",
                    image: "storage/thumb4.jpg",
                    tag: "LIVE",
                  },
                  {
                    id: "l3",
                    title: "Serengeti Dawn Wildlife Migration Patrol",
                    host: "Rehema Mushi (Serengeti)",
                    viewers: "4.5k",
                    image: "storage/thumb1.jpg",
                    tag: "LIVE",
                  },
                  {
                    id: "l4",
                    title: "Singeli 300BPM Speed Challenge Live",
                    host: "Amani Juma (Mbagala)",
                    viewers: "3.2k",
                    image: "storage/thumb3.jpg",
                    tag: "LIVE",
                  },
                ].map((stream) => (
                  <div
                    key={stream.id}
                    onClick={() => {
                      setCurrentTab("reels");
                      showToast(`Entering broadcast: ${stream.title}`);
                    }}
                    className="live-stream-card"
                  >
                    <img src={resolveMedia(stream.image)} alt={stream.title} className="stream-cover-img" />
                    <div className="stream-badge-live">{stream.tag}</div>
                    <div className="stream-viewers-pill">{stream.viewers} watching</div>
                    <div className="stream-info-overlay">
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
            <div className="tab-surface-page">
              <div className="page-header-row">
                <h2>Community Feed</h2>
                <p>Behind the scenes moments, creative photography, and culture updates.</p>
              </div>
              <div className="community-posts-grid">
                {posts.map((post) => (
                  <article key={post._id} className="community-post-card">
                    <div className="post-header-row">
                      <img
                        src={resolveMedia(post.userImage)}
                        alt={post.name}
                        className="post-user-avatar"
                      />
                      <div className="post-user-info">
                        <span className="post-user-name">{post.name}</span>
                        <span className="post-user-handle">{post.location || post.userName}</span>
                      </div>
                      <span className="post-timestamp">{post.time || "Recently"}</span>
                    </div>
                    <div className="post-media-box">
                      <img
                        src={resolveMedia(post.postImage?.[0] || post.mainPostImage)}
                        alt="Community Post"
                        className="post-main-img"
                      />
                    </div>
                    <div className="post-body-content">
                      <p className="post-caption-text">{post.caption}</p>
                      <div className="post-action-buttons">
                        <button onClick={() => showToast("Liked post")} className="post-action-btn">
                          <IconHeart size={16} />
                          <span>{post.totalLikes || 18} Likes</span>
                        </button>
                        <button onClick={() => setShowCommentsDrawer(true)} className="post-action-btn">
                          <IconMessage size={16} />
                          <span>Comments</span>
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
            <div className="tab-surface-page">
              <div className="page-header-row">
                <h2>Soundtracks & Music</h2>
                <p>Explore original African rhythms, Bongo Flava, Singeli, and global collaborations.</p>
              </div>
              <div className="music-tracks-grid">
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
                  <div key={idx} className="track-listing-item">
                    <img src={resolveMedia(track.image)} alt={track.title} className="track-thumb" />
                    <div className="track-details">
                      <h4>{track.title}</h4>
                      <p>
                        {track.singer} • <span className="genre-label">{track.genre}</span>
                      </p>
                    </div>
                    <span className="track-time-tag">{track.time}</span>
                    <button
                      onClick={() => handleToggleMusic(track.link)}
                      className="track-play-action"
                    >
                      {playingAudioUrl === resolveMedia(track.link) ? "Pause" : "Play"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DISCOVER TANZANIA SHOWCASE */}
          {currentTab === "explore" && (
            <div className="tab-surface-page">
              <div className="page-header-row">
                <h2>Discover Tanzania</h2>
                <p>Natural beauty, cultural rhythm, and untamed spirit across Africa&apos;s leading destinations.</p>
              </div>
              <div className="destinations-showcase-grid">
                {[
                  {
                    name: "Serengeti National Park",
                    subtitle: "Great Migration & Lion Prides",
                    desc: "Witness the greatest wildlife spectacle on Earth across the endless savanna plains.",
                    image: "storage/thumb1.jpg",
                    tag: "#Serengeti",
                  },
                  {
                    name: "Stone Town, Zanzibar",
                    subtitle: "Spice Island & Swahili Soul",
                    desc: "Labyrinthine alleys, acoustic coastal melodies, and sunset dhow sails on turquoise waters.",
                    image: "storage/post4.jpg",
                    tag: "#Zanzibar",
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
                  <div key={i} className="destination-feature-card">
                    <div className="destination-media-wrap">
                      <img src={resolveMedia(item.image)} alt={item.name} />
                      <span className="destination-tag-badge">{item.tag}</span>
                    </div>
                    <div className="destination-content">
                      <h3>{item.name}</h3>
                      <h4>{item.subtitle}</h4>
                      <p>{item.desc}</p>
                      <button
                        onClick={() => {
                          setCurrentFilter("tanzania");
                          setCurrentTab("reels");
                        }}
                        className="destination-view-btn"
                      >
                        Watch Reels from Here →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: USER PROFILE & WALLET */}
          {currentTab === "profile" && (
            <div className="tab-surface-page">
              <div className="profile-surface-card">
                <div className="profile-banner-band">
                  <div className="profile-avatar-center">
                    {currentUser?.image ? (
                      <img src={resolveMedia(currentUser.image)} alt="Avatar" className="profile-hero-img" />
                    ) : isAuth ? (
                      "👑"
                    ) : (
                      "👤"
                    )}
                  </div>
                </div>
                <div className="profile-card-body">
                  <h3 className="profile-full-name">
                    {currentUser?.name || (isAuth ? "Creator Account" : "Guest Explorer")}
                  </h3>
                  <p className="profile-user-handle">
                    {currentUser?.userName || (isAuth ? "@wudau_creator" : "Guest")}
                  </p>
                  <p className="profile-user-email">
                    {currentUser?.email || "Connect with creators, send gifts, and share your talent."}
                  </p>

                  <div className="coins-balance-box">
                    <div>
                      <span className="balance-label">COINS BALANCE</span>
                      <h2 className="balance-value">
                        {currentUser?.coin !== undefined ? currentUser.coin.toLocaleString() : "1,000"} Coins
                      </h2>
                    </div>
                    <button
                      onClick={() => showToast("Coins package ready")}
                      className="topup-btn"
                    >
                      Top Up
                    </button>
                  </div>

                  <div className="profile-action-stack">
                    {isAuth ? (
                      <>
                        {userRole === "admin" && (
                          <Link href="/dashboard" className="action-accent-btn full">
                            Open Admin Portal
                          </Link>
                        )}
                        <button onClick={handleLogout} className="action-hollow-btn full">
                          Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="action-accent-btn full">
                          Sign In
                        </Link>
                        <Link href="/Registration" className="action-hollow-btn full">
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ==================================================================== */}
        {/* MOBILE BOTTOM NAVIGATION BAR                                         */}
        {/* ==================================================================== */}
        <nav className="mobile-tab-nav">
          <button
            onClick={() => setCurrentTab("reels")}
            className={`tab-nav-btn ${currentTab === "reels" ? "active" : ""}`}
          >
            <IconReels size={20} />
            <span className="tab-title">Reels</span>
          </button>

          <button
            onClick={() => setCurrentTab("live")}
            className={`tab-nav-btn ${currentTab === "live" ? "active" : ""}`}
          >
            <IconLive size={20} />
            <span className="tab-title">Live</span>
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
            className="tab-nav-btn create-tab-btn"
            title="Create Reel"
          >
            <div className="create-bubble-icon">
              <IconPlus size={18} />
            </div>
          </button>

          <button
            onClick={() => setCurrentTab("social")}
            className={`tab-nav-btn ${currentTab === "social" ? "active" : ""}`}
          >
            <IconCommunity size={20} />
            <span className="tab-title">Feed</span>
          </button>

          <button
            onClick={() => setCurrentTab("profile")}
            className={`tab-nav-btn ${currentTab === "profile" ? "active" : ""}`}
          >
            <IconUser size={20} />
            <span className="tab-title">Profile</span>
          </button>
        </nav>

        {/* ==================================================================== */}
        {/* COMMENTS BOTTOM SHEET DRAWER                                         */}
        {/* ==================================================================== */}
        {showCommentsDrawer && activeVideo && (
          <div className="drawer-overlay" onClick={() => setShowCommentsDrawer(false)}>
            <div className="bottom-comments-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-drag-handle" />
              <div className="sheet-title-row">
                <h3>Comments ({(commentsMap[activeVideo._id] || commentsMap["default"] || []).length})</h3>
                <button onClick={() => setShowCommentsDrawer(false)} className="sheet-close-cross">
                  ✕
                </button>
              </div>

              <div className="sheet-comments-scroll">
                {(commentsMap[activeVideo._id] || commentsMap["default"] || []).map((c) => (
                  <div key={c.id} className="comment-thread-item">
                    <div className="comment-initial-badge">
                      {c.userName.slice(1, 3).toUpperCase()}
                    </div>
                    <div className="comment-body-bubble">
                      <div className="comment-author-line">
                        <span className="comment-author-name">{c.userName}</span>
                        <span className="comment-time-ago">{c.time}</span>
                      </div>
                      <p className="comment-message-text">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="comment-submit-form">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="comment-type-input"
                />
                <button type="submit" className="comment-post-btn">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* GIFT SELECTION TRAY MODAL                                            */}
        {/* ==================================================================== */}
        {showGiftModal && (
          <div className="drawer-overlay" onClick={() => setShowGiftModal(false)}>
            <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-line">
                <h3>Send Creator Gift</h3>
                <button onClick={() => setShowGiftModal(false)} className="sheet-close-cross">
                  ✕
                </button>
              </div>
              <p className="modal-subtitle">Support {activeVideo?.name} with virtual creator gifts</p>
              <div className="gifts-selection-grid">
                {GIFTS_LIST.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSendGift(g)}
                    className="gift-select-item"
                  >
                    <IconGift size={24} />
                    <span className="gift-title">{g.name}</span>
                    <span className="gift-cost">{g.coins} Coins</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* AUTH PROMPT MODAL                                                    */}
        {/* ==================================================================== */}
        {showAuthModal && (
          <div className="drawer-overlay" onClick={() => setShowAuthModal(false)}>
            <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-line">
                <h3>{authModalTitle}</h3>
                <button onClick={() => setShowAuthModal(false)} className="sheet-close-cross">
                  ✕
                </button>
              </div>
              <p className="modal-subtitle">Sign in or create an account to upload videos and interact.</p>
              <div className="modal-actions-list">
                <Link
                  href="/login"
                  onClick={() => setShowAuthModal(false)}
                  className="action-accent-btn full"
                >
                  Log In to WUDAU
                </Link>
                <Link
                  href="/Registration"
                  onClick={() => setShowAuthModal(false)}
                  className="action-hollow-btn full"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* WORLD-CLASS SOCIAL MEDIA STYLES (OBSIDIAN DARK, SLEEK, REFINED)      */}
      {/* ==================================================================== */}
      <style jsx global>{`
        :root {
          --brand-primary: #ff5722;
          --brand-secondary: #ff9800;
          --brand-accent: linear-gradient(135deg, #ff5722 0%, #ff9800 100%);
          --bg-root: #090a0f;
          --bg-header: rgba(12, 13, 18, 0.92);
          --bg-card: #14161f;
          --bg-subtle: rgba(255, 255, 255, 0.05);
          --border-subtle: rgba(255, 255, 255, 0.09);
          --border-active: rgba(255, 87, 34, 0.5);
          --text-primary: #ffffff;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }

        body,
        html {
          width: 100%;
          height: 100%;
          background-color: var(--bg-root);
          color: var(--text-primary);
          overflow-x: hidden;
          font-size: 14px;
          line-height: 1.5;
        }

        .app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100vw;
          background-color: var(--bg-root);
          position: relative;
        }

        /* ------------------------------------------------------------------ */
        /* TOP HEADER NAVIGATION                                              */
        /* ------------------------------------------------------------------ */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          background: var(--bg-header);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .menu-trigger-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .menu-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .hamburger-box {
          width: 16px;
          height: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .ham-line {
          width: 100%;
          height: 1.75px;
          background: #ffffff;
          border-radius: 2px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .menu-trigger-btn.active .ham-line.top {
          transform: translateY(5px) rotate(45deg);
        }
        .menu-trigger-btn.active .ham-line.mid {
          opacity: 0;
        }
        .menu-trigger-btn.active .ham-line.bot {
          transform: translateY(-5px) rotate(-45deg);
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .brand-logo-mark {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--brand-accent);
          color: #ffffff;
          font-weight: 900;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 87, 34, 0.35);
        }

        .brand-logo-mark.mini {
          width: 26px;
          height: 26px;
          font-size: 14px;
        }

        .brand-name {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #ffffff;
        }

        /* Clean Header Category Tabs */
        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
          overflow: hidden;
          padding: 0 4px;
        }

        .category-tabs-track {
          display: flex;
          align-items: center;
          gap: 2px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 0;
        }

        .category-tabs-track::-webkit-scrollbar {
          display: none;
        }

        .category-tab-btn {
          position: relative;
          padding: 8px 14px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.15s ease;
        }

        .category-tab-btn:hover {
          color: var(--text-primary);
        }

        .category-tab-btn.active {
          color: var(--text-primary);
          font-weight: 700;
        }

        .tab-active-indicator {
          position: absolute;
          bottom: 0;
          left: 14px;
          right: 14px;
          height: 2.5px;
          border-radius: 2px;
          background: var(--brand-primary);
        }

        /* Header Right Controls */
        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .header-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 6px 12px;
          width: 220px;
          color: var(--text-muted);
          transition: border-color 0.15s ease;
        }

        .header-search-bar:focus-within {
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
        }

        .header-search-bar input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 12px;
          color: #ffffff;
          width: 100%;
        }

        .header-search-bar input::placeholder {
          color: var(--text-muted);
        }

        .search-clear-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 11px;
        }

        .icon-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .icon-action-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .icon-action-btn.active-glow {
          color: var(--brand-primary);
          background: rgba(255, 87, 34, 0.12);
          border-color: rgba(255, 87, 34, 0.4);
        }

        .icon-action-btn.mobile-only {
          display: none;
        }

        .create-shortcut-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 18px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .create-shortcut-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .header-profile-cluster {
          display: flex;
          align-items: center;
        }

        .profile-avatar-trigger {
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .user-thumb {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--brand-primary);
        }

        .user-initial {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--brand-primary);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .guest-auth-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-login-btn {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 18px;
          transition: opacity 0.15s ease;
        }

        .nav-signup-btn {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 18px;
          background: var(--brand-accent);
          box-shadow: 0 2px 6px rgba(255, 87, 34, 0.3);
        }

        .mobile-search-overlay {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #12141c;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-muted);
        }

        .mobile-search-overlay input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 13px;
        }

        .search-close-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 16px;
          cursor: pointer;
        }

        /* ------------------------------------------------------------------ */
        /* SLIDE-OVER NAVIGATION DRAWER                                       */
        /* ------------------------------------------------------------------ */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 200;
          display: flex;
          animation: fadeIn 0.15s ease-out;
        }

        .nav-drawer {
          width: 300px;
          max-width: 85vw;
          height: 100%;
          background: #0f1016;
          border-right: 1px solid var(--border-subtle);
          box-shadow: 6px 0 35px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 18px 16px;
          animation: slideRight 0.2s ease-out;
        }

        .drawer-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .drawer-close-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: var(--text-primary);
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .drawer-user-box {
          margin-top: 14px;
          padding: 14px;
          border-radius: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
        }

        .user-logged-in-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar-wrap {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-avatar-fallback {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
        }

        .user-meta-column {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-profile-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-profile-handle {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .drawer-guest-prompt {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .guest-prompt-title {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }

        .guest-prompt-sub {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .drawer-guest-btn-row {
          display: flex;
          gap: 8px;
        }

        .drawer-btn {
          flex: 1;
          padding: 7px;
          border-radius: 8px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .drawer-btn.primary {
          background: var(--brand-accent);
          color: #ffffff;
        }

        .drawer-btn.secondary {
          background: var(--bg-subtle);
          color: #ffffff;
          border: 1px solid var(--border-subtle);
        }

        .drawer-nav-group {
          margin-top: 18px;
        }

        .drawer-group-label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.8px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .drawer-nav-items {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* Clean Sidebar Navigation Links (NO multi-line subtitle overlaps) */
        .drawer-link-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s ease;
        }

        .drawer-link-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        .drawer-link-btn.active {
          background: rgba(255, 87, 34, 0.15);
          color: var(--brand-primary);
          font-weight: 700;
        }

        .drawer-link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-link-text {
          white-space: nowrap;
        }

        /* Cultural Highlights List */
        .cultural-channels-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cultural-channel-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease;
        }

        .cultural-channel-row:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .channel-region-pill {
          font-size: 10px;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 6px;
        }

        .language-selector-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .lang-pill {
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .lang-pill.active {
          background: var(--brand-accent);
          color: #ffffff;
          border-color: transparent;
        }

        .drawer-bottom-actions {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .drawer-admin-portal-link {
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
          background: var(--brand-accent);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
        }

        .drawer-logout-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.25);
          background: transparent;
          color: #ef4444;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .drawer-footer-note {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
          font-size: 10px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* ------------------------------------------------------------------ */
        /* MAIN REEL PLAYER STAGE                                             */
        /* ------------------------------------------------------------------ */
        .content-stage {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 100%;
          min-height: calc(100vh - 56px);
          overflow: hidden;
        }

        .reels-stage {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .player-presentation-layout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          width: 100%;
          height: 100%;
          padding: 16px;
        }

        /* Fluid Video Card (NO Fake Phone Bezels or Notches) */
        .video-player-card {
          position: relative;
          width: 440px;
          max-width: 100%;
          height: calc(100vh - 88px);
          max-height: 820px;
          background: #000000;
          border-radius: 16px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid var(--border-subtle);
        }

        .main-reel-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .buffering-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.25);
          z-index: 25;
          pointer-events: none;
        }

        .buffering-spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: var(--brand-primary);
          animation: spin 0.8s linear infinite;
        }

        .floating-tap-heart {
          position: absolute;
          pointer-events: none;
          z-index: 50;
          animation: heartPop 0.75s ease-out forwards;
        }

        @keyframes heartPop {
          0% { transform: scale(0.2); opacity: 0; }
          40% { transform: scale(1.3); opacity: 1; }
          70% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.4) translateY(-30px); opacity: 0; }
        }

        .player-sound-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 30;
          transition: transform 0.15s ease;
        }

        .player-sound-btn:hover {
          transform: scale(1.08);
        }

        .player-pause-indicator {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          z-index: 24;
          pointer-events: none;
        }

        .pause-icon-pill {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Floating Right Actions Rail */
        .player-actions-column {
          position: absolute;
          right: 10px;
          bottom: 84px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          z-index: 35;
        }

        .creator-avatar-wrap {
          position: relative;
          margin-bottom: 4px;
        }

        .creator-avatar-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        }

        .follow-plus-badge {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--brand-primary);
          color: #ffffff;
          border: 1.5px solid #ffffff;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .action-icon-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          width: 42px;
          height: 42px;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
          position: relative;
        }

        .action-icon-pill:hover {
          transform: scale(1.08);
          background: rgba(0, 0, 0, 0.6);
        }

        .action-icon-pill.liked {
          color: #ff2d55;
          border-color: rgba(255, 45, 85, 0.4);
        }

        .action-icon-pill.active-repeat {
          color: var(--brand-primary);
          border-color: var(--border-active);
          background: rgba(255, 87, 34, 0.2);
        }

        .action-pill-count {
          position: absolute;
          bottom: -14px;
          font-size: 9px;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
          white-space: nowrap;
        }

        .vinyl-sound-disc {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #12131a;
          border: 2px solid #2a2c38;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          margin-top: 14px;
        }

        .vinyl-sound-disc.spinning {
          animation: spin 4s linear infinite;
        }

        .disc-groove {
          color: var(--brand-secondary);
        }

        /* Bottom Vignette Overlay */
        .player-bottom-vignette {
          position: absolute;
          left: 0;
          right: 64px;
          bottom: 0;
          padding: 20px 14px 18px 14px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
          z-index: 30;
          pointer-events: auto;
        }

        .creator-details-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }

        .creator-full-name {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
        }

        .verified-check {
          background: #3b82f6;
          color: #fff;
          font-size: 8px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .creator-handle-text {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .location-tag-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: var(--brand-secondary);
          margin-bottom: 4px;
        }

        .caption-text {
          font-size: 13px;
          color: #f1f5f9;
          line-height: 1.35;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .audio-sound-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.08);
          padding: 3px 8px;
          border-radius: 12px;
          width: fit-content;
          max-width: 90%;
        }

        .audio-marquee-track {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        /* Playback Progress */
        .playback-progress-track {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2.5px;
          background: rgba(255, 255, 255, 0.2);
          z-index: 40;
        }

        .playback-progress-fill {
          height: 100%;
          background: var(--brand-accent);
          transition: width 0.15s linear;
        }

        .playback-progress-fill.auto-mode {
          background: linear-gradient(90deg, #ff5722 0%, #10b981 100%);
        }

        /* ------------------------------------------------------------------ */
        /* DESKTOP COMPANION RAIL                                             */
        /* ------------------------------------------------------------------ */
        .desktop-companion-rail {
          width: 270px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .companion-box {
          background: var(--bg-card);
          border-radius: 14px;
          border: 1px solid var(--border-subtle);
          padding: 14px;
        }

        .companion-box-label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .nav-arrow-pair {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .arrow-button {
          flex: 1;
          height: 38px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .arrow-button:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .counter-tag {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .companion-subtext {
          display: block;
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 8px;
          text-align: center;
        }

        .spotlight-author-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .spotlight-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--brand-primary);
        }

        .spotlight-text h4 {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .spotlight-text p {
          font-size: 11px;
          color: var(--text-muted);
        }

        .spotlight-stats-row {
          display: flex;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          padding: 8px 0;
          margin-bottom: 12px;
        }

        .spotlight-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .spotlight-stat strong {
          font-size: 13px;
          color: #ffffff;
        }

        .spotlight-stat span {
          font-size: 10px;
          color: var(--text-muted);
        }

        .spotlight-follow-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          background: var(--brand-accent);
          color: #ffffff;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .soundtrack-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        .soundtrack-head h5 {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .soundtrack-head p {
          font-size: 10px;
          color: var(--text-muted);
        }

        .soundtrack-preview-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        /* ------------------------------------------------------------------ */
        /* MOBILE BOTTOM TAB BAR                                              */
        /* ------------------------------------------------------------------ */
        .mobile-tab-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: rgba(12, 13, 18, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-subtle);
          z-index: 95;
          align-items: center;
          justify-content: space-around;
          padding: 0 4px env(safe-area-inset-bottom, 0px) 4px;
        }

        .tab-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          gap: 2px;
          flex: 1;
          height: 100%;
        }

        .tab-nav-btn.active {
          color: var(--brand-primary);
        }

        .tab-title {
          font-size: 10px;
          font-weight: 600;
        }

        .tab-nav-btn.create-tab-btn {
          flex: 0 0 48px;
        }

        .create-bubble-icon {
          width: 42px;
          height: 30px;
          border-radius: 10px;
          background: var(--brand-accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 87, 34, 0.35);
        }

        /* ------------------------------------------------------------------ */
        /* SECONDARY TAB PAGES                                                */
        /* ------------------------------------------------------------------ */
        .tab-surface-page {
          max-width: 980px;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 24px 20px 80px 20px;
        }

        .page-header-row {
          margin-bottom: 24px;
          text-align: left;
        }

        .page-header-row h2 {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }

        .page-header-row p {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .live-streams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .live-stream-card {
          position: relative;
          height: 320px;
          border-radius: 14px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }

        .stream-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .live-stream-card:hover .stream-cover-img {
          transform: scale(1.04);
        }

        .stream-badge-live {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ef4444;
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
        }

        .stream-viewers-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
        }

        .stream-info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, transparent 100%);
          color: #fff;
        }

        .stream-info-overlay h4 {
          font-size: 14px;
          font-weight: 700;
        }

        .stream-info-overlay p {
          font-size: 11px;
          opacity: 0.8;
          margin-top: 2px;
        }

        /* Community Feed */
        .community-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .community-post-card {
          background: var(--bg-card);
          border-radius: 14px;
          border: 1px solid var(--border-subtle);
          overflow: hidden;
        }

        .post-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
        }

        .post-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .post-user-info {
          flex: 1;
        }

        .post-user-name {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .post-user-handle {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
        }

        .post-timestamp {
          font-size: 10px;
          color: var(--text-muted);
        }

        .post-media-box {
          width: 100%;
          height: 240px;
          background: #000;
        }

        .post-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .post-body-content {
          padding: 12px;
        }

        .post-caption-text {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.4;
          margin-bottom: 10px;
        }

        .post-action-buttons {
          display: flex;
          gap: 14px;
        }

        .post-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: transparent;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
        }

        .post-action-btn:hover {
          color: var(--text-primary);
        }

        /* Music Track Listing */
        .music-tracks-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .track-listing-item {
          display: flex;
          align-items: center;
          background: var(--bg-card);
          border-radius: 10px;
          border: 1px solid var(--border-subtle);
          padding: 10px 14px;
          gap: 12px;
        }

        .track-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: cover;
        }

        .track-details {
          flex: 1;
        }

        .track-details h4 {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .track-details p {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .genre-label {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .track-time-tag {
          font-size: 11px;
          color: var(--text-muted);
        }

        .track-play-action {
          padding: 5px 14px;
          border-radius: 16px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
        }

        /* Destinations */
        .destinations-showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .destination-feature-card {
          background: var(--bg-card);
          border-radius: 14px;
          border: 1px solid var(--border-subtle);
          overflow: hidden;
        }

        .destination-media-wrap {
          position: relative;
          height: 180px;
          background: #000;
        }

        .destination-media-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .destination-tag-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .destination-content {
          padding: 14px;
        }

        .destination-content h3 {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
        }

        .destination-content h4 {
          font-size: 11px;
          font-weight: 700;
          color: var(--brand-primary);
          margin: 2px 0 6px 0;
        }

        .destination-content p {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 10px;
        }

        .destination-view-btn {
          border: none;
          background: transparent;
          color: var(--brand-primary);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Profile Surface Card */
        .profile-surface-card {
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-subtle);
          overflow: hidden;
          max-width: 480px;
          margin: 0 auto;
        }

        .profile-banner-band {
          height: 100px;
          background: var(--brand-accent);
          position: relative;
          display: flex;
          justify-content: center;
        }

        .profile-avatar-center {
          position: absolute;
          bottom: -28px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #111827;
          border: 3px solid #111827;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          overflow: hidden;
        }

        .profile-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-card-body {
          padding: 38px 18px 24px 18px;
          text-align: center;
        }

        .profile-full-name {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
        }

        .profile-user-handle {
          font-size: 12px;
          color: var(--brand-primary);
          font-weight: 700;
          margin-top: 2px;
        }

        .profile-user-email {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .coins-balance-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 14px;
          margin: 18px 0;
          text-align: left;
        }

        .balance-label {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: var(--text-muted);
        }

        .balance-value {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          margin-top: 2px;
        }

        .topup-btn {
          background: var(--brand-accent);
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .profile-action-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Comments Bottom Sheet */
        .bottom-comments-sheet {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 440px;
          max-height: 70vh;
          background: #14161f;
          border-radius: 20px 20px 0 0;
          display: flex;
          flex-direction: column;
          padding: 14px 18px 20px 18px;
          animation: slideUp 0.2s ease-out;
          border-top: 1px solid var(--border-subtle);
          z-index: 210;
        }

        .sheet-drag-handle {
          width: 36px;
          height: 4px;
          border-radius: 2px;
          background: #334155;
          margin: 0 auto 10px auto;
        }

        .sheet-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .sheet-title-row h3 {
          font-size: 14px;
          font-weight: 700;
        }

        .sheet-close-cross {
          border: none;
          background: var(--bg-subtle);
          width: 26px;
          height: 26px;
          border-radius: 50%;
          color: #ffffff;
          cursor: pointer;
        }

        .sheet-comments-scroll {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 44vh;
          padding-right: 4px;
        }

        .comment-thread-item {
          display: flex;
          gap: 8px;
        }

        .comment-initial-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--brand-primary);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .comment-body-bubble {
          flex: 1;
          background: var(--bg-subtle);
          border-radius: 10px;
          padding: 8px 10px;
        }

        .comment-author-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .comment-author-name {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
        }

        .comment-time-ago {
          font-size: 9px;
          color: var(--text-muted);
        }

        .comment-message-text {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.35;
        }

        .comment-submit-form {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .comment-type-input {
          flex: 1;
          padding: 9px 12px;
          border-radius: 18px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: #ffffff;
          outline: none;
          font-size: 12px;
        }

        .comment-post-btn {
          padding: 7px 16px;
          border-radius: 18px;
          background: var(--brand-accent);
          color: #fff;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Modal Card */
        .modal-content-card {
          width: 100%;
          max-width: 380px;
          background: #14161f;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid var(--border-subtle);
          margin: auto;
        }

        .modal-header-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header-line h3 {
          font-size: 15px;
          font-weight: 800;
        }

        .modal-subtitle {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 4px 0 14px 0;
        }

        .gifts-selection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .gift-select-item {
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 10px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          color: #ffffff;
          transition: all 0.15s ease;
        }

        .gift-select-item:hover {
          border-color: var(--brand-primary);
          background: rgba(255, 87, 34, 0.12);
        }

        .gift-title {
          font-size: 11px;
          font-weight: 700;
        }

        .gift-cost {
          font-size: 10px;
          color: var(--brand-secondary);
          font-weight: 700;
        }

        .modal-actions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-accent-btn {
          background: var(--brand-accent);
          color: #ffffff;
          border: none;
          padding: 9px 18px;
          border-radius: 18px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }

        .action-hollow-btn {
          background: transparent;
          color: #ffffff;
          border: 1px solid var(--border-subtle);
          padding: 9px 18px;
          border-radius: 18px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }

        .action-accent-btn.full,
        .action-hollow-btn.full {
          width: 100%;
        }

        .empty-state-card {
          text-align: center;
          padding: 40px 20px;
          max-width: 360px;
          margin: 0 auto;
          color: var(--text-muted);
        }

        .empty-state-card h3 {
          margin: 12px 0 6px 0;
          font-size: 16px;
          color: #ffffff;
        }

        .empty-state-card p {
          font-size: 12px;
          margin-bottom: 14px;
        }

        .wudau-toast {
          position: fixed;
          top: 68px;
          left: 50%;
          transform: translateX(-50%);
          background: #1e212b;
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          z-index: 300;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          animation: dropIn 0.2s ease-out;
        }

        /* ------------------------------------------------------------------ */
        /* RESPONSIVE BREAKPOINTS (MOBILE FITNESS)                            */
        /* ------------------------------------------------------------------ */
        @media (max-width: 768px) {
          .site-header {
            padding: 0 12px;
            height: 52px;
          }

          .header-search-bar {
            display: none;
          }

          .icon-action-btn.mobile-only {
            display: flex;
          }

          .create-shortcut-btn {
            display: none;
          }

          .desktop-companion-rail {
            display: none;
          }

          .content-stage {
            min-height: calc(100dvh - 52px - 56px);
            padding-bottom: 56px;
          }

          .player-presentation-layout {
            padding: 0;
            width: 100%;
            height: calc(100dvh - 52px - 56px);
          }

          .video-player-card {
            width: 100vw;
            height: 100%;
            max-height: none;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }

          .player-actions-column {
            bottom: 64px;
            right: 8px;
            gap: 10px;
          }

          .player-bottom-vignette {
            right: 58px;
            padding: 14px 10px 12px 10px;
          }

          .mobile-tab-nav {
            display: flex;
          }

          .tab-surface-page {
            padding: 16px 12px 72px 12px;
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

        @keyframes dropIn {
          from { transform: translate(-50%, -15px); opacity: 0; }
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
