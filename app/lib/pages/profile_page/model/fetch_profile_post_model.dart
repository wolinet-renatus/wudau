// To parse this JSON data, do
//
//     final fetchProfilePostModel = fetchProfilePostModelFromJson(jsonString);

import 'dart:convert';

FetchProfilePostModel fetchProfilePostModelFromJson(String str) => FetchProfilePostModel.fromJson(json.decode(str));

String fetchProfilePostModelToJson(FetchProfilePostModel data) => json.encode(data.toJson());

class FetchProfilePostModel {
  bool? status;
  String? message;
  List<ProfilePostData>? data;

  FetchProfilePostModel({
    this.status,
    this.message,
    this.data,
  });

  factory FetchProfilePostModel.fromJson(Map<String, dynamic> json) => FetchProfilePostModel(
        status: json["status"],
        message: json["message"],
        data: json["data"] == null
            ? []
            : List<ProfilePostData>.from(json["data"]!.map((x) => ProfilePostData.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "status": status,
        "message": message,
        "data": data == null ? [] : List<dynamic>.from(data!.map((x) => x.toJson())),
      };
}

class ProfilePostData {
  String? id;
  String? caption;
  String? mainPostImage;
  List<String>? postImage;

  ProfilePostData({
    this.id,
    this.caption,
    this.mainPostImage,
    this.postImage,
  });

  factory ProfilePostData.fromJson(Map<String, dynamic> json) => ProfilePostData(
        id: json["_id"],
        caption: json["caption"],
        mainPostImage: json["mainPostImage"],
        postImage: json["postImage"] == null ? [] : List<String>.from(json["postImage"]!.map((x) => x)),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "caption": caption,
        "mainPostImage": mainPostImage,
        "postImage": postImage == null ? [] : List<dynamic>.from(postImage!.map((x) => x)),
      };
}
