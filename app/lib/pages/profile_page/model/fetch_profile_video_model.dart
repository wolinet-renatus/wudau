import 'dart:convert';

FetchProfileVideoModel fetchProfileVideoModelFromJson(String str) => FetchProfileVideoModel.fromJson(json.decode(str));
String fetchProfileVideoModelToJson(FetchProfileVideoModel data) => json.encode(data.toJson());

class FetchProfileVideoModel {
  FetchProfileVideoModel({
    bool? status,
    String? message,
    List<ProfileVideoData>? data,
  }) {
    _status = status;
    _message = message;
    _data = data;
  }

  FetchProfileVideoModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    if (json['data'] != null) {
      _data = [];
      json['data'].forEach((v) {
        _data?.add(ProfileVideoData.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  List<ProfileVideoData>? _data;
  FetchProfileVideoModel copyWith({
    bool? status,
    String? message,
    List<ProfileVideoData>? data,
  }) =>
      FetchProfileVideoModel(
        status: status ?? _status,
        message: message ?? _message,
        data: data ?? _data,
      );
  bool? get status => _status;
  String? get message => _message;
  List<ProfileVideoData>? get data => _data;

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

ProfileVideoData dataFromJson(String str) => ProfileVideoData.fromJson(json.decode(str));
String dataToJson(ProfileVideoData data) => json.encode(data.toJson());

class ProfileVideoData {
  ProfileVideoData({
    String? id,
    String? caption,
    String? videoUrl,
    String? videoImage,
    String? songId,
    bool? isBanned,
    String? createdAt,
    int? totalLikes,
    bool? isLike,
    int? totalComments,
    int? totalViews,
    List<String>? hashTag,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? userIsFake,
    String? songTitle,
    String? songImage,
    String? songLink,
    String? singerName,
  }) {
    _id = id;
    _caption = caption;
    _videoUrl = videoUrl;
    _videoImage = videoImage;
    _songId = songId;
    _isBanned = isBanned;
    _createdAt = createdAt;
    _totalLikes = totalLikes;
    _isLike = isLike;
    _totalComments = totalComments;
    _totalViews = totalViews;
    _hashTag = hashTag;
    _userId = userId;
    _name = name;
    _userName = userName;
    _userImage = userImage;
    _userIsFake = userIsFake;
    _songTitle = songTitle;
    _songImage = songImage;
    _songLink = songLink;
    _singerName = singerName;
  }

  ProfileVideoData.fromJson(dynamic json) {
    _id = json['_id'];
    _caption = json['caption'];
    _videoUrl = json['videoUrl'];
    _videoImage = json['videoImage'];
    _songId = json['songId'];
    _isBanned = json['isBanned'];
    _createdAt = json['createdAt'];
    _totalLikes = json['totalLikes'];
    _isLike = json['isLike'];
    _totalComments = json['totalComments'];
    _totalViews = json['totalViews'];
    _hashTag = json['hashTag'] != null ? json['hashTag'].cast<String>() : [];
    _userId = json['userId'];
    _name = json['name'];
    _userName = json['userName'];
    _userImage = json['userImage'];
    _userIsFake = json['userIsFake'];
    _songTitle = json['songTitle'];
    _songImage = json['songImage'];
    _songLink = json['songLink'];
    _singerName = json['singerName'];
  }
  String? _id;
  String? _caption;
  String? _videoUrl;
  String? _videoImage;
  String? _songId;
  bool? _isBanned;
  String? _createdAt;
  int? _totalLikes;
  bool? _isLike;
  int? _totalComments;
  int? _totalViews;
  List<String>? _hashTag;
  String? _userId;
  String? _name;
  String? _userName;
  String? _userImage;
  bool? _userIsFake;
  String? _songTitle;
  String? _songImage;
  String? _songLink;
  String? _singerName;
  ProfileVideoData copyWith({
    String? id,
    String? caption,
    String? videoUrl,
    String? videoImage,
    String? songId,
    bool? isBanned,
    String? createdAt,
    int? totalLikes,
    bool? isLike,
    int? totalComments,
    int? totalViews,
    List<String>? hashTag,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? userIsFake,
    String? songTitle,
    String? songImage,
    String? songLink,
    String? singerName,
  }) =>
      ProfileVideoData(
        id: id ?? _id,
        caption: caption ?? _caption,
        videoUrl: videoUrl ?? _videoUrl,
        videoImage: videoImage ?? _videoImage,
        songId: songId ?? _songId,
        isBanned: isBanned ?? _isBanned,
        createdAt: createdAt ?? _createdAt,
        totalLikes: totalLikes ?? _totalLikes,
        isLike: isLike ?? _isLike,
        totalComments: totalComments ?? _totalComments,
        totalViews: totalViews ?? _totalViews,
        hashTag: hashTag ?? _hashTag,
        userId: userId ?? _userId,
        name: name ?? _name,
        userName: userName ?? _userName,
        userImage: userImage ?? _userImage,
        userIsFake: userIsFake ?? _userIsFake,
        songTitle: songTitle ?? _songTitle,
        songImage: songImage ?? _songImage,
        songLink: songLink ?? _songLink,
        singerName: singerName ?? _singerName,
      );
  String? get id => _id;
  String? get caption => _caption;
  String? get videoUrl => _videoUrl;
  String? get videoImage => _videoImage;
  String? get songId => _songId;
  bool? get isBanned => _isBanned;
  String? get createdAt => _createdAt;
  int? get totalLikes => _totalLikes;
  bool? get isLike => _isLike;
  int? get totalComments => _totalComments;
  int? get totalViews => _totalViews;
  List<String>? get hashTag => _hashTag;
  String? get userId => _userId;
  String? get name => _name;
  String? get userName => _userName;
  String? get userImage => _userImage;
  bool? get userIsFake => _userIsFake;
  String? get songTitle => _songTitle;
  String? get songImage => _songImage;
  String? get songLink => _songLink;
  String? get singerName => _singerName;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['caption'] = _caption;
    map['videoUrl'] = _videoUrl;
    map['videoImage'] = _videoImage;
    map['songId'] = _songId;
    map['isBanned'] = _isBanned;
    map['createdAt'] = _createdAt;
    map['totalLikes'] = _totalLikes;
    map['isLike'] = _isLike;
    map['totalComments'] = _totalComments;
    map['totalViews'] = _totalViews;
    map['hashTag'] = _hashTag;
    map['userId'] = _userId;
    map['name'] = _name;
    map['userName'] = _userName;
    map['userImage'] = _userImage;
    map['userIsFake'] = _userIsFake;
    map['songTitle'] = _songTitle;
    map['songImage'] = _songImage;
    map['songLink'] = _songLink;
    map['singerName'] = _singerName;
    return map;
  }
}
