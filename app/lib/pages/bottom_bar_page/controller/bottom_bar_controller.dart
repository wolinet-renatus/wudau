import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:wudau/pages/feed_page/view/feed_view.dart';
import 'package:wudau/pages/message_page/view/message_view.dart';
import 'package:wudau/pages/profile_page/view/profile_view.dart';
import 'package:wudau/pages/reels_page/view/reels_view.dart';
import 'package:wudau/pages/stream_page/view/stream_view.dart';
import 'package:wudau/routes/app_routes.dart';
import 'package:wudau/ui/send_gift_on_video_bottom_sheet_ui.dart';
import 'package:wudau/utils/branch_io_services.dart';
import 'package:wudau/utils/database.dart';
import 'package:wudau/utils/socket_services.dart';

class BottomBarController extends GetxController {
  int selectedTabIndex = 0;
  PageController pageController = PageController();

  @override
  void onInit() {
    init();
    super.onInit();
  }

  void init() async {
    selectedTabIndex = 0;

    await SocketServices.socketConnect();



    SendGiftOnVideoBottomSheetUi.onGetGift();

    if (BranchIoServices.eventType == "Post") {
      await 500.milliseconds.delay();
      onChangeBottomBar(2);
    } else if (BranchIoServices.eventType == "Profile") {
      await 500.milliseconds.delay();
      onChangeBottomBar(2);
      if (BranchIoServices.eventId != "") {
        Get.toNamed(AppRoutes.previewUserProfilePage, arguments: BranchIoServices.eventId);
      }
    }
  }

  List bottomBarPages = [
    const ReelsView(),
    const StreamView(),
    const FeedView(),
    const MessageView(),
    const ProfileView(),
  ];

  void onChangeBottomBar(int index) {
    if ((index == 3 || index == 4) && !Database.checkUserLogin()) {
      return;
    }
    if (index != selectedTabIndex) {
      selectedTabIndex = index;
      update(["onChangeBottomBar"]);
    }
  }
}
