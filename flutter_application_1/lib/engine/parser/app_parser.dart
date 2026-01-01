import '../../models/app_model.dart';

class AppParser {
  static AppModel parse(Map<String, dynamic> json) {
    return AppModel.fromJson(json);
  }
}
