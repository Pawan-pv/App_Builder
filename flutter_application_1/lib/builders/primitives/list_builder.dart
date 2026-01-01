// lib/builders/primitives/list_builder.dart
import 'package:flutter/material.dart';

import '../../context/render_context.dart';
import '../../engine/renderer/universal_widget_factory.dart';

class ListBuilder {
  static Widget build(
    Map<String, dynamic> json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};
    final items = props['items'] as List? ?? [];
    final template = json['itemTemplate'];

    if (template == null) {
      return const Text('ListView missing itemTemplate');
    }

    return ListView.builder(
      itemCount: items.length,
      shrinkWrap: false, // ✅ correct for full screen lists
      physics: const AlwaysScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        return UniversalWidgetFactory.build(
          template,
          ctx.withData({
            'item': items[index],
            'index': index,
          }),
        );
      },
    );
  }
}
