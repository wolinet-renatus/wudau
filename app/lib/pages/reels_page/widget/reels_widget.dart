import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:gallery_saver/gallery_saver.dart';
import 'package:get/get.dart';
import 'package:lottie/lottie.dart';
import 'package:path_provider/path_provider.dart';
import 'package:readmore/readmore.dart';
import 'package:video_player/video_player.dart';
import 'package:wudau/custom/custom_format_number.dart';
import 'package:wudau/custom/custom_share.dart';
import 'package:wudau/pages/bottom_bar_page/controller/bottom_bar_controller.dart';
import 'package:wudau/routes/app_routes.dart';
import 'package:wudau/ui/loading_ui.dart';
import 'package:wudau/ui/preview_network_image_ui.dart';
import 'package:wudau/ui/preview_profile_bottom_sheet_ui.dart';
import 'package:wudau/custom/custom_icon_button.dart';
import 'package:wudau/ui/comment_bottom_sheet_ui.dart';
import 'package:wudau/main.dart';
import 'package:wudau/pages/reels_page/api/reels_like_dislike_api.dart';
import 'package:wudau/pages/reels_page/api/reels_share_api.dart';
import 'package:wudau/pages/reels_page/controller/reels_controller.dart';
import 'package:wudau/ui/report_bottom_sheet_ui.dart';
import 'package:wudau/ui/send_gift_on_video_bottom_sheet_ui.dart';
import 'package:wudau/ui/video_picker_bottom_sheet_ui.dart';
import 'package:wudau/utils/api.dart';
import 'package:wudau/utils/asset.dart';
import 'package:wudau/utils/branch_io_services.dart';
import 'package:wudau/utils/color.dart';
import 'package:wudau/utils/constant.dart';
import 'package:wudau/utils/database.dart';
import 'package:wudau/utils/enums.dart';
import 'package:wudau/utils/font_style.dart';
import 'package:wudau/utils/utils.dart';
import 'package:wudau/utils/video_cache_service.dart';
import 'package:vibration/vibration.dart';

class PreviewReelsView extends StatefulWidget {
  const PreviewReelsView({super.key, required this.index, required this.currentPageIndex});

  final int index;
  final int currentPageIndex;

  @override
  State<PreviewReelsView> createState() => _PreviewReelsViewState();
}

class _PreviewReelsViewState extends State<PreviewReelsView> with SingleTickerProviderStateMixin {
  final controller = Get.find<ReelsController>();

  VideoPlayerController? videoPlayerController;

  RxBool isPlaying = true.obs;
  RxBool isShowIcon = false.obs;

  RxBool isBuffering = false.obs;
  RxBool isVideoInitialized = false.obs;

  RxBool isShowLikeAnimation = false.obs;
  RxBool isShowLikeIconAnimation = false.obs;

  RxBool isReelsPage = true.obs; // Used to stop auto-playing when navigating away

  RxBool isLike = false.obs;

  RxMap customChanges = {"like": 0, "comment": 0}.obs;

  AnimationController? _cdController;
  late Animation<double> _cdAnimation;

  RxBool isReadMore = false.obs;

  /// True when this widget should have an active decoder (current or adjacent)
  bool get _isProximity => (widget.index - widget.currentPageIndex).abs() <= 1;

  /// True when this is the currently visible page
  bool get _isCurrentPage => widget.index == widget.currentPageIndex;

  @override
  void initState() {
    super.initState();
    _cdController = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    );
    _cdAnimation = Tween(begin: 0.0, end: 1.0).animate(_cdController!);

    customSetting();

    if (_isProximity) {
      _initializeVideoPlayer();
    }

    if (_isCurrentPage) {
      _cdController?.repeat();
    }
  }

  @override
  void didUpdateWidget(covariant PreviewReelsView oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.currentPageIndex != widget.currentPageIndex) {
      if (_isCurrentPage) {
        // We became the visible page — play and spin the CD
        _cdController?.repeat();
        if (isVideoInitialized.value && isReelsPage.value) {
          onPlayVideo();
        }
      } else if ((widget.index - widget.currentPageIndex).abs() == 1) {
        // Adjacent page: initialize player for instant-next-swipe, keep paused
        _cdController?.stop();
        onStopVideo();
        if (videoPlayerController == null) {
          _initializeVideoPlayer();
        }
      } else {
        // Far off-screen: release hardware decoder immediately
        _cdController?.stop();
        onStopVideo();
        _disposeVideoPlayer();
      }
    }
  }

  @override
  void dispose() {
    _cdController?.dispose();
    _disposeVideoPlayer();
    Utils.showLog("Dispose Method Called Success");
    super.dispose();
  }

  // ─────────────────────────────────────────────────
  // Video Player Lifecycle
  // ─────────────────────────────────────────────────

  Future<void> _initializeVideoPlayer() async {
    if (!mounted) return;
    try {
      final data = controller.mainReels[widget.index];
      final videoPath = data.videoUrl ?? "";
      if (videoPath.isEmpty) return;

      final fullUrl = Api.baseUrl + videoPath;

      // Check local disk cache first for zero-latency start
      final cachedFile = await VideoCacheService.getCachedVideoFile(fullUrl);

      if (!mounted) return;

      if (cachedFile != null) {
        videoPlayerController = VideoPlayerController.file(cachedFile);
      } else {
        videoPlayerController = VideoPlayerController.networkUrl(
          Uri.parse(fullUrl),
          videoPlayerOptions: VideoPlayerOptions(mixWithOthers: false),
        );
        // Kick off background cache download
        VideoCacheService.preloadVideo(fullUrl);
      }

      await videoPlayerController?.setLooping(true);
      await videoPlayerController?.initialize();
      await videoPlayerController?.setVolume(1.0);

      if (!mounted) {
        videoPlayerController?.dispose();
        videoPlayerController = null;
        return;
      }

      if (videoPlayerController?.value.isInitialized ?? false) {
        isVideoInitialized.value = true;

        // Auto-play if this is the current visible page
        if (_isCurrentPage && isReelsPage.value) {
          onPlayVideo();
        }

        videoPlayerController?.addListener(() {
          if (!mounted) return;
          final isNowBuffering = videoPlayerController?.value.isBuffering ?? false;
          if (isBuffering.value != isNowBuffering) {
            isBuffering.value = isNowBuffering;
          }
          if (isReelsPage.value == false) {
            onStopVideo(); // Stop when navigating away
          }
        });
      }
    } catch (e) {
      _disposeVideoPlayer();
      Utils.showLog("Reels Video Initialization Failed !!! ${widget.index} => $e");
    }
  }

  void onStopVideo() {
    if (!mounted) return;
    isPlaying.value = false;
    videoPlayerController?.pause();
  }

  void onPlayVideo() {
    if (!mounted) return;
    isPlaying.value = true;
    videoPlayerController?.setVolume(1.0);
    videoPlayerController?.play();
  }

  void _disposeVideoPlayer() {
    try {
      videoPlayerController?.pause();
      videoPlayerController?.dispose();
      videoPlayerController = null;
      isVideoInitialized.value = false;
    } catch (e) {
      Utils.showLog(">>>> _disposeVideoPlayer Error => $e");
    }
  }

  void customSetting() {
    isLike.value = controller.mainReels[widget.index].isLike!;
    customChanges["like"] = int.parse(controller.mainReels[widget.index].totalLikes.toString());
    customChanges["comment"] = int.parse(controller.mainReels[widget.index].totalComments.toString());
  }

  // ─────────────────────────────────────────────────
  // User Interactions
  // ─────────────────────────────────────────────────

  void onClickVideo() async {
    if (isVideoInitialized.value == false) return;
    videoPlayerController!.value.isPlaying ? onStopVideo() : onPlayVideo();
    isShowIcon.value = true;
    await 2.seconds.delay();
    isShowIcon.value = false;
    if (isReelsPage.value == false) {
      isReelsPage.value = true;
    }
  }

  void onClickPlayPause() async {
    if (isVideoInitialized.value == false) return;
    videoPlayerController!.value.isPlaying ? onStopVideo() : onPlayVideo();
    if (isReelsPage.value == false) {
      isReelsPage.value = true;
    }
  }

  Future<void> onClickShare() async {
    isReelsPage.value = false;

    Get.dialog(const LoadingUi(), barrierDismissible: false);

    await BranchIoServices.onCreateBranchIoLink(
      id: controller.mainReels[widget.index].id ?? "",
      name: controller.mainReels[widget.index].caption ?? "",
      image: controller.mainReels[widget.index].videoImage ?? "",
      userId: controller.mainReels[widget.index].userId ?? "",
      pageRoutes: "Video",
    );

    final link = await BranchIoServices.onGenerateLink();

    Get.back();

    if (link != null) {
      CustomShare.onShareLink(link: link);
    }
    await ReelsShareApi.callApi(loginUserId: Database.loginUserId, videoId: controller.mainReels[widget.index].id!);
  }

  Future<void> onClickDownload() async {
    final reel = controller.mainReels[widget.index];
    if (reel.id == null || reel.id!.isEmpty) return;

    Get.dialog(const LoadingUi(), barrierDismissible: false);
    try {
      final downloadUrl = "${Api.downloadVideo}?videoId=${reel.id}";
      final dir = await getTemporaryDirectory();
      final filePath = "${dir.path}/WUDAO_${reel.id}.mp4";

      final dio = Dio();
      await dio.download(downloadUrl, filePath);

      final success = await GallerySaver.saveVideo(filePath);
      Get.back();

      if (success == true) {
        Utils.showToast(EnumLocal.txtDownloadSuccess.name.tr);
      } else {
        Utils.showToast(EnumLocal.txtSomeThingWentWrong.name.tr);
      }
    } catch (e) {
      Get.back();
      Utils.showLog("Download video failed => $e");
      Utils.showToast(EnumLocal.txtSomeThingWentWrong.name.tr);
    }
  }

  Future<void> onClickLike() async {
    if (!Database.checkUserLogin()) return;
    if (isLike.value) {
      isLike.value = false;
      customChanges["like"]--;
    } else {
      isLike.value = true;
      customChanges["like"]++;

      isShowLikeIconAnimation.value = true;
      await 500.milliseconds.delay();
      isShowLikeIconAnimation.value = false;
    }

    await ReelsLikeDislikeApi.callApi(
      loginUserId: Database.loginUserId,
      videoId: controller.mainReels[widget.index].id!,
    );
  }

  Future<void> onDoubleClick() async {
    if (!Database.checkUserLogin()) return;
    if (isLike.value) {
      isLike.value = false;
      customChanges["like"]--;
    } else {
      isLike.value = true;
      customChanges["like"]++;

      isShowLikeAnimation.value = true;
      Vibration.vibrate(duration: 50, amplitude: 128);
      await 1200.milliseconds.delay();
      isShowLikeAnimation.value = false;
    }
    await ReelsLikeDislikeApi.callApi(
      loginUserId: Database.loginUserId,
      videoId: controller.mainReels[widget.index].id!,
    );
  }

  Future<void> onClickComment() async {
    isReelsPage.value = false;
    customChanges["comment"] = await CommentBottomSheetUi.show(
      context: context,
      commentType: 2,
      commentTypeId: controller.mainReels[widget.index].id!,
      totalComments: customChanges["comment"],
    );
  }

  // ─────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox(
        height: Get.height,
        width: Get.width,
        child: Stack(
          children: [
            // ── Video Layer (with instant thumbnail backdrop) ──
            GestureDetector(
              onTap: onClickVideo,
              onDoubleTap: onDoubleClick,
              child: Container(
                color: AppColor.black,
                height: (Get.height - AppConstant.bottomBarSize),
                width: Get.width,
                child: Obx(
                  () {
                    final initialized = isVideoInitialized.value;
                    return Stack(
                      fit: StackFit.expand,
                      children: [
                        // ── Instant thumbnail backdrop (always visible) ──
                        _buildThumbnail(),

                        // ── Actual video on top once ready ──
                        if (initialized && videoPlayerController != null)
                          AnimatedOpacity(
                            opacity: 1.0,
                            duration: const Duration(milliseconds: 200),
                            child: SizedBox.expand(
                              child: ClipRect(
                                child: FittedBox(
                                  fit: BoxFit.cover,
                                  // Use aspectRatio (rotation-corrected) not value.size
                                  // (which is pre-rotation storage dimensions and causes
                                  //  portrait video to render as landscape letterbox).
                                  child: SizedBox(
                                    width: (videoPlayerController!.value.aspectRatio > 0
                                            ? videoPlayerController!.value.aspectRatio
                                            : 9.0 / 16.0) *
                                        1000,
                                    height: 1000,
                                    child: VideoPlayer(videoPlayerController!),
                                  ),
                                ),
                              ),
                            ),
                          ),

                        // ── Buffering indicator (small spinner, not a full blocker) ──
                        if (!initialized)
                          const Align(
                            alignment: Alignment.bottomCenter,
                            child: LinearProgressIndicator(),
                          ),
                      ],
                    );
                  },
                ),
              ),
            ),

            // ── Brand Watermark ──
            Positioned(
              top: MediaQuery.of(context).viewPadding.top + 15,
              left: 20,
              child: Visibility(
                visible: Utils.isShowWaterMark,
                child: CachedNetworkImage(
                  imageUrl: Utils.waterMarkIcon,
                  fit: BoxFit.contain,
                  imageBuilder: (context, imageProvider) => Image(
                    image: ResizeImage(imageProvider, width: Utils.waterMarkSize, height: Utils.waterMarkSize),
                    fit: BoxFit.contain,
                  ),
                  placeholder: (context, url) => const Offstage(),
                  errorWidget: (context, url, error) => const Offstage(),
                ),
              ),
            ),

            // ── Gift overlay ──
            Align(
              alignment: Alignment.center,
              child: SendGiftOnVideoBottomSheetUi.onShowGift(),
            ),

            // ── Double-tap like animation ──
            Obx(
              () => Visibility(
                visible: isShowLikeAnimation.value,
                child: Align(alignment: Alignment.center, child: Lottie.asset(AppAsset.lottieLike, fit: BoxFit.cover, height: 300, width: 300)),
              ),
            ),

            // ── Play/Pause icon overlay ──
            Obx(
              () => isShowIcon.value
                  ? Align(
                      alignment: Alignment.center,
                      child: GestureDetector(
                        onTap: onClickPlayPause,
                        child: Container(
                          height: 70,
                          width: 70,
                          padding: EdgeInsets.only(left: isPlaying.value ? 0 : 2),
                          decoration: BoxDecoration(color: AppColor.black.withOpacity(0.2), shape: BoxShape.circle),
                          child: Center(
                            child: Image.asset(
                              isPlaying.value ? AppAsset.icPause : AppAsset.icPlay,
                              width: 30,
                              height: 30,
                              color: AppColor.white,
                            ),
                          ),
                        ),
                      ),
                    )
                  : const Offstage(),
            ),

            // ── Bottom gradient overlay ──
            Positioned(
              bottom: 0,
              child: Container(
                height: Get.height / 4,
                width: Get.width,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColor.transparent, AppColor.black.withOpacity(0.7)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
            ),

            // ── Top-right action bar (create, report) ──
            Positioned(
              right: 0,
              child: Container(
                padding: Platform.isAndroid ? EdgeInsets.only(top: 30) : EdgeInsets.only(top: 46),
                height: Get.height,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomIconButton(
                      circleSize: 40,
                      iconSize: 25,
                      icon: AppAsset.icCreate,
                      callback: () {
                        if (!Database.checkUserLogin()) return;
                        isReelsPage.value = false;
                        VideoPickerBottomSheetUi.show(context: context);
                      },
                    ),
                    5.width,
                    GestureDetector(
                      onTap: () {
                        if (!Database.checkUserLogin()) return;
                        isReelsPage.value = false;
                        ReportBottomSheetUi.show(context: context, eventId: controller.mainReels[widget.index].id ?? "", eventType: 1);
                      },
                      child: Container(
                        height: 40,
                        width: 40,
                        decoration: const BoxDecoration(shape: BoxShape.circle),
                        child: const Icon(Icons.more_vert_rounded, color: AppColor.white, size: 30),
                      ),
                    ),
                    8.width,
                  ],
                ),
              ),
            ),

            // ── Right-side action buttons (gift, like, comment, share, download, music) ──
            Positioned(
              right: 0,
              child: Container(
                padding: const EdgeInsets.only(top: 30, bottom: 100),
                height: Get.height,
                child: Column(
                  children: [
                    const Spacer(),
                    GestureDetector(
                      onTap: () {
                        if (!Database.checkUserLogin()) return;
                        Utils.showLog("Video User Id => ${controller.mainReels[widget.index].userId} => ${Database.loginUserId}");
                        if (controller.mainReels[widget.index].userId != Database.loginUserId) {
                          isReelsPage.value = false;
                          SendGiftOnVideoBottomSheetUi.show(
                            context: context,
                            videoId: controller.mainReels[widget.index].id ?? "",
                          );
                        } else {
                          Utils.showToast(EnumLocal.txtYouCantSendGiftOwnVideo.name.tr);
                        }
                      },
                      child: SizedBox(
                        width: 65,
                        child: Lottie.asset(AppAsset.lottieGift),
                      ),
                    ),
                    10.height,
                    Obx(
                      () => SizedBox(
                        height: 40,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          height: isShowLikeIconAnimation.value ? 15 : 50,
                          width: isShowLikeIconAnimation.value ? 15 : 50,
                          alignment: Alignment.center,
                          child: CustomIconButton(
                            icon: AppAsset.icLike,
                            callback: onClickLike,
                            iconSize: 34,
                            iconColor: isLike.value ? AppColor.colorRedContainer : AppColor.white,
                          ),
                        ),
                      ),
                    ),
                    Obx(
                      () => Text(
                        CustomFormatNumber.convert(customChanges["like"]),
                        style: AppFontStyle.styleW700(AppColor.white, 14),
                      ),
                    ),
                    15.height,
                    CustomIconButton(icon: AppAsset.icComment, circleSize: 40, callback: onClickComment, iconSize: 34),
                    Obx(
                      () => Text(
                        CustomFormatNumber.convert(customChanges["comment"]),
                        style: AppFontStyle.styleW700(AppColor.white, 14),
                      ),
                    ),
                    12.height,
                    CustomIconButton(
                      circleSize: 40,
                      icon: AppAsset.icShare,
                      callback: onClickShare,
                      iconSize: 32,
                      iconColor: AppColor.white,
                    ),
                    Text("", style: AppFontStyle.styleW700(AppColor.white, 14)),
                    12.height,
                    CustomIconButton(
                      circleSize: 40,
                      icon: AppAsset.icDownload,
                      callback: onClickDownload,
                      iconSize: 28,
                      iconColor: AppColor.white,
                    ),
                    Text("", style: AppFontStyle.styleW700(AppColor.white, 14)),
                    12.height,
                    GestureDetector(
                      onTap: () {
                        Utils.showLog("Song Id => ${controller.mainReels[widget.index].songId}");
                        if (controller.mainReels[widget.index].songId != "" && controller.mainReels[widget.index].songId != null) {
                          isReelsPage.value = false;
                          Get.toNamed(AppRoutes.audioWiseVideosPage, arguments: controller.mainReels[widget.index].songId);
                        } else if (controller.mainReels[widget.index].userId != Database.loginUserId) {
                          isReelsPage.value = false;
                          PreviewProfileBottomSheetUi.show(
                            context: context,
                            userId: controller.mainReels[widget.index].userId ?? "",
                          );
                        } else {
                          isReelsPage.value = false;
                          final bottomBarCtrl = Get.find<BottomBarController>();
                          bottomBarCtrl.onChangeBottomBar(4);
                        }
                      },
                      child: SizedBox(
                        width: 50,
                        child: Stack(
                          alignment: Alignment.center,
                          clipBehavior: Clip.none,
                          children: [
                            RotationTransition(turns: _cdAnimation, child: Image.asset(AppAsset.icMusicCd)),
                            RotationTransition(
                              turns: _cdAnimation,
                              child: Container(
                                width: 30,
                                clipBehavior: Clip.antiAlias,
                                decoration: const BoxDecoration(shape: BoxShape.circle),
                                child: Stack(
                                  children: [
                                    Image.asset(AppAsset.icProfilePlaceHolder),
                                    PreviewNetworkImageUi(image: controller.mainReels[widget.index].userImage),
                                  ],
                                ),
                              ),
                            ),
                            Positioned(
                              right: 4,
                              bottom: -4,
                              child: Image.asset(AppAsset.icMusic, width: 20),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Bottom-left user info & caption ──
            Positioned(
              left: 15,
              bottom: 20,
              child: SizedBox(
                height: 400,
                width: Get.width / 1.5,
                child: Align(
                  alignment: Alignment.bottomLeft,
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        GestureDetector(
                          onTap: () {
                            if (controller.mainReels[widget.index].userId != Database.loginUserId) {
                              isReelsPage.value = false;
                              PreviewProfileBottomSheetUi.show(
                                context: context,
                                userId: controller.mainReels[widget.index].userId ?? "",
                              );
                            } else {
                              isReelsPage.value = false;
                              final bottomBarCtrl = Get.find<BottomBarController>();
                              bottomBarCtrl.onChangeBottomBar(4);
                            }
                          },
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                height: 46,
                                width: 46,
                                clipBehavior: Clip.antiAlias,
                                decoration: const BoxDecoration(shape: BoxShape.circle),
                                child: Stack(
                                  children: [
                                    AspectRatio(aspectRatio: 1, child: Image.asset(AppAsset.icProfilePlaceHolder)),
                                    AspectRatio(aspectRatio: 1, child: PreviewNetworkImageUi(image: controller.mainReels[widget.index].userImage)),
                                  ],
                                ),
                              ),
                              10.width,
                              Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(
                                    width: Get.width / 2,
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.start,
                                      children: [
                                        Text(
                                          maxLines: 1,
                                          controller.mainReels[widget.index].name ?? "",
                                          style: AppFontStyle.styleW600(AppColor.white, 16.5),
                                        ),
                                        Visibility(
                                          visible: controller.mainReels[widget.index].isVerified ?? false,
                                          child: Padding(
                                            padding: const EdgeInsets.only(left: 3),
                                            child: Image.asset(AppAsset.icBlueTick, width: 20),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  SizedBox(
                                    width: Get.width / 2,
                                    child: Text(
                                      maxLines: 1,
                                      controller.mainReels[widget.index].userName ?? "",
                                      style: AppFontStyle.styleW500(AppColor.white, 13),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        10.height,
                        Visibility(
                          visible: controller.mainReels[widget.index].caption?.trim().isNotEmpty ?? false,
                          child: ReadMoreText(
                            controller.mainReels[widget.index].caption ?? "",
                            trimMode: TrimMode.Line,
                            trimLines: 3,
                            style: AppFontStyle.styleW500(AppColor.white, 13),
                            colorClickableText: AppColor.primary,
                            trimCollapsedText: ' Show more',
                            trimExpandedText: ' Show less',
                            moreStyle: AppFontStyle.styleW500(AppColor.primary, 13.5),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Instant thumbnail backdrop using server-provided poster image
  Widget _buildThumbnail() {
    final imageUrl = controller.mainReels[widget.index].videoImage ?? "";
    if (imageUrl.isEmpty) return const SizedBox.shrink();
    return SizedBox.expand(
      child: CachedNetworkImage(
        imageUrl: Api.baseUrl + imageUrl,
        fit: BoxFit.cover,
        placeholder: (_, __) => Container(color: AppColor.black),
        errorWidget: (_, __, ___) => Container(color: AppColor.black),
      ),
    );
  }
}
