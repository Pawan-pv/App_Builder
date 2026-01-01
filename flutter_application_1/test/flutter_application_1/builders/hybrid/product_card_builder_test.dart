import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:namer_app/builders/hybrid/product_card_builder.dart';
import 'package:namer_app/context/render_context.dart';
import 'package:namer_app/widgets/business/product_card.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ProductCardBuilder', () {
    late RenderContext ctx;

    setUp(() {
      ctx = RenderContext(
        data: {
          'item': {
            'id': 'p1',
            'name': 'Test Product',
            'image': 'https://test.com/image.png',
            'price': 99.0,
          }
        },
        navigate: (_, {Map<String, dynamic>? params}) {},
      );
    });

    testWidgets('renders ProductCard when required props exist', (tester) async {
      final json = {
        'type': 'ProductCard',
        'props': {
          'id': '{{item.id}}',
          'name': '{{item.name}}',
          'image': '{{item.image}}',
          'price': '{{item.price}}',
        }
      };

      final widget = ProductCardBuilder.build(json, ctx);

      await tester.pumpWidget(
        MaterialApp(home: Scaffold(body: widget)),
      );

      expect(find.byType(ProductCard), findsOneWidget);
      expect(find.text('Test Product'), findsOneWidget);
    });

    testWidgets('shows error UI when required props are missing', (tester) async {
      final json = {
        'type': 'ProductCard',
        'props': {
          'name': 'Broken Product',
        }
      };

      final widget = ProductCardBuilder.build(json, ctx);

      await tester.pumpWidget(
        MaterialApp(home: Scaffold(body: widget)),
      );

      expect(find.textContaining('Error:'), findsOneWidget);
    });

    testWidgets('does not crash when action is null', (tester) async {
      final json = {
        'type': 'ProductCard',
        'props': {
          'id': 'p1',
          'name': 'Safe Product',
          'image': 'https://test.com/image.png',
          'price': 10,
          'onTap': null,
        }
      };

      final widget = ProductCardBuilder.build(json, ctx);

      await tester.pumpWidget(
        MaterialApp(home: Scaffold(body: widget)),
      );

      expect(find.byType(ProductCard), findsOneWidget);
    });
  });

  testWidgets('ProductCardBuilder triggers navigation with params', (tester) async {
    String? navigatedTo;
    Map<String, dynamic>? capturedParams;

    final ctx = RenderContext(
      data: {
        'item': {
          'id': 'p99',
          'name': 'Test Product',
          'image': 'img.png',
          'price': 10,
        }
      },
      navigate: (String screenId, {Map<String, dynamic>? params}) {
        navigatedTo = screenId;
        capturedParams = params;
      },
    );

    final widget = ProductCardBuilder.build(
      {
        'type': 'ProductCard',
        'props': {
          'id': '{{item.id}}',
          'name': '{{item.name}}',
          'image': '{{item.image}}',
          'price': '{{item.price}}',
          'onTap': {
            'type': 'navigate',
            'target': 'product-details',
            'params': {
              'id': '{{item.id}}',
            }
          }
        }
      },
      ctx,
    );

    await tester.pumpWidget(MaterialApp(home: widget));

    await tester.tap(find.byType(InkWell).first);
    await tester.pump();

    expect(navigatedTo, 'product-details');
    expect(capturedParams, {'id': 'p99'});
  });
}
