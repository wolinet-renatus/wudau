import 'dart:convert';

FetchReelsModel fetchReelsModelFromJson(String str) => FetchReelsModel.fromJson(json.decode(str));
String fetchReelsModelToJson(FetchReelsModel data) => json.encode(data.toJson());

class FetchReelsModel {
  FetchReelsModel({
    bool? status,
    String? message,
    List<Data>? data,
  }) {
    _status = status;
    _message = message;
    _data = data;
  }

  FetchReelsModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    if (json['data'] != null) {
      _data = [];
      json['data'].forEach((v) {
        _data?.add(Data.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  List<Data>? _data;
  FetchReelsModel copyWith({
    bool? status,
    String? message,
    List<Data>? data,
  }) =>
      FetchReelsModel(
        status: status ?? _status,
        message: message ?? _message,
        data: data ?? _data,
      );
  bool? get status => _status;
  String? get message => _message;
  List<Data>? get data => _data;

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

Data dataFromJson(String str) => Data.fromJson(json.decode(str));
String dataToJson(Data data) => json.encode(data.toJson());

class Data {
  Data({
    String? id,
    String? caption,
    String? videoUrl,
    String? videoImage,
    String? songId,
    int? shareCount,
    bool? isFake,
    String? createdAt,
    String? songTitle,
    String? songImage,
    String? songLink,
    String? singerName,
    List<String>? hashTag,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? isVerified,
    bool? isLike,
    bool? isFollow,
    int? totalLikes,
    int? totalComments,
    String? time,
  }) {
    _id = id;
    _caption = caption;
    _videoUrl = videoUrl;
    _videoImage = videoImage;
    _songId = songId;
    _shareCount = shareCount;
    _isFake = isFake;
    _createdAt = createdAt;
    _songTitle = songTitle;
    _songImage = songImage;
    _songLink = songLink;
    _singerName = singerName;
    _hashTag = hashTag;
    _userId = userId;
    _name = name;
    _userName = userName;
    _userImage = userImage;
    _isVerified = isVerified;
    _isLike = isLike;
    _isFollow = isFollow;
    _totalLikes = totalLikes;
    _totalComments = totalComments;
    _time = time;
  }

  Data.fromJson(dynamic json) {
    _id = json['_id'];
    _caption = json['caption'];
    _videoUrl = json['videoUrl'];
    _videoImage = json['videoImage'];
    _songId = json['songId'];
    _shareCount = json['shareCount'];
    _isFake = json['isFake'];
    _createdAt = json['createdAt'];
    _songTitle = json['songTitle'];
    _songImage = json['songImage'];
    _songLink = json['songLink'];
    _singerName = json['singerName'];
    _hashTag = json['hashTag'] != null ? json['hashTag'].cast<String>() : [];
    _userId = json['userId'];
    _name = json['name'];
    _userName = json['userName'];
    _userImage = json['userImage'];
    _isVerified = json['isVerified'];
    _isLike = json['isLike'];
    _isFollow = json['isFollow'];
    _totalLikes = json['totalLikes'];
    _totalComments = json['totalComments'];
    _time = json['time'];
  }
  String? _id;
  String? _caption;
  String? _videoUrl;
  String? _videoImage;
  String? _songId;
  int? _shareCount;
  bool? _isFake;
  String? _createdAt;
  String? _songTitle;
  String? _songImage;
  String? _songLink;
  String? _singerName;
  List<String>? _hashTag;
  String? _userId;
  String? _name;
  String? _userName;
  String? _userImage;
  bool? _isVerified;
  bool? _isLike;
  bool? _isFollow;
  int? _totalLikes;
  int? _totalComments;
  String? _time;
  Data copyWith({
    String? id,
    String? caption,
    String? videoUrl,
    String? videoImage,
    String? songId,
    int? shareCount,
    bool? isFake,
    String? createdAt,
    String? songTitle,
    String? songImage,
    String? songLink,
    String? singerName,
    List<String>? hashTag,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? isVerified,
    bool? isLike,
    bool? isFollow,
    int? totalLikes,
    int? totalComments,
    String? time,
  }) =>
      Data(
        id: id ?? _id,
        caption: caption ?? _caption,
        videoUrl: videoUrl ?? _videoUrl,
        videoImage: videoImage ?? _videoImage,
        songId: songId ?? _songId,
        shareCount: shareCount ?? _shareCount,
        isFake: isFake ?? _isFake,
        createdAt: createdAt ?? _createdAt,
        songTitle: songTitle ?? _songTitle,
        songImage: songImage ?? _songImage,
        songLink: songLink ?? _songLink,
        singerName: singerName ?? _singerName,
        hashTag: hashTag ?? _hashTag,
        userId: userId ?? _userId,
        name: name ?? _name,
        userName: userName ?? _userName,
        userImage: userImage ?? _userImage,
        isVerified: isVerified ?? _isVerified,
        isLike: isLike ?? _isLike,
        isFollow: isFollow ?? _isFollow,
        totalLikes: totalLikes ?? _totalLikes,
        totalComments: totalComments ?? _totalComments,
        time: time ?? _time,
      );
  String? get id => _id;
  String? get caption => _caption;
  String? get videoUrl => _videoUrl;
  String? get videoImage => _videoImage;
  String? get songId => _songId;
  int? get shareCount => _shareCount;
  bool? get isFake => _isFake;
  String? get createdAt => _createdAt;
  String? get songTitle => _songTitle;
  String? get songImage => _songImage;
  String? get songLink => _songLink;
  String? get singerName => _singerName;
  List<String>? get hashTag => _hashTag;
  String? get userId => _userId;
  String? get name => _name;
  String? get userName => _userName;
  String? get userImage => _userImage;
  bool? get isVerified => _isVerified;
  bool? get isLike => _isLike;
  bool? get isFollow => _isFollow;
  int? get totalLikes => _totalLikes;
  int? get totalComments => _totalComments;
  String? get time => _time;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['caption'] = _caption;
    map['videoUrl'] = _videoUrl;
    map['videoImage'] = _videoImage;
    map['songId'] = _songId;
    map['shareCount'] = _shareCount;
    map['isFake'] = _isFake;
    map['createdAt'] = _createdAt;
    map['songTitle'] = _songTitle;
    map['songImage'] = _songImage;
    map['songLink'] = _songLink;
    map['singerName'] = _singerName;
    map['hashTag'] = _hashTag;
    map['userId'] = _userId;
    map['name'] = _name;
    map['userName'] = _userName;
    map['userImage'] = _userImage;
    map['isVerified'] = _isVerified;
    map['isLike'] = _isLike;
    map['isFollow'] = _isFollow;
    map['totalLikes'] = _totalLikes;
    map['totalComments'] = _totalComments;
    map['time'] = _time;
    return map;
  }
}
