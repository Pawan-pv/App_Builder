// lib/builders/primitives/text_builder.dart

import 'package:flutter/material.dart';

import '../../context/render_context.dart';
import '../../engine/binding/binding_resolver.dart';
import '../../core/utils/color_utils.dart';

class TextBuilder {
  static Widget build(
    Map<String, dynamic> json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};

    final text = BindingResolver.resolve(
          props['text'],
          ctx.data,
        )?.toString() ??
        '';

    return Text(
      text,
      textAlign: _parseTextAlign(props['textAlign']),
      style: TextStyle(
        fontSize: (props['fontSize'] as num?)?.toDouble() ?? 16,
        color: ColorUtils.fromHexSafe(props['color']),
        fontWeight: _parseFontWeight(props['fontWeight']),
      ),
    );
  }

  static TextAlign _parseTextAlign(dynamic value) {
    switch (value?.toString()) {
      case 'center':
        return TextAlign.center;
      case 'right':
        return TextAlign.right;
      case 'left':
        return TextAlign.left;
      case 'justify':
        return TextAlign.justify;
      default:
        return TextAlign.start;
    }
  }

  static FontWeight _parseFontWeight(dynamic value) {
    switch (value?.toString()) {
      case 'bold':
        return FontWeight.bold;
      case 'w500':
        return FontWeight.w500;
      case 'w600':
        return FontWeight.w600;
      default:
        return FontWeight.normal;
    }
  }
}
