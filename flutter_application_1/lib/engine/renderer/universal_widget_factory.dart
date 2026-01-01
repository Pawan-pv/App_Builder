// lib/engine/renderer/universal_widget_factory.dart
import 'package:flutter/material.dart';

import '../../context/render_context.dart';
import '../../engine/hybrid/native_widget_registry.dart';
import '../../engine/hybrid/widget_validator.dart';
import '../../widget_registry.dart';

/// =====================================================
/// UNIVERSAL WIDGET FACTORY
/// -----------------------------------------------------
/// • Single entry point for ALL widgets
/// • Supports Native / Hybrid / SDUI
/// • No backend UI injection
/// • JSON is the source of truth
/// =====================================================
class UniversalWidgetFactory {
  static Widget build(
    Map<String, dynamic> json,
    RenderContext ctx,
  ) {
    try {
      // ─────────────────────────────────────────
      // 1️⃣ Basic validation
      // ─────────────────────────────────────────
      final type = json['type']?.toString();
      if (type == null) {
        return _error('Missing widget type');
      }

      // ─────────────────────────────────────────
      // 2️⃣ Visibility condition
      // ─────────────────────────────────────────
      final visible = json['props']?['visible'];
      if (visible == false) {
        return const SizedBox.shrink();
      }

      // ─────────────────────────────────────────
      // 3️⃣ Validate widget (native stricter)
      // ─────────────────────────────────────────
      final validation = WidgetValidator.validate(json);
      if (!validation.isValid) {
        debugPrint('❌ Widget validation failed: ${validation.error}');
        return _error(validation.error!);
      }

      // ─────────────────────────────────────────
      // 4️⃣ Resolve widget mode
      // ─────────────────────────────────────────
      final mode = NativeWidgetRegistry.getMode(type);

      switch (mode) {
        case WidgetMode.native:
        case WidgetMode.hybrid:
          return _buildNativeOrHybrid(type, json, ctx);

        case WidgetMode.sdui:
          return _buildSDUI(type, json, ctx);
      }
    } catch (e, stack) {
      debugPrint('❌ Widget build crash: $e\n$stack');
      return _error('Widget render failed');
    }
  }

  // =====================================================
  // 🔹 Native / Hybrid widgets
  // =====================================================
  static Widget _buildNativeOrHybrid(
    String type,
    Map<String, dynamic> json,
    RenderContext ctx,
  ) {
    final builder = WidgetRegistry.resolve(type);

    if (builder == null) {
      return _error('Native/Hybrid widget not registered: $type');
    }

    return KeyedSubtree(
      key: ValueKey(json['id'] ?? '${type}_${json.hashCode}'),
      child: builder(json, ctx),
    );
  }

  // =====================================================
  // 🔹 SDUI widgets (pure JSON)
  // =====================================================
  static Widget _buildSDUI(
    String type,
    Map<String, dynamic> json,
    RenderContext ctx,
  ) {
    final builder = WidgetRegistry.resolve(type);

    if (builder == null) {
      return _unknown(type);
    }

    return KeyedSubtree(
      key: ValueKey(json['id'] ?? '${type}_${json.hashCode}'),
      child: builder(json, ctx),
    );
  }

  // =====================================================
  // 🔹 Error widgets
  // =====================================================
  static Widget _unknown(String type) {
    return Container(
      padding: const EdgeInsets.all(8),
      color: Colors.orange.shade50,
      child: Text(
        'Unknown widget: $type',
        style: const TextStyle(color: Colors.orange),
      ),
    );
  }

  static Widget _error(String message) {
    return Container(
      padding: const EdgeInsets.all(8),
      color: Colors.red.shade50,
      child: Text(
        message,
        style: const TextStyle(color: Colors.red),
      ),
    );
  }
}
