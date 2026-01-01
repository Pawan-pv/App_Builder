// lib/builders/layout/stack_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../engine/renderer/universal_widget_factory.dart';

class StackBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};
    final children = json['children'] as List? ?? [];

    return Stack(
      alignment: _parseAlignment(props['alignment']),
      children: children.map((child) {
        return UniversalWidgetFactory.build(child, ctx);
      }).toList(),
    );
  }

  static Alignment _parseAlignment(dynamic value) {
    switch (value?.toString()) {
      case 'center': return Alignment.center;
      case 'topLeft': return Alignment.topLeft;
      case 'topCenter': return Alignment.topCenter;
      case 'topRight': return Alignment.topRight;
      case 'centerLeft': return Alignment.centerLeft;
      case 'centerRight': return Alignment.centerRight;
      case 'bottomLeft': return Alignment.bottomLeft;
      case 'bottomCenter': return Alignment.bottomCenter;
      case 'bottomRight': return Alignment.bottomRight;
      default: return Alignment.topLeft;
    }
  }
}


