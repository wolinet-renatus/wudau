import 'package:get/get.dart';
import 'package:wudau/localization/languages/language_ar.dart';
import 'package:wudau/localization/languages/language_bn.dart';
import 'package:wudau/localization/languages/language_de.dart';
import 'package:wudau/localization/languages/language_es.dart';
import 'package:wudau/localization/languages/language_fr.dart';
import 'package:wudau/localization/languages/language_hi.dart';
import 'package:wudau/localization/languages/language_id.dart';
import 'package:wudau/localization/languages/language_it.dart';
import 'package:wudau/localization/languages/language_ja.dart';
import 'package:wudau/localization/languages/language_ko.dart';
import 'package:wudau/localization/languages/language_mr.dart';
import 'package:wudau/localization/languages/language_pt.dart';
import 'package:wudau/localization/languages/language_ru.dart';
import 'package:wudau/localization/languages/language_sw.dart';
import 'package:wudau/localization/languages/language_ta.dart';
import 'package:wudau/localization/languages/language_te.dart';
import 'package:wudau/localization/languages/language_tr.dart';
import 'package:wudau/localization/languages/language_ur.dart';
import 'package:wudau/localization/languages/language_zh.dart';

import 'languages/language_en.dart';

class AppLanguages extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
        "ar_DZ": arDZ,
        "bn_In": bnIn,
        "zh_CN": zhCN,
        "en_US": enUS,
        "fr_Fr": frFr,
        "de_De": deDe,
        "hi_IN": hiIN,
        "it_In": itIn,
        "id_ID": idID,
        "ja_JP": jaJP,
        "ko_KR": koKR,
        "mr_IN": mrIN,
        "pt_PT": ptPT,
        "ru_RU": ruRU,
        "es_ES": esES,
        "sw_KE": swKE,
        "tr_TR": trTR,
        "te_IN": teIN,
        "ta_IN": taIN,
        "ur_PK": urPK,
      };
}

final List<LanguageModel> languages = [
  LanguageModel("dz", "Arabic (العربية)", 'ar', 'DZ'),
  LanguageModel("🇮🇳", "Bengali (বাংলা)", 'bn', 'IN'),
  LanguageModel("🇨🇳", "Chinese Simplified (中国人)", 'zh', 'CN'),
  LanguageModel("🇺🇸", "English (English)", 'en', 'US'),
  LanguageModel("🇫🇷", "French (français)", 'fr', 'FR'),
  LanguageModel("🇩🇪", "German (Deutsche)", 'de', 'DE'),
  LanguageModel("🇮🇳", "Hindi (हिंदी)", 'hi', 'IN'),
  LanguageModel("🇮🇹", "Italian (italiana)", 'it', 'IT'),
  LanguageModel("🇮🇩", "Indonesian (bahasa indo)", 'id', 'ID'),
  LanguageModel("🇯🇵", "Japanese (日本語)", 'ja', 'JP'),
  LanguageModel("🇰🇵", "Korean (한국인)", 'ko', 'KR'),
  LanguageModel("🇮🇳", "Marathi (मराठी)", 'mr', 'IN'),
  LanguageModel("🇵🇹", "Portuguese (português)", 'pt', 'PT'),
  LanguageModel("🇷🇺", "Russian (русский)", 'ru', 'RU'),
  LanguageModel("🇪🇸", "Spanish (Español)", 'es', 'ES'),
  LanguageModel("🇰🇪", "Swahili (Kiswahili)", 'sw', 'KE'),
  LanguageModel("🇹🇷", "Turkish (Türk)", 'tr', 'TR'),
  LanguageModel("🇮🇳", "Telugu (తెలుగు)", 'te', 'IN'),
  LanguageModel("🇮🇳", "Tamil (தமிழ்)", 'ta', 'IN'),
  LanguageModel("🇵🇰", "(اردو) Urdu", 'ur', 'PK'),
];

class LanguageModel {
  LanguageModel(
    this.symbol,
    this.language,
    this.languageCode,
    this.countryCode,
  );

  String language;
  String symbol;
  String countryCode;
  String languageCode;
}
