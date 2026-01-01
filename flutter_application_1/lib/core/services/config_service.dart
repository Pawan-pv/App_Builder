// lib/core/services/config_service.dart
import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

class ConfigService {
  // ✅ Update with your backend URL
  static const baseUrl = 'http://localhost:4000/api/publish';

  Future<Map<String, dynamic>> load(String appId) async {
    try {
      print('🔍 Fetching config for: $appId');
      print('📡 URL: $baseUrl/$appId/live');

      final response = await http
          .get(Uri.parse('$baseUrl/$appId/live'))
          .timeout(const Duration(seconds: 10));

      print('📥 Response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('✅ Config loaded from server');
        return data;
      } else {
        print('⚠️ Server error: ${response.statusCode}');
        return await _loadFromAssets();
      }
    } catch (e) {
      print('❌ Network error: $e');
      return await _loadFromAssets();
    }
  }

  Future<Map<String, dynamic>> _loadFromAssets() async {
    try {
      print('📂 Loading from assets...');
      final raw = await rootBundle.loadString('assets/app_config.json');
      return jsonDecode(raw);
    } catch (e) {
      print('❌ Asset loading failed: $e');
      return _getFallbackConfig();
    }
  }

  Map<String, dynamic> _getFallbackConfig() {
    return {
      'app': {
        'id': 'fallback',
        'name': 'Demo App',
        'theme': {
          'primaryColor': '#0D9488',
          'backgroundColor': '#FFFFFF',
          'fontFamily': 'Inter',
        },
      },
      'screens': [
        {
          'id': 'home',
          'title': 'Home',
          'root': {
            'type': 'Column',
            'props': {'padding': 16},
            'children': [
              {
                'type': 'Text',
                'props': {
                  'text': 'Unable to load app config',
                  'fontSize': 18,
                },
              },
            ],
          },
        },
      ],
    };
  }
}

// ═══════════════════════════════════════════════════════
// lib/main.dart
// ═══════════════════════════════════════════════════════
