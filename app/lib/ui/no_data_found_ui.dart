import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:wudau/main.dart';
import 'package:wudau/utils/asset.dart';
import 'package:wudau/utils/color.dart';
import 'package:wudau/utils/enums.dart';
import 'package:wudau/utils/font_style.dart';

class NoDataFoundUi extends StatelessWidget {
  const NoDataFoundUi({
    super.key,
    required this.iconSize,
    required this.fontSize,
  });

  final double iconSize;
  final double fontSize;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(AppAsset.icNoDataFound, width: iconSize),
          15.height,
          Text(
            EnumLocal.txtNoDataFound.name.tr,
            style: AppFontStyle.styleW500(AppColor.colorGreyHasTagText, fontSize),
          ),
        ],
      ),
    );
  }
}
