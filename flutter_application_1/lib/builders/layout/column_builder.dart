// lib/builders/layout/column_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../engine/renderer/universal_widget_factory.dart';

class ColumnBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};
    final childrenJson = json['children'] as List? ?? [];
    final spacing =
        (props['spacing'] as num?)?.toDouble() ??
        (props['gap'] as num?)?.toDouble();

    final List<Widget> children = childrenJson
        .map<Widget>((c) => UniversalWidgetFactory.build(c, ctx))
        .toList();

    Widget column = Column(
      mainAxisAlignment: _parseMainAxis(props['mainAxisAlignment']),
      crossAxisAlignment: _parseCrossAxis(props['crossAxisAlignment']),
      children: spacing != null
          ? _addSpacing(children, spacing, true)
          : children,
    );

    final padding = _parsePadding(props['padding']);
    if (padding != null) {
      return Padding(padding: padding, child: column);
    }
    return column;
  }

 
  static List<Widget> _addSpacing(
    List<Widget> children,
    double spacing,
    bool vertical,
  ) {
    if (children.isEmpty) return children;

    final List<Widget> result = [];

    for (int i = 0; i < children.length; i++) {
      result.add(children[i]);

      if (i < children.length - 1) {
        result.add(
          SizedBox(
            height: vertical ? spacing : 0,
            width: vertical ? 0 : spacing,
          ),
        );
      }
    }

    return result;
  }

  static MainAxisAlignment _parseMainAxis(dynamic value) {
    switch (value?.toString()) {
      case 'center':
        return MainAxisAlignment.center;
      case 'end':
        return MainAxisAlignment.end;
      case 'spaceBetween':
        return MainAxisAlignment.spaceBetween;
      case 'spaceAround':
        return MainAxisAlignment.spaceAround;
      case 'spaceEvenly':
        return MainAxisAlignment.spaceEvenly;
      default:
        return MainAxisAlignment.start;
    }
  }

  static CrossAxisAlignment _parseCrossAxis(dynamic value) {
    switch (value?.toString()) {
      case 'center':
        return CrossAxisAlignment.center;
      case 'end':
        return CrossAxisAlignment.end;
      case 'stretch':
        return CrossAxisAlignment.stretch;
      default:
        return CrossAxisAlignment.start;
    }
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
