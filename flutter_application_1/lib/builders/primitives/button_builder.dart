// lib/builders/primitives/button_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../core/utils/color_utils.dart';
import '../../engine/binding/binding_resolver.dart';

class ButtonBuilder {
  static Widget build(Map json, RenderContext ctx) {
    final props = json['props'] ?? {};
    final text =
        BindingResolver.resolve(props['text'], ctx.data)?.toString() ??
        'Button';
    final action = props['action'];

    return SizedBox(
      width: _parseSize(props['width']),
      height: _parseSize(props['height']) ?? 48,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: ColorUtils.fromHexSafe(props['backgroundColor']),
          foregroundColor: ColorUtils.fromHexSafe(
            props['textColor'] ?? props['color'],
          ),
          padding: EdgeInsets.symmetric(
            horizontal: (props['paddingX'] as num?)?.toDouble() ?? 16,
            vertical: (props['paddingY'] as num?)?.toDouble() ?? 12,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(
              (props['borderRadius'] as num?)?.toDouble() ?? 8,
            ),
          ),
        ),
        onPressed: () => _handleAction(action, ctx),
        child: Text(text),
      ),
    );
  }

  static void _handleAction(dynamic action, RenderContext ctx) {
    if (action == null) return;
    if (action is! Map) return;

    final type = action['type']?.toString();
    final target = BindingResolver.resolve(action['target'], ctx.data);

    // ✅ SAFE MAP NORMALIZATION
    final rawParams = action['params'];
    final Map<String, dynamic>? params = rawParams is Map
        ? Map<String, dynamic>.from(rawParams)
        : null;

    if (type == 'navigate' && target != null) {
      ctx.navigate(target.toString(), params: params);
    }
  }

  static double? _parseSize(dynamic value) {
    if (value == null) return null;
    if (value == 'infinity') return double.infinity;
    if (value is num) return value.toDouble();
    return null;
  }
}
