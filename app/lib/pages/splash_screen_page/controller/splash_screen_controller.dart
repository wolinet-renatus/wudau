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
    try {
      await AppRequest.notificationPermission();

      if (InternetConnection.isConnect.value) {
        await AdminSettingsApi.callApi(); // Get Admin Setting Data...

        if (AdminSettingsApi.adminSettingModel?.data != null) {
          try {
            await Utils.onInitCreateEngine(); // Init Live...
          } catch (e) {
            Utils.showLog("onInitCreateEngine error: $e");
          }

          try {
            await Utils.onInitPayment(); // Init Payment...
          } catch (e) {
            Utils.showLog("onInitPayment error: $e");
          }
        } else {
          Utils.showToast(EnumLocal.txtSomeThingWentWrong.name.tr);
          Utils.showLog("Admin Setting Api Calling Failed !!");
        }
      } else {
        Utils.showToast(EnumLocal.txtConnectionLost.name.tr);
        Utils.showLog("Internet Connection Lost !!");
      }
    } catch (e) {
      Utils.showLog("SplashScreenController init error: $e");
    } finally {
      await splashScreen();
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
