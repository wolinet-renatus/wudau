import 'dart:convert';

FetchFollowingModel fetchFollowingModelFromJson(String str) => FetchFollowingModel.fromJson(json.decode(str));
String fetchFollowingModelToJson(FetchFollowingModel data) => json.encode(data.toJson());

class FetchFollowingModel {
  FetchFollowingModel({
    bool? status,
    String? message,
    List<FollowingData>? followerFollowing,
  }) {
    _status = status;
    _message = message;
    _followerFollowing = followerFollowing;
  }

  FetchFollowingModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    if (json['followerFollowing'] != null) {
      _followerFollowing = [];
      json['followerFollowing'].forEach((v) {
        _followerFollowing?.add(FollowingData.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  List<FollowingData>? _followerFollowing;
  FetchFollowingModel copyWith({
    bool? status,
    String? message,
    List<FollowingData>? followerFollowing,
  }) =>
      FetchFollowingModel(
        status: status ?? _status,
        message: message ?? _message,
        followerFollowing: followerFollowing ?? _followerFollowing,
      );
  bool? get status => _status;
  String? get message => _message;
  List<FollowingData>? get followerFollowing => _followerFollowing;

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

FollowingData followerFollowingFromJson(String str) => FollowingData.fromJson(json.decode(str));
String followerFollowingToJson(FollowingData data) => json.encode(data.toJson());

class FollowingData {
  FollowingData({
    String? id,
    String? fromUserId,
    ToUserId? toUserId,
    String? createdAt,
    String? updatedAt,
  }) {
    _id = id;
    _fromUserId = fromUserId;
    _toUserId = toUserId;
    _createdAt = createdAt;
    _updatedAt = updatedAt;
  }

  FollowingData.fromJson(dynamic json) {
    _id = json['_id'];
    _fromUserId = json['fromUserId'];
    _toUserId = json['toUserId'] != null ? ToUserId.fromJson(json['toUserId']) : null;
    _createdAt = json['createdAt'];
    _updatedAt = json['updatedAt'];
  }
  String? _id;
  String? _fromUserId;
  ToUserId? _toUserId;
  String? _createdAt;
  String? _updatedAt;
  FollowingData copyWith({
    String? id,
    String? fromUserId,
    ToUserId? toUserId,
    String? createdAt,
    String? updatedAt,
  }) =>
      FollowingData(
        id: id ?? _id,
        fromUserId: fromUserId ?? _fromUserId,
        toUserId: toUserId ?? _toUserId,
        createdAt: createdAt ?? _createdAt,
        updatedAt: updatedAt ?? _updatedAt,
      );
  String? get id => _id;
  String? get fromUserId => _fromUserId;
  ToUserId? get toUserId => _toUserId;
  String? get createdAt => _createdAt;
  String? get updatedAt => _updatedAt;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['fromUserId'] = _fromUserId;
    if (_toUserId != null) {
      map['toUserId'] = _toUserId?.toJson();
    }
    map['createdAt'] = _createdAt;
    map['updatedAt'] = _updatedAt;
    return map;
  }
}

ToUserId toUserIdFromJson(String str) => ToUserId.fromJson(json.decode(str));
String toUserIdToJson(ToUserId data) => json.encode(data.toJson());

class ToUserId {
  ToUserId({
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

  ToUserId.fromJson(dynamic json) {
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
  ToUserId copyWith({
    String? id,
    String? name,
    String? userName,
    String? image,
    bool? isVerified,
  }) =>
      ToUserId(
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
