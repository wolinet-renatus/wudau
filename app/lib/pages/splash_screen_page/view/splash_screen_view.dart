import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:wudau/pages/splash_screen_page/controller/splash_screen_controller.dart';
import 'package:wudau/utils/asset.dart';
import 'package:wudau/utils/color.dart';

class SplashScreenView extends GetView<SplashScreenController> {
  const SplashScreenView({super.key});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarIconBrightness: Brightness.light,
        statusBarColor: AppColor.transparent,
      ),
    );
    return Scaffold(
      body: Image.asset(
        AppAsset.imgSplashScreen,
        height: Get.height,
        width: Get.width,
        fit: BoxFit.cover,
      ),
    );
  }
}
