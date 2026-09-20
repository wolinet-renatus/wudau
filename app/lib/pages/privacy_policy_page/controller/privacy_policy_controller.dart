import 'package:get/get.dart';
import 'package:wudau/utils/color.dart';
import 'package:wudau/utils/utils.dart';
import 'package:webview_flutter/webview_flutter.dart';

class PrivacyPolicyController extends GetxController {
  WebViewController? webViewController;
  @override
  void onInit() {
    onInitializeWebView();
    super.onInit();
  }

  void onInitializeWebView() async {
    webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppColor.white)
      ..loadRequest(Uri.parse(Utils.privacyPolicyLink));
    update(["onInitializeWebView"]);
  }
}
