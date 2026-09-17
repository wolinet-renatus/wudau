import 'dart:convert';

FetchAudioWiseVideosModel fetchAudioWiseVideosModelFromJson(String str) => FetchAudioWiseVideosModel.fromJson(json.decode(str));
String fetchAudioWiseVideosModelToJson(FetchAudioWiseVideosModel data) => json.encode(data.toJson());

class FetchAudioWiseVideosModel {
  FetchAudioWiseVideosModel({
    bool? status,
    String? message,
    int? totalVideosOfSong,
    List<Videos>? videos,
  }) {
    _status = status;
    _message = message;
    _totalVideosOfSong = totalVideosOfSong;
    _videos = videos;
  }

  FetchAudioWiseVideosModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    _totalVideosOfSong = json['totalVideosOfSong'];
    if (json['videos'] != null) {
      _videos = [];
      json['videos'].forEach((v) {
        _videos?.add(Videos.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  int? _totalVideosOfSong;
  List<Videos>? _videos;
  FetchAudioWiseVideosModel copyWith({
    bool? status,
    String? message,
    int? totalVideosOfSong,
    List<Videos>? videos,
  }) =>
      FetchAudioWiseVideosModel(
        status: status ?? _status,
        message: message ?? _message,
        totalVideosOfSong: totalVideosOfSong ?? _totalVideosOfSong,
        videos: videos ?? _videos,
      );
  bool? get status => _status;
  String? get message => _message;
  int? get totalVideosOfSong => _totalVideosOfSong;
  List<Videos>? get videos => _videos;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = _status;
    map['message'] = _message;
    map['totalVideosOfSong'] = _totalVideosOfSong;
    if (_videos != null) {
      map['videos'] = _videos?.map((v) => v.toJson()).toList();
    }
    return map;
  }
}

Videos videosFromJson(String str) => Videos.fromJson(json.decode(str));
String videosToJson(Videos data) => json.encode(data.toJson());

class Videos {
  Videos({
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
    String? songTitle,
    String? songImage,
    String? songLink,
    String? singerName,
    List<String>? hashTag,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? userIsFake,
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
    _songTitle = songTitle;
    _songImage = songImage;
    _songLink = songLink;
    _singerName = singerName;
    _hashTag = hashTag;
    _userId = userId;
    _name = name;
    _userName = userName;
    _userImage = userImage;
    _userIsFake = userIsFake;
  }

  Videos.fromJson(dynamic json) {
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
    _songTitle = json['songTitle'];
    _songImage = json['songImage'];
    _songLink = json['songLink'];
    _singerName = json['singerName'];
    _hashTag = json['hashTag'] != null ? json['hashTag'].cast<String>() : [];
    _userId = json['userId'];
    _name = json['name'];
    _userName = json['userName'];
    _userImage = json['userImage'];
    _userIsFake = json['userIsFake'];
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
  String? _songTitle;
  String? _songImage;
  String? _songLink;
  String? _singerName;
  List<String>? _hashTag;
  String? _userId;
  String? _name;
  String? _userName;
  String? _userImage;
  bool? _userIsFake;
  Videos copyWith({
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
    String? songTitle,
    String? songImage,
    String? songLink,
    String? singerName,
    List<String>? hashTag,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? userIsFake,
  }) =>
      Videos(
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
        songTitle: songTitle ?? _songTitle,
        songImage: songImage ?? _songImage,
        songLink: songLink ?? _songLink,
        singerName: singerName ?? _singerName,
        hashTag: hashTag ?? _hashTag,
        userId: userId ?? _userId,
        name: name ?? _name,
        userName: userName ?? _userName,
        userImage: userImage ?? _userImage,
        userIsFake: userIsFake ?? _userIsFake,
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
  String? get songTitle => _songTitle;
  String? get songImage => _songImage;
  String? get songLink => _songLink;
  String? get singerName => _singerName;
  List<String>? get hashTag => _hashTag;
  String? get userId => _userId;
  String? get name => _name;
  String? get userName => _userName;
  String? get userImage => _userImage;
  bool? get userIsFake => _userIsFake;

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
    map['songTitle'] = _songTitle;
    map['songImage'] = _songImage;
    map['songLink'] = _songLink;
    map['singerName'] = _singerName;
    map['hashTag'] = _hashTag;
    map['userId'] = _userId;
    map['name'] = _name;
    map['userName'] = _userName;
    map['userImage'] = _userImage;
    map['userIsFake'] = _userIsFake;
    return map;
  }
}
