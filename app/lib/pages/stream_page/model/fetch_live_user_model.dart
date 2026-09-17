import 'dart:convert';

FetchLiveUserModel fetchLiveUserModelFromJson(String str) => FetchLiveUserModel.fromJson(json.decode(str));
String fetchLiveUserModelToJson(FetchLiveUserModel data) => json.encode(data.toJson());

class FetchLiveUserModel {
  FetchLiveUserModel({
    bool? status,
    String? message,
    List<LiveUserList>? liveUserList,
  }) {
    _status = status;
    _message = message;
    _liveUserList = liveUserList;
  }

  FetchLiveUserModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    if (json['liveUserList'] != null) {
      _liveUserList = [];
      json['liveUserList'].forEach((v) {
        _liveUserList?.add(LiveUserList.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  List<LiveUserList>? _liveUserList;
  FetchLiveUserModel copyWith({
    bool? status,
    String? message,
    List<LiveUserList>? liveUserList,
  }) =>
      FetchLiveUserModel(
        status: status ?? _status,
        message: message ?? _message,
        liveUserList: liveUserList ?? _liveUserList,
      );
  bool? get status => _status;
  String? get message => _message;
  List<LiveUserList>? get liveUserList => _liveUserList;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = _status;
    map['message'] = _message;
    if (_liveUserList != null) {
      map['liveUserList'] = _liveUserList?.map((v) => v.toJson()).toList();
    }
    return map;
  }
}
LiveUserList liveUserListFromJson(String str) => LiveUserList.fromJson(json.decode(str));

String liveUserListToJson(LiveUserList data) => json.encode(data.toJson());

class LiveUserList {
  String? id;
  String? videoUrl;
  bool? isLive;
  int? view;
  dynamic liveHistoryId;
  bool? isFollow;
  String? name;
  String? userName;
  String? image;
  bool? isVerified;
  String? countryFlagImage;
  bool? isFake;

  LiveUserList({
    this.id,
    this.videoUrl,
    this.isLive,
    this.view,
    this.liveHistoryId,
    this.isFollow,
    this.name,
    this.userName,
    this.image,
    this.isVerified,
    this.countryFlagImage,
    this.isFake,
  });

  factory LiveUserList.fromJson(Map<String, dynamic> json) => LiveUserList(
    id: json["_id"],
    videoUrl: json["videoUrl"],
    isLive: json["isLive"],
    view: json["view"],
    liveHistoryId: json["liveHistoryId"],
    isFollow: json["isFollow"],
    name: json["name"],
    userName: json["userName"],
    image: json["image"],
    isVerified: json["isVerified"],
    countryFlagImage: json["countryFlagImage"],
    isFake: json["isFake"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "videoUrl": videoUrl,
    "isLive": isLive,
    "view": view,
    "liveHistoryId": liveHistoryId,
    "isFollow": isFollow,
    "name": name,
    "userName": userName,
    "image": image,
    "isVerified": isVerified,
    "countryFlagImage": countryFlagImage,
    "isFake": isFake,
  };
}
