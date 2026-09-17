import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shortie/utils/api.dart';
import 'package:shortie/utils/database.dart';
import 'package:shortie/utils/utils.dart';

class PreviewNetworkImageUi extends StatelessWidget {
  const PreviewNetworkImageUi({super.key, this.image});

  final String? image;

  @override
  Widget build(BuildContext context) {
    return (image != null && image != "")
        ? Database.networkImage(Api.baseUrl + image!) != null
            ? CachedNetworkImage(
                imageUrl: Database.networkImage(Api.baseUrl + image!)!,
                fit: BoxFit.cover,
                errorWidget: (context, url, error) => Offstage(),
              )
            // : CachedNetworkImage(imageUrl: Api.baseUrl + image!, fit: BoxFit.cover)

            : FutureBuilder(
                future: _onCheckImage(Api.baseUrl + image!),
                builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Offstage();
                  } else if (snapshot.hasError) {
                    return Offstage();
                  } else {
                    if (snapshot.data == true) {
                      Database.onSetNetworkImage(Api.baseUrl + image!);
                      return CachedNetworkImage(
                        imageUrl: Api.baseUrl + image!,
                        fit: BoxFit.cover,
                        errorWidget: (context, url, error) => Offstage(),
                      );
                    } else {
                      return Offstage();
                    }
                  }
                },
              )
        : Offstage();
  }
}

Future<bool> _onCheckImage(String image) async {
  try {
    final response = await http.head(Uri.parse(image));

    return response.statusCode == 200;
  } catch (e) {
    Utils.showLog('Check Profile Image Filed !! => $e');
    return false;
  }
}
