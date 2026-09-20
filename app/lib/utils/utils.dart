import 'dart:developer';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:get/get.dart';
import 'package:in_app_purchase_android/in_app_purchase_android.dart';
import 'package:wudau/utils/color.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:wudau/pages/splash_screen_page/api/admin_setting_api.dart';
import 'package:wudau/utils/internet_connection.dart';
import 'package:zego_express_engine/zego_express_engine.dart';

abstract class Utils {
  static RxBool isAppOpen = false.obs;

  static void showLog(String text) {
    log(text);
    print("[APP] $text");
  }

  static void showToast(String text, [Color? color]) {
    Fluttertoast.showToast(
      msg: text,
      backgroundColor: color ?? AppColor.primary,
      textColor: AppColor.white,
      gravity: ToastGravity.BOTTOM,
    );
  }

  // >>>>> >>>>> Edit Profile Page <<<<< <<<<<

  static int waterMarkSize = 25;
  static bool get isShowWaterMark => AdminSettingsApi.adminSettingModel?.data?.isWatermarkOn ?? false;
  static String get waterMarkIcon => AdminSettingsApi.adminSettingModel?.data?.watermarkIcon ?? "";

  static TextEditingController countryController = TextEditingController(text: "India");
  static TextEditingController flagController = TextEditingController(text: "🇮🇳");

  // >>>>> >>>>> Show Reels Effect <<<<< <<<<<

  static bool get isShowReelsEffect => AdminSettingsApi.adminSettingModel?.data?.isEffectActive ?? false;

  // >>>>> >>>>> Upload Shorts Limit <<<<< <<<<<

  static int get shortsDuration => AdminSettingsApi.adminSettingModel?.data?.durationOfShorts ?? 0;

  static String get effectAndroidLicenseKey => AdminSettingsApi.adminSettingModel?.data?.androidLicenseKey ?? "";
  static String get effectIosLicenseKey => AdminSettingsApi.adminSettingModel?.data?.iosLicenseKey ?? "";

  // >>>>> >>>>> Web View Url <<<<< <<<<<

  static String get privacyPolicyLink => AdminSettingsApi.adminSettingModel?.data?.privacyPolicyLink ?? "";
  static String get termsOfUseLink => AdminSettingsApi.adminSettingModel?.data?.termsOfUsePolicyLink ?? "";

  // >>>>> >>>>> Show Payment Method <<<<< <<<<<

  static bool get isShowStripePaymentMethod => AdminSettingsApi.adminSettingModel?.data?.stripeSwitch ?? false;
  static bool get isShowRazorPayPaymentMethod => AdminSettingsApi.adminSettingModel?.data?.razorPaySwitch ?? false;
  static bool get isShowFlutterWavePaymentMethod => AdminSettingsApi.adminSettingModel?.data?.flutterWaveSwitch ?? false;
  static bool get isShowInAppPurchasePaymentMethod => AdminSettingsApi.adminSettingModel?.data?.googlePlaySwitch ?? false;

  // >>>>> >>>>> Live Streaming Credential <<<<< <<<<<

  static const String serverSecret = "";
  static String get liveAppSign => AdminSettingsApi.adminSettingModel?.data?.zegoAppSignIn ?? "";
  static int get liveAppId => int.tryParse(AdminSettingsApi.adminSettingModel?.data?.zegoAppId?.toString() ?? "0") ?? 0;

  // >>>>> >>>>> RazorPay Payment Credential <<<<< <<<<<

  static String get razorpayTestKey => AdminSettingsApi.adminSettingModel?.data?.razorSecretKey ?? "";
  static String get razorpayCurrencyCode => AdminSettingsApi.adminSettingModel?.data?.currency?.currencyCode ?? "";

  // >>>>> >>>>> Stripe Payment Credential <<<<< <<<<<

  static const String stripeUrl = "https://api.stripe.com/v1/payment_intents";

  static String get stripeMerchantCountryCode => AdminSettingsApi.adminSettingModel?.data?.currency?.countryCode ?? "";
  static String get stripeCurrencyCode => AdminSettingsApi.adminSettingModel?.data?.currency?.currencyCode ?? "";
  static String get stripeTestSecretKey => AdminSettingsApi.adminSettingModel?.data?.stripeSecretKey ?? "";
  static String get stripeTestPublicKey => AdminSettingsApi.adminSettingModel?.data?.stripePublishableKey ?? "";

  // >>>>> >>>>> Flutter Wave Credential <<<<< <<<<<

  static String get flutterWaveId => AdminSettingsApi.adminSettingModel?.data?.flutterWaveId ?? "";
  static String get flutterWaveCurrencyCode => AdminSettingsApi.adminSettingModel?.data?.currency?.currencyCode ?? "";

  // >>>>>> >>>>>> Initialize Live Streaming <<<<<< <<<<<<

  static Future<void> onInitCreateEngine() async {
    try {
      final appId = Utils.liveAppId;
      final appSign = Utils.liveAppSign;
      if (appId > 0 && appSign.isNotEmpty && !appSign.contains("YOUR_ZEGO")) {
        await ZegoExpressEngine.createEngineWithProfile(
          ZegoEngineProfile(
            appId,
            ZegoScenario.Broadcast,
            appSign: kIsWeb ? null : appSign,
          ),
        );
      } else {
        Utils.showLog("Skip Zego initialization: invalid or placeholder credentials (appId: $appId)");
      }
    } catch (e) {
      Utils.showLog("Zego initialization error: $e");
    }
  }

  // >>>>>> >>>>>> Initialize Payment <<<<<< <<<<<<

  static Future<void> onInitPayment() async {
    try {
      if (InternetConnection.isConnect.value) {
        final pubKey = Utils.stripeTestPublicKey;
        if (pubKey.isNotEmpty && !pubKey.contains("PLACEHOLDER")) {
          Stripe.publishableKey = pubKey;
          await Stripe.instance.applySettings();
        }
        InAppPurchaseAndroidPlatformAddition.enablePendingPurchases();
      }
    } catch (e) {
      Utils.showLog("Payment initialization error: $e");
    }
  }
}
