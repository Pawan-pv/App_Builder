// lib/builders/layout/card_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../engine/renderer/universal_widget_factory.dart';

class CardBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};
    final children = json['children'] as List? ?? [];

    return Card(
      elevation: (props['elevation'] as num?)?.toDouble() ?? 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(
          (props['borderRadius'] as num?)?.toDouble() ?? 12,
        ),
      ),
      child: Padding(
        padding: _parsePadding(props['padding']) ?? const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: children.map((child) {
            return UniversalWidgetFactory.build(child, ctx);
          }).toList(),
        ),
      ),
    );
  }

  static EdgeInsets? _parsePadding(dynamic value) {
    if (value == null) return null;
    if (value is num) return EdgeInsets.all(value.toDouble());
    if (value is Map) {
      return EdgeInsets.only(
        top: (value['top'] as num?)?.toDouble() ?? 0,
        right: (value['right'] as num?)?.toDouble() ?? 0,
        bottom: (value['bottom'] as num?)?.toDouble() ?? 0,
        left: (value['left'] as num?)?.toDouble() ?? 0,
      );
    }
    return null;
  }
}