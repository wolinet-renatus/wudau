import 'dart:io';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:wudau/utils/utils.dart';

class VideoCacheService {
  VideoCacheService._();

  static final CacheManager _cacheManager = CacheManager(
    Config(
      'wudau_video_cache',
      stalePeriod: const Duration(days: 7),
      maxNrOfCacheObjects: 40,
      repo: JsonCacheInfoRepository(databaseName: 'wudau_video_cache'),
      fileService: HttpFileService(),
    ),
  );

  /// Check if the video file is already cached on disk.
  static Future<File?> getCachedVideoFile(String url) async {
    if (url.trim().isEmpty) return null;
    try {
      final fileInfo = await _cacheManager.getFileFromCache(url);
      if (fileInfo != null && await fileInfo.file.exists()) {
        return fileInfo.file;
      }
    } catch (e) {
      Utils.showLog("VideoCacheService getCachedVideoFile error: $e");
    }
    return null;
  }

  /// Download and cache video in background for subsequent loops or swipes.
  static void preloadVideo(String url) {
    if (url.trim().isEmpty) return;
    try {
      _cacheManager.downloadFile(url).then((_) {
        Utils.showLog("Video preloaded to local cache: $url");
      }).catchError((e) {
        // Silently ignore background download errors
      });
    } catch (e) {
      // Ignore
    }
  }

  /// Clear video cache if needed.
  static Future<void> clearCache() async {
    try {
      await _cacheManager.emptyCache();
    } catch (e) {
      Utils.showLog("VideoCacheService clearCache error: $e");
    }
  }
}
