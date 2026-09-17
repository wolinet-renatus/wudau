import 'dart:convert';

SearchMessageUserModel searchMessageUserModelFromJson(String str) => SearchMessageUserModel.fromJson(json.decode(str));
String searchMessageUserModelToJson(SearchMessageUserModel data) => json.encode(data.toJson());

class SearchMessageUserModel {
  SearchMessageUserModel({
    bool? status,
    String? message,
    List<SearchUserData>? data,
  }) {
    _status = status;
    _message = message;
    _data = data;
  }

  SearchMessageUserModel.fromJson(dynamic json) {
    _status = json['status'];
    _message = json['message'];
    if (json['data'] != null) {
      _data = [];
      json['data'].forEach((v) {
        _data?.add(SearchUserData.fromJson(v));
      });
    }
  }
  bool? _status;
  String? _message;
  List<SearchUserData>? _data;
  SearchMessageUserModel copyWith({
    bool? status,
    String? message,
    List<SearchUserData>? data,
  }) =>
      SearchMessageUserModel(
        status: status ?? _status,
        message: message ?? _message,
        data: data ?? _data,
      );
  bool? get status => _status;
  String? get message => _message;
  List<SearchUserData>? get data => _data;

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

SearchUserData dataFromJson(String str) => SearchUserData.fromJson(json.decode(str));
String dataToJson(SearchUserData data) => json.encode(data.toJson());

class SearchUserData {
  SearchUserData({
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

  SearchUserData.fromJson(dynamic json) {
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
  SearchUserData copyWith({
    String? id,
    String? name,
    String? userName,
    String? image,
    bool? isVerified,
  }) =>
      SearchUserData(
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
