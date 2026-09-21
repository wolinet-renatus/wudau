import 'package:get/get.dart';
import 'package:preload_page_view/preload_page_view.dart';
import 'package:wudau/pages/reels_page/api/fetch_reels_api.dart';
import 'package:wudau/pages/reels_page/model/fetch_reels_model.dart';
import 'package:wudau/utils/api.dart';
import 'package:wudau/utils/branch_io_services.dart';
import 'package:wudau/utils/database.dart';
import 'package:wudau/utils/video_cache_service.dart';

class ReelsController extends GetxController {
  PreloadPageController preloadPageController = PreloadPageController();

  bool isLoadingReels = false;
  FetchReelsModel? fetchReelsModel;

  bool isPaginationLoading = false;

  List<Data> mainReels = [];

  int currentPageIndex = 0;

  /// Guard: prevents duplicate initialization on route changes
  bool _isInitialized = false;

  @override
  void onInit() {
    init();
    super.onInit();
  }

  Future<void> init() async {
    if (_isInitialized) return; // ← Prevents re-init on route pop / tab switch
    _isInitialized = true;
    currentPageIndex = 0;
    mainReels.clear();
    FetchReelsApi.startPagination = 0;
    isLoadingReels = true;
    update(["onGetReels"]);
    await onGetReels();
    isLoadingReels = false;
  }

  /// Force-refresh triggered by pull-to-refresh gesture
  Future<void> forceRefresh() async {
    _isInitialized = false;
    currentPageIndex = 0;
    mainReels.clear();
    FetchReelsApi.startPagination = 0;
    isLoadingReels = true;
    update(["onGetReels"]);
    await onGetReels();
    isLoadingReels = false;
    _isInitialized = true;
  }

  void onPagination(int value) async {
    if ((mainReels.length - 1) == value) {
      if (isPaginationLoading == false) {
        isPaginationLoading = true;
        update(["onPagination"]);
        await onGetReels();
        isPaginationLoading = false;
        update(["onPagination"]);
      }
    }
  }

  void onChangePage(int index) async {
    currentPageIndex = index;
    update(["onChangePage"]);
    // Pre-cache next video in background so scrolling down is instant
    _preloadAdjacentVideos(index);
  }

  /// Silently pre-download the next video to disk cache
  void _preloadAdjacentVideos(int currentIndex) {
    final nextIndex = currentIndex + 1;
    if (nextIndex < mainReels.length) {
      final path = mainReels[nextIndex].videoUrl ?? "";
      if (path.isNotEmpty) {
        VideoCacheService.preloadVideo(Api.baseUrl + path);
      }
    }
  }

  Future<void> onGetReels() async {
    fetchReelsModel = null;
    fetchReelsModel = await FetchReelsApi.callApi(loginUserId: Database.loginUserId, videoId: BranchIoServices.eventId);

    if (fetchReelsModel?.data != null) {
      if (fetchReelsModel!.data!.isNotEmpty) {
        final paginationData = fetchReelsModel?.data ?? [];
        mainReels.addAll(paginationData);
        update(["onGetReels"]);

        // Pre-cache first two videos immediately after fetch
        for (int i = 0; i < paginationData.length && i < 2; i++) {
          final path = paginationData[i].videoUrl ?? "";
          if (path.isNotEmpty) {
            VideoCacheService.preloadVideo(Api.baseUrl + path);
          }
        }
      }
    }
    if (mainReels.isEmpty) {
      update(["onGetReels"]);
    }
  }
}
