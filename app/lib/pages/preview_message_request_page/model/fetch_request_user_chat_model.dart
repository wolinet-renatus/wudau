import 'dart:convert';

FetchRequestUserChatModel fetchRequestUserChatModelFromJson(String str) => FetchRequestUserChatModel.fromJson(json.decode(str));
String fetchRequestUserChatModelToJson(FetchRequestUserChatModel data) => json.encode(data.toJson());

class FetchRequestUserChatModel {
  FetchRequestUserChatModel({
    bool? status,
    String? message,
    String? chatTopic,
    List<Chat>? chat,
  }) {
    _status = status;
    _message = message;
    _chatTopic = chatTopic;
    _chat = chat;
  }

  FetchRequestUserChatModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    _chatTopic = json['chatTopic'];
    if (json['chat'] != null) {
      _chat = [];
      json['chat'].forEach((v) {
        _chat?.add(Chat.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  String? _chatTopic;
  List<Chat>? _chat;
  FetchRequestUserChatModel copyWith({
    bool? status,
    String? message,
    String? chatTopic,
    List<Chat>? chat,
  }) =>
      FetchRequestUserChatModel(
        status: status ?? _status,
        message: message ?? _message,
        chatTopic: chatTopic ?? _chatTopic,
        chat: chat ?? _chat,
      );
  bool? get status => _status;
  String? get message => _message;
  String? get chatTopic => _chatTopic;
  List<Chat>? get chat => _chat;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = _status;
    map['message'] = _message;
    map['chatTopic'] = _chatTopic;
    if (_chat != null) {
      map['chat'] = _chat?.map((v) => v.toJson()).toList();
    }
    return map;
  }
}

Chat chatFromJson(String str) => Chat.fromJson(json.decode(str));
String chatToJson(Chat data) => json.encode(data.toJson());

class Chat {
  Chat({
    String? id,
    String? chatRequestTopicId,
    String? message,
    String? image,
    String? audio,
    bool? isRead,
    String? date,
    String? senderUserId,
    int? messageType,
    String? createdAt,
    String? updatedAt,
  }) {
    _id = id;
    _chatRequestTopicId = chatRequestTopicId;
    _message = message;
    _image = image;
    _audio = audio;
    _isRead = isRead;
    _date = date;
    _senderUserId = senderUserId;
    _messageType = messageType;
    _createdAt = createdAt;
    _updatedAt = updatedAt;
  }

  Chat.fromJson(dynamic json) {
    _id = json['_id'];
    _chatRequestTopicId = json['chatRequestTopicId'];
    _message = json['message'];
    _image = json['image'];
    _audio = json['audio'];
    _isRead = json['isRead'];
    _date = json['date'];
    _senderUserId = json['senderUserId'];
    _messageType = json['messageType'];
    _createdAt = json['createdAt'];
    _updatedAt = json['updatedAt'];
  }
  String? _id;
  String? _chatRequestTopicId;
  String? _message;
  String? _image;
  String? _audio;
  bool? _isRead;
  String? _date;
  String? _senderUserId;
  int? _messageType;
  String? _createdAt;
  String? _updatedAt;
  Chat copyWith({
    String? id,
    String? chatRequestTopicId,
    String? message,
    String? image,
    String? audio,
    bool? isRead,
    String? date,
    String? senderUserId,
    int? messageType,
    String? createdAt,
    String? updatedAt,
  }) =>
      Chat(
        id: id ?? _id,
        chatRequestTopicId: chatRequestTopicId ?? _chatRequestTopicId,
        message: message ?? _message,
        image: image ?? _image,
        audio: audio ?? _audio,
        isRead: isRead ?? _isRead,
        date: date ?? _date,
        senderUserId: senderUserId ?? _senderUserId,
        messageType: messageType ?? _messageType,
        createdAt: createdAt ?? _createdAt,
        updatedAt: updatedAt ?? _updatedAt,
      );
  String? get id => _id;
  String? get chatRequestTopicId => _chatRequestTopicId;
  String? get message => _message;
  String? get image => _image;
  String? get audio => _audio;
  bool? get isRead => _isRead;
  String? get date => _date;
  String? get senderUserId => _senderUserId;
  int? get messageType => _messageType;
  String? get createdAt => _createdAt;
  String? get updatedAt => _updatedAt;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['_id'] = _id;
    map['chatRequestTopicId'] = _chatRequestTopicId;
    map['message'] = _message;
    map['image'] = _image;
    map['audio'] = _audio;
    map['isRead'] = _isRead;
    map['date'] = _date;
    map['senderUserId'] = _senderUserId;
    map['messageType'] = _messageType;
    map['createdAt'] = _createdAt;
    map['updatedAt'] = _updatedAt;
    return map;
  }
}
