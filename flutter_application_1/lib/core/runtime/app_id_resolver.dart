import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:shared_preferences/shared_preferences.dart';

/// NOTE:
/// - Web preview → reads from URL (?appId=xxx)
/// - Mobile app  → reads from local storage (or fallback)
class AppIdResolver {
  static const _fallbackAppId = 'demo-app';

  static Future<String> resolve() async {
    if (kIsWeb) {
      return _fromWebUrl();
    }
    return _fromMobileStorage();
  }

  /// ─────────────────────────────────────────
  /// Web: ?appId=xxxx
  /// ─────────────────────────────────────────
  static String _fromWebUrl() {
    // ignore: avoid_web_libraries_in_flutter
    final uri = Uri.base;
    return uri.queryParameters['appId'] ?? _fallbackAppId;
  }

  /// ─────────────────────────────────────────
  /// Mobile: SharedPreferences (or fallback)
  /// ─────────────────────────────────────────
  static Future<String> _fromMobileStorage() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('appId') ?? _fallbackAppId;
  }

  /// Optional helper (call after login / app selection)
  static Future<void> persistForMobile(String appId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('appId', appId);
  }
}
