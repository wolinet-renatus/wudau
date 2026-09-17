import 'dart:convert';

FetchFollowersModel fetchFollowersModelFromJson(String str) => FetchFollowersModel.fromJson(json.decode(str));
String fetchFollowersModelToJson(FetchFollowersModel data) => json.encode(data.toJson());

class FetchFollowersModel {
  FetchFollowersModel({
    bool? status,
    String? message,
    List<FollowersData>? followerFollowing,
  }) {
    _status = status;
    _message = message;
    _followerFollowing = followerFollowing;
  }

  FetchFollowersModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    if (json['followerFollowing'] != null) {
      _followerFollowing = [];
      json['followerFollowing'].forEach((v) {
        _followerFollowing?.add(FollowersData.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  List<FollowersData>? _followerFollowing;
  FetchFollowersModel copyWith({
    bool? status,
    String? message,
    List<FollowersData>? followerFollowing,
  }) =>
      FetchFollowersModel(
        status: status ?? _status,
        message: message ?? _message,
        followerFollowing: followerFollowing ?? _followerFollowing,
      );
  bool? get status => _status;
  String? get message => _message;
  List<FollowersData>? get followerFollowing => _followerFollowing;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = _status;
    map['message'] = _message;
    if (_followerFollowing != null) {
      map['followerFollowing'] = _followerFollowing?.map((v) => v.toJson()).toList();
    }
    return map;
  }
}

FollowersData followerFollowingFromJson(String str) => FollowersData.fromJson(json.decode(str));
String followerFollowingToJson(FollowersData data) => json.encode(data.toJson());

class FollowersData {
  FollowersData({
    String? id,
    FromUserId? fromUserId,
    String? toUserId,
    String? createdAt,
    String? updatedAt,
  }) {
    _id = id;
    _fromUserId = fromUserId;
    _toUserId = toUserId;
    _createdAt = createdAt;
    _updatedAt = updatedAt;
  }

  FollowersData.fromJson(dynamic json) {
    _id = json['_id'];
    _fromUserId = json['fromUserId'] != null ? FromUserId.fromJson(json['fromUserId']) : null;
    _toUserId = json['toUserId'];
    _createdAt = json['createdAt'];
    _updatedAt = json['updatedAt'];
  }
  String? _id;
  FromUserId? _fromUserId;
  String? _toUserId;
  String? _createdAt;
  String? _updatedAt;
  FollowersData copyWith({
    String? id,
    FromUserId? fromUserId,
    String? toUserId,
    String? createdAt,
    String? updatedAt,
  }) =>
      FollowersData(
        id: id ?? _id,
        fromUserId: fromUserId ?? _fromUserId,
        toUserId: toUserId ?? _toUserId,
        createdAt: createdAt ?? _createdAt,
        updatedAt: updatedAt ?? _updatedAt,
      );
  String? get id => _id;
  FromUserId? get fromUserId => _fromUserId;
  String? get toUserId => _toUserId;
  String? get createdAt => _createdAt;
  String? get updatedAt => _updatedAt;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    if (_fromUserId != null) {
      map['fromUserId'] = _fromUserId?.toJson();
    }
    map['toUserId'] = _toUserId;
    map['createdAt'] = _createdAt;
    map['updatedAt'] = _updatedAt;
    return map;
  }
}

FromUserId fromUserIdFromJson(String str) => FromUserId.fromJson(json.decode(str));
String fromUserIdToJson(FromUserId data) => json.encode(data.toJson());

class FromUserId {
  FromUserId({
    String? id,
    String? name,
    String? userName,
    String? image,
    bool? isVerified,
  }) {
    _id = id;
    _name = name;
    _userName = userName;
    _image = image;
    _isVerified = isVerified;
  }

  FromUserId.fromJson(dynamic json) {
    _id = json['_id'];
    _name = json['name'];
    _userName = json['userName'];
    _image = json['image'];
    _isVerified = json['isVerified'];
  }
  String? _id;
  String? _name;
  String? _userName;
  String? _image;
  bool? _isVerified;
  FromUserId copyWith({
    String? id,
    String? name,
    String? userName,
    String? image,
    bool? isVerified,
  }) =>
      FromUserId(
        id: id ?? _id,
        name: name ?? _name,
        userName: userName ?? _userName,
        image: image ?? _image,
        isVerified: isVerified ?? _isVerified,
      );
  String? get id => _id;
  String? get name => _name;
  String? get userName => _userName;
  String? get image => _image;
  bool? get isVerified => _isVerified;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['name'] = _name;
    map['userName'] = _userName;
    map['image'] = _image;
    map['isVerified'] = _isVerified;
    return map;
  }
}
