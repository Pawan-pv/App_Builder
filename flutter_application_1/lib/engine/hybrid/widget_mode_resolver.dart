// lib/engine/hybrid/widget_mode_resolver.dart
import 'native_widget_registry.dart';

class WidgetModeResolver {
  static WidgetMode resolve(String type) {
    return NativeWidgetRegistry.getMode(type);
  }

  static bool isNative(String type) {
    return resolve(type) == WidgetMode.native;
  }

  static bool isHybrid(String type) {
    return resolve(type) == WidgetMode.hybrid;
  }

  static bool isSDUI(String type) {
    return resolve(type) == WidgetMode.sdui;
  }
}
