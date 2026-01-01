// lib/builders/layout/container_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../engine/renderer/universal_widget_factory.dart';
import '../../core/utils/color_utils.dart';

class ContainerBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};
    Widget? child;
    
    if (json['child'] != null) {
      child = UniversalWidgetFactory.build(json['child'], ctx);
    }

    return Container(
      width: _parseSize(props['width']),
      height: _parseSize(props['height']),
      padding: _parsePadding(props['padding']),
      margin: _parsePadding(props['margin']),
      decoration: BoxDecoration(
        color: ColorUtils.fromHexSafe(props['backgroundColor']),
        borderRadius: BorderRadius.circular(
          (props['borderRadius'] as num?)?.toDouble() ?? 0,
        ),
        border: props['borderWidth'] != null
            ? Border.all(
                color: ColorUtils.fromHexSafe(props['borderColor']) ?? Colors.grey,
                width: (props['borderWidth'] as num).toDouble(),
              )
            : null,
      ),
      child: child,
    );
  }

  static double? _parseSize(dynamic value) {
    if (value == null) return null;
    if (value == 'infinity') return double.infinity;
    if (value is num) return value.toDouble();
    return null;
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