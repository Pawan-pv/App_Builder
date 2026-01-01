// lib/builders/data/list_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../engine/renderer/universal_widget_factory.dart';

class ListBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};
    final items = props['items'] as List? ?? [];
    final template = json['itemTemplate'];

    if (template == null) {
      return const Text('ListView missing itemTemplate');
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
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
