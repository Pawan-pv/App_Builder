// lib/widget_registry.dart
import 'package:flutter/material.dart';
import 'context/render_context.dart';
import 'builders/primitives/text_builder.dart';
import 'builders/primitives/button_builder.dart';
import 'builders/primitives/image_builder.dart';
import 'builders/primitives/input_builder.dart';
import 'builders/layout/column_builder.dart';
import 'builders/layout/row_builder.dart';
import 'builders/layout/container_builder.dart';
import 'builders/layout/stack_builder.dart';
import 'builders/layout/card_builder.dart';
import 'builders/primitives/list_builder.dart';
import 'builders/data/grid_builder.dart';

// 🆕 Import hybrid builders
import 'builders/hybrid/product_card_builder.dart';

typedef WidgetBuilderFn = Widget Function(
  Map json,
  RenderContext ctx,
);

class WidgetRegistry {
  static final Map _builders = {
    // SDUI widgets (your existing)
    'Text': TextBuilder.build,
    'Button': ButtonBuilder.build,
    'Image': ImageBuilder.build,
    'Input': InputBuilder.build,
    'Column': ColumnBuilder.build,
    'Row': RowBuilder.build,
    'Container': ContainerBuilder.build,
    'Stack': StackBuilder.build,
    'Card': CardBuilder.build,
    'ListView': ListBuilder.build,
    'GridView': GridBuilder.build,
    
    // 🆕 Hybrid/Native widgets
    'ProductCard': ProductCardBuilder.build,
    // 'CourseCard': CourseCardBuilder.build,
    // Add more as you create them...
  };

  static WidgetBuilderFn? resolve(String type) {
    return _builders[type];
  }
}