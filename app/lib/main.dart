import 'dart:async';
import 'dart:ui';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_branch_sdk/flutter_branch_sdk.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:wudau/localization/locale_constant.dart';
import 'package:wudau/localization/localizations_delegate.dart';
import 'package:wudau/routes/app_pages.dart';
import 'package:wudau/routes/app_routes.dart';
import 'package:wudau/utils/color.dart';
import 'package:wudau/utils/constant.dart';
import 'package:wudau/utils/database.dart';
import 'package:wudau/utils/enums.dart';
import 'package:wudau/utils/internet_connection.dart';
import 'package:wudau/utils/notification_services.dart';
import 'package:wudau/utils/platform_device_id.dart';
import 'package:wudau/utils/utils.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await GetStorage.init();
  } catch (e) {
    Utils.showLog("GetStorage init error: $e");
  }

  try {
    InternetConnection.init();
  } catch (e) {
    Utils.showLog("InternetConnection init error: $e");
  }

  try {
    await Firebase.initializeApp().timeout(const Duration(seconds: 3));
    await onInitializeCrashlytics();
  } catch (e) {
    Utils.showLog("Firebase init error: $e");
  }

  try {
    await onInitializeBranchIo().timeout(const Duration(seconds: 2));
  } catch (e) {
    Utils.showLog("Branch.io init error: $e");
  }

  String? identity;
  try {
    identity = await PlatformDeviceId.getDeviceId.timeout(const Duration(seconds: 2));
  } catch (e) {
    Utils.showLog("PlatformDeviceId error: $e");
    identity = "device_${DateTime.now().millisecondsSinceEpoch}";
  }

  String? fcmToken;
  try {
    fcmToken = await FirebaseMessaging.instance.getToken().timeout(const Duration(seconds: 3));
  } catch (e) {
    Utils.showLog("FCM Token error: $e");
    fcmToken = "sim_fcm_token_${identity ?? 'default'}";
  }

  Utils.showLog("Device Id => $identity");
  Utils.showLog("FCM Token => $fcmToken");

  try {
    await Database.init(identity ?? "default_device", fcmToken ?? "default_token");
  } catch (e) {
    Utils.showLog("Database init error: $e");
  }

  try {
    NotificationServices.init();
    NotificationServices.firebaseInit();
    FirebaseMessaging.onBackgroundMessage(NotificationServices.onShowBackgroundNotification);
  } catch (e) {
    Utils.showLog("Notification initialization error: $e");
  }

  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  static final StreamController purchaseStreamController = StreamController<PurchaseDetails>.broadcast();

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  @override
  void initState() {
    Utils.isAppOpen.value = true;
    WidgetsBinding.instance.addObserver(this);
    super.initState();
  }

  @override
  void dispose() {
    Utils.isAppOpen.value = false;
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      Utils.isAppOpen.value = true;
      Utils.showLog("User Back To App...");
    }
    if (state == AppLifecycleState.inactive) {
      Utils.isAppOpen.value = false;
      Utils.showLog("User Try To Exit...");
    }
  }

  @override
  void didChangeDependencies() {
    getLocale().then((locale) {
      setState(() {
        Utils.showLog("Preference LanguageCode => ${locale.languageCode}");
        Utils.showLog("GetX locale LanguageCode => ${Get.locale?.languageCode ?? ""}");
        Get.updateLocale(locale);
      });
    });
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: EnumLocal.txtAppName.name.tr,
      debugShowCheckedModeBanner: false,
      color: AppColor.white,
      translations: AppLanguages(),
      fallbackLocale: const Locale(AppConstant.languageEn, AppConstant.countryCodeEn),
      locale: const Locale(AppConstant.languageEn),
      defaultTransition: Transition.fade,
      getPages: AppPages.list,
      initialRoute: AppRoutes.initial,
    );
  }
}

// >>>>>> >>>>>> Sized Box Extension <<<<<< <<<<<<

extension HeightExtension on num {
  SizedBox get height => SizedBox(height: toDouble());
}

extension WidthExtension on num {
  SizedBox get width => SizedBox(width: toDouble());
}

Future<void> onInitializeCrashlytics() async {
  try {
    FlutterError.onError = (errorDetails) {
      FirebaseCrashlytics.instance.recordFlutterFatalError(errorDetails);
    };

    PlatformDispatcher.instance.onError = (error, stack) {
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      return true;
    };
  } catch (e) {
    Utils.showLog("Initialize Crashlytics Failed !! => $e");
  }
}

Future<void> onInitializeBranchIo() async {
  try {
    await FlutterBranchSdk.init();
  } catch (e) {
    Utils.showLog("Initialize Branch Io Failed !! => $e");
  }
}
