import 'dart:async';
import 'package:get/get.dart';
import 'package:wudau/routes/app_routes.dart';
import 'package:wudau/pages/splash_screen_page/api/admin_setting_api.dart';
import 'package:wudau/utils/branch_io_services.dart';
import 'package:wudau/utils/enums.dart';
import 'package:wudau/utils/internet_connection.dart';
import 'package:wudau/utils/request.dart';
import 'package:wudau/utils/utils.dart';

class SplashScreenController extends GetxController {
  @override
  void onInit() {
    init();
    super.onInit();
  }

  Future<void> init() async {
    await AppRequest.notificationPermission();

    if (InternetConnection.isConnect.value) {
      await AdminSettingsApi.callApi(); // Get Admin Setting Data...

      if (AdminSettingsApi.adminSettingModel?.data != null) {
        await Utils.onInitCreateEngine(); // Init Live...

        await Utils.onInitPayment(); // Init Payment...

        await splashScreen();
      } else {
        Utils.showToast(EnumLocal.txtSomeThingWentWrong.name.tr);
        Utils.showLog("Admin Setting Api Calling Failed !!");
      }
    } else {
      Utils.showToast(EnumLocal.txtConnectionLost.name.tr);
      Utils.showLog("Internet Connection Lost !!");
    }
  }

  Future<void> splashScreen() async {
    Timer(
      Duration(milliseconds: 100),
      () {
        BranchIoServices.onListenBranchIoLinks();
        Get.offAllNamed(AppRoutes.bottomBarPage);
      },
    );
  }
}
