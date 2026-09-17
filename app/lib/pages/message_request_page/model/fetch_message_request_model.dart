import 'dart:convert';

FetchMessageRequestModel fetchMessageRequestModelFromJson(String str) => FetchMessageRequestModel.fromJson(json.decode(str));
String fetchMessageRequestModelToJson(FetchMessageRequestModel data) => json.encode(data.toJson());

class FetchMessageRequestModel {
  FetchMessageRequestModel({
    bool? status,
    String? message,
    List<Data>? data,
  }) {
    _status = status;
    _message = message;
    _data = data;
  }

  FetchMessageRequestModel.fromJson(dynamic json) {
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
  FetchMessageRequestModel copyWith({
    bool? status,
    String? message,
    List<Data>? data,
  }) =>
      FetchMessageRequestModel(
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
    String? name,
    String? userName,
    String? image,
    bool? isOnline,
    bool? isVerified,
    bool? isFake,
    String? userId,
    String? chatRequestTopicId,
    String? senderUserId,
    String? message,
    int? unreadCount,
    String? time,
  }) {
    _id = id;
    _name = name;
    _userName = userName;
    _image = image;
    _isOnline = isOnline;
    _isVerified = isVerified;
    _isFake = isFake;
    _userId = userId;
    _chatRequestTopicId = chatRequestTopicId;
    _senderUserId = senderUserId;
    _message = message;
    _unreadCount = unreadCount;
    _time = time;
  }

  Data.fromJson(dynamic json) {
    _id = json['_id'];
    _name = json['name'];
    _userName = json['userName'];
    _image = json['image'];
    _isOnline = json['isOnline'];
    _isVerified = json['isVerified'];
    _isFake = json['isFake'];
    _userId = json['userId'];
    _chatRequestTopicId = json['chatRequestTopicId'];
    _senderUserId = json['senderUserId'];
    _message = json['message'];
    _unreadCount = json['unreadCount'];
    _time = json['time'];
  }
  String? _id;
  String? _name;
  String? _userName;
  String? _image;
  bool? _isOnline;
  bool? _isVerified;
  bool? _isFake;
  String? _userId;
  String? _chatRequestTopicId;
  String? _senderUserId;
  String? _message;
  int? _unreadCount;
  String? _time;
  Data copyWith({
    String? id,
    String? name,
    String? userName,
    String? image,
    bool? isOnline,
    bool? isVerified,
    bool? isFake,
    String? userId,
    String? chatRequestTopicId,
    String? senderUserId,
    String? message,
    int? unreadCount,
    String? time,
  }) =>
      Data(
        id: id ?? _id,
        name: name ?? _name,
        userName: userName ?? _userName,
        image: image ?? _image,
        isOnline: isOnline ?? _isOnline,
        isVerified: isVerified ?? _isVerified,
        isFake: isFake ?? _isFake,
        userId: userId ?? _userId,
        chatRequestTopicId: chatRequestTopicId ?? _chatRequestTopicId,
        senderUserId: senderUserId ?? _senderUserId,
        message: message ?? _message,
        unreadCount: unreadCount ?? _unreadCount,
        time: time ?? _time,
      );
  String? get id => _id;
  String? get name => _name;
  String? get userName => _userName;
  String? get image => _image;
  bool? get isOnline => _isOnline;
  bool? get isVerified => _isVerified;
  bool? get isFake => _isFake;
  String? get userId => _userId;
  String? get chatRequestTopicId => _chatRequestTopicId;
  String? get senderUserId => _senderUserId;
  String? get message => _message;
  int? get unreadCount => _unreadCount;
  String? get time => _time;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['name'] = _name;
    map['userName'] = _userName;
    map['image'] = _image;
    map['isOnline'] = _isOnline;
    map['isVerified'] = _isVerified;
    map['isFake'] = _isFake;
    map['userId'] = _userId;
    map['chatRequestTopicId'] = _chatRequestTopicId;
    map['senderUserId'] = _senderUserId;
    map['message'] = _message;
    map['unreadCount'] = _unreadCount;
    map['time'] = _time;
    return map;
  }
}
