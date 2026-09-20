import 'package:get/get.dart';
import 'package:wudau/pages/withdraw_page/controller/withdraw_controller.dart';

class WithdrawBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<WithdrawController>(() => WithdrawController());
  }
}
