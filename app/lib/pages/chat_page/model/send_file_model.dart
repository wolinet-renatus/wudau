import 'dart:convert';

SendFileModel sendFileModelFromJson(String str) => SendFileModel.fromJson(json.decode(str));
String sendFileModelToJson(SendFileModel data) => json.encode(data.toJson());

class SendFileModel {
  SendFileModel({
    bool? status,
    String? message,
    SendFileData? chat,
  }) {
    _status = status;
    _message = message;
    _chat = chat;
  }

  SendFileModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    _chat = json['chat'] != null ? SendFileData.fromJson(json['chat']) : null;
  }
  bool? _status;
  String? _message;
  SendFileData? _chat;
  SendFileModel copyWith({
    bool? status,
    String? message,
    SendFileData? chat,
  }) =>
      SendFileModel(
        status: status ?? _status,
        message: message ?? _message,
        chat: chat ?? _chat,
      );
  bool? get status => _status;
  String? get message => _message;
  SendFileData? get chat => _chat;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = _status;
    map['message'] = _message;
    if (_chat != null) {
      map['chat'] = _chat?.toJson();
    }
    return map;
  }
}

SendFileData chatFromJson(String str) => SendFileData.fromJson(json.decode(str));
String chatToJson(SendFileData data) => json.encode(data.toJson());

class SendFileData {
  SendFileData({
    String? chatTopicId,
    String? senderUserId,
    String? message,
    String? image,
    String? audio,
    bool? isRead,
    String? date,
    String? id,
    int? messageType,
    String? createdAt,
    String? updatedAt,
  }) {
    _chatTopicId = chatTopicId;
    _senderUserId = senderUserId;
    _message = message;
    _image = image;
    _audio = audio;
    _isRead = isRead;
    _date = date;
    _id = id;
    _messageType = messageType;
    _createdAt = createdAt;
    _updatedAt = updatedAt;
  }

  SendFileData.fromJson(dynamic json) {
    _chatTopicId = json['chatTopicId'];
    _senderUserId = json['senderUserId'];
    _message = json['message'];
    _image = json['image'];
    _audio = json['audio'];
    _isRead = json['isRead'];
    _date = json['date'];
    _id = json['_id'];
    _messageType = json['messageType'];
    _createdAt = json['createdAt'];
    _updatedAt = json['updatedAt'];
  }
  String? _chatTopicId;
  String? _senderUserId;
  String? _message;
  String? _image;
  String? _audio;
  bool? _isRead;
  String? _date;
  String? _id;
  int? _messageType;
  String? _createdAt;
  String? _updatedAt;
  SendFileData copyWith({
    String? chatTopicId,
    String? senderUserId,
    String? message,
    String? image,
    String? audio,
    bool? isRead,
    String? date,
    String? id,
    int? messageType,
    String? createdAt,
    String? updatedAt,
  }) =>
      SendFileData(
        chatTopicId: chatTopicId ?? _chatTopicId,
        senderUserId: senderUserId ?? _senderUserId,
        message: message ?? _message,
        image: image ?? _image,
        audio: audio ?? _audio,
        isRead: isRead ?? _isRead,
        date: date ?? _date,
        id: id ?? _id,
        messageType: messageType ?? _messageType,
        createdAt: createdAt ?? _createdAt,
        updatedAt: updatedAt ?? _updatedAt,
      );
  String? get chatTopicId => _chatTopicId;
  String? get senderUserId => _senderUserId;
  String? get message => _message;
  String? get image => _image;
  String? get audio => _audio;
  bool? get isRead => _isRead;
  String? get date => _date;
  String? get id => _id;
  int? get messageType => _messageType;
  String? get createdAt => _createdAt;
  String? get updatedAt => _updatedAt;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['chatTopicId'] = _chatTopicId;
    map['senderUserId'] = _senderUserId;
    map['message'] = _message;
    map['image'] = _image;
    map['audio'] = _audio;
    map['isRead'] = _isRead;
    map['date'] = _date;
    map['_id'] = _id;
    map['messageType'] = _messageType;
    map['createdAt'] = _createdAt;
    map['updatedAt'] = _updatedAt;
    return map;
  }
}
