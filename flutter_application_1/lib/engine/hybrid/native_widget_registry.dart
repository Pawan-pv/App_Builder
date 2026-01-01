// import 'package:flutter/material.dart';

/// Maps widget type to rendering mode
enum WidgetMode {
  native,    // Fully native Flutter widget
  hybrid,    // Native wrapper with JSON props
  sdui,      // Pure JSON-driven widget
}

/// Registry for native widgets
class NativeWidgetRegistry {
  // Define which widgets should be native vs SDUI
  static const Map _widgetModes = {
    // NATIVE: Critical business widgets
    'ProductCard': WidgetMode.native,
    'CourseCard': WidgetMode.native,
    'UserProfile': WidgetMode.native,
    'CheckoutFlow': WidgetMode.native,
    'PaymentForm': WidgetMode.native,
    'VideoPlayer': WidgetMode.native,
    
    // HYBRID: Configurable but controlled
    'FeaturedBanner': WidgetMode.hybrid,
    'CategoryList': WidgetMode.hybrid,
    'SearchBar': WidgetMode.hybrid,
    
    // SDUI: Simple, safe to be dynamic
    'Text': WidgetMode.sdui,
    'Button': WidgetMode.sdui,
    'Image': WidgetMode.sdui,
    'Column': WidgetMode.sdui,
    'Row': WidgetMode.sdui,
    'Container': WidgetMode.sdui,
    'ListView': WidgetMode.sdui,
    'GridView': WidgetMode.sdui,
  };

  /// Get mode for a widget type
  static WidgetMode getMode(String type) {
    return _widgetModes[type] ?? WidgetMode.sdui;
  }

  /// Check if widget is native
  static bool isNative(String type) {
    return getMode(type) == WidgetMode.native;
  }

  /// Check if widget is hybrid
  static bool isHybrid(String type) {
    return getMode(type) == WidgetMode.hybrid;
  }

  /// Check if widget is SDUI
  static bool isSDUI(String type) {
    return getMode(type) == WidgetMode.sdui;
  }

  /// Get all native widget types
  static List getNativeTypes() {
    return _widgetModes.entries
        .where((e) => e.value == WidgetMode.native)
        .map((e) => e.key)
        .toList();
  }

  /// Get all hybrid widget types
  static List getHybridTypes() {
    return _widgetModes.entries
        .where((e) => e.value == WidgetMode.hybrid)
        .map((e) => e.key)
        .toList();
  }
}