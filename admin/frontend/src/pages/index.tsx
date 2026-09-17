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

const IconChevronLeft = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polyline points="15 18 9 12 15 6" />
  </SvgIcon>
);

const IconChevronRight = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polyline points="9 18 15 12 9 6" />
  </SvgIcon>
);

const IconBookmark = ({ filled = false, size = 20 }: { filled?: boolean; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "#f59e0b" : "none"}
    stroke={filled ? "#f59e0b" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const IconClose = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </SvgIcon>
);

const IconSend = ({ size = 18 }: { size?: number }) => (
  <SvgIcon size={size}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </SvgIcon>
);

const IconCheck = ({ size = 14 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polyline points="20 6 9 17 4 12" />
  </SvgIcon>
);

const IconLayers = ({ size = 16 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
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
  isLike?: boolean;
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
  isLike?: boolean;
  isFollow?: boolean;
}

interface CommentItem {
  id?: string;
  _id?: string;
  userName: string;
  name?: string;
  userImage?: string;
  commentText?: string;
  text?: string;
  time: string;
  totalLikes?: number;
  isLike?: boolean;
}

interface GiftItem {
  _id?: string;
  id?: string;
  name?: string;
  coins?: number;
  coin?: number;
  image?: string;
}

interface SongItem {
  _id: string;
  songTitle: string;
  songImage: string;
  singerName: string;
  songTime: number | string;
  songLink: string;
  songCategoryName?: string;
  songCategoryImage?: string;
  isFavorite?: boolean;
}

interface LiveStreamItem {
  _id: string;
  name: string;
  userName: string;
  image: string;
  view: number;
  isLive: boolean;
  isVerified?: boolean;
  liveHistoryId?: string;
  countryFlagImage?: string;
  videoUrl?: string;
}

interface HashTagItem {
  _id: string;
  hashTag: string;
  hashTagIcon?: string;
  hashTagBanner?: string;
  totalHashTagUsedCount?: number;
}

export default function Home({
  initialVideos = [],
  initialPosts = [],
  initialHashtags = [],
  initialSongs = [],
  initialLiveStreams = [],
  initialGifts = [],
}: {
  initialVideos?: VideoItem[];
  initialPosts?: PostItem[];
  initialHashtags?: HashTagItem[];
  initialSongs?: SongItem[];
  initialLiveStreams?: LiveStreamItem[];
  initialGifts?: GiftItem[];
}) {
  const router = useRouter();

  // Navigation & Viewport State - Defaults to "reels" (Vertical Video Experience) with Auto-Scroll
  const [currentTab, setCurrentTab] = useState<"social" | "reels" | "live" | "music" | "explore" | "profile">("reels");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [language, setLanguage] = useState<string>("English");
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);

  // Content Data - 100% Backed by MongoDB Collections (Zero Mock Data)
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [hashtags, setHashtags] = useState<HashTagItem[]>(initialHashtags);
  const [songs, setSongs] = useState<SongItem[]>(initialSongs);
  const [liveStreams, setLiveStreams] = useState<LiveStreamItem[]>(initialLiveStreams);
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts || []);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Continuous Infinite Scroll for Home Social Feed
  const [postPage, setPostPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState<boolean>(false);
  const feedSentinelRef = useRef<HTMLDivElement | null>(null);

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

  // Community Posts Interactive State
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [selectedPostPhotoIndex, setSelectedPostPhotoIndex] = useState<number>(0);
  const [postLikesMap, setPostLikesMap] = useState<{ [postId: string]: boolean }>({});
  const [postLikesCount, setPostLikesCount] = useState<{ [postId: string]: number }>({});
  const [postCommentsCount, setPostCommentsCount] = useState<{ [postId: string]: number }>({});
  const [postCommentsMap, setPostCommentsMap] = useState<{ [postId: string]: CommentItem[] }>({});
  const [isLoadingPostComments, setIsLoadingPostComments] = useState<boolean>(false);
  const [newPostCommentText, setNewPostCommentText] = useState<string>("");
  const [followedUsersMap, setFollowedUsersMap] = useState<{ [userId: string]: boolean }>({});
  const [postHeartEffect, setPostHeartEffect] = useState<boolean>(false);
  const [cardPhotoIndices, setCardPhotoIndices] = useState<{ [postId: string]: number }>({});
  const [cardCommentInputs, setCardCommentInputs] = useState<{ [postId: string]: string }>({});

  // Music Preview in Sound Tab
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Real Comments from MongoDB
  const [commentsMap, setCommentsMap] = useState<{ [videoId: string]: CommentItem[] }>({});

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

  // Sync post states when posts change
  useEffect(() => {
    if (posts && posts.length) {
      const initialLikesMap: { [id: string]: boolean } = {};
      const initialLikesCount: { [id: string]: number } = {};
      const initialCommentsCount: { [id: string]: number } = {};
      const initialFollowMap: { [id: string]: boolean } = {};
      posts.forEach((p) => {
        initialLikesMap[p._id] = !!p.isLike;
        initialLikesCount[p._id] = p.totalLikes || 0;
        initialCommentsCount[p._id] = p.totalComments || 0;
        if (p.userId) {
          initialFollowMap[p.userId] = !!p.isFollow;
        }
      });
      setPostLikesMap((prev) => ({ ...initialLikesMap, ...prev }));
      setPostLikesCount((prev) => ({ ...initialLikesCount, ...prev }));
      setPostCommentsCount((prev) => ({ ...initialCommentsCount, ...prev }));
      setFollowedUsersMap((prev) => ({ ...initialFollowMap, ...prev }));
    }
  }, [posts]);

  // Fetch updated data from all MongoDB-backed API endpoints on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, pRes, hRes, sRes, lRes, gRes] = await Promise.all([
          axios.get("client/video/getAllVideos?start=1&limit=30", { headers: { key: secretKey } }).catch(() => ({ data: { data: [] } })),
          axios.get("client/post/getAllPosts?start=1&limit=30", { headers: { key: secretKey } }).catch(() => ({ data: { post: [] } })),
          axios.get("client/hashTag/hashtagDrop", { headers: { key: secretKey } }).catch(() => ({ data: { data: [] } })),
          axios.get("client/song/getSongsByUser", { headers: { key: secretKey } }).catch(() => ({ data: { songs: [] } })),
          axios.get("client/liveUser/getliveUserList", { headers: { key: secretKey } }).catch(() => ({ data: { liveUserList: [] } })),
          axios.get("client/gift/getGiftsForUser", { headers: { key: secretKey } }).catch(() => ({ data: { data: [] } })),
        ]);
        if (vRes.data?.data?.length) setVideos(vRes.data.data);
        if (pRes.data?.post?.length) setPosts(pRes.data.post);
        if (hRes.data?.data?.length) setHashtags(hRes.data.data);
        if (sRes.data?.songs?.length) setSongs(sRes.data.songs);
        if (lRes.data?.liveUserList?.length) setLiveStreams(lRes.data.liveUserList);
        if (gRes.data?.data?.length) setGifts(gRes.data.data);
      } catch (err) {
        console.warn("Client data fetch error:", err);
      }
    };
    fetchData();
  }, []);


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setShowCommentsDrawer(false);
        setShowGiftModal(false);
        setShowAuthModal(false);
        setMobileSearchOpen(false);
        setSelectedPost(null);
      }
      if (selectedPost && selectedPost.postImage && selectedPost.postImage.length > 1) {
        if (e.key === "ArrowLeft") {
          setSelectedPostPhotoIndex((prev) => (prev > 0 ? prev - 1 : selectedPost.postImage.length - 1));
        } else if (e.key === "ArrowRight") {
          setSelectedPostPhotoIndex((prev) => (prev < selectedPost.postImage.length - 1 ? prev + 1 : 0));
        }
      }
      if (currentTab === "reels" && !showCommentsDrawer && !showGiftModal && !showAuthModal && !selectedPost) {
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
  }, [currentTab, currentReelIndex, videos.length, showCommentsDrawer, showGiftModal, showAuthModal, selectedPost]);

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

  // Dynamic Categories from MongoDB hashtags
  const dynamicCategories = useMemo(() => {
    const base = [{ id: "all", label: "✦ For You" }];
    const tagList = (hashtags && hashtags.length > 0 ? hashtags : []).map((h) => ({
      id: h.hashTag.toLowerCase(),
      label: `#${h.hashTag}`,
      name: h.hashTag,
    }));
    return [...base, ...tagList];
  }, [hashtags]);

  // Feed Category Filter Options (Top 6 visible + Load More Option)
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const VISIBLE_CATEGORY_LIMIT = 6;

  const visibleCategories = useMemo(() => {
    if (showAllCategories) return dynamicCategories;
    const slice = dynamicCategories.slice(0, VISIBLE_CATEGORY_LIMIT);
    // Ensure active category is always visible in the chips row
    if (currentFilter !== "all" && !slice.some((c) => c.id === currentFilter)) {
      const activeCat = dynamicCategories.find((c) => c.id === currentFilter);
      if (activeCat) {
        slice.push(activeCat);
      }
    }
    return slice;
  }, [dynamicCategories, showAllCategories, currentFilter]);

  const remainingCategoryCount = useMemo(() => {
    return Math.max(0, dynamicCategories.length - VISIBLE_CATEGORY_LIMIT);
  }, [dynamicCategories]);

  // Dynamic Explore Destinations derived from real MongoDB posts & hashtags
  const dynamicExploreCards = useMemo(() => {
    const tagMap: { [tag: string]: { tag: string; name: string; count: number; image: string } } = {};
    posts.forEach((p) => {
      const tags = Array.isArray(p.hashTag) ? p.hashTag : [];
      const img = p.postImage?.[0] || p.mainPostImage || "storage/thumb1.jpg";
      tags.forEach((t) => {
        const clean = t.replace("#", "");
        if (!tagMap[clean]) {
          tagMap[clean] = {
            tag: clean,
            name: clean.replace(/([A-Z])/g, " $1").trim(),
            count: 1,
            image: img,
          };
        } else {
          tagMap[clean].count += 1;
        }
      });
    });

    hashtags.forEach((h) => {
      const clean = h.hashTag.replace("#", "");
      if (!tagMap[clean]) {
        tagMap[clean] = {
          tag: clean,
          name: clean.replace(/([A-Z])/g, " $1").trim(),
          count: h.totalHashTagUsedCount || 1,
          image: h.hashTagIcon || h.hashTagBanner || "storage/thumb1.jpg",
        };
      }
    });

    return Object.values(tagMap);
  }, [posts, hashtags]);

  // Fully Dynamic Filter for Videos (Reels)
  const filteredVideos = useMemo(() => {
    let list = videos;
    if (currentFilter !== "all") {
      const f = currentFilter.toLowerCase().replace("#", "").trim();
      list = list.filter((v) => {
        const tags = Array.isArray(v.hashTag) ? v.hashTag.map((t: string) => t.toLowerCase()) : [];
        const caption = (v.caption || "").toLowerCase();
        const loc = (v.location || "").toLowerCase();
        const name = (v.name || "").toLowerCase();
        const userName = (v.userName || "").toLowerCase();
        return tags.some((t: string) => t.includes(f) || f.includes(t)) || caption.includes(f) || loc.includes(f) || name.includes(f) || userName.includes(f);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          (v.caption || "").toLowerCase().includes(q) ||
          (v.name || "").toLowerCase().includes(q) ||
          (v.userName || "").toLowerCase().includes(q) ||
          (v.location || "").toLowerCase().includes(q) ||
          (Array.isArray(v.hashTag) && v.hashTag.some((h: string) => h.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [videos, currentFilter, searchQuery]);

  // Fully Dynamic Filter for Posts (Home Feed)
  const filteredPosts = useMemo(() => {
    let list = posts;
    if (currentFilter !== "all") {
      const f = currentFilter.toLowerCase().replace("#", "").trim();
      list = list.filter((p) => {
        const tags = Array.isArray(p.hashTag) ? p.hashTag.map((t: string) => t.toLowerCase()) : [];
        const caption = (p.caption || "").toLowerCase();
        const loc = (p.location || "").toLowerCase();
        const name = (p.name || "").toLowerCase();
        const userName = (p.userName || "").toLowerCase();
        return tags.some((t: string) => t.includes(f) || f.includes(t)) || caption.includes(f) || loc.includes(f) || name.includes(f) || userName.includes(f);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.caption || "").toLowerCase().includes(q) ||
          (p.name || "").toLowerCase().includes(q) ||
          (p.userName || "").toLowerCase().includes(q) ||
          (p.location || "").toLowerCase().includes(q) ||
          (Array.isArray(p.hashTag) && p.hashTag.some((h: string) => h.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [posts, currentFilter, searchQuery]);

  const handleInlinePostComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = (cardCommentInputs[postId] || "").trim();
    if (!commentText) return;

    const commenterName = currentUser?.userName || "@You";
    const commenterDisplayName = currentUser?.name || "You";
    const commenterImage = currentUser?.image || "storage/avatar_kassim.png";

    const newCommentItem: CommentItem = {
      _id: "inline_" + Date.now(),
      id: "inline_" + Date.now(),
      userName: commenterName,
      name: commenterDisplayName,
      userImage: commenterImage,
      commentText: commentText,
      text: commentText,
      time: "Just now",
      totalLikes: 0,
      isLike: false,
    };

    setPostCommentsMap((prev) => ({
      ...prev,
      [postId]: [newCommentItem, ...(prev[postId] || [])],
    }));

    setPostCommentsCount((prev) => ({
      ...prev,
      [postId]: (postCommentsCount[postId] || 0) + 1,
    }));

    setCardCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    showToast("Comment posted 💬");

    const userIdParam = currentUser?._id ? `&userId=${currentUser._id}` : "";
    axios
      .post(
        `client/postOrvideoComment/postComment?postId=${postId}&type=post${userIdParam}`,
        { commentText },
        { headers: { key: secretKey } }
      )
      .catch((err) => console.warn("Inline comment sync error:", err));
  };

  // Continuous Social Feed: Infinite Scroll Loader
  const loadMorePosts = async () => {
    if (isLoadingMorePosts || !hasMorePosts) return;
    setIsLoadingMorePosts(true);
    try {
      const nextPage = postPage + 1;
      const res = await axios.get(`client/post/getAllPosts?start=${nextPage}&limit=10`, {
        headers: { key: secretKey },
      });
      const newPosts: PostItem[] = res.data?.post || [];
      if (!newPosts.length) {
        setHasMorePosts(false);
      } else {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const fresh = newPosts.filter((np) => !existingIds.has(np._id));
          if (fresh.length === 0) {
            setHasMorePosts(false);
            return prev;
          }
          return [...prev, ...fresh];
        });
        setPostPage(nextPage);
      }
    } catch (err) {
      console.warn("Error loading more posts:", err);
    } finally {
      setIsLoadingMorePosts(false);
    }
  };

  // Infinite Scroll Trigger for Continuous Feed
  useEffect(() => {
    if (currentTab !== "social") return;
    const sentinel = feedSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePosts && !isLoadingMorePosts) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentTab, hasMorePosts, isLoadingMorePosts, postPage]);

  const activeVideo = filteredVideos[currentReelIndex] || filteredVideos[0];

  // Fetch real video comments when comments drawer opens
  useEffect(() => {
    if (showCommentsDrawer && activeVideo?._id) {
      const userIdParam = currentUser?._id ? `&userId=${currentUser._id}` : "";
      axios
        .get(`client/postOrvideoComment/getpostOrvideoComments?videoId=${activeVideo._id}&type=video${userIdParam}`, {
          headers: { key: secretKey },
        })
        .then((res) => {
          if (res.data?.status && Array.isArray(res.data.postOrVideoComment) && res.data.postOrVideoComment.length > 0) {
            setCommentsMap((prev) => ({ ...prev, [activeVideo._id]: res.data.postOrVideoComment }));
          }
        })
        .catch((err) => console.warn("Fetch video comments error:", err));
    }
  }, [showCommentsDrawer, activeVideo?._id]);

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
    showToast(wasLiked ? "Unliked" : "Liked reel ❤️");

    const userIdParam = currentUser?._id ? `&userId=${currentUser._id}` : "";
    axios
      .post(`client/video/likeOrDislikeOfVideo?videoId=${id}${userIdParam}`, {}, { headers: { key: secretKey } })
      .catch((err) => console.warn("Video like sync error:", err));
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
    const coins = gift.coin || gift.coins || 10;
    const name = gift.name || `${coins} Coins`;
    showToast(`Sent ${name} (${coins} coins) to ${activeVideo?.name || "Creator"}`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const vidId = activeVideo?._id || "default";
    const text = commentInput.trim();
    const currentList = commentsMap[vidId] || commentsMap["default"] || [];
    const commenterName = currentUser?.userName || "@You";
    const newComment: CommentItem = {
      id: "c_" + Date.now(),
      _id: "c_" + Date.now(),
      userName: commenterName,
      text: text,
      commentText: text,
      time: "Just now",
    };
    setCommentsMap({ ...commentsMap, [vidId]: [newComment, ...currentList] });
    setCommentInput("");
    showToast("Comment posted 💬");

    if (activeVideo?._id) {
      const userIdParam = currentUser?._id ? `&userId=${currentUser._id}` : "";
      axios
        .post(
          `client/postOrvideoComment/commentOfPostOrVideo?videoId=${activeVideo._id}&commentText=${encodeURIComponent(text)}&type=video${userIdParam}`,
          {},
          { headers: { key: secretKey } }
        )
        .catch((err) => console.warn("Video comment error:", err));
    }
  };

  // ============================================================================
  // COMMUNITY POST INTERACTION HANDLERS
  // ============================================================================
  const handleTogglePostLike = (post: PostItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const pid = post._id;
    const isLiked = postLikesMap[pid] !== undefined ? postLikesMap[pid] : !!post.isLike;
    const curCount = postLikesCount[pid] !== undefined ? postLikesCount[pid] : (post.totalLikes || 0);

    const nextLiked = !isLiked;
    const nextCount = nextLiked ? curCount + 1 : Math.max(0, curCount - 1);

    setPostLikesMap((prev) => ({ ...prev, [pid]: nextLiked }));
    setPostLikesCount((prev) => ({ ...prev, [pid]: nextCount }));

    if (nextLiked) {
      setPostHeartEffect(true);
      setTimeout(() => setPostHeartEffect(false), 700);
      showToast("Liked post ❤️");
    } else {
      showToast("Unliked post");
    }

    const userIdParam = currentUser?._id ? `&userId=${currentUser._id}` : "";
    axios
      .post(`client/post/likeOrDislikeOfPost?postId=${pid}${userIdParam}`, {}, { headers: { key: secretKey } })
      .catch((err) => console.warn("Post like sync error:", err));
  };

  const handleOpenPostModal = (post: PostItem, focusComment = false) => {
    setSelectedPost(post);
    setSelectedPostPhotoIndex(0);
    setNewPostCommentText("");

    setIsLoadingPostComments(true);
    const userIdParam = currentUser?._id ? `&userId=${currentUser._id}` : "";
    axios
      .get(`client/postOrvideoComment/getpostOrvideoComments?postId=${post._id}&type=post${userIdParam}`, {
        headers: { key: secretKey },
      })
      .then((res) => {
        if (res.data?.status && Array.isArray(res.data.postOrVideoComment)) {
          setPostCommentsMap((prev) => ({ ...prev, [post._id]: res.data.postOrVideoComment }));
          setPostCommentsCount((prev) => ({ ...prev, [post._id]: res.data.postOrVideoComment.length }));
        }
      })
      .catch((err) => console.warn("Fetch post comments error:", err))
      .finally(() => setIsLoadingPostComments(false));
  };

  const handleClosePostModal = () => {
    setSelectedPost(null);
    setSelectedPostPhotoIndex(0);
    setNewPostCommentText("");
  };

  const handleAddPostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostCommentText.trim() || !selectedPost) return;

    const pid = selectedPost._id;
    const text = newPostCommentText.trim();
    const commenterName = currentUser?.userName || "@You";
    const commenterDisplayName = currentUser?.name || "You";
    const commenterImage = currentUser?.image || "storage/avatar_kassim.png";

    const newCommentItem: CommentItem = {
      _id: "temp_" + Date.now(),
      id: "temp_" + Date.now(),
      userName: commenterName,
      name: commenterDisplayName,
      userImage: commenterImage,
      commentText: text,
      text: text,
      time: "Just now",
      totalLikes: 0,
      isLike: false,
    };

    const currentList = postCommentsMap[pid] || [];
    setPostCommentsMap((prev) => ({
      ...prev,
      [pid]: [newCommentItem, ...currentList],
    }));

    const curCount = postCommentsCount[pid] !== undefined ? postCommentsCount[pid] : (selectedPost.totalComments || 0);
    setPostCommentsCount((prev) => ({ ...prev, [pid]: curCount + 1 }));

    setNewPostCommentText("");
    showToast("Comment posted 💬");

    const userIdParam = currentUser?._id ? `&userId=${currentUser._id}` : "";
    axios
      .post(
        `client/postOrvideoComment/commentOfPostOrVideo?postId=${pid}&commentText=${encodeURIComponent(text)}&type=post${userIdParam}`,
        {},
        { headers: { key: secretKey } }
      )
      .catch((err) => console.warn("Post comment sync error:", err));
  };

  const handleToggleFollow = (creatorUserId: string, userName?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isFollowed = !!followedUsersMap[creatorUserId];
    setFollowedUsersMap((prev) => ({ ...prev, [creatorUserId]: !isFollowed }));
    showToast(isFollowed ? `Unfollowed ${userName || "creator"}` : `Following ${userName || "creator"} ✨`);
  };

  const handleSharePost = (post: PostItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/?tab=social&postId=${post._id}`;
      if (navigator.share) {
        navigator
          .share({
            title: post.caption || "View post on WUDAU",
            url,
          })
          .catch(() => {});
      } else {
        navigator.clipboard?.writeText(url);
        showToast("Post link copied to clipboard");
      }
    }
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
            <Link
              href="/"
              className="brand-link"
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab("reels");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="brand-logo-mark">W</div>
              <span className="brand-name">WUDAU</span>
            </Link>
          </div>

          {/* Primary Navigation Tabs */}
          <div className="header-center">
            <nav className="header-main-nav">
              <button
                onClick={() => {
                  setCurrentTab("reels");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`header-nav-tab ${currentTab === "reels" ? "active" : ""}`}
                title="Vertical Reels"
              >
                <IconReels size={16} />
                <span>Reels</span>
              </button>
              <button
                onClick={() => {
                  setCurrentTab("social");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`header-nav-tab ${currentTab === "social" ? "active" : ""}`}
                title="Community Feed"
              >
                <IconCommunity size={16} />
                <span>Feed</span>
              </button>
              <button
                onClick={() => {
                  setCurrentTab("explore");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`header-nav-tab ${currentTab === "explore" ? "active" : ""}`}
                title="Explore Topics"
              >
                <IconCompass size={16} />
                <span>Explore</span>
              </button>
              <button
                onClick={() => {
                  setCurrentTab("live");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`header-nav-tab ${currentTab === "live" ? "active" : ""}`}
                title="Live Broadcasts"
              >
                <IconLive size={16} />
                <span>Live</span>
              </button>
              <button
                onClick={() => {
                  setCurrentTab("music");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`header-nav-tab ${currentTab === "music" ? "active" : ""}`}
                title="Soundtracks & Music"
              >
                <IconMusic size={16} />
                <span>Music</span>
              </button>
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

              {/* Trending Hashtags from MongoDB */}
              <div className="drawer-nav-group">
                <span className="drawer-group-label">TRENDING HASHTAGS</span>
                <div className="cultural-channels-list">
                  {(hashtags && hashtags.length > 0 ? hashtags.slice(0, 8) : []).map((chan) => (
                    <button
                      key={chan._id || chan.hashTag}
                      onClick={() => {
                        setCurrentFilter(chan.hashTag.toLowerCase());
                        setCurrentTab("social");
                        setCurrentReelIndex(0);
                        setIsMenuOpen(false);
                      }}
                      className="cultural-channel-row"
                    >
                      <span className="channel-title">#{chan.hashTag}</span>
                      <span className="channel-region-pill">{chan.totalHashTagUsedCount ? `${chan.totalHashTagUsedCount} posts` : "Trending"}</span>
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
                {liveStreams.length === 0 ? (
                  <div className="empty-state-card" style={{ gridColumn: "1 / -1" }}>
                    <IconLive size={36} />
                    <h3>No creators currently live</h3>
                    <p>Live creator streams will appear here in real-time as stages go on air.</p>
                  </div>
                ) : (
                  liveStreams.map((stream) => (
                    <div
                      key={stream._id}
                      onClick={() => {
                        setCurrentTab("reels");
                        showToast(`Entering live broadcast: ${stream.name}`);
                      }}
                      className="live-stream-card"
                    >
                      <img src={resolveMedia(stream.image)} alt={stream.name} className="stream-cover-img" />
                      <div className="stream-badge-live">LIVE</div>
                      <div className="stream-viewers-pill">{(stream.view || 1500).toLocaleString()} watching</div>
                      <div className="stream-info-overlay">
                        <h4>{stream.name}</h4>
                        <p>Hosted by {stream.userName}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY SOCIAL FEED (FLUID CONTINUOUS SCROLLING FEED) */}
          {currentTab === "social" && (
            <div className="tab-surface-page social-feed-viewport">
              {/* Creator Stories & Reels Highlights Row */}
              <div className="stories-tray-container">
                <div className="stories-track">
                  {videos.slice(0, 10).map((vid, idx) => {
                    const isCreatorLive = liveStreams.some(
                      (l) => (l.userName || "").toLowerCase() === (vid.userName || "").toLowerCase()
                    );
                    return (
                      <div
                        key={vid._id || idx}
                        onClick={() => {
                          setCurrentReelIndex(idx);
                          setCurrentTab("reels");
                          showToast(`Watching @${vid.userName}`);
                        }}
                        className="story-avatar-item"
                      >
                        <div className={`story-ring-wrap ${isCreatorLive ? "live-ring" : ""}`}>
                          <img src={resolveMedia(vid.userImage)} alt={vid.name} className="story-img" />
                          {isCreatorLive && <span className="story-live-badge">LIVE</span>}
                        </div>
                        <span className="story-label">{vid.name.split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feed Category Filter Chips Bar */}
              <div className="feed-category-chips-bar">
                <div className={`chips-scroll-track ${showAllCategories ? "expanded" : ""}`}>
                  {visibleCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCurrentFilter(cat.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`feed-category-chip ${currentFilter === cat.id ? "active" : ""}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                  {remainingCategoryCount > 0 && (
                    <button
                      onClick={() => setShowAllCategories((prev) => !prev)}
                      className="feed-category-more-btn"
                      title={showAllCategories ? "Show fewer categories" : "Load more topic options"}
                    >
                      {showAllCategories ? "Show Less ▴" : `+ More Topics (${remainingCategoryCount}) ▾`}
                    </button>
                  )}
                  {currentFilter !== "all" && (
                    <button
                      onClick={() => {
                        setCurrentFilter("all");
                        setSearchQuery("");
                      }}
                      className="feed-category-reset-chip"
                      title="Clear active filter"
                    >
                      ✕ All Posts
                    </button>
                  )}
                </div>
              </div>

              {/* Main Social Posts Stream */}
              <div className="social-timeline-stream">
                {filteredPosts.length === 0 ? (
                  <div className="empty-state-card">
                    <IconSearch size={36} />
                    <h3>No posts found in this category</h3>
                    <p>Try switching categories or exploring all community posts.</p>
                    <button
                      onClick={() => {
                        setCurrentFilter("all");
                        setSearchQuery("");
                      }}
                      className="action-accent-btn"
                    >
                      Show All Posts
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post) => {
                    const isPostLiked = postLikesMap[post._id] !== undefined ? postLikesMap[post._id] : !!post.isLike;
                    const currentLikes = postLikesCount[post._id] !== undefined ? postLikesCount[post._id] : (post.totalLikes || 0);
                    const currentComments = postCommentsCount[post._id] !== undefined ? postCommentsCount[post._id] : (post.totalComments || 0);
                    const isCreatorFollowed = !!followedUsersMap[post.userId];
                    const photos = post.postImage && post.postImage.length > 0 ? post.postImage : [post.mainPostImage || "storage/thumb1.jpg"];
                    const activePhotoIdx = cardPhotoIndices[post._id] || 0;
                    const currentCardPhoto = photos[activePhotoIdx] || photos[0];
                    const commentsForPost = postCommentsMap[post._id] || [];

                    return (
                      <article key={post._id} className="timeline-post-card">
                        {/* Header: Author & Location & Follow */}
                        <div className="timeline-card-header">
                          <img
                            src={resolveMedia(post.userImage)}
                            alt={post.name}
                            className="timeline-user-avatar"
                            onClick={() => handleOpenPostModal(post)}
                          />
                          <div className="timeline-user-meta" onClick={() => handleOpenPostModal(post)}>
                            <div className="timeline-name-line">
                              <span className="timeline-author-name">{post.name}</span>
                              {post.isVerified && (
                                <span className="verified-icon-badge" title="Verified Creator">
                                  <IconCheck size={12} />
                                </span>
                              )}
                            </div>
                            <span className="timeline-author-handle">
                              {post.location ? (
                                <span className="location-pin-wrap">
                                  <IconMapPin size={11} /> {post.location}
                                </span>
                              ) : (
                                post.userName
                              )}
                            </span>
                          </div>

                          <div className="timeline-header-actions">
                            {post.userId && (
                              <button
                                onClick={(e) => handleToggleFollow(post.userId, post.userName, e)}
                                className={`post-card-follow-btn ${isCreatorFollowed ? "active" : ""}`}
                              >
                                {isCreatorFollowed ? "Following" : "Follow"}
                              </button>
                            )}
                            <span className="timeline-post-time">{post.time || "Recently"}</span>
                          </div>
                        </div>

                        {/* Media Carousel / Photo Stage */}
                        <div
                          className="timeline-media-stage"
                          onDoubleClick={(e) => handleTogglePostLike(post, e)}
                        >
                          <img
                            src={resolveMedia(currentCardPhoto)}
                            alt={post.caption || "Post Media"}
                            className="timeline-main-photo"
                            onClick={() => handleOpenPostModal(post)}
                          />

                          {/* Multi-photo carousel buttons */}
                          {photos.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardPhotoIndices((prev) => ({
                                    ...prev,
                                    [post._id]: (activePhotoIdx - 1 + photos.length) % photos.length,
                                  }));
                                }}
                                className="carousel-nav-arrow left"
                                aria-label="Previous photo"
                              >
                                ‹
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardPhotoIndices((prev) => ({
                                    ...prev,
                                    [post._id]: (activePhotoIdx + 1) % photos.length,
                                  }));
                                }}
                                className="carousel-nav-arrow right"
                                aria-label="Next photo"
                              >
                                ›
                              </button>
                              <div className="carousel-dots-indicator">
                                {photos.map((_, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className={`carousel-dot ${pIdx === activePhotoIdx ? "active" : ""}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Action Toolbar */}
                        <div className="timeline-actions-row">
                          <div className="timeline-actions-left">
                            <button
                              onClick={(e) => handleTogglePostLike(post, e)}
                              className={`timeline-action-icon-btn ${isPostLiked ? "liked" : ""}`}
                              title={isPostLiked ? "Unlike" : "Like"}
                            >
                              <IconHeart size={20} filled={isPostLiked} />
                            </button>
                            <button
                              onClick={() => handleOpenPostModal(post, true)}
                              className="timeline-action-icon-btn"
                              title="Comments"
                            >
                              <IconMessage size={20} />
                            </button>
                            <button
                              onClick={(e) => handleSharePost(post, e)}
                              className="timeline-action-icon-btn"
                              title="Share"
                            >
                              <IconShare size={20} />
                            </button>
                          </div>
                          <button
                            onClick={() => showToast("Post saved to bookmarks 🔖")}
                            className="timeline-action-icon-btn"
                            title="Save post"
                          >
                            <IconBookmark size={20} />
                          </button>
                        </div>

                        {/* Likes Count Row */}
                        <div className="timeline-likes-count">
                          <strong>{currentLikes.toLocaleString()} likes</strong>
                        </div>

                        {/* Category / Hashtag Chips */}
                        {Array.isArray(post.hashTag) && post.hashTag.length > 0 && (
                          <div className="timeline-hashtags-row">
                            {post.hashTag.map((t, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setCurrentFilter(t.toLowerCase().replace("#", ""));
                                }}
                                className="timeline-tag-pill"
                              >
                                #{t.replace("#", "")}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Caption Section */}
                        <div className="timeline-caption-row">
                          <span className="caption-author-handle">{post.userName}</span>{" "}
                          <span className="caption-text-content">{post.caption}</span>
                        </div>

                        {/* Live Comments Preview */}
                        <div className="timeline-comments-section">
                          {currentComments > 0 && (
                            <button
                              onClick={() => handleOpenPostModal(post, true)}
                              className="view-all-comments-link"
                            >
                              View all {currentComments} comments
                            </button>
                          )}
                          {commentsForPost.slice(0, 2).map((c, cIdx) => (
                            <div key={c._id || cIdx} className="timeline-comment-snippet">
                              <span className="comment-snippet-user">{c.userName}</span>{" "}
                              <span className="comment-snippet-text">{c.commentText || c.text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Fast Inline Comment Form */}
                        <form
                          onSubmit={(e) => handleInlinePostComment(post._id, e)}
                          className="timeline-inline-comment-form"
                        >
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={cardCommentInputs[post._id] || ""}
                            onChange={(e) =>
                              setCardCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))
                            }
                            className="timeline-inline-input"
                          />
                          <button
                            type="submit"
                            disabled={!(cardCommentInputs[post._id] || "").trim()}
                            className="timeline-inline-submit-btn"
                          >
                            Post
                          </button>
                        </form>
                      </article>
                    );
                  })
                )}

                {/* Continuous Infinite Scroll Sentinel */}
                <div ref={feedSentinelRef} className="feed-infinite-scroll-sentinel">
                  {isLoadingMorePosts && (
                    <div className="feed-scroll-loader">
                      <div className="scroll-loader-spinner" />
                      <span>Pulling more posts...</span>
                    </div>
                  )}
                  {!hasMorePosts && filteredPosts.length > 0 && (
                    <div className="feed-end-message">
                      <span className="end-badge">✦ All caught up</span>
                      <p>You have seen all recent community posts from your favorite creators.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOUNDS & MUSIC LIBRARY (100% REAL FROM MONGODB) */}
          {currentTab === "music" && (
            <div className="tab-surface-page">
              <div className="page-header-row">
                <h2>Soundtracks & Music</h2>
                <p>Explore authentic African rhythms, Bongo Flava, Singeli, and global collaborations from MongoDB.</p>
              </div>
              <div className="music-tracks-grid">
                {songs.length === 0 ? (
                  <div className="empty-state-card" style={{ gridColumn: "1 / -1" }}>
                    <IconMusic size={36} />
                    <h3>No soundtracks available</h3>
                    <p>New tracks uploaded by artists will appear here.</p>
                  </div>
                ) : (
                  songs.map((track) => (
                    <div key={track._id} className="track-listing-item">
                      <img
                        src={resolveMedia(track.songImage || "storage/category_bongo.jpg")}
                        alt={track.songTitle}
                        className="track-thumb"
                      />
                      <div className="track-details">
                        <h4>{track.songTitle}</h4>
                        <p>
                          {track.singerName} • <span className="genre-label">{track.songCategoryName || "Original Sound"}</span>
                        </p>
                      </div>
                      <span className="track-time-tag">0:{track.songTime}</span>
                      <button
                        onClick={() => handleToggleMusic(track.songLink)}
                        className={`track-play-action ${playingAudioUrl === resolveMedia(track.songLink) ? "playing" : ""}`}
                      >
                        {playingAudioUrl === resolveMedia(track.songLink) ? "Pause" : "Play"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DISCOVER & EXPLORE SHOWCASE (DERIVED FROM MONGODB) */}
          {currentTab === "explore" && (
            <div className="tab-surface-page">
              <div className="page-header-row">
                <h2>Explore & Discover</h2>
                <p>Natural beauty, cultural rhythm, and authentic creator moments aggregated from real posts across WUDAU.</p>
              </div>
              <div className="destinations-showcase-grid">
                {dynamicExploreCards.length === 0 ? (
                  <div className="empty-state-card" style={{ gridColumn: "1 / -1" }}>
                    <IconCompass size={36} />
                    <h3>No destinations discovered yet</h3>
                  </div>
                ) : (
                  dynamicExploreCards.map((item, i) => (
                    <div key={i} className="destination-feature-card">
                      <div className="destination-media-wrap">
                        <img src={resolveMedia(item.image)} alt={item.name} />
                        <span className="destination-tag-badge">#{item.tag}</span>
                      </div>
                      <div className="destination-content">
                        <h3>{item.name}</h3>
                        <h4>Trending Culture Topic</h4>
                        <p>{item.count} community posts, reels, and stories shared by creators.</p>
                        <button
                          onClick={() => {
                            setCurrentFilter(item.tag.toLowerCase());
                            setCurrentTab("social");
                            showToast(`Exploring #${item.tag} feed`);
                          }}
                          className="destination-view-btn"
                        >
                          Explore #{item.tag} Feed →
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
                {(commentsMap[activeVideo._id] || commentsMap["default"] || []).map((c, idx) => (
                  <div key={c._id || c.id || idx} className="comment-thread-item">
                    {c.userImage ? (
                      <img src={resolveMedia(c.userImage)} alt={c.userName} className="comment-thread-avatar-img" />
                    ) : (
                      <div className="comment-initial-badge">
                        {(c.userName || "U").slice(1, 3).toUpperCase()}
                      </div>
                    )}
                    <div className="comment-body-bubble">
                      <div className="comment-author-line">
                        <span className="comment-author-name">{c.userName || c.name}</span>
                        <span className="comment-time-ago">{c.time}</span>
                      </div>
                      <p className="comment-message-text">{c.commentText || c.text}</p>
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
        {/* POST DETAIL & INTERACTIVE COMMENTS MODAL                            */}
        {/* ==================================================================== */}
        {selectedPost && (
          <div className="post-modal-overlay" onClick={handleClosePostModal}>
            <div className="post-modal-container" onClick={(e) => e.stopPropagation()}>
              {/* LEFT: MEDIA CAROUSEL AREA */}
              <div
                className="post-modal-media-col"
                onDoubleClick={(e) => handleTogglePostLike(selectedPost, e)}
              >
                {/* Current Image */}
                {selectedPost.postImage && selectedPost.postImage.length > 0 ? (
                  <img
                    src={resolveMedia(
                      selectedPost.postImage[selectedPostPhotoIndex] ||
                        selectedPost.mainPostImage ||
                        selectedPost.postImage[0]
                    )}
                    alt={selectedPost.caption}
                    className="post-modal-media-img"
                  />
                ) : (
                  <img
                    src={resolveMedia(selectedPost.mainPostImage || selectedPost.postImage?.[0])}
                    alt={selectedPost.caption}
                    className="post-modal-media-img"
                  />
                )}

                {/* Double click floating heart burst */}
                {postHeartEffect && (
                  <div className="modal-floating-heart-burst">
                    <IconHeart size={90} filled={true} />
                  </div>
                )}

                {/* Carousel Prev/Next Controls */}
                {selectedPost.postImage && selectedPost.postImage.length > 1 && (
                  <>
                    <button
                      className="carousel-btn prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPostPhotoIndex((prev) =>
                          prev > 0 ? prev - 1 : selectedPost.postImage.length - 1
                        );
                      }}
                      title="Previous photo (Arrow Left)"
                    >
                      <IconChevronLeft size={20} />
                    </button>
                    <button
                      className="carousel-btn next"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPostPhotoIndex((prev) =>
                          prev < selectedPost.postImage.length - 1 ? prev + 1 : 0
                        );
                      }}
                      title="Next photo (Arrow Right)"
                    >
                      <IconChevronRight size={20} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="carousel-dots-row">
                      {selectedPost.postImage.map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`carousel-dot ${dotIdx === selectedPostPhotoIndex ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPostPhotoIndex(dotIdx);
                          }}
                        />
                      ))}
                    </div>

                    {/* Counter Badge */}
                    <span className="carousel-counter-tag">
                      {selectedPostPhotoIndex + 1} / {selectedPost.postImage.length}
                    </span>
                  </>
                )}
              </div>

              {/* RIGHT: DETAILS & COMMENTS THREAD */}
              <div className="post-modal-details-col">
                {/* Header: Author Info */}
                <div className="modal-author-header">
                  <div className="modal-author-left">
                    <img
                      src={resolveMedia(selectedPost.userImage)}
                      alt={selectedPost.name}
                      className="modal-author-avatar"
                    />
                    <div className="modal-author-names">
                      <div className="modal-author-display-name">
                        <span>{selectedPost.name}</span>
                        {selectedPost.isVerified && (
                          <span className="verified-icon-badge" title="Verified Creator">
                            <IconCheck size={13} />
                          </span>
                        )}
                      </div>
                      <span className="modal-author-location">
                        {selectedPost.location ? (
                          <>
                            <IconMapPin size={11} /> {selectedPost.location}
                          </>
                        ) : (
                          selectedPost.userName
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="modal-header-actions">
                    {selectedPost.userId && (
                      <button
                        onClick={(e) => handleToggleFollow(selectedPost.userId, selectedPost.userName, e)}
                        className={`follow-toggle-btn ${followedUsersMap[selectedPost.userId] ? "active" : ""}`}
                      >
                        {followedUsersMap[selectedPost.userId] ? "Following" : "Follow"}
                      </button>
                    )}
                    <button
                      onClick={handleClosePostModal}
                      className="modal-close-x"
                      title="Close (Esc)"
                    >
                      <IconClose size={20} />
                    </button>
                  </div>
                </div>

                {/* Scrollable Comments & Caption Thread */}
                <div className="modal-comments-thread">
                  {/* Original Post Caption */}
                  <div className="modal-original-caption-box">
                    <img
                      src={resolveMedia(selectedPost.userImage)}
                      alt={selectedPost.name}
                      className="caption-avatar"
                    />
                    <div className="caption-content">
                      <span className="caption-author">{selectedPost.userName}</span>
                      <span className="caption-text">
                        {selectedPost.caption.split(" ").map((word, wIdx) => {
                          if (word.startsWith("#")) {
                            return (
                              <span key={wIdx} className="caption-hashtag">
                                {word}{" "}
                              </span>
                            );
                          }
                          return word + " ";
                        })}
                      </span>
                      <span className="caption-time">{selectedPost.time || "Recently"}</span>
                    </div>
                  </div>

                  {/* Comments List */}
                  {isLoadingPostComments ? (
                    <div className="comments-loading-state">
                      <div className="comments-spinner" />
                      <span>Loading comments...</span>
                    </div>
                  ) : (postCommentsMap[selectedPost._id] || []).length === 0 ? (
                    <div className="comments-empty-state">
                      <IconMessage size={32} />
                      <p className="empty-title">No comments yet</p>
                      <p className="empty-desc">Start the conversation! Share what you think about this post.</p>
                    </div>
                  ) : (
                    (postCommentsMap[selectedPost._id] || []).map((comment, cIdx) => (
                      <div key={comment._id || comment.id || cIdx} className="single-comment-item">
                        {comment.userImage ? (
                          <img
                            src={resolveMedia(comment.userImage)}
                            alt={comment.userName}
                            className="comment-user-avatar"
                          />
                        ) : (
                          <div className="comment-user-avatar placeholder">
                            {(comment.name || comment.userName || "U").slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className="comment-text-box">
                          <div className="comment-header-line">
                            <span className="comment-handle">{comment.userName || comment.name}</span>
                            <span className="comment-timestamp">{comment.time || "Recently"}</span>
                          </div>
                          <p className="comment-body-text">{comment.commentText || comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer: Action Bar */}
                <div className="modal-action-bar">
                  <div className="modal-actions-row">
                    <div className="modal-actions-left">
                      <button
                        onClick={(e) => handleTogglePostLike(selectedPost, e)}
                        className={`modal-icon-btn ${
                          postLikesMap[selectedPost._id] !== undefined
                            ? postLikesMap[selectedPost._id]
                              ? "liked"
                              : ""
                            : selectedPost.isLike
                            ? "liked"
                            : ""
                        }`}
                        title="Like post"
                      >
                        <IconHeart
                          size={24}
                          filled={
                            postLikesMap[selectedPost._id] !== undefined
                              ? postLikesMap[selectedPost._id]
                              : !!selectedPost.isLike
                          }
                        />
                      </button>
                      <button
                        className="modal-icon-btn"
                        title="Comments count"
                      >
                        <IconMessage size={24} />
                      </button>
                      <button
                        onClick={(e) => handleSharePost(selectedPost, e)}
                        className="modal-icon-btn"
                        title="Share post"
                      >
                        <IconShare size={24} />
                      </button>
                    </div>
                    <button
                      onClick={() => showToast("Post saved to bookmarks")}
                      className="modal-icon-btn"
                      title="Bookmark post"
                    >
                      <IconBookmark size={22} />
                    </button>
                  </div>

                  <span className="modal-likes-label">
                    {(
                      postLikesCount[selectedPost._id] !== undefined
                        ? postLikesCount[selectedPost._id]
                        : selectedPost.totalLikes || 0
                    ).toLocaleString()}{" "}
                    likes
                  </span>
                  <span className="modal-date-label">
                    {(
                      postCommentsCount[selectedPost._id] !== undefined
                        ? postCommentsCount[selectedPost._id]
                        : selectedPost.totalComments || 0
                    ).toLocaleString()}{" "}
                    comments · {selectedPost.time || "Recently"}
                  </span>
                </div>

                {/* Footer: Add Comment Form */}
                <form onSubmit={handleAddPostComment} className="modal-comment-input-form">
                  <input
                    type="text"
                    placeholder={`Add a comment as ${currentUser?.userName || "@You"}...`}
                    value={newPostCommentText}
                    onChange={(e) => setNewPostCommentText(e.target.value)}
                    className="modal-comment-input"
                  />
                  <button
                    type="submit"
                    disabled={!newPostCommentText.trim()}
                    className="modal-comment-post-btn"
                  >
                    Post
                  </button>
                </form>
              </div>
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
                {gifts.map((g) => (
                  <button
                    key={g._id || g.id}
                    onClick={() => handleSendGift(g)}
                    className="gift-select-item"
                  >
                    {g.image ? (
                      <img src={resolveMedia(g.image)} alt={g.name || "Gift"} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <IconGift size={24} />
                    )}
                    <span className="gift-title">{g.name || `${g.coin || g.coins} Coins`}</span>
                    <span className="gift-cost">{g.coin || g.coins || 10} Coins</span>
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

        /* Primary Header Navigation Bar */
        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 16px;
          min-width: 0;
        }

        .header-main-nav {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          padding: 5px 8px;
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          flex-shrink: 0;
        }

        .header-nav-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 7px 16px;
          margin: 0;
          border: 1px solid transparent;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
          user-select: none;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .header-nav-tab:focus,
        .header-nav-tab:focus-visible {
          outline: none !important;
          box-shadow: none;
        }

        .header-nav-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .header-nav-tab.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-weight: 700;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
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

        .social-feed-viewport {
          max-width: 680px;
          margin: 0 auto;
          padding: 16px 16px 90px 16px;
          scroll-behavior: smooth;
        }

        /* Stories Tray */
        .stories-tray-container {
          width: 100%;
          overflow-x: auto;
          padding: 4px 0 14px 0;
          margin-bottom: 8px;
          scrollbar-width: none;
        }
        .stories-tray-container::-webkit-scrollbar {
          display: none;
        }
        .stories-track {
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .story-avatar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          flex-shrink: 0;
          width: 66px;
        }
        .story-ring-wrap {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          padding: 2.5px;
          background: linear-gradient(45deg, #ff2d55, #ff7a00, #ff007a);
          transition: transform 0.2s ease;
        }
        .story-ring-wrap:hover {
          transform: scale(1.06);
        }
        .story-ring-wrap.live-ring {
          background: linear-gradient(45deg, #ef4444, #dc2626, #b91c1c);
          animation: pulseLiveRing 1.8s infinite;
        }
        @keyframes pulseLiveRing {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .story-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #0c0d12;
        }
        .story-live-badge {
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          background: #ef4444;
          color: #fff;
          font-size: 8px;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          border: 1.5px solid #0c0d12;
        }
        .story-label {
          font-size: 11px;
          color: #cbd5e1;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 62px;
          text-align: center;
        }

        /* Feed Category Filter Chips Bar */
        .feed-category-chips-bar {
          width: 100%;
          margin-bottom: 18px;
        }
        .chips-scroll-track {
          display: flex;
          gap: 8px;
          align-items: center;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 2px 8px 2px;
          transition: all 0.25s ease;
        }
        .chips-scroll-track::-webkit-scrollbar {
          display: none;
        }
        .chips-scroll-track.expanded {
          flex-wrap: wrap;
          overflow-x: visible;
          padding-bottom: 4px;
        }
        .feed-category-chip {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #94a3b8;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
        }
        .feed-category-chip:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.25);
        }
        .feed-category-chip.active {
          background: #ff2d55;
          border-color: #ff2d55;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(255, 45, 85, 0.4);
        }
        .feed-category-more-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          border: 1px dashed rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.18s ease;
        }
        .feed-category-more-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.45);
          color: #ffffff;
          transform: translateY(-1px);
        }
        .feed-category-reset-chip {
          padding: 6px 13px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
        }
        .feed-category-reset-chip:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #ffffff;
        }

        /* Main Social Timeline Stream */
        .social-timeline-stream {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }
        .timeline-post-card {
          background: #0f141c;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .timeline-post-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
        }
        .timeline-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .timeline-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
        }
        .timeline-user-meta {
          flex: 1;
          min-width: 0;
          cursor: pointer;
        }
        .timeline-name-line {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .timeline-author-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .timeline-author-handle {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-top: 1px;
        }
        .timeline-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .timeline-post-time {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
        }
        .timeline-media-stage {
          width: 100%;
          position: relative;
          background: #000000;
          min-height: 340px;
          max-height: 580px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .timeline-main-photo {
          width: 100%;
          height: auto;
          max-height: 580px;
          object-fit: cover;
          display: block;
          cursor: pointer;
        }
        .carousel-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.15s ease;
          z-index: 5;
        }
        .carousel-nav-arrow:hover {
          background: rgba(0, 0, 0, 0.85);
          transform: translateY(-50%) scale(1.1);
        }
        .carousel-nav-arrow.left { left: 12px; }
        .carousel-nav-arrow.right { right: 12px; }
        .carousel-dots-indicator {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 5;
          background: rgba(0, 0, 0, 0.5);
          padding: 4px 8px;
          border-radius: 10px;
          backdrop-filter: blur(6px);
        }
        .carousel-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.2s ease;
        }
        .carousel-dot.active {
          background: #ff2d55;
          width: 16px;
          border-radius: 4px;
        }
        .timeline-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px 4px 16px;
        }
        .timeline-actions-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .timeline-action-icon-btn {
          background: transparent;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease, color 0.15s ease;
        }
        .timeline-action-icon-btn:hover {
          color: #ffffff;
          transform: scale(1.14);
        }
        .timeline-action-icon-btn.liked {
          color: #ff2d55;
        }
        .timeline-likes-count {
          padding: 2px 16px;
          font-size: 13px;
          color: #ffffff;
        }
        .timeline-hashtags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 6px 16px 2px 16px;
        }
        .timeline-tag-pill {
          background: rgba(56, 189, 248, 0.08);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .timeline-tag-pill:hover {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
        }
        .timeline-caption-row {
          padding: 4px 16px 8px 16px;
          font-size: 13.5px;
          line-height: 1.5;
          color: #e2e8f0;
        }
        .caption-author-handle {
          font-weight: 700;
          color: #ffffff;
        }
        .caption-text-content {
          color: #cbd5e1;
        }
        .timeline-comments-section {
          padding: 2px 16px 8px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .view-all-comments-link {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          padding: 0;
          margin-bottom: 2px;
        }
        .view-all-comments-link:hover {
          color: #94a3b8;
          text-decoration: underline;
        }
        .timeline-comment-snippet {
          font-size: 12px;
          line-height: 1.4;
        }
        .comment-snippet-user {
          font-weight: 600;
          color: #ffffff;
        }
        .comment-snippet-text {
          color: #94a3b8;
        }
        .timeline-inline-comment-form {
          display: flex;
          align-items: center;
          padding: 8px 16px 12px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          gap: 10px;
        }
        .timeline-inline-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 8px 14px;
          font-size: 12.5px;
          color: #ffffff;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .timeline-inline-input:focus {
          border-color: rgba(255, 45, 85, 0.5);
        }
        .timeline-inline-submit-btn {
          background: transparent;
          border: none;
          color: #ff2d55;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 8px;
          transition: opacity 0.15s ease;
        }
        .timeline-inline-submit-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Continuous Infinite Scroll Loader & Sentinel */
        .feed-infinite-scroll-sentinel {
          padding: 24px 0 32px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          width: 100%;
        }
        .feed-scroll-loader {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.04);
          padding: 10px 20px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .scroll-loader-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 45, 85, 0.2);
          border-top-color: #ff2d55;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .feed-end-message {
          text-align: center;
          padding: 20px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          max-width: 440px;
          width: 100%;
        }
        .feed-end-message .end-badge {
          display: inline-block;
          background: rgba(255, 45, 85, 0.12);
          color: #ff2d55;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 12px;
          border-radius: 12px;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }
        .feed-end-message p {
          font-size: 12px;
          color: #64748b;
          margin: 0;
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
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .community-post-card {
          background: #0f141c;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.2s ease, box-shadow 0.22s ease;
        }

        .community-post-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 45, 85, 0.35);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
        }

        .post-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .post-user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
        }

        .post-user-info {
          flex: 1;
          min-width: 0;
        }

        .post-user-name-line {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .post-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .post-user-handle {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .location-pin-wrap {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #38bdf8;
        }

        .post-card-follow-btn {
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .post-card-follow-btn.active {
          background: #ff2d55;
          border-color: #ff2d55;
          color: #fff;
        }

        .post-timestamp {
          font-size: 10px;
          color: #64748b;
          white-space: nowrap;
        }

        .post-media-box {
          width: 100%;
          height: 280px;
          background: #050811;
          position: relative;
          overflow: hidden;
        }

        .post-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .community-post-card:hover .post-main-img {
          transform: scale(1.03);
        }

        .post-multi-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          z-index: 2;
        }

        .post-overlay-hint {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 40%);
          display: flex;
          align-items: flex-end;
          padding: 12px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .community-post-card:hover .post-overlay-hint {
          opacity: 1;
        }

        .post-overlay-hint span {
          font-size: 11px;
          font-weight: 600;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          padding: 3px 8px;
          border-radius: 8px;
        }

        .post-body-content {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
        }

        .post-author-bold {
          font-weight: 700;
          color: #ffffff;
          margin-right: 5px;
        }

        .post-caption-text {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.45;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-action-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .post-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .post-action-btn:hover {
          color: #ffffff;
          transform: scale(1.05);
        }

        .post-action-btn.liked {
          color: #ff2d55;
        }

        .post-action-btn.share {
          margin-left: auto;
        }

        /* ------------------------------------------------------------------ */
        /* POST DETAIL MODAL (INSTAGRAM / TIKTOK WEB STYLE)                   */
        /* ------------------------------------------------------------------ */
        .post-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.86);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: modalOverlayFade 0.2s ease;
        }

        @keyframes modalOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .post-modal-container {
          width: 100%;
          max-width: 980px;
          height: 84vh;
          max-height: 740px;
          background: #0b0f17;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          box-shadow: 0 32px 96px rgba(0, 0, 0, 0.85);
          display: flex;
          overflow: hidden;
          position: relative;
          animation: modalScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Left: Media Area */
        .post-modal-media-col {
          flex: 1.35;
          background: #03060c;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          user-select: none;
        }

        .post-modal-media-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #020408;
        }

        .modal-floating-heart-burst {
          position: absolute;
          pointer-events: none;
          z-index: 20;
          animation: heartBurstAnim 0.7s cubic-bezier(0.17, 0.89, 0.32, 1.49) forwards;
        }

        @keyframes heartBurstAnim {
          0% { opacity: 0; transform: scale(0.3); }
          40% { opacity: 1; transform: scale(1.3); }
          75% { opacity: 0.9; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.4) translateY(-30px); }
        }

        /* Carousel controls */
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.18s ease;
        }

        .carousel-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-btn.prev { left: 14px; }
        .carousel-btn.next { right: 14px; }

        .carousel-dots-row {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }

        .carousel-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .carousel-dot.active {
          background: #ff2d55;
          width: 18px;
          border-radius: 10px;
        }

        .carousel-counter-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.15);
          z-index: 10;
        }

        /* Right: Details & Comments Column */
        .post-modal-details-col {
          flex: 1;
          min-width: 320px;
          max-width: 420px;
          background: #0d121c;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* Modal Header */
        .modal-author-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(13, 18, 28, 0.95);
        }

        .modal-author-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .modal-author-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 45, 85, 0.6);
          flex-shrink: 0;
        }

        .modal-author-names {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .modal-author-display-name {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .verified-icon-badge {
          color: #3b82f6;
          display: inline-flex;
        }

        .modal-author-location {
          font-size: 11px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .follow-toggle-btn {
          padding: 5px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .follow-toggle-btn.active {
          background: #ff2d55;
          border-color: #ff2d55;
          color: #ffffff;
        }

        .modal-close-x {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .modal-close-x:hover {
          color: #ffffff;
          transform: scale(1.15);
        }

        /* Modal Caption & Comments Scroll Area */
        .modal-comments-thread {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-original-caption-box {
          display: flex;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .caption-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .caption-content {
          flex: 1;
        }

        .caption-author {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin-right: 6px;
        }

        .caption-text {
          font-size: 13px;
          line-height: 1.45;
          color: #e2e8f0;
        }

        .caption-hashtag {
          color: #38bdf8;
          font-weight: 500;
          cursor: pointer;
        }

        .caption-hashtag:hover {
          text-decoration: underline;
        }

        .caption-time {
          display: block;
          margin-top: 6px;
          font-size: 11px;
          color: #64748b;
        }

        /* Loading & Empty states */
        .comments-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 10px;
          gap: 10px;
          color: #94a3b8;
          font-size: 12px;
        }

        .comments-spinner {
          width: 22px;
          height: 22px;
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-top-color: #ff2d55;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .comments-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 14px;
          text-align: center;
          color: #64748b;
        }

        .comments-empty-state .empty-title {
          font-size: 14px;
          font-weight: 700;
          color: #e2e8f0;
          margin-top: 8px;
        }

        .comments-empty-state .empty-desc {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
          max-width: 240px;
        }

        /* Individual Comment Items */
        .single-comment-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .comment-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .comment-user-avatar.placeholder {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .comment-text-box {
          flex: 1;
        }

        .comment-header-line {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 2px;
        }

        .comment-handle {
          font-size: 13px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .comment-timestamp {
          font-size: 10px;
          color: #64748b;
        }

        .comment-body-text {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.4;
          word-break: break-word;
        }

        .comment-thread-avatar-img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        /* Modal Action Bar */
        .modal-action-bar {
          padding: 12px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(13, 18, 28, 0.95);
        }

        .modal-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .modal-actions-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .modal-icon-btn {
          background: transparent;
          border: none;
          color: #e2e8f0;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease, color 0.15s ease;
        }

        .modal-icon-btn:hover {
          transform: scale(1.15);
          color: #ffffff;
        }

        .modal-icon-btn.liked {
          color: #ff2d55;
          animation: heartPop 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.49);
        }

        @keyframes heartPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }

        .modal-likes-label {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          display: block;
          margin-bottom: 2px;
        }

        .modal-date-label {
          font-size: 11px;
          color: #64748b;
          display: block;
        }

        /* Modal Input Bar */
        .modal-comment-input-form {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background: #0d121c;
        }

        .modal-comment-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 9px 14px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .modal-comment-input:focus {
          border-color: #ff2d55;
          background: rgba(255, 255, 255, 0.09);
        }

        .modal-comment-post-btn {
          background: linear-gradient(135deg, #ff2d55, #f43f5e);
          color: #ffffff;
          border: none;
          border-radius: 20px;
          padding: 9px 18px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.15s ease;
        }

        .modal-comment-post-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
        }

        .modal-comment-post-btn:not(:disabled):hover {
          transform: scale(1.03);
        }

        /* Responsive Modal for Mobile Screens */
        @media (max-width: 768px) {
          .post-modal-overlay {
            padding: 0;
            align-items: flex-end;
          }
          .post-modal-container {
            height: 94vh;
            max-height: 94vh;
            border-radius: 20px 20px 0 0;
            flex-direction: column;
          }
          .post-modal-media-col {
            flex: none;
            height: 38vh;
          }
          .post-modal-details-col {
            flex: 1;
            max-width: none;
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
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

          .header-center {
            display: none;
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

// Server-Side Props for Instant First Paint - 100% Real Data
export async function getServerSideProps() {
  try {
    const apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_BASE_URL || baseURL;
    const cleanBase = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;
    const [videosRes, postsRes, hashtagsRes, songsRes, liveRes, giftsRes] = await Promise.all([
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
      fetch(`${cleanBase}client/hashTag/hashtagDrop`, {
        headers: { key: secretKey },
      })
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
      fetch(`${cleanBase}client/song/getSongsByUser`, {
        headers: { key: secretKey },
      })
        .then((r) => r.json())
        .catch(() => ({ songs: [] })),
      fetch(`${cleanBase}client/liveUser/getliveUserList`, {
        headers: { key: secretKey },
      })
        .then((r) => r.json())
        .catch(() => ({ liveUserList: [] })),
      fetch(`${cleanBase}client/gift/getGiftsForUser`, {
        headers: { key: secretKey },
      })
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
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
        initialHashtags: hashtagsRes.data || [],
        initialSongs: songsRes.songs || [],
        initialLiveStreams: liveRes.liveUserList || [],
        initialGifts: giftsRes.data || [],
      },
    };
  } catch (e) {
    return {
      props: {
        initialVideos: [],
        initialPosts: [],
        initialHashtags: [],
        initialSongs: [],
        initialLiveStreams: [],
        initialGifts: [],
      },
    };
  }
}
