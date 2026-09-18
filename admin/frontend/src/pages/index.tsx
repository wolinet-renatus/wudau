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

const IconExternalLink = ({ size = 16 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
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

const IconUpload = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
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

const IconPlay = ({ size = 20, filled = false }: { size?: number; filled?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <polygon points="5 3 19 12 5 21 5 3" fill={filled ? "currentColor" : "none"} />
  </svg>
);

const IconFlame = ({ size = 18 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
  </SvgIcon>
);

const IconImage = ({ size = 18 }: { size?: number }) => (
  <SvgIcon size={size}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </SvgIcon>
);

const IconLayers = ({ size = 16 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </SvgIcon>
);

const IconWhatsApp = ({ size = 24 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </SvgIcon>
);

const IconFacebook = ({ size = 24 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </SvgIcon>
);

const IconTwitter = ({ size = 22 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M4 4l11.7 16h4.3L8.3 4H4zm3.9 2h2.7l8.2 11.2h-2.7L7.9 6z" />
  </SvgIcon>
);

const IconTelegram = ({ size = 24 }: { size?: number }) => (
  <SvgIcon size={size}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </SvgIcon>
);

const IconMail = ({ size = 22 }: { size?: number }) => (
  <SvgIcon size={size}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </SvgIcon>
);

const IconCopy = ({ size = 18 }: { size?: number }) => (
  <SvgIcon size={size}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </SvgIcon>
);

const IconCode = ({ size = 16 }: { size?: number }) => (
  <SvgIcon size={size}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
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
  initialVideoId = null,
  initialEmbed = false,
}: {
  initialVideos?: VideoItem[];
  initialPosts?: PostItem[];
  initialHashtags?: HashTagItem[];
  initialSongs?: SongItem[];
  initialLiveStreams?: LiveStreamItem[];
  initialGifts?: GiftItem[];
  initialVideoId?: string | null;
  initialEmbed?: boolean;
}) {
  const router = useRouter();

  // Navigation & Viewport State - Defaults to "reels" (Vertical Video Experience) with Auto-Scroll
  const [currentTab, setCurrentTab] = useState<"social" | "reels" | "live" | "music" | "explore" | "profile">("reels");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [language, setLanguage] = useState<string>("English");
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);

  // Embed & iframe Fitness Detection (zero outer navigation clutter)
  const [isFramed, setIsFramed] = useState<boolean>(Boolean(initialEmbed));
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>(9 / 16);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let framed = false;
      try {
        framed = window.self !== window.top;
      } catch (e) {
        framed = true;
      }
      const isEmbedQuery =
        router.query.embed === "true" ||
        router.query.embed === "1" ||
        window.location.search.includes("embed=true");
      setIsFramed(framed || isEmbedQuery || Boolean(initialEmbed));
    }
  }, [router.query.embed, initialEmbed]);

  const isEmbedMode = isFramed;

  useEffect(() => {
    if (isEmbedMode) {
      setCurrentTab("reels");
    }
  }, [isEmbedMode]);

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

  // Video Controls & Audio - Defaults to UNMUTED for full audio engagement
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("wudao_sound_enabled");
      if (saved === "false") return true;
      if (saved === "true") return false;
    }
    return false;
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-Scrolling & Reel Playback Progress
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);
  const preventClickUntil = useRef<number>(0);
  const lastTapTime = useRef<number>(0);

  // Social Interactions & Modals
  const [likedReelIds, setLikedReelIds] = useState<{ [id: string]: boolean }>({});
  const [reelLikesCount, setReelLikesCount] = useState<{ [id: string]: number }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState<boolean>(false);
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalTitle, setAuthModalTitle] = useState<string>("");
  const [authModalSubtitle, setAuthModalSubtitle] = useState<string>("");
  const [authModalAction, setAuthModalAction] = useState<string>("");
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareTarget, setShareTarget] = useState<{
    url: string;
    title: string;
    type: "reel" | "post";
    author?: string;
  } | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
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

  // Creator Upload Studio State & Handlers
  const [showUploadStudio, setShowUploadStudio] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<"reel" | "post">("reel");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFilePreview, setUploadFilePreview] = useState<string | null>(null);
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postImagePreviews, setPostImagePreviews] = useState<string[]>([]);
  const [uploadCaption, setUploadCaption] = useState<string>("");
  const [uploadLocation, setUploadLocation] = useState<string>("Dar es Salaam, Tanzania");
  const [uploadSelectedSongId, setUploadSelectedSongId] = useState<string>("");
  const [uploadDuration, setUploadDuration] = useState<number>(15);
  const [uploadThumbnailFile, setUploadThumbnailFile] = useState<File | null>(null);
  const [uploadThumbnailPreview, setUploadThumbnailPreview] = useState<string | null>(null);
  const [candidateThumbnails, setCandidateThumbnails] = useState<{ url: string; file: File }[]>([]);
  const [uploadSelectedHashtags, setUploadSelectedHashtags] = useState<string[]>(["WudauCreatives"]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatusText, setUploadStatusText] = useState<string>("");
  const [studioCreatorId, setStudioCreatorId] = useState<string>("");

  const reelFileInputRef = useRef<HTMLInputElement | null>(null);
  const customThumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const postFileInputRef = useRef<HTMLInputElement | null>(null);

  // Available creator profiles for web publishing
  const availableCreators = useMemo(() => {
    const list: { _id: string; name: string; userName: string; image: string }[] = [];
    const seen = new Set<string>();
    if (currentUser && currentUser._id) {
      list.push({
        _id: currentUser._id,
        name: currentUser.name || "Me",
        userName: currentUser.userName || "@me",
        image: currentUser.image || "storage/male.png",
      });
      seen.add(currentUser._id);
    }
    posts.forEach((p) => {
      if (p.userId && !seen.has(p.userId)) {
        seen.add(p.userId);
        list.push({
          _id: p.userId,
          name: p.name || "Creator",
          userName: p.userName || "@creator",
          image: p.userImage || "storage/male.png",
        });
      }
    });
    videos.forEach((v) => {
      if (v.userId && !seen.has(v.userId)) {
        seen.add(v.userId);
        list.push({
          _id: v.userId,
          name: v.name || "Creator",
          userName: v.userName || "@creator",
          image: v.userImage || "storage/male.png",
        });
      }
    });
    return list;
  }, [currentUser, posts, videos]);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    const url = URL.createObjectURL(file);
    setUploadFilePreview(url);
    setCandidateThumbnails([]);

    try {
      const tempVid = document.createElement("video");
      tempVid.src = url;
      tempVid.muted = true;
      tempVid.playsInline = true;
      tempVid.crossOrigin = "anonymous";
      
      const timestamps = [0.08, 0.32, 0.58, 0.82];
      const extracted: { url: string; file: File }[] = [];
      let stepIdx = 0;

      tempVid.onloadeddata = () => {
        const dur = Math.round(tempVid.duration);
        if (dur > 0) setUploadDuration(dur);
        tempVid.currentTime = Math.max(0.3, (tempVid.duration || 1) * timestamps[0]);
      };

      tempVid.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = tempVid.videoWidth || 640;
          canvas.height = tempVid.videoHeight || 1138;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(tempVid, 0, 0, canvas.width, canvas.height);
            // Stamp Official WUDAO Watermark onto Thumbnail
            const stampW = Math.min(220, Math.round(canvas.width * 0.38));
            const stampH = Math.round(stampW * 0.22);
            const pad = Math.round(canvas.width * 0.04);
            const bx = canvas.width - stampW - pad;
            const by = canvas.height - stampH - pad;

            ctx.save();
            ctx.fillStyle = "rgba(10, 12, 18, 0.75)";
            if (ctx.roundRect) {
              ctx.roundRect(bx, by, stampW, stampH, Math.round(stampH / 2));
            } else {
              ctx.rect(bx, by, stampW, stampH);
            }
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${Math.round(stampH * 0.42)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const creatorTag = currentUser?.userName ? `@${currentUser.userName}` : "@wudao";
            ctx.fillText(`WUDAO • ${creatorTag}`, bx + stampW / 2, by + stampH / 2);
            ctx.restore();

            canvas.toBlob((blob) => {
              if (blob) {
                const thumbFile = new File([blob], `thumbnail_${stepIdx}.jpg`, { type: "image/jpeg" });
                const dataUrl = canvas.toDataURL("image/jpeg");
                extracted.push({ url: dataUrl, file: thumbFile });
                
                if (stepIdx === 0) {
                  setUploadThumbnailFile(thumbFile);
                  setUploadThumbnailPreview(dataUrl);
                }
                setCandidateThumbnails([...extracted]);

                stepIdx++;
                if (stepIdx < timestamps.length && tempVid.duration) {
                  tempVid.currentTime = tempVid.duration * timestamps[stepIdx];
                }
              }
            }, "image/jpeg", 0.9);
          }
        } catch (cvErr) {
          console.warn("Canvas capture note:", cvErr);
        }
      };
    } catch (err) {
      console.warn("Video thumbnail extract error:", err);
    }
  };

  const handleCustomThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 720;
        canvas.height = img.naturalHeight || 1280;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Stamp Official WUDAO Watermark onto Custom Cover
          const stampW = Math.min(220, Math.round(canvas.width * 0.38));
          const stampH = Math.round(stampW * 0.22);
          const pad = Math.round(canvas.width * 0.04);
          const bx = canvas.width - stampW - pad;
          const by = canvas.height - stampH - pad;

          ctx.save();
          ctx.fillStyle = "rgba(10, 12, 18, 0.75)";
          if (ctx.roundRect) ctx.roundRect(bx, by, stampW, stampH, Math.round(stampH / 2));
          else ctx.rect(bx, by, stampW, stampH);
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.round(stampH * 0.42)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const creatorTag = currentUser?.userName ? `@${currentUser.userName}` : "@wudao";
          ctx.fillText(`WUDAO • ${creatorTag}`, bx + stampW / 2, by + stampH / 2);
          ctx.restore();

          canvas.toBlob((blob) => {
            if (blob) {
              const thumb = new File([blob], "custom_cover.jpg", { type: "image/jpeg" });
              setUploadThumbnailFile(thumb);
              const previewUrl = canvas.toDataURL("image/jpeg");
              setUploadThumbnailPreview(previewUrl);
              setCandidateThumbnails((prev) => [{ url: previewUrl, file: thumb }, ...prev]);
              showToast("Custom cover thumbnail selected ✨");
            }
            URL.revokeObjectURL(url);
          }, "image/jpeg", 0.92);
        }
      } catch (err) {
        console.warn("Custom cover capture note:", err);
      }
    };
    img.src = url;
  };

  const handlePostImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const rawFiles = Array.from(e.target.files).slice(0, 5);
    const creatorTag = currentUser?.userName ? `@${currentUser.userName}` : "@wudao";

    const watermarkedFiles: File[] = await Promise.all(
      rawFiles.map((file) => {
        return new Promise<File>((resolve) => {
          const img = new Image();
          const objUrl = URL.createObjectURL(file);
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = img.naturalWidth || 800;
              canvas.height = img.naturalHeight || 800;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Stamp Wudau Watermark
                const stampW = Math.min(240, Math.round(canvas.width * 0.35));
                const stampH = Math.round(stampW * 0.22);
                const pad = Math.round(canvas.width * 0.04);
                const bx = canvas.width - stampW - pad;
                const by = canvas.height - stampH - pad;

                ctx.save();
                ctx.fillStyle = "rgba(10, 12, 18, 0.75)";
                if (ctx.roundRect) ctx.roundRect(bx, by, stampW, stampH, Math.round(stampH / 2));
                else ctx.rect(bx, by, stampW, stampH);
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.font = `bold ${Math.round(stampH * 0.42)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`WUDAO • ${creatorTag}`, bx + stampW / 2, by + stampH / 2);
                ctx.restore();

                canvas.toBlob((blob) => {
                  if (blob) {
                    const markedFile = new File([blob], file.name, { type: file.type || "image/jpeg" });
                    resolve(markedFile);
                  } else {
                    resolve(file);
                  }
                  URL.revokeObjectURL(objUrl);
                }, file.type || "image/jpeg", 0.9);
              } else {
                resolve(file);
                URL.revokeObjectURL(objUrl);
              }
            } catch {
              resolve(file);
              URL.revokeObjectURL(objUrl);
            }
          };
          img.onerror = () => {
            resolve(file);
            URL.revokeObjectURL(objUrl);
          };
          img.src = objUrl;
        });
      })
    );

    setPostImages(watermarkedFiles);
    const previews = watermarkedFiles.map((f) => URL.createObjectURL(f));
    setPostImagePreviews(previews);
  };

  const resetStudioForm = () => {
    setUploadFile(null);
    setUploadFilePreview(null);
    setPostImages([]);
    setPostImagePreviews([]);
    setUploadCaption("");
    setUploadSelectedSongId("");
    setUploadThumbnailFile(null);
    setUploadThumbnailPreview(null);
    setCandidateThumbnails([]);
    setUploadProgress(0);
    setUploadStatusText("");
  };

  const handleUploadReel = async () => {
    if (!uploadFile) {
      showToast("Please select a video file for your reel.");
      return;
    }
    const creatorId = currentUser?._id || studioCreatorId || availableCreators[0]?._id;
    if (!creatorId) {
      showToast("Please select a creator profile.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatusText("Preparing video file & thumbnail...");

    try {
      const formData = new FormData();
      formData.append("videoUrl", uploadFile);

      if (uploadThumbnailFile) {
        formData.append("videoImage", uploadThumbnailFile);
      } else {
        formData.append("videoImage", uploadFile);
      }

      formData.append("caption", uploadCaption);
      formData.append("videoTime", String(uploadDuration || 15));
      if (uploadSelectedSongId) {
        formData.append("songId", uploadSelectedSongId);
      }
      if (uploadSelectedHashtags.length > 0) {
        const matchingIds = hashtags
          .filter((h) => uploadSelectedHashtags.includes(h.hashTag) || uploadSelectedHashtags.includes(`#${h.hashTag}`))
          .map((h) => h._id);
        if (matchingIds.length > 0) {
          formData.append("hashTagId", matchingIds.join(","));
        }
      }

      setUploadStatusText("Uploading video stream to WUDAO servers...");
      const res = await axios.post(
        `${baseURL}client/video/uploadvideo?userId=${creatorId}`,
        formData,
        {
          headers: {
            key: secretKey,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(Math.min(95, percentCompleted));
            }
          },
        }
      );

      if (res.data?.status && res.data.data) {
        setUploadProgress(100);
        setUploadStatusText("Reel successfully published!");
        const newReel = res.data.data;
        const creatorObj = availableCreators.find((c) => c._id === creatorId);
        const enrichedReel: VideoItem = {
          ...newReel,
          name: creatorObj?.name || "Creator",
          userName: creatorObj?.userName || "@creator",
          userImage: creatorObj?.image || "storage/male.png",
          isVerified: true,
          isLike: false,
          isFollow: false,
          totalLikes: 0,
          totalComments: 0,
        };
        setVideos((prev) => [enrichedReel, ...prev]);
        setCurrentReelIndex(0);
        setCurrentTab("reels");
        showToast("🎉 Reel published to WUDAO successfully!");
        resetStudioForm();
        setShowUploadStudio(false);
      } else {
        showToast(res.data?.message || "Failed to upload reel.");
      }
    } catch (err: any) {
      console.error("Upload reel error:", err);
      showToast(err.response?.data?.message || err.message || "Upload failed. Please check network connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadPost = async () => {
    if (postImages.length === 0) {
      showToast("Please select at least one photo for your post.");
      return;
    }
    const creatorId = currentUser?._id || studioCreatorId || availableCreators[0]?._id;
    if (!creatorId) {
      showToast("Please select a creator profile.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    setUploadStatusText("Optimizing photos for community feed...");

    try {
      const formData = new FormData();
      postImages.forEach((file) => {
        formData.append("postImage", file);
      });
      formData.append("caption", uploadCaption);
      formData.append("location", uploadLocation);
      if (uploadSelectedHashtags.length > 0) {
        const matchingIds = hashtags
          .filter((h) => uploadSelectedHashtags.includes(h.hashTag) || uploadSelectedHashtags.includes(`#${h.hashTag}`))
          .map((h) => h._id);
        if (matchingIds.length > 0) {
          formData.append("hashTagId", matchingIds.join(","));
        }
      }

      setUploadStatusText("Publishing to community feed...");
      const res = await axios.post(
        `${baseURL}client/post/uploadPost?userId=${creatorId}`,
        formData,
        {
          headers: {
            key: secretKey,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(Math.min(95, percentCompleted));
            }
          },
        }
      );

      if (res.data?.status && res.data.post) {
        setUploadProgress(100);
        setUploadStatusText("Post published!");
        const newPostData = res.data.post;
        const creatorObj = availableCreators.find((c) => c._id === creatorId);
        const enrichedPost: PostItem = {
          ...newPostData,
          name: creatorObj?.name || "Creator",
          userName: creatorObj?.userName || "@creator",
          userImage: creatorObj?.image || "storage/male.png",
          isVerified: true,
          isLike: false,
          isFollow: false,
          totalLikes: 0,
          totalComments: 0,
          time: "Just now",
          hashTag: uploadSelectedHashtags,
        };
        setPosts((prev) => [enrichedPost, ...prev]);
        setCurrentTab("social");
        window.scrollTo({ top: 0, behavior: "smooth" });
        showToast("🎉 Post published to community feed!");
        resetStudioForm();
        setShowUploadStudio(false);
      } else {
        showToast(res.data?.message || "Failed to upload post.");
      }
    } catch (err: any) {
      console.error("Upload post error:", err);
      showToast(err.response?.data?.message || err.message || "Failed to upload post.");
    } finally {
      setIsUploading(false);
    }
  };

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
        const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const requestedVidId = (router.query.videoId as string) || urlParams?.get("videoId") || initialVideoId;
        const videoEndpoint = requestedVidId
          ? `client/video/getAllVideos?videoId=${encodeURIComponent(requestedVidId)}&limit=30`
          : "client/video/getAllVideos?start=1&limit=30";

        const [vRes, pRes, hRes, sRes, lRes, gRes] = await Promise.all([
          axios.get(videoEndpoint, { headers: { key: secretKey } }).catch(() => ({ data: { data: [] } })),
          axios.get("client/post/getAllPosts?start=1&limit=30", { headers: { key: secretKey } }).catch(() => ({ data: { post: [] } })),
          axios.get("client/hashTag/hashtagDrop", { headers: { key: secretKey } }).catch(() => ({ data: { data: [] } })),
          axios.get("client/song/getSongsByUser", { headers: { key: secretKey } }).catch(() => ({ data: { songs: [] } })),
          axios.get("client/liveUser/getliveUserList", { headers: { key: secretKey } }).catch(() => ({ data: { liveUserList: [] } })),
          axios.get("client/gift/getGiftsForUser", { headers: { key: secretKey } }).catch(() => ({ data: { data: [] } })),
        ]);
        if (vRes.data?.data?.length) {
          const freshVideos: VideoItem[] = vRes.data.data;
          setVideos(freshVideos);
          if (requestedVidId) {
            const idx = freshVideos.findIndex((v) => v._id === requestedVidId);
            if (idx !== -1) {
              setCurrentReelIndex(idx);
            }
          }
        }
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

  // Deep-linking: listen for query param changes to instantly jump to target video
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const targetVideoId = (router.query.videoId as string) || urlParams.get("videoId");
    if (!targetVideoId) return;

    const foundIdx = videos.findIndex((v) => v._id === targetVideoId);
    if (foundIdx !== -1) {
      if (foundIdx !== currentReelIndex) {
        setCurrentReelIndex(foundIdx);
      }
    } else {
      axios
        .get(`client/video/getAllVideos?videoId=${encodeURIComponent(targetVideoId)}`, {
          headers: { key: secretKey },
        })
        .then((res) => {
          if (res.data?.data?.length) {
            const target = res.data.data[0];
            setVideos((prev) => {
              if (prev.some((v) => v._id === target._id)) return prev;
              return [target, ...prev];
            });
            setCurrentReelIndex(0);
          }
        })
        .catch(() => {});
    }
  }, [router.query.videoId]);


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setShowCommentsDrawer(false);
        setShowGiftModal(false);
        setShowAuthModal(false);
        setShowUploadStudio(false);
        setShowShareModal(false);
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
      if (currentTab === "reels" && !showCommentsDrawer && !showGiftModal && !showAuthModal && !selectedPost && !showUploadStudio && !showShareModal) {
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
  }, [currentTab, currentReelIndex, videos.length, showCommentsDrawer, showGiftModal, showAuthModal, showUploadStudio, showShareModal, selectedPost]);

  // Global first-gesture auto-unmute listener (conquers browser strict autoplay restrictions)
  useEffect(() => {
    const handleFirstGesture = () => {
      const saved = typeof window !== "undefined" ? sessionStorage.getItem("wudao_sound_enabled") : null;
      if (saved !== "false" && videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("wudao_sound_enabled", "true");
        }
      }
    };

    window.addEventListener("click", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsUserPaused(false);
        })
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsUserPaused(true);
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

  // Auth enforcement helper for community actions
  const requireAuth = (
    action: "like" | "comment" | "follow" | "gift" | "create" | "preview_limit",
    customReason?: string
  ) => {
    if (isAuth) return true;

    let title = "Join the WUDAO Community";
    let subtitle = "Log in or create a free account to like, comment, and interact with creators.";

    if (action === "like") {
      title = "Like this Moment?";
      subtitle = customReason || "Sign in to like reels and posts, and show your support to creators.";
    } else if (action === "comment") {
      title = "Join the Conversation";
      subtitle = customReason || "Sign in to post comments, reply to friends, and chat with creators.";
    } else if (action === "follow") {
      title = "Follow Creator";
      subtitle = customReason || "Sign in to follow creators and see their newest moments in your feed.";
    } else if (action === "gift") {
      title = "Send Virtual Gift";
      subtitle = customReason || "Sign in to send gifts, cheer for live streams, and show love to creators.";
    } else if (action === "create") {
      title = "WUDAO Creator Studio";
      subtitle = customReason || "Sign in or create an account to upload your own vertical reels, photos, and music.";
    } else if (action === "preview_limit") {
      title = "Enjoying WUDAO?";
      subtitle = customReason || "You've reached the guest preview limit. Sign in to unlock unlimited streaming, infinite feeds, and creative moments.";
    }

    setAuthModalTitle(title);
    setAuthModalSubtitle(subtitle);
    setAuthModalAction(action);
    setShowAuthModal(true);
    return false;
  };

  const handleInlinePostComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth("comment", "Sign in to join the conversation and comment.")) return;
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
    if (isLoadingMorePosts || !hasMorePosts) return; // all users can load more

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

  // Reset playback progress and start instant streaming playback when switching reel or category
  useEffect(() => {
    setProgressPercent(0);
    setIsBuffering(false);
    setIsUserPaused(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch(() => {
            // Autoplay policy fallback: guarantee playback by muting if browser blocks unmuted playback
            video.muted = true;
            setIsMuted(true);
            video.play().then(() => {
              setIsPlaying(true);
              setIsBuffering(false);
            }).catch(() => {});
          });
      }
    }
  }, [currentReelIndex, currentFilter]);

  const handleNextReel = () => {
    if (filteredVideos.length === 0) return;
    setProgressPercent(0);
    setIsUserPaused(false);
    setCurrentReelIndex((prev) => (prev + 1) % filteredVideos.length);
    setIsPlaying(true);
  };

  const handlePrevReel = () => {
    if (filteredVideos.length === 0) return;
    setProgressPercent(0);
    setIsUserPaused(false);
    setCurrentReelIndex((prev) => (prev - 1 + filteredVideos.length) % filteredVideos.length);
    setIsPlaying(true);
  };

  const handleVideoEnded = () => {
    if (isAutoScroll) {
      handleNextReel();
    }
  };

  // Sync address bar URL with active reel without page reload
  useEffect(() => {
    if (typeof window === "undefined" || isEmbedMode || currentTab !== "reels") return;
    const curVid = filteredVideos[currentReelIndex];
    if (curVid && curVid._id) {
      const url = new URL(window.location.href);
      if (url.searchParams.get("videoId") !== curVid._id) {
        url.searchParams.set("videoId", curVid._id);
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [currentReelIndex, currentTab, filteredVideos, isEmbedMode]);

  // Responsive parent communication for embedded iframes
  const postResizeToParent = (vid?: HTMLVideoElement | null) => {
    if (typeof window === "undefined" || window.self === window.top) return;
    const video = vid || videoRef.current;
    const curVideo = filteredVideos[currentReelIndex] || filteredVideos[0];
    const width = video?.videoWidth || 720;
    const height = video?.videoHeight || 1280;
    const ratio = width / height;
    try {
      window.parent.postMessage(
        {
          type: "WUDAO_REEL_RESIZE",
          videoId: curVideo?._id,
          width,
          height,
          aspectRatio: ratio,
          isLandscape: ratio > 1.15,
        },
        "*"
      );
    } catch (e) {}
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
    if (now - lastWheelTime.current < 240) return;
    if (Math.abs(e.deltaY) > 15) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        handleNextReel();
      } else {
        handlePrevReel();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (showCommentsDrawer || showGiftModal || showAuthModal || showUploadStudio || showShareModal) return;
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    isSwiping.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = currentY - touchStartY.current;
    const diffX = currentX - (touchStartX.current || 0);

    // If gesture is predominantly vertical, track finger movement smoothly
    if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
      isSwiping.current = true;
      // Add subtle rubber-band resistance at list edges
      let offset = diffY;
      if ((currentReelIndex === 0 && diffY > 0) || (currentReelIndex === filteredVideos.length - 1 && diffY < 0)) {
        offset = diffY * 0.35;
      }
      setDragOffsetY(offset);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (touchStartY.current === null) return;
    const currentY = e.changedTouches[0].clientY;
    const diffY = currentY - touchStartY.current;
    const elapsed = Date.now() - touchStartTime.current;
    const velocity = Math.abs(diffY) / Math.max(1, elapsed);

    touchStartY.current = null;
    touchStartX.current = null;

    if (isSwiping.current) {
      // Suppress synthetic click after touch release so it never pauses playback!
      preventClickUntil.current = Date.now() + 450;
      isSwiping.current = false;

      // Effortless swipe threshold: 30px distance or quick flick
      if (diffY < -30 || (diffY < -15 && velocity > 0.22)) {
        handleNextReel();
      } else if (diffY > 30 || (diffY > 15 && velocity > 0.22)) {
        handlePrevReel();
      }
    }
    setDragOffsetY(0);
  };

  // Double tap to like on video surface (swipes will never accidentally trigger this)
  const handleSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() < preventClickUntil.current || isSwiping.current) {
      return;
    }
    // Auto-unmute immediately on surface click if video was muted by autoplay policy
    if (isMuted && videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("wudao_sound_enabled", "true");
      }
      showToast("Sound Enabled 🔊");
    }

    const now = Date.now();
    if (now - lastTapTime.current < 280) {
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
      }, 280);
    }
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!requireAuth("like", `Sign in to like this reel and support ${activeVideo?.userName || "the creator"}.`)) return;
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
      setShareTarget({
        url,
        title: video.caption || "Watch this viral reel on WUDAO 🔥",
        type: "reel",
        author: video.userName || "Creator",
      });
      setCopiedShareLink(false);
      setShowShareModal(true);
    }
  };

  const handleSendGift = (gift: GiftItem) => {
    if (!requireAuth("gift", "Sign in to send gifts to live creators.")) return;
    setShowGiftModal(false);
    const coins = gift.coin || gift.coins || 10;
    const name = gift.name || `${coins} Coins`;
    showToast(`Sent ${name} (${coins} coins) to ${activeVideo?.name || "Creator"}`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth("comment", "Sign in to comment on this reel.")) return;
    if (!commentInput.trim()) return;
    const vidId = activeVideo?._id || "default";
    const text = commentInput.trim();
    const currentList = commentsMap[vidId] || commentsMap["default"] || [];
    const commenterName = currentUser?.userName || "@You";
    const newComment: CommentItem = {
      id: "c_" + Date.now(),
      _id: "c_" + Date.now(),
      userName: commenterName,
      name: currentUser?.name || "You",
      userImage: currentUser?.image || "storage/avatar_kassim.png",
      text: text,
      commentText: text,
      time: "Just now",
      totalLikes: 0,
      isLike: false,
    };
    setCommentsMap((prev) => ({
      ...prev,
      [vidId]: [newComment, ...currentList],
    }));
    setCommentInput("");
    showToast("Comment added 💬");

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
    if (!requireAuth("like", `Sign in to like this post and support ${post.userName || "the creator"}.`)) return;
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
    if (!requireAuth("comment", "Sign in to comment on this post.")) return;
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
    if (!requireAuth("follow", `Sign in to follow ${userName ? `@${userName}` : "creators"} and see their updates.`)) return;
    const isFollowed = !!followedUsersMap[creatorUserId];
    setFollowedUsersMap((prev) => ({ ...prev, [creatorUserId]: !isFollowed }));
    showToast(isFollowed ? `Unfollowed ${userName || "creator"}` : `Following ${userName || "creator"} ✨`);
  };

  const handleSharePost = (post: PostItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/?tab=social&postId=${post._id}`;
      setShareTarget({
        url,
        title: post.caption || "View this community moment on WUDAO ✨",
        type: "post",
        author: post.userName || post.name || "Creator",
      });
      setCopiedShareLink(false);
      setShowShareModal(true);
    }
  };

  const handleCopyShareLink = () => {
    if (!shareTarget) return;
    navigator.clipboard?.writeText(shareTarget.url);
    setCopiedShareLink(true);
    showToast("Link copied to clipboard! 📋");
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  const handleCopyEmbedCode = () => {
    if (!shareTarget) return;
    const baseShareUrl = shareTarget.url.includes("?")
      ? `${shareTarget.url}&embed=true`
      : `${shareTarget.url}?embed=true`;
    const embedCode = `<iframe src="${baseShareUrl}" width="100%" height="100%" style="max-width:500px;aspect-ratio:9/16;border:none;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,0.35);overflow:hidden;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    navigator.clipboard?.writeText(embedCode);
    showToast("Responsive Embed code copied! 📋");
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
          content="Discover trending Tanzanian street dance, Bongo Flava, Singeli 300BPM, Serengeti wildlife, and global creative reels on WUDAO."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
        {/* Preload first reel video for zero-delay autoplay */}
        {filteredVideos[0]?.videoUrl && (
          <link
            rel="preload"
            as="video"
            href={resolveMedia(filteredVideos[0].videoUrl)}
          />
        )}
      </Head>

      {/* Audio preview element */}
      <audio ref={audioPreviewRef} onEnded={() => setPlayingAudioUrl(null)} />

      {/* Toast alert */}
      {toastMessage && (
        <div className="wudao-toast" role="alert">
          {toastMessage}
        </div>
      )}

      {/* APP ROOT */}
      <div className={`app-shell ${isEmbedMode ? "embed-mode" : ""}`}>
        {/* ==================================================================== */}
        {/* TOP HEADER NAVIGATION                                                */}
        {/* ==================================================================== */}
        {!isEmbedMode && (
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
              <div className="brand-logo-mark">
                <img src="/favicon.svg" alt="WUDAO" width={22} height={22} style={{ display: "block" }} />
              </div>
              <span className="brand-name">WUDAO</span>
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
                if (!requireAuth("create", "Sign in or create an account to upload videos and community posts.")) return;
                setShowUploadStudio(true);
              }}
              className="create-shortcut-btn"
              title="Create new reel or post"
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
        )}

        {/* Mobile Search Expandable Bar */}
        {!isEmbedMode && mobileSearchOpen && (
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
        {!isEmbedMode && isMenuOpen && (
          <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)}>
            <aside className="nav-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-top-bar">
                <Link href="/" className="drawer-brand" onClick={() => setIsMenuOpen(false)}>
                  <div className="brand-logo-mark mini">
                    <img src="/favicon.svg" alt="WUDAO" width={18} height={18} style={{ display: "block" }} />
                  </div>
                  <span className="brand-name">WUDAO</span>
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
                    <p className="guest-prompt-title">Sign in to WUDAO</p>
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
                <p>© 2026 WUDAO Technologies • Made for African & Global Creators</p>
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
                      className={`video-player-card ${videoAspectRatio > 1.15 ? "is-landscape" : videoAspectRatio > 0.85 ? "is-square" : "is-portrait"} ${isEmbedMode ? "is-embed" : ""}`}
                      style={{
                        transform: dragOffsetY !== 0 ? `translateY(${dragOffsetY}px)` : undefined,
                        transition: isDragging ? "none" : "transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1)",
                        willChange: "transform",
                      }}
                      onClick={handleSurfaceClick}
                      onWheel={handleWheel}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <>
                        {/* Ambient Blurred Backdrop for complete ratio fitness (16:9, 1:1, 9:16) */}
                        <div
                          className="ambient-blur-backdrop"
                          style={{
                            backgroundImage: `url(${resolveMedia(activeVideo.videoImage)})`,
                          }}
                        />

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
                          preload="auto"
                          onLoadedMetadata={(e) => {
                            const vid = e.currentTarget;
                            if (vid.videoWidth && vid.videoHeight) {
                              const ratio = vid.videoWidth / vid.videoHeight;
                              setVideoAspectRatio(ratio);
                              postResizeToParent(vid);
                            }
                            // Instant streaming zero-delay playback trigger
                            vid.play().then(() => setIsPlaying(true)).catch(() => {
                              vid.muted = true;
                              setIsMuted(true);
                              vid.play().then(() => setIsPlaying(true)).catch(() => {});
                            });
                          }}
                          onLoadedData={(e) => {
                            // Force immediate play as soon as first bytes are decoded
                            const vid = e.currentTarget;
                            vid.play().then(() => setIsPlaying(true)).catch(() => {});
                          }}
                          onWaiting={() => setIsBuffering(true)}
                          onCanPlay={() => setIsBuffering(false)}
                          onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
                          onEnded={handleVideoEnded}
                          onTimeUpdate={handleTimeUpdate}
                          className="main-reel-video"
                        />

                        {/* Instant Next Reels Preloaders */}
                        {filteredVideos.length > 1 && (
                          <>
                            <video
                              src={resolveMedia(filteredVideos[(currentReelIndex + 1) % filteredVideos.length]?.videoUrl)}
                              preload="auto"
                              muted
                              playsInline
                              style={{ display: "none" }}
                            />
                            {filteredVideos.length > 2 && (
                              <video
                                src={resolveMedia(filteredVideos[(currentReelIndex + 2) % filteredVideos.length]?.videoUrl)}
                                preload="auto"
                                muted
                                playsInline
                                style={{ display: "none" }}
                              />
                            )}
                          </>
                        )}

                        {/* Buffering Spinner */}
                        {isBuffering && (
                          <div className="buffering-overlay">
                            <div className="buffering-spinner" />
                          </div>
                        )}

                        {/* In Embed Mode: Watch on WUDAO badge */}
                        {isEmbedMode ? (
                          <a
                            href={`https://wudao.wolinet.com/?videoId=${activeVideo._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="embed-wudao-badge"
                            onClick={(e) => e.stopPropagation()}
                            title="Watch full experience on WUDAO"
                          >
                            <img src="/favicon.svg" alt="WUDAO" width={18} height={18} />
                            <span>Watch on WUDAO</span>
                            <IconExternalLink size={13} />
                          </a>
                        ) : (
                          /* WUDAO Logo Watermark Overlay */
                          <div className="wudao-reel-watermark">
                            <div className="watermark-logo-wrap">
                              <img
                                src="/favicon.svg"
                                alt="WUDAO"
                                className="watermark-logo-img"
                                width={18}
                                height={18}
                              />
                            </div>
                            <span className="watermark-brand-word">WUDAO</span>
                            <span className="watermark-sep">·</span>
                            <span className="watermark-author-handle">@{activeVideo.userName || "creator"}</span>
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

                          {/* Sound Toggle Floating Button - High Visibility Pulsing Pill */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextMuted = !isMuted;
                              setIsMuted(nextMuted);
                              if (videoRef.current) {
                                videoRef.current.muted = nextMuted;
                                if (!nextMuted) videoRef.current.play().catch(() => {});
                              }
                              if (typeof window !== "undefined") {
                                sessionStorage.setItem("wudao_sound_enabled", nextMuted ? "false" : "true");
                              }
                              showToast(nextMuted ? "Muted" : "Sound Enabled 🔊");
                            }}
                            className={`player-sound-btn ${isMuted ? "is-muted" : "is-unmuted"}`}
                            aria-label="Toggle Sound"
                            title={isMuted ? "Tap to Unmute Sound" : "Mute Sound"}
                          >
                            {isMuted ? (
                              <div className="sound-pill-content">
                                <IconVolumeX size={18} />
                                <span className="sound-pill-text">Tap for Sound</span>
                              </div>
                            ) : (
                              <IconVolume size={18} />
                            )}
                          </button>

                          {/* Pause / Play Fade Indicator — only shows when user explicitly tapped to pause */}
                          {isUserPaused && !isPlaying && (
                            <div className="player-pause-indicator">
                              <div className="pause-icon-pill">
                                <polygon points="5 3 19 12 5 21 5 3" fill="#ffffff" />
                              </div>
                            </div>
                          )}
                        </>

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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFollow(activeVideo.userId, activeVideo.userName, e);
                            }}
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
                          onClick={() => {
                            if (!requireAuth("gift", "Sign in to send gifts to live creators.")) return;
                            setShowGiftModal(true);
                          }}
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
                    {!isEmbedMode && (
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
                                <p>{activeVideo.singerName || "WUDAO Audio"}</p>
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
                    )}
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
                  (isAuth ? filteredPosts : filteredPosts.slice(0, 3)).map((post) => {
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

                          {/* WUDAO Watermark on Photo */}
                          <div className="wudao-photo-watermark">
                            <span className="photo-watermark-flame">🔥</span>
                            <span className="photo-watermark-brand">WUDAO</span>
                            <span className="photo-watermark-dot">•</span>
                            <span className="photo-watermark-user">@{post.userName}</span>
                          </div>

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
                            placeholder={isAuth ? "Add a comment..." : "Log in to add a comment..."}
                            value={cardCommentInputs[post._id] || ""}
                            onChange={(e) =>
                              setCardCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))
                            }
                            onFocus={(e) => {
                              if (!isAuth) {
                                e.target.blur();
                                requireAuth("comment", "Sign in to join the conversation and comment.");
                              }
                            }}
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

                {/* Guests have unlimited view access — auth only required for interactions */}

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
                <p>Natural beauty, cultural rhythm, and authentic creator moments aggregated from real posts across WUDAO.</p>
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

              {/* Trending Video Reels Showcase */}
              {videos.length > 0 && (
                <div className="explore-reels-section">
                  <div className="explore-section-header">
                    <div className="explore-section-title-wrap">
                      <IconReels size={22} />
                      <h3>Trending Video Reels</h3>
                    </div>
                    <span className="explore-section-badge">{videos.length} Videos</span>
                  </div>

                  <div className="explore-reels-grid">
                    {videos.map((vid, vIdx) => (
                      <div
                        key={vid._id}
                        className="explore-reel-card"
                        onClick={() => {
                          const targetIdx = filteredVideos.findIndex((v) => v._id === vid._id);
                          if (targetIdx >= 0) {
                            setCurrentReelIndex(targetIdx);
                          } else {
                            setCurrentFilter("all");
                            const allIdx = videos.findIndex((v) => v._id === vid._id);
                            if (allIdx >= 0) setCurrentReelIndex(allIdx);
                          }
                          setCurrentTab("reels");
                          showToast(`Playing "${(vid.caption || "Reel").slice(0, 24)}"`);
                        }}
                      >
                        <div className="explore-reel-thumbnail-wrap">
                          <img
                            src={resolveMedia(vid.videoImage)}
                            alt={vid.caption || "Reel Thumbnail"}
                            className="explore-reel-img"
                            loading="lazy"
                          />
                          <div className="explore-reel-overlay-gradient" />
                          <div className="explore-reel-play-icon">
                            <IconPlay size={18} filled />
                          </div>
                          <div className="explore-reel-views-pill">
                            <IconFlame size={12} />
                            <span>{vid.totalLikes ? `${vid.totalLikes} likes` : "Trending"}</span>
                          </div>
                        </div>
                        <div className="explore-reel-info">
                          <div className="explore-reel-creator">
                            <img
                              src={resolveMedia(vid.userImage || "storage/male.png")}
                              alt={vid.name}
                              className="explore-creator-avatar"
                            />
                            <span className="explore-creator-name">{vid.name || "Creator"}</span>
                          </div>
                          {vid.caption && (
                            <p className="explore-reel-caption">{vid.caption}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    {currentUser?.userName || (isAuth ? "@wudao_creator" : "Guest")}
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
        {!isEmbedMode && (
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
                if (!requireAuth("create", "Sign in or create an account to upload videos and community posts.")) return;
                setShowUploadStudio(true);
              }}
              className="tab-nav-btn create-tab-btn"
              title="Create Reel or Post"
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
        )}

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
                  placeholder={isAuth ? "Add a comment..." : "Log in to add a comment..."}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onFocus={(e) => {
                    if (!isAuth) {
                      e.target.blur();
                      requireAuth("comment", "Sign in to comment on this reel.");
                    }
                  }}
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

                {/* WUDAO Watermark on Photo Modal */}
                <div className="wudao-photo-watermark modal-pos">
                  <span className="photo-watermark-flame">🔥</span>
                  <span className="photo-watermark-brand">WUDAO</span>
                  <span className="photo-watermark-dot">•</span>
                  <span className="photo-watermark-user">@{selectedPost.userName}</span>
                </div>

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
                    placeholder={isAuth ? `Add a comment as ${currentUser?.userName || "@You"}...` : "Log in to add a comment..."}
                    value={newPostCommentText}
                    onChange={(e) => setNewPostCommentText(e.target.value)}
                    onFocus={(e) => {
                      if (!isAuth) {
                        e.target.blur();
                        requireAuth("comment", "Sign in to comment on this post.");
                      }
                    }}
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
        {/* CREATOR UPLOAD STUDIO MODAL                                          */}
        {/* ==================================================================== */}
        {showUploadStudio && (
          <div
            className="studio-modal-overlay"
            onClick={() => {
              if (!isUploading) setShowUploadStudio(false);
            }}
          >
            <div className="studio-modal-container" onClick={(e) => e.stopPropagation()}>
              {/* Studio Header */}
              <div className="studio-header">
                <div className="studio-title-cluster">
                  <div className="studio-title-badge">
                    <IconUpload size={18} />
                  </div>
                  <span className="studio-title-text">Creator Studio</span>
                </div>

                <div className="studio-type-toggle">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isUploading) setUploadType("reel");
                    }}
                    className={`studio-type-btn ${uploadType === "reel" ? "active" : ""}`}
                  >
                    <IconReels size={15} />
                    <span>Reel (Video)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isUploading) setUploadType("post");
                    }}
                    className={`studio-type-btn ${uploadType === "post" ? "active" : ""}`}
                  >
                    <IconCommunity size={15} />
                    <span>Post (Photos)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!isUploading) setShowUploadStudio(false);
                  }}
                  className="sheet-close-cross"
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>

              {/* Studio Body */}
              <div className="studio-body">
                {/* Left Column: Media Drag/Drop & Live Preview */}
                <div className="studio-media-col">
                  {uploadType === "reel" ? (
                    uploadFilePreview ? (
                      <div className="studio-preview-wrapper">
                        <video
                          src={uploadFilePreview}
                          className="studio-video-preview"
                          controls
                          autoPlay
                          muted
                          loop
                        />
                        <div className="studio-preview-badge">
                          {uploadDuration > 0 ? `00:${uploadDuration < 10 ? "0" : ""}${uploadDuration}` : "Reel Preview"}
                        </div>

                        {/* Thumbnail Cover Chooser Strip */}
                        <div className="studio-thumbnail-selector-panel">
                          <div className="studio-thumbnail-panel-header">
                            <span className="studio-thumb-label">Choose Cover Thumbnail:</span>
                            <button
                              type="button"
                              className="studio-custom-cover-btn"
                              onClick={() => customThumbnailInputRef.current?.click()}
                              disabled={isUploading}
                            >
                              <IconUpload size={12} />
                              <span>Upload Cover</span>
                            </button>
                          </div>

                          <div className="studio-thumbnails-strip">
                            {candidateThumbnails.map((cand, cIdx) => (
                              <div
                                key={cIdx}
                                className={`thumbnail-candidate-card ${uploadThumbnailPreview === cand.url ? "selected" : ""}`}
                                onClick={() => {
                                  setUploadThumbnailFile(cand.file);
                                  setUploadThumbnailPreview(cand.url);
                                }}
                                title={`Frame ${cIdx + 1}`}
                              >
                                <img src={cand.url} alt={`Frame ${cIdx + 1}`} />
                                {uploadThumbnailPreview === cand.url && (
                                  <div className="thumbnail-selected-check">
                                    <IconCheck size={12} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="studio-change-media-btn"
                          onClick={() => reelFileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          Change Video
                        </button>
                      </div>
                    ) : (
                      <div
                        className="studio-dropzone"
                        onClick={() => reelFileInputRef.current?.click()}
                      >
                        <div className="studio-dropzone-icon">
                          <IconUpload size={30} />
                        </div>
                        <h4 className="studio-dropzone-title">Select Reel Video</h4>
                        <p className="studio-dropzone-subtitle">
                          Drag & drop MP4, WebM or MOV video.<br />
                          Vertical 9:16 aspect ratio recommended.
                        </p>
                        <button type="button" className="studio-browse-btn">
                          Browse Computer
                        </button>
                      </div>
                    )
                  ) : postImagePreviews.length > 0 ? (
                    <div className="studio-preview-wrapper">
                      <img
                        src={postImagePreviews[0]}
                        alt="Post Preview"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                      <div className="studio-preview-badge">
                        {postImages.length} Photo{postImages.length > 1 ? "s" : ""}
                      </div>
                      <button
                        type="button"
                        className="studio-change-media-btn"
                        onClick={() => postFileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        Change Photos
                      </button>
                    </div>
                  ) : (
                    <div
                      className="studio-dropzone"
                      onClick={() => postFileInputRef.current?.click()}
                    >
                      <div className="studio-dropzone-icon">
                        <IconCommunity size={30} />
                      </div>
                      <h4 className="studio-dropzone-title">Select Photos to Share</h4>
                      <p className="studio-dropzone-subtitle">
                        Upload up to 5 photos (JPEG, PNG, WebP) for the community social feed.
                      </p>
                      <button type="button" className="studio-browse-btn">
                        Browse Photos
                      </button>
                    </div>
                  )}

                  {/* Hidden native file inputs */}
                  <input
                    ref={reelFileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    style={{ display: "none" }}
                    onChange={handleVideoFileChange}
                  />
                  <input
                    ref={customThumbnailInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleCustomThumbnailChange}
                  />
                  <input
                    ref={postFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handlePostImagesChange}
                  />
                </div>

                {/* Right Column: Metadata & Details */}
                <div className="studio-form-col">
                  {/* Creator Selection Row */}
                  <div className="studio-creator-bar">
                    <div className="studio-creator-info">
                      <img
                        src={resolveMedia(
                          availableCreators.find((c) => c._id === (currentUser?._id || studioCreatorId))?.image ||
                          currentUser?.image ||
                          availableCreators[0]?.image ||
                          "storage/male.png"
                        )}
                        alt="Creator Avatar"
                        className="studio-creator-avatar"
                      />
                      <div>
                        <div className="studio-creator-name">
                          {availableCreators.find((c) => c._id === (currentUser?._id || studioCreatorId))?.name ||
                            currentUser?.name ||
                            availableCreators[0]?.name ||
                            "WUDAO Creator"}
                        </div>
                        <div className="studio-creator-handle">
                          {availableCreators.find((c) => c._id === (currentUser?._id || studioCreatorId))?.userName ||
                            currentUser?.userName ||
                            availableCreators[0]?.userName ||
                            "@creator"}
                        </div>
                      </div>
                    </div>

                    <select
                      className="studio-creator-select"
                      value={currentUser?._id || studioCreatorId || availableCreators[0]?._id}
                      onChange={(e) => setStudioCreatorId(e.target.value)}
                      disabled={isUploading}
                    >
                      {availableCreators.map((creator) => (
                        <option key={creator._id} value={creator._id}>
                          Post as {creator.name} ({creator.userName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Caption Input */}
                  <div>
                    <label className="studio-field-label">
                      <span>Caption</span>
                      <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                        {uploadCaption.length} / 500
                      </span>
                    </label>
                    <textarea
                      className="studio-caption-textarea"
                      placeholder="Write an engaging caption, story, or description..."
                      value={uploadCaption}
                      maxLength={500}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>

                  {/* Hashtags Quick Cloud */}
                  <div>
                    <label className="studio-field-label">Trending Hashtags (Click to add)</label>
                    <div className="studio-hashtags-box">
                      {[
                        "WudauCreatives",
                        "NatureTz",
                        "SingeliDance",
                        "ZanzibarVibes",
                        "BongoFlava",
                        "Kilimanjaro",
                        "AfroDance",
                        "SerengetiMagic",
                      ].map((tag) => {
                        const isSelected = uploadSelectedHashtags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            className={`studio-hashtag-chip ${isSelected ? "selected" : ""}`}
                            onClick={() => {
                              if (isSelected) {
                                setUploadSelectedHashtags((prev) => prev.filter((t) => t !== tag));
                              } else {
                                setUploadSelectedHashtags((prev) => [...prev, tag]);
                                if (!uploadCaption.includes(`#${tag}`)) {
                                  setUploadCaption((prev) => (prev ? `${prev} #${tag}` : `#${tag}`));
                                }
                              }
                            }}
                            disabled={isUploading}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location Field */}
                  <div>
                    <label className="studio-field-label">Location</label>
                    <input
                      type="text"
                      className="studio-input-field"
                      placeholder="e.g. Dar es Salaam, Tanzania"
                      value={uploadLocation}
                      onChange={(e) => setUploadLocation(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>

                  {/* Audio Track Selector (for Reels) */}
                  {uploadType === "reel" && (
                    <div>
                      <label className="studio-field-label">Soundtrack / Music</label>
                      <select
                        className="studio-input-field"
                        value={uploadSelectedSongId}
                        onChange={(e) => setUploadSelectedSongId(e.target.value)}
                        disabled={isUploading}
                      >
                        <option value="">Original Audio (Embedded in video)</option>
                        {songs.map((song) => (
                          <option key={song._id} value={song._id}>
                            🎵 {song.songTitle} - {song.singerName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Upload Progress Display */}
                  {isUploading && (
                    <div className="studio-progress-card">
                      <div className="studio-progress-status">
                        <span>{uploadStatusText || "Uploading..."}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="studio-progress-bar">
                        <div
                          className="studio-progress-fill"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="studio-footer-actions">
                    <button
                      type="button"
                      className="action-hollow-btn"
                      onClick={() => {
                        if (!isUploading) {
                          resetStudioForm();
                          setShowUploadStudio(false);
                        }
                      }}
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="action-accent-btn"
                      onClick={uploadType === "reel" ? handleUploadReel : handleUploadPost}
                      disabled={isUploading || (uploadType === "reel" ? !uploadFile : postImages.length === 0)}
                    >
                      {isUploading
                        ? "Publishing..."
                        : uploadType === "reel"
                        ? "Publish Reel"
                        : "Share Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* AUTH PROMPT MODAL                                                    */}
        {/* ==================================================================== */}
        {showAuthModal && (
          <div className="drawer-overlay" onClick={() => setShowAuthModal(false)}>
            <div className="auth-prompt-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowAuthModal(false)}
                className="auth-modal-close-btn"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="auth-modal-top-brand">
                <span className="auth-modal-flame">🔥</span>
                <span className="auth-modal-brand-name">WUDAO</span>
              </div>
              <h3 className="auth-modal-title">{authModalTitle || "Join the WUDAO Community"}</h3>
              <p className="auth-modal-subtitle">
                {authModalSubtitle || "Log in or create an account to like, comment, and interact with creators across Africa."}
              </p>

              <div className="auth-modal-perks-list">
                <div className="auth-perk-row">
                  <span className="perk-bullet">✦</span>
                  <span>Unlimited streaming of African reels, songs & stories</span>
                </div>
                <div className="auth-perk-row">
                  <span className="perk-bullet">✦</span>
                  <span>Like posts, comment on moments, and talk with creators</span>
                </div>
                <div className="auth-perk-row">
                  <span className="perk-bullet">✦</span>
                  <span>Upload your own vertical reels and community photos</span>
                </div>
              </div>

              <div className="auth-modal-actions-box">
                <Link
                  href="/login"
                  onClick={() => setShowAuthModal(false)}
                  className="auth-action-btn primary"
                >
                  Log In to WUDAO
                </Link>
                <Link
                  href="/Registration"
                  onClick={() => setShowAuthModal(false)}
                  className="auth-action-btn secondary"
                >
                  Create Free Account
                </Link>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="auth-action-dismiss"
                >
                  Continue Viewing as Guest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TIKTOK-STYLE SHARE TO MODAL                                          */}
        {/* ==================================================================== */}
        {showShareModal && shareTarget && (
          <div className="drawer-overlay" onClick={() => setShowShareModal(false)}>
            <div className="tiktok-share-modal" onClick={(e) => e.stopPropagation()}>
              <div className="share-modal-header">
                <div className="share-modal-title-col">
                  <h3>Share to</h3>
                  <p className="share-modal-author-note">
                    {shareTarget.author ? `From @${shareTarget.author}` : "Share this content"}
                  </p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="sheet-close-cross"
                  aria-label="Close share dialog"
                >
                  ✕
                </button>
              </div>

              {/* TikTok Style Destination Apps Track */}
              <div className="share-apps-grid">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    shareTarget.title + "\n" + shareTarget.url
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-app-item"
                  onClick={() => showToast("Opening WhatsApp...")}
                >
                  <div className="share-app-circle whatsapp">
                    <IconWhatsApp size={28} />
                  </div>
                  <span className="share-app-label">WhatsApp</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareTarget.url
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-app-item"
                  onClick={() => showToast("Opening Facebook...")}
                >
                  <div className="share-app-circle facebook">
                    <IconFacebook size={26} />
                  </div>
                  <span className="share-app-label">Facebook</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareTarget.title
                  )}&url=${encodeURIComponent(shareTarget.url)}&hashtags=Wudau,Tanzania`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-app-item"
                  onClick={() => showToast("Opening X...")}
                >
                  <div className="share-app-circle twitter">
                    <IconTwitter size={24} />
                  </div>
                  <span className="share-app-label">X (Twitter)</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    shareTarget.url
                  )}&text=${encodeURIComponent(shareTarget.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-app-item"
                  onClick={() => showToast("Opening Telegram...")}
                >
                  <div className="share-app-circle telegram">
                    <IconTelegram size={26} />
                  </div>
                  <span className="share-app-label">Telegram</span>
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    shareTarget.title
                  )}&body=${encodeURIComponent(
                    shareTarget.title + "\n\nWatch on WUDAO:\n" + shareTarget.url
                  )}`}
                  className="share-app-item"
                  onClick={() => showToast("Opening Email...")}
                >
                  <div className="share-app-circle email">
                    <IconMail size={24} />
                  </div>
                  <span className="share-app-label">Email</span>
                </a>

                <a
                  href={`sms:?&body=${encodeURIComponent(
                    shareTarget.title + " " + shareTarget.url
                  )}`}
                  className="share-app-item"
                >
                  <div className="share-app-circle sms">
                    <IconMessage size={24} />
                  </div>
                  <span className="share-app-label">SMS</span>
                </a>
              </div>

              <div className="share-divider-line" />

              {/* Copy Link Row */}
              <div className="share-copy-link-section">
                <div className="share-link-input-wrap">
                  <input
                    type="text"
                    readOnly
                    value={shareTarget.url}
                    className="share-link-input"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className={`share-link-copy-btn ${copiedShareLink ? "copied" : ""}`}
                  >
                    {copiedShareLink ? (
                      <>
                        <IconCheck size={16} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <IconCopy size={16} />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Utility / Embed Actions */}
              <div className="share-footer-utilities">
                <button onClick={handleCopyEmbedCode} className="share-util-btn">
                  <IconCode size={15} />
                  <span>Copy Embed Code</span>
                </button>
                {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                  <button
                    onClick={() => {
                      navigator.share({
                        title: shareTarget.title,
                        url: shareTarget.url,
                      }).catch(() => {});
                    }}
                    className="share-util-btn system"
                  >
                    <span>More Options...</span>
                  </button>
                )}
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
          background: #0c0d12;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(120, 75, 160, 0.45);
          overflow: hidden;
          flex-shrink: 0;
        }

        .brand-logo-mark.mini {
          width: 26px;
          height: 26px;
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

        /* Fluid Video Card — Auto-responsive fitness for 9:16, 16:9, 1:1 and iframes */
        .video-player-card {
          position: relative;
          width: 100%;
          max-width: 480px;
          height: calc(100dvh - 56px);
          background: #000000;
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.06);
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
          transition: max-width 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), height 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
        }

        /* Landscape Cinema Adaptation for 16:9 widescreen videos on desktop */
        @media (min-width: 768px) {
          .video-player-card.is-landscape {
            max-width: min(860px, 72vw);
            height: min(calc(100dvh - 84px), 520px);
            aspect-ratio: 16 / 9;
          }
        }

        /* Ambient blurred background layer that fills non-9:16 aspect ratios with glowing colors */
        .ambient-blur-backdrop {
          position: absolute;
          inset: -30px;
          background-size: cover;
          background-position: center;
          filter: blur(36px) brightness(0.42) saturate(1.4);
          transform: scale(1.15);
          pointer-events: none;
          z-index: 1;
          transition: background-image 0.35s ease;
        }

        .main-reel-video {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          background: transparent;
        }

        /* Embed / Iframe Mode: Clean full-viewport auto-fit player */
        .embed-mode.app-shell {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
          max-width: 100vw !important;
          background: #000000 !important;
        }

        .embed-mode .content-stage,
        .embed-mode .reels-stage {
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh !important;
          width: 100vw !important;
          max-width: 100vw !important;
          min-height: 100vh !important;
        }

        .embed-mode .player-presentation-layout {
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh !important;
          width: 100vw !important;
          max-width: 100vw !important;
          gap: 0 !important;
        }

        .embed-mode .video-player-card {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          border: none !important;
          margin: 0 !important;
          box-shadow: none !important;
        }

        /* Embed Mode Brand Link Badge */
        .embed-wudao-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 40;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .embed-wudao-badge:hover {
          background: rgba(255, 69, 0, 0.88);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
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
          height: 38px;
          min-width: 38px;
          padding: 0 10px;
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 30;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .player-sound-btn.is-muted {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.92), rgba(220, 38, 38, 0.95));
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          padding: 0 13px;
          gap: 6px;
          animation: pulseMuteGlow 2.2s infinite;
        }

        @keyframes pulseMuteGlow {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.75); transform: scale(1); }
          50% { box-shadow: 0 0 0 9px rgba(239, 68, 68, 0); transform: scale(1.04); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); transform: scale(1); }
        }

        .sound-pill-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sound-pill-text {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .player-sound-btn:hover {
          transform: scale(1.06);
        }

        /* Creator Studio Candidate Thumbnails Strip */
        .studio-thumbnail-selector-panel {
          width: 100%;
          margin: 12px 0 6px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .studio-thumbnail-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .studio-thumb-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .studio-custom-cover-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .studio-custom-cover-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .studio-thumbnails-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 2px 8px;
          scrollbar-width: thin;
        }

        .thumbnail-candidate-card {
          position: relative;
          width: 68px;
          height: 96px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.12);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .thumbnail-candidate-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.35);
        }

        .thumbnail-candidate-card.selected {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 2px var(--brand-primary), 0 4px 12px rgba(255, 69, 0, 0.3);
        }

        .thumbnail-candidate-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-selected-check {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--brand-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        /* Explore Tab Video Reels Grid */
        .explore-reels-section {
          width: 100%;
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid var(--border-subtle);
        }

        .explore-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .explore-section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
        }

        .explore-section-title-wrap h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .explore-section-badge {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--text-secondary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .explore-reels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        @media (max-width: 640px) {
          .explore-reels-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        .explore-reel-card {
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .explore-reel-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.22);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
        }

        .explore-reel-thumbnail-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 14;
          background: #0b0f19;
          overflow: hidden;
        }

        .explore-reel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .explore-reel-card:hover .explore-reel-img {
          transform: scale(1.05);
        }

        .explore-reel-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.65) 100%);
          pointer-events: none;
        }

        .explore-reel-play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.22s ease;
          pointer-events: none;
        }

        .explore-reel-card:hover .explore-reel-play-icon {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .explore-reel-views-pill {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .explore-reel-info {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .explore-reel-creator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .explore-creator-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .explore-creator-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .explore-reel-caption {
          font-size: 12px;
          color: var(--text-primary);
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

        /* Comments Bottom Sheet & Desktop Panel */
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

        @media (min-width: 769px) {
          .bottom-comments-sheet {
            top: 50%;
            bottom: auto;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 440px;
            max-width: 90vw;
            height: 640px;
            max-height: 85vh;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.16);
            box-shadow: 0 32px 90px rgba(0, 0, 0, 0.85);
            animation: modalScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .sheet-drag-handle {
            display: none;
          }
          .sheet-comments-scroll {
            max-height: calc(640px - 140px);
            flex: 1;
          }
        }

        @media (min-width: 1200px) {
          /* Dock side-by-side with the centered reel player on desktop so the video remains completely visible */
          .bottom-comments-sheet {
            left: calc(50% + 240px);
            transform: translateY(-50%);
            width: 390px;
            height: 700px;
            max-height: 86vh;
          }
        }

        /* WUDAO Watermark Floating Badge */
        .wudao-reel-watermark {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px 5px 7px;
          border-radius: 20px;
          background: rgba(8, 10, 15, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          z-index: 15;
          pointer-events: none;
          user-select: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.3s ease;
        }

        .watermark-logo-wrap {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          background: #0c0d12;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .watermark-logo-img {
          display: block;
          object-fit: contain;
        }

        .watermark-sep {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
        }

        .watermark-brand-word {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          background: linear-gradient(135deg, #ff5722 0%, #ff9800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .watermark-author-handle {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.82);
        }

        .wudao-photo-watermark {
          position: absolute;
          bottom: 14px;
          right: 14px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 14px;
          background: rgba(5, 7, 12, 0.72);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 10;
          pointer-events: none;
          user-select: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .wudao-photo-watermark.modal-pos {
          bottom: 20px;
          right: 20px;
          padding: 5px 12px;
          border-radius: 16px;
        }

        .photo-watermark-flame {
          font-size: 11px;
        }

        .photo-watermark-brand {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, #ff5722 0%, #ff9800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .photo-watermark-dot {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
        }

        .photo-watermark-user {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
        }

        /* Guest Reel Preview Gate */
        .guest-reel-preview-gate {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, #1b2133 0%, #080a11 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 30;
          text-align: center;
        }

        .preview-gate-card {
          max-width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .preview-gate-icon {
          font-size: 44px;
        }

        .preview-gate-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 4px 10px;
          border-radius: 12px;
          background: rgba(255, 87, 34, 0.16);
          color: #ff7043;
          border: 1px solid rgba(255, 87, 34, 0.3);
        }

        .preview-gate-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.3;
          margin: 0;
        }

        .preview-gate-card p {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0;
        }

        .preview-gate-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .gate-btn {
          width: 100%;
          padding: 12px 18px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
          border: none;
          cursor: pointer;
        }

        .gate-btn.primary {
          background: linear-gradient(135deg, #ff5722 0%, #ff9800 100%);
          color: #ffffff;
          box-shadow: 0 4px 18px rgba(255, 87, 34, 0.4);
        }

        .gate-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 87, 34, 0.55);
        }

        .gate-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .gate-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.14);
        }

        .gate-btn.reset {
          background: transparent;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
          padding: 6px;
        }

        .gate-btn.reset:hover {
          color: #ffffff;
        }

        /* Guest Feed Preview Gate */
        .guest-feed-preview-gate {
          margin: 24px 0 40px 0;
          background: linear-gradient(180deg, rgba(20, 24, 38, 0.75) 0%, rgba(11, 14, 23, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 24px;
          padding: 36px 24px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
          text-align: center;
          display: flex;
          justify-content: center;
        }

        .feed-gate-card {
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .feed-gate-avatar-stack {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .feed-gate-avatar-stack .stack-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #0e121c;
          margin-left: -14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .feed-gate-avatar-stack .stack-avatar:first-child {
          margin-left: 0;
        }

        .feed-gate-badge {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 4px 12px;
          border-radius: 14px;
          background: rgba(255, 87, 34, 0.15);
          color: #ff7043;
          border: 1px solid rgba(255, 87, 34, 0.28);
        }

        .feed-gate-card h3 {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.3;
          margin: 0;
        }

        .feed-gate-card p {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0;
        }

        .feed-gate-actions {
          display: flex;
          gap: 12px;
          width: 100%;
          margin-top: 10px;
        }

        @media (max-width: 600px) {
          .feed-gate-actions {
            flex-direction: column;
          }
        }

        /* TikTok Share Modal */
        .tiktok-share-modal {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 480px;
          background: #11141f;
          border-radius: 24px 24px 0 0;
          padding: 20px 22px 28px 22px;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.9);
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 220;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 769px) {
          .tiktok-share-modal {
            top: 50%;
            bottom: auto;
            transform: translate(-50%, -50%);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.16);
            animation: modalScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }

        .share-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .share-modal-title-col h3 {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }

        .share-modal-author-note {
          font-size: 12px;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }

        .share-apps-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          padding: 8px 0;
          overflow-x: auto;
        }

        @media (max-width: 480px) {
          .share-apps-grid {
            display: flex;
            overflow-x: auto;
            gap: 16px;
            padding-bottom: 12px;
            scrollbar-width: none;
          }
          .share-apps-grid::-webkit-scrollbar {
            display: none;
          }
        }

        .share-app-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #e2e8f0;
          transition: transform 0.18s ease;
          flex-shrink: 0;
        }

        .share-app-item:hover {
          transform: translateY(-2px);
        }

        .share-app-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          transition: transform 0.18s ease;
        }

        .share-app-circle.whatsapp {
          background: #25d366;
        }
        .share-app-circle.facebook {
          background: #1877f2;
        }
        .share-app-circle.twitter {
          background: #0f1419;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }
        .share-app-circle.telegram {
          background: #229ed9;
        }
        .share-app-circle.email {
          background: #ea4335;
        }
        .share-app-circle.sms {
          background: #34a853;
        }

        .share-app-label {
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          color: #cbd5e1;
        }

        .share-divider-line {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 2px 0;
        }

        .share-copy-link-section {
          width: 100%;
        }

        .share-link-input-wrap {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 4px 6px 4px 14px;
          gap: 10px;
        }

        .share-link-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #e2e8f0;
          font-size: 13px;
          outline: none;
          text-overflow: ellipsis;
        }

        .share-link-copy-btn {
          padding: 8px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }

        .share-link-copy-btn:hover {
          background: rgba(255, 255, 255, 0.22);
        }

        .share-link-copy-btn.copied {
          background: #10b981;
          color: #ffffff;
        }

        .share-footer-utilities {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .share-util-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 8px 14px;
          border-radius: 12px;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.18s ease;
        }

        .share-util-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        /* Enhanced Auth Prompt Modal Card */
        .auth-prompt-modal-card {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 440px;
          background: #111420;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          padding: 28px 24px;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.9);
          animation: modalScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 230;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .auth-modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          border: none;
          background: rgba(255, 255, 255, 0.08);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-modal-top-brand {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(255, 87, 34, 0.14);
          border: 1px solid rgba(255, 87, 34, 0.3);
          margin-bottom: 12px;
        }

        .auth-modal-flame {
          font-size: 13px;
        }

        .auth-modal-brand-name {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          background: linear-gradient(135deg, #ff5722 0%, #ff9800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 8px 0;
        }

        .auth-modal-subtitle {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .auth-modal-perks-list {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .auth-perk-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #cbd5e1;
        }

        .perk-bullet {
          color: #ff7043;
          font-size: 11px;
        }

        .auth-modal-actions-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .auth-action-btn {
          width: 100%;
          padding: 12px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
        }

        .auth-action-btn.primary {
          background: linear-gradient(135deg, #ff5722 0%, #ff9800 100%);
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(255, 87, 34, 0.4);
        }

        .auth-action-btn.primary:hover {
          transform: translateY(-1px);
        }

        .auth-action-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .auth-action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.14);
        }

        .auth-action-dismiss {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px;
        }

        .auth-action-dismiss:hover {
          color: #94a3b8;
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

        .wudao-toast {
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

          .embed-mode .content-stage,
          .embed-mode .player-presentation-layout,
          .embed-mode .reels-stage {
            height: 100vh !important;
            min-height: 100vh !important;
            padding: 0 !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
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
            touch-action: pan-y;
            user-select: none;
            -webkit-user-select: none;
          }

          .player-actions-column {
            bottom: 64px;
            right: 8px;
            gap: 10px;
          }

          .player-bottom-vignette {
            right: 58px;
            padding: 16px 12px calc(env(safe-area-inset-bottom, 0px) + 12px) 12px;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.65) 50%, rgba(0, 0, 0, 0.15) 80%, transparent 100%);
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

        /* ==================================================================== */
        /* CREATOR UPLOAD STUDIO STYLING                                        */
        /* ==================================================================== */
        .studio-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          background: rgba(4, 6, 12, 0.84);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .studio-modal-container {
          background: #10121a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          width: 920px;
          max-width: 100%;
          height: 680px;
          max-height: 94vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.9);
          overflow: hidden;
        }

        .studio-header {
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          flex-shrink: 0;
        }

        .studio-title-cluster {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .studio-title-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--brand-accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 87, 34, 0.4);
        }

        .studio-title-text {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
        }

        .studio-type-toggle {
          display: inline-flex;
          background: rgba(255, 255, 255, 0.06);
          padding: 4px;
          border-radius: 20px;
          gap: 4px;
        }

        .studio-type-btn {
          padding: 6px 16px;
          border-radius: 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .studio-type-btn.active {
          background: var(--brand-accent);
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(255, 87, 34, 0.4);
        }

        .studio-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          padding: 24px;
          gap: 28px;
        }

        .studio-media-col {
          width: 360px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.16);
          border-radius: 18px;
          overflow: hidden;
          position: relative;
        }

        .studio-dropzone {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .studio-dropzone:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .studio-dropzone-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 87, 34, 0.15);
          color: var(--brand-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .studio-dropzone-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .studio-dropzone-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .studio-browse-btn {
          padding: 8px 18px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .studio-preview-wrapper {
          flex: 1;
          position: relative;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .studio-video-preview {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .studio-preview-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
        }

        .studio-change-media-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(8px);
        }

        .studio-form-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .studio-creator-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .studio-creator-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .studio-creator-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .studio-creator-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .studio-creator-handle {
          font-size: 11px;
          color: var(--text-muted);
        }

        .studio-creator-select {
          background: #191c26;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          padding: 4px 10px;
          font-size: 12px;
          outline: none;
        }

        .studio-field-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
        }

        .studio-caption-textarea {
          width: 100%;
          min-height: 90px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 12px;
          color: #ffffff;
          font-size: 13px;
          resize: vertical;
          outline: none;
          font-family: inherit;
        }

        .studio-caption-textarea:focus {
          border-color: rgba(255, 87, 34, 0.6);
        }

        .studio-hashtags-box {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .studio-hashtag-chip {
          padding: 4px 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .studio-hashtag-chip.selected {
          background: rgba(255, 87, 34, 0.2);
          border-color: rgba(255, 87, 34, 0.5);
          color: #ffffff;
        }

        .studio-input-field {
          width: 100%;
          height: 40px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0 12px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
        }

        .studio-input-field:focus {
          border-color: rgba(255, 87, 34, 0.6);
        }

        .studio-progress-card {
          padding: 12px;
          background: rgba(255, 87, 34, 0.08);
          border: 1px solid rgba(255, 87, 34, 0.2);
          border-radius: 14px;
        }

        .studio-progress-status {
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .studio-progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .studio-progress-fill {
          height: 100%;
          background: var(--brand-accent);
          transition: width 0.2s ease;
        }

        .studio-footer-actions {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 768px) {
          .studio-modal-container {
            width: 100vw;
            height: 100dvh;
            max-height: 100dvh;
            border-radius: 0;
          }
          .studio-body {
            flex-direction: column;
            overflow-y: auto;
          }
          .studio-media-col {
            width: 100%;
            height: 240px;
            flex-shrink: 0;
          }
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Server-Side Props for Instant First Paint - 100% Real Data
export async function getServerSideProps(context: any) {
  try {
    const apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_BASE_URL || baseURL;
    const cleanBase = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;
    const requestedVideoId = context.query?.videoId ? String(context.query.videoId).trim() : null;
    const isEmbed = context.query?.embed === "true" || context.query?.embed === "1";

    const videoEndpoint = requestedVideoId
      ? `${cleanBase}client/video/getAllVideos?videoId=${encodeURIComponent(requestedVideoId)}&limit=30`
      : `${cleanBase}client/video/getAllVideos?start=1&limit=30`;

    const [videosRes, postsRes, hashtagsRes, songsRes, liveRes, giftsRes] = await Promise.all([
      fetch(videoEndpoint, {
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

    let videoList: VideoItem[] = videosRes.data || [];

    if (requestedVideoId) {
      // Prioritize requested videoId strictly at index 0 for deep-linking
      const targetIdx = videoList.findIndex((v) => v._id === requestedVideoId);
      if (targetIdx > 0) {
        const [moved] = videoList.splice(targetIdx, 1);
        videoList.unshift(moved);
      }
    } else {
      // Prioritize Tanzanian & African creators first
      videoList.sort((a, b) => {
        const aIsTz = (a.userName || "").includes("_tz") || (a.userName || "").includes("_znz");
        const bIsTz = (b.userName || "").includes("_tz") || (b.userName || "").includes("_znz");
        if (aIsTz && !bIsTz) return -1;
        if (!aIsTz && bIsTz) return 1;
        return 0;
      });
    }

    return {
      props: {
        initialVideos: videoList,
        initialPosts: postsRes.post || [],
        initialHashtags: hashtagsRes.data || [],
        initialSongs: songsRes.songs || [],
        initialLiveStreams: liveRes.liveUserList || [],
        initialGifts: giftsRes.data || [],
        initialVideoId: requestedVideoId,
        initialEmbed: isEmbed,
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
        initialVideoId: null,
        initialEmbed: false,
      },
    };
  }
}
