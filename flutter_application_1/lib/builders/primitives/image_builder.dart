// lib/builders/primitives/image_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../engine/binding/binding_resolver.dart';

class ImageBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};
    final url = BindingResolver.resolve(props['url'] ?? props['image'], ctx.data)?.toString() ?? '';

    if (url.isEmpty) {
      return const Icon(Icons.broken_image, size: 48);
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(
        (props['borderRadius'] as num?)?.toDouble() ?? 0,
      ),
      child: Image.network(
        url,
        width: _parseSize(props['width']),
        height: _parseSize(props['height']),
        fit: _parseFit(props['fit']),
        errorBuilder: (_, _, _) => Container(
          width: _parseSize(props['width']),
          height: _parseSize(props['height']),
          color: Colors.grey.shade200,
          child: const Icon(Icons.broken_image),
        ),
      ),
    );
  }

  static double? _parseSize(dynamic value) {
    if (value == null) return null;
    if (value is num) return value.toDouble();
    return null;
  }

  static BoxFit _parseFit(dynamic fit) {
    switch (fit?.toString()) {
      case 'cover': return BoxFit.cover;
      case 'contain': return BoxFit.contain;
      case 'fill': return BoxFit.fill;
      case 'fitWidth': return BoxFit.fitWidth;
      case 'fitHeight': return BoxFit.fitHeight;
      default: return BoxFit.cover;
    }
  }
}