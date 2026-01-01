import 'package:flutter/material.dart';
import '../../context/render_context.dart';

class InputBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};

    return TextField(
      decoration: InputDecoration(
        hintText: props['placeholder']?.toString(),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(
            (props['borderRadius'] as num?)?.toDouble() ?? 8,
          ),
        ),
      ),
      keyboardType: _parseKeyboardType(props['inputType']),
    );
  }

  static TextInputType _parseKeyboardType(dynamic value) {
    switch (value?.toString()) {
      case 'email': return TextInputType.emailAddress;
      case 'number': return TextInputType.number;
      case 'phone': return TextInputType.phone;
      case 'url': return TextInputType.url;
      default: return TextInputType.text;
    }
  }
}
