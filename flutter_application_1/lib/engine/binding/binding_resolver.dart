class BindingResolver {
  /// Main resolver entry point
  static dynamic resolve(dynamic value, Map<String, dynamic> context) {
    if (value is String) {
      return _resolveString(value, context);
    } else if (value is Map) {
      return _resolveMap(
        Map<String, dynamic>.from(value),
        context,
      );
    } else if (value is List) {
      return value.map((item) => resolve(item, context)).toList();
    }
    return value;
  }

  /// Resolve {{field}} patterns in strings
  static String _resolveString(String template, Map<String, dynamic> context) {
    if (!template.contains('{{')) return template;

    final regex = RegExp(r'\{\{([^}]+)\}\}');
    
    return template.replaceAllMapped(regex, (match) {
      final path = match.group(1)?.trim() ?? '';
      final value = _getNestedValue(context, path);
      return value?.toString() ?? '';
    });
  }

  /// Resolve all bindings in a map
  static Map<String, dynamic> _resolveMap(
    Map<String, dynamic> map,
    Map<String, dynamic> context,
  ) {
    final resolved = <String, dynamic>{};
    
    map.forEach((key, value) {
      resolved[key] = resolve(value, context);
    });
    
    return resolved;
  }

  /// Get nested value using dot notation
  static dynamic _getNestedValue(
    Map<String, dynamic> context,
    String path,
  ) {
    final parts = path.split('.');
    dynamic current = context;

    for (final part in parts) {
      if (current is Map) {
        current = current[part];
      } else if (current is List && _isNumeric(part)) {
        final index = int.tryParse(part);
        if (index != null && index < current.length) {
          current = current[index];
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    return current;
  }

  /// Evaluate conditional expressions
  static bool evaluateCondition(String condition, Map<String, dynamic> context) {
    final expr = condition.replaceAll(RegExp(r'[{}]'), '').trim();
    
    if (expr.contains('>=')) {
      return _compareNumbers(expr, '>=', context, (a, b) => a >= b);
    }
    if (expr.contains('>')) {
      return _compareNumbers(expr, '>', context, (a, b) => a > b);
    }
    if (expr.contains('<=')) {
      return _compareNumbers(expr, '<=', context, (a, b) => a <= b);
    }
    if (expr.contains('<')) {
      return _compareNumbers(expr, '<', context, (a, b) => a < b);
    }
    if (expr.contains('!=')) {
      return _compareEquality(expr, '!=', context, false);
    }
    if (expr.contains('==')) {
      return _compareEquality(expr, '==', context, true);
    }

    final value = _getNestedValue(context, expr);
    return value == true;
  }

  static bool _compareNumbers(
    String expr,
    String operator,
    Map<String, dynamic> context,
    bool Function(num, num) compare,
  ) {
    final parts = expr.split(operator);
    if (parts.length != 2) return false;

    final left = _getNestedValue(context, parts[0].trim());
    final right = num.tryParse(parts[1].trim());

    if (left is num && right != null) {
      return compare(left, right);
    }
    return false;
  }

  static bool _compareEquality(
    String expr,
    String operator,
    Map<String, dynamic> context,
    bool expectEqual,
  ) {
    final parts = expr.split(operator);
    if (parts.length != 2) return false;

    final left = _getNestedValue(context, parts[0].trim());
    final right = parts[1].trim().replaceAll('"', '').replaceAll("'", '');

    final isEqual = left?.toString() == right;
    return expectEqual ? isEqual : !isEqual;
  }

  static bool _isNumeric(String str) {
    return int.tryParse(str) != null;
  }

  static bool hasBindings(String? text) {
    if (text == null) return false;
    return text.contains('{{');
  }

  static List<String> extractBindings(String text) {
    final regex = RegExp(r'\{\{([^}]+)\}\}');
    return regex
        .allMatches(text)
        .map((m) => m.group(1)!.trim())
        .toList();
  }
}
