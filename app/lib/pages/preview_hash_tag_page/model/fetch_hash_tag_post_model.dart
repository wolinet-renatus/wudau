import 'dart:convert';

FetchHashTagPostModel fetchHashTagPostModelFromJson(String str) => FetchHashTagPostModel.fromJson(json.decode(str));
String fetchHashTagPostModelToJson(FetchHashTagPostModel data) => json.encode(data.toJson());

class FetchHashTagPostModel {
  FetchHashTagPostModel({
    bool? status,
    String? message,
    List<PostData>? data,
  }) {
    _status = status;
    _message = message;
    _data = data;
  }

  FetchHashTagPostModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    if (json['data'] != null) {
      _data = [];
      json['data'].forEach((v) {
        _data?.add(PostData.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  List<PostData>? _data;
  FetchHashTagPostModel copyWith({
    bool? status,
    String? message,
    List<PostData>? data,
  }) =>
      FetchHashTagPostModel(
        status: status ?? _status,
        message: message ?? _message,
        data: data ?? _data,
      );
  bool? get status => _status;
  String? get message => _message;
  List<PostData>? get data => _data;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = _status;
    map['message'] = _message;
    if (_data != null) {
      map['data'] = _data?.map((v) => v.toJson()).toList();
    }
    return map;
  }
}

PostData dataFromJson(String str) => PostData.fromJson(json.decode(str));
String dataToJson(PostData data) => json.encode(data.toJson());

class PostData {
  PostData({
    String? id,
    bool? isLike,
    int? totalLikes,
    int? totalComments,
    String? postId,
    String? caption,
    String? mainPostImage,
    List<String>? postImage,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? isVerified,
    List<String>? hashTag,
    String? time,
  }) {
    _id = id;
    _isLike = isLike;
    _totalLikes = totalLikes;
    _totalComments = totalComments;
    _postId = postId;
    _caption = caption;
    _mainPostImage = mainPostImage;
    _postImage = postImage;
    _userId = userId;
    _name = name;
    _userName = userName;
    _userImage = userImage;
    _isVerified = isVerified;
    _hashTag = hashTag;
    _time = time;
  }

  PostData.fromJson(dynamic json) {
    _id = json['_id'];
    _isLike = json['isLike'];
    _totalLikes = json['totalLikes'];
    _totalComments = json['totalComments'];
    _postId = json['postId'];
    _caption = json['caption'];
    _mainPostImage = json['mainPostImage'];
    _postImage = json['postImage'] != null ? json['postImage'].cast<String>() : [];
    _userId = json['userId'];
    _name = json['name'];
    _userName = json['userName'];
    _userImage = json['userImage'];
    _isVerified = json['isVerified'];
    _hashTag = json['hashTag'] != null ? json['hashTag'].cast<String>() : [];
    _time = json['time'];
  }
  String? _id;
  bool? _isLike;
  int? _totalLikes;
  int? _totalComments;
  String? _postId;
  String? _caption;
  String? _mainPostImage;
  List<String>? _postImage;
  String? _userId;
  String? _name;
  String? _userName;
  String? _userImage;
  bool? _isVerified;
  List<String>? _hashTag;
  String? _time;
  PostData copyWith({
    String? id,
    bool? isLike,
    int? totalLikes,
    int? totalComments,
    String? postId,
    String? caption,
    String? mainPostImage,
    List<String>? postImage,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? isVerified,
    List<String>? hashTag,
    String? time,
  }) =>
      PostData(
        id: id ?? _id,
        isLike: isLike ?? _isLike,
        totalLikes: totalLikes ?? _totalLikes,
        totalComments: totalComments ?? _totalComments,
        postId: postId ?? _postId,
        caption: caption ?? _caption,
        mainPostImage: mainPostImage ?? _mainPostImage,
        postImage: postImage ?? _postImage,
        userId: userId ?? _userId,
        name: name ?? _name,
        userName: userName ?? _userName,
        userImage: userImage ?? _userImage,
        isVerified: isVerified ?? _isVerified,
        hashTag: hashTag ?? _hashTag,
        time: time ?? _time,
      );
  String? get id => _id;
  bool? get isLike => _isLike;
  int? get totalLikes => _totalLikes;
  int? get totalComments => _totalComments;
  String? get postId => _postId;
  String? get caption => _caption;
  String? get mainPostImage => _mainPostImage;
  List<String>? get postImage => _postImage;
  String? get userId => _userId;
  String? get name => _name;
  String? get userName => _userName;
  String? get userImage => _userImage;
  bool? get isVerified => _isVerified;
  List<String>? get hashTag => _hashTag;
  String? get time => _time;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['isLike'] = _isLike;
    map['totalLikes'] = _totalLikes;
    map['totalComments'] = _totalComments;
    map['postId'] = _postId;
    map['caption'] = _caption;
    map['mainPostImage'] = _mainPostImage;
    map['postImage'] = _postImage;
    map['userId'] = _userId;
    map['name'] = _name;
    map['userName'] = _userName;
    map['userImage'] = _userImage;
    map['isVerified'] = _isVerified;
    map['hashTag'] = _hashTag;
    map['time'] = _time;
    return map;
  }
}
