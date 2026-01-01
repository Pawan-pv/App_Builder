import 'package:flutter_test/flutter_test.dart';
import 'package:namer_app/engine/binding/binding_resolver.dart';
void main() {
  group('BindingResolver.resolve()', () {
    test('resolves simple value', () {
      final result = BindingResolver.resolve(
        '{{name}}',
        {'name': 'Pavan'},
      );

      expect(result, 'Pavan');
    });

    test('resolves nested object value', () {
      final result = BindingResolver.resolve(
        '{{user.profile.email}}',
        {
          'user': {
            'profile': {
              'email': 'pavan@test.com',
            },
          },
        },
      );

      expect(result, 'pavan@test.com');
    });

    test('resolves list index value', () {
      final result = BindingResolver.resolve(
        '{{items.0.title}}',
        {
          'items': [
            {'title': 'First'},
            {'title': 'Second'},
          ],
        },
      );

      expect(result, 'First');
    });

    test('returns empty string when key not found', () {
      final result = BindingResolver.resolve(
        '{{unknown.key}}',
        {'name': 'Pavan'},
      );

      expect(result, '');
    });

    test('resolves multiple bindings in one string', () {
      final result = BindingResolver.resolve(
        'Hello {{user.name}}, price is {{item.price}}',
        {
          'user': {'name': 'Pavan'},
          'item': {'price': 199},
        },
      );

      expect(result, 'Hello Pavan, price is 199');
    });
  });

  group('BindingResolver.evaluateCondition()', () {
    test('evaluates greater than condition', () {
      final result = BindingResolver.evaluateCondition(
        '{{item.price > 100}}',
        {'item': {'price': 150}},
      );

      expect(result, true);
    });

    test('evaluates equality condition', () {
      final result = BindingResolver.evaluateCondition(
        '{{status == "active"}}',
        {'status': 'active'},
      );

      expect(result, true);
    });

    test('returns false for invalid condition', () {
      final result = BindingResolver.evaluateCondition(
        '{{item.price < 50}}',
        {'item': {'price': 150}},
      );

      expect(result, false);
    });
  });

  group('BindingResolver.hasBindings()', () {
    test('detects bindings', () {
      expect(
        BindingResolver.hasBindings('Hello {{name}}'),
        true,
      );
    });

    test('detects no bindings', () {
      expect(
        BindingResolver.hasBindings('Hello World'),
        false,
      );
    });
  });

  group('BindingResolver.extractBindings()', () {
    test('extracts binding keys', () {
      final result = BindingResolver.extractBindings(
        'Hello {{user.name}} {{item.price}}',
      );

      expect(result, ['user.name', 'item.price']);
    });
  });
}

// ▶️ How to run this test

// From project root:

// flutter test test/engine/binding/binding_resolver_test.dart