// lib/builders/data/grid_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../engine/renderer/universal_widget_factory.dart';

class GridBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};
    final items = props['items'] as List? ?? [];
    final template = json['itemTemplate'];
    final columns = (props['columns'] as num?)?.toInt() ?? 2;

    if (template == null) {
      return const Text('GridView missing itemTemplate');
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: columns,
        crossAxisSpacing: (props['spacing'] as num?)?.toDouble() ?? 12,
        mainAxisSpacing: (props['spacing'] as num?)?.toDouble() ?? 12,
        childAspectRatio: (props['aspectRatio'] as num?)?.toDouble() ?? 1,
      ),
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