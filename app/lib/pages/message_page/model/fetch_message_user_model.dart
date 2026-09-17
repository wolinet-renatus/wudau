import 'dart:convert';

FetchMessageUserModel fetchMessageUserModelFromJson(String str) => FetchMessageUserModel.fromJson(json.decode(str));
String fetchMessageUserModelToJson(FetchMessageUserModel data) => json.encode(data.toJson());

class FetchMessageUserModel {
  FetchMessageUserModel({
    bool? status,
    String? message,
    int? pendingCount,
    List<Data>? data,
  }) {
    _status = status;
    _message = message;
    _pendingCount = pendingCount;
    _data = data;
  }

  FetchMessageUserModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    _pendingCount = json['pendingCount'];
    if (json['data'] != null) {
      _data = [];
      json['data'].forEach((v) {
        _data?.add(Data.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  int? _pendingCount;
  List<Data>? _data;
  FetchMessageUserModel copyWith({
    bool? status,
    String? message,
    int? pendingCount,
    List<Data>? data,
  }) =>
      FetchMessageUserModel(
        status: status ?? _status,
        message: message ?? _message,
        pendingCount: pendingCount ?? _pendingCount,
        data: data ?? _data,
      );
  bool? get status => _status;
  String? get message => _message;
  int? get pendingCount => _pendingCount;
  List<Data>? get data => _data;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = _status;
    map['message'] = _message;
    map['pendingCount'] = _pendingCount;
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
    String? name,
    String? userName,
    String? image,
    bool? isOnline,
    bool? isFake,
    bool? isVerified,
    String? chatTopicId,
    String? message,
    String? time,
    String? userId,
    String? senderUserId,
    bool? isAccepted,
    int? unreadCount,
  }) {
    _id = id;
    _name = name;
    _userName = userName;
    _image = image;
    _isOnline = isOnline;
    _isFake = isFake;
    _isVerified = isVerified;
    _chatTopicId = chatTopicId;
    _message = message;
    _time = time;
    _userId = userId;
    _senderUserId = senderUserId;
    _isAccepted = isAccepted;
    _unreadCount = unreadCount;
  }

  Data.fromJson(dynamic json) {
    _id = json['_id'];
    _name = json['name'];
    _userName = json['userName'];
    _image = json['image'];
    _isOnline = json['isOnline'];
    _isFake = json['isFake'];
    _isVerified = json['isVerified'];
    _chatTopicId = json['chatTopicId'];
    _message = json['message'];
    _time = json['time'];
    _userId = json['userId'];
    _senderUserId = json['senderUserId'];
    _isAccepted = json['isAccepted'];
    _unreadCount = json['unreadCount'];
  }
  String? _id;
  String? _name;
  String? _userName;
  String? _image;
  bool? _isOnline;
  bool? _isFake;
  bool? _isVerified;
  String? _chatTopicId;
  String? _message;
  String? _time;
  String? _userId;
  String? _senderUserId;
  bool? _isAccepted;
  int? _unreadCount;
  Data copyWith({
    String? id,
    String? name,
    String? userName,
    String? image,
    bool? isOnline,
    bool? isFake,
    bool? isVerified,
    String? chatTopicId,
    String? message,
    String? time,
    String? userId,
    String? senderUserId,
    bool? isAccepted,
    int? unreadCount,
  }) =>
      Data(
        id: id ?? _id,
        name: name ?? _name,
        userName: userName ?? _userName,
        image: image ?? _image,
        isOnline: isOnline ?? _isOnline,
        isFake: isFake ?? _isFake,
        isVerified: isVerified ?? _isVerified,
        chatTopicId: chatTopicId ?? _chatTopicId,
        message: message ?? _message,
        time: time ?? _time,
        userId: userId ?? _userId,
        senderUserId: senderUserId ?? _senderUserId,
        isAccepted: isAccepted ?? _isAccepted,
        unreadCount: unreadCount ?? _unreadCount,
      );
  String? get id => _id;
  String? get name => _name;
  String? get userName => _userName;
  String? get image => _image;
  bool? get isOnline => _isOnline;
  bool? get isFake => _isFake;
  bool? get isVerified => _isVerified;
  String? get chatTopicId => _chatTopicId;
  String? get message => _message;
  String? get time => _time;
  String? get userId => _userId;
  String? get senderUserId => _senderUserId;
  bool? get isAccepted => _isAccepted;
  int? get unreadCount => _unreadCount;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['name'] = _name;
    map['userName'] = _userName;
    map['image'] = _image;
    map['isOnline'] = _isOnline;
    map['isFake'] = _isFake;
    map['isVerified'] = _isVerified;
    map['chatTopicId'] = _chatTopicId;
    map['message'] = _message;
    map['time'] = _time;
    map['userId'] = _userId;
    map['senderUserId'] = _senderUserId;
    map['isAccepted'] = _isAccepted;
    map['unreadCount'] = _unreadCount;
    return map;
  }
}
