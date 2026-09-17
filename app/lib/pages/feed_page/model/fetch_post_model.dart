import 'dart:convert';

FetchPostModel fetchPostModelFromJson(String str) => FetchPostModel.fromJson(json.decode(str));
String fetchPostModelToJson(FetchPostModel data) => json.encode(data.toJson());

class FetchPostModel {
  FetchPostModel({
    bool? status,
    String? message,
    List<Post>? post,
  }) {
    _status = status;
    _message = message;
    _post = post;
  }

  FetchPostModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    if (json['post'] != null) {
      _post = [];
      json['post'].forEach((v) {
        _post?.add(Post.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  List<Post>? _post;
  FetchPostModel copyWith({
    bool? status,
    String? message,
    List<Post>? post,
  }) =>
      FetchPostModel(
        status: status ?? _status,
        message: message ?? _message,
        post: post ?? _post,
      );
  bool? get status => _status;
  String? get message => _message;
  List<Post>? get post => _post;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = _status;
    map['message'] = _message;
    if (_post != null) {
      map['post'] = _post?.map((v) => v.toJson()).toList();
    }
    return map;
  }
}

Post postFromJson(String str) => Post.fromJson(json.decode(str));
String postToJson(Post data) => json.encode(data.toJson());

class Post {
  Post({
    String? id,
    String? caption,
    List<String>? postImage,
    int? shareCount,
    bool? isFake,
    String? createdAt,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? isVerified,
    List<String>? hashTag,
    bool? isLike,
    bool? isFollow,
    int? totalLikes,
    int? totalComments,
    String? time,
  }) {
    _id = id;
    _caption = caption;
    _postImage = postImage;
    _shareCount = shareCount;
    _isFake = isFake;
    _createdAt = createdAt;
    _userId = userId;
    _name = name;
    _userName = userName;
    _userImage = userImage;
    _isVerified = isVerified;
    _hashTag = hashTag;
    _isLike = isLike;
    _isFollow = isFollow;
    _totalLikes = totalLikes;
    _totalComments = totalComments;
    _time = time;
  }

  Post.fromJson(dynamic json) {
    _id = json['_id'];
    _caption = json['caption'];
    _postImage = json['postImage'] != null ? json['postImage'].cast<String>() : [];
    _shareCount = json['shareCount'];
    _isFake = json['isFake'];
    _createdAt = json['createdAt'];
    _userId = json['userId'];
    _name = json['name'];
    _userName = json['userName'];
    _userImage = json['userImage'];
    _isVerified = json['isVerified'];
    _hashTag = json['hashTag'] != null ? json['hashTag'].cast<String>() : [];
    _isLike = json['isLike'];
    _isFollow = json['isFollow'];
    _totalLikes = json['totalLikes'];
    _totalComments = json['totalComments'];
    _time = json['time'];
  }
  String? _id;
  String? _caption;
  List<String>? _postImage;
  int? _shareCount;
  bool? _isFake;
  String? _createdAt;
  String? _userId;
  String? _name;
  String? _userName;
  String? _userImage;
  bool? _isVerified;
  List<String>? _hashTag;
  bool? _isLike;
  bool? _isFollow;
  int? _totalLikes;
  int? _totalComments;
  String? _time;
  Post copyWith({
    String? id,
    String? caption,
    List<String>? postImage,
    int? shareCount,
    bool? isFake,
    String? createdAt,
    String? userId,
    String? name,
    String? userName,
    String? userImage,
    bool? isVerified,
    List<String>? hashTag,
    bool? isLike,
    bool? isFollow,
    int? totalLikes,
    int? totalComments,
    String? time,
  }) =>
      Post(
        id: id ?? _id,
        caption: caption ?? _caption,
        postImage: postImage ?? _postImage,
        shareCount: shareCount ?? _shareCount,
        isFake: isFake ?? _isFake,
        createdAt: createdAt ?? _createdAt,
        userId: userId ?? _userId,
        name: name ?? _name,
        userName: userName ?? _userName,
        userImage: userImage ?? _userImage,
        isVerified: isVerified ?? _isVerified,
        hashTag: hashTag ?? _hashTag,
        isLike: isLike ?? _isLike,
        isFollow: isFollow ?? _isFollow,
        totalLikes: totalLikes ?? _totalLikes,
        totalComments: totalComments ?? _totalComments,
        time: time ?? _time,
      );
  String? get id => _id;
  String? get caption => _caption;
  List<String>? get postImage => _postImage;
  int? get shareCount => _shareCount;
  bool? get isFake => _isFake;
  String? get createdAt => _createdAt;
  String? get userId => _userId;
  String? get name => _name;
  String? get userName => _userName;
  String? get userImage => _userImage;
  bool? get isVerified => _isVerified;
  List<String>? get hashTag => _hashTag;
  bool? get isLike => _isLike;
  bool? get isFollow => _isFollow;
  int? get totalLikes => _totalLikes;
  int? get totalComments => _totalComments;
  String? get time => _time;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['caption'] = _caption;
    map['postImage'] = _postImage;
    map['shareCount'] = _shareCount;
    map['isFake'] = _isFake;
    map['createdAt'] = _createdAt;
    map['userId'] = _userId;
    map['name'] = _name;
    map['userName'] = _userName;
    map['userImage'] = _userImage;
    map['isVerified'] = _isVerified;
    map['hashTag'] = _hashTag;
    map['isLike'] = _isLike;
    map['isFollow'] = _isFollow;
    map['totalLikes'] = _totalLikes;
    map['totalComments'] = _totalComments;
    map['time'] = _time;
    return map;
  }
}
