

// This test ensures:

// SDUI widgets render correctly

// Native widgets are routed correctly

// Hybrid decision logic is respected



import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:namer_app/context/render_context.dart';
import 'package:namer_app/engine/renderer/universal_widget_factory.dart';
import 'package:namer_app/engine/hybrid/native_widget_registry.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('UniversalWidgetFactory', () {
    late RenderContext ctx;

    setUp(() {
      ctx = RenderContext(
        data: {},
        navigate: (_, {Map<String, dynamic>? params}) {},
      );
    });

    testWidgets('renders SDUI Text widget', (tester) async {
      final json = {
        'type': 'Text',
        'props': {
          'text': 'Hello World',
        },
      };

      final widget = UniversalWidgetFactory.build(json, ctx);

      await tester.pumpWidget(
        MaterialApp(home: Scaffold(body: widget)),
      );

      expect(find.text('Hello World'), findsOneWidget);
    });

    testWidgets('routes native widget to native builder', (tester) async {
      expect(
        NativeWidgetRegistry.isNative('ProductCard'),
        true,
      );
    });

    testWidgets('does not crash on unknown widget type', (tester) async {
      final json = {
        'type': 'UnknownWidget',
      };

      final widget = UniversalWidgetFactory.build(json, ctx);

      await tester.pumpWidget(
        MaterialApp(home: Scaffold(body: widget)),
      );

      // Should render fallback safely
      expect(find.byType(SizedBox), findsOneWidget);
    });
  });
}
