// lib/engine/hybrid/hybrid_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import 'native_widget_registry.dart';

class HybridBuilder {
  static Widget build(
    String type,
    Map json,
    RenderContext ctx,
    Widget Function() fallback,
  ) {
    final mode = NativeWidgetRegistry.getMode(type);

    switch (mode) {
      case WidgetMode.hybrid:
        // Hybrid widgets are allowed custom handling
        return fallback();

      case WidgetMode.native:
        // Native widgets handled elsewhere
        return fallback();

      case WidgetMode.sdui:
        return fallback();
    }
  }
}
