// lib/core/theme/app_theme.dart
// ═══════════════════════════════════════════════════════

import 'package:flutter/material.dart';

class AppTheme {
  final Color primary;
  final Color background;
  final String fontFamily;

  const AppTheme({
    required this.primary,
    required this.background,
    required this.fontFamily,
  });

  factory AppTheme.fromJson(Map<String, dynamic> json) {
    return AppTheme(
      primary: _parseColor(json['primaryColor'] ?? '#0D9488'),
      background: _parseColor(json['backgroundColor'] ?? '#FFFFFF'),
      fontFamily: json['fontFamily'] ?? 'Inter',
    );
  }

  ThemeData toFlutterTheme() {
    return ThemeData(
      fontFamily: fontFamily,
      primaryColor: primary,
      scaffoldBackgroundColor: background,
      colorScheme: ColorScheme.fromSeed(seedColor: primary),
      useMaterial3: true,
      appBarTheme: AppBarTheme(
        backgroundColor: primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
    );
  }

  static Color _parseColor(String hex) {
    hex = hex.replaceAll('#', '');
    if (hex.length == 6) {
      hex = 'FF$hex';
    }
    return Color(int.parse(hex, radix: 16));
  }
}