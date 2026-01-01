// lib/engine/hybrid/widget_validator.dart

import 'native_widget_registry.dart';

class WidgetValidator {
  /// Validate widget JSON before building
  static ValidationResult validate(Map json) {
    final type = json['type']?.toString();

    if (type == null) {
      return ValidationResult.error('Missing widget type');
    }

    // Validate native widgets more strictly
    if (NativeWidgetRegistry.isNative(type)) {
      return _validateNativeWidget(type, json);
    }

    return ValidationResult.success();
  }

  static ValidationResult _validateNativeWidget(String type, Map json) {
    final props = json['props'];

    if (props == null || props is! Map) {
      return ValidationResult.error('$type requires props');
    }

    switch (type) {
      case 'ProductCard':
        return _validateProductCard(props);
      default:
        return ValidationResult.success();
    }
  }

  static ValidationResult _validateProductCard(Map props) {
    const requiredFields = ['id', 'name', 'image', 'price'];

    for (final field in requiredFields) {
      if (props[field] == null) {
        return ValidationResult.error(
          'ProductCard missing required field: $field',
        );
      }
    }

    return ValidationResult.success();
  }
}

class ValidationResult {
  final bool isValid;
  final String? error;

  const ValidationResult.success()
      : isValid = true,
        error = null;

  const ValidationResult.error(this.error) : isValid = false;
}
