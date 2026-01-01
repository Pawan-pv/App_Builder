// lib/core/utils/color_utils.dart
// ═══════════════════════════════════════════════════════

import 'package:flutter/material.dart';

class ColorUtils {
  static Color? fromHexSafe(dynamic color) {
    if (color == null) return null;
    if (color is Color) return color;

    try {
      String hex = color.toString().replaceAll('#', '');
      if (hex.length == 6) {
        hex = 'FF$hex';
      }
      return Color(int.parse(hex, radix: 16));
    } catch (e) {
      return null;
    }
  }

  static Color fromHex(String hex) {
    hex = hex.replaceAll('#', '');
    if (hex.length == 6) {
      hex = 'FF$hex';
    }
    return Color(int.parse(hex, radix: 16));
  }
}