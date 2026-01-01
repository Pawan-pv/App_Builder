import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:namer_app/widgets/business/product_card.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ProductCard Widget', () {
    testWidgets('renders basic product information', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductCard(
              id: 'p1',
              name: 'iPhone 15',
              image:'https://www.pngall.com/wp-content/uploads/2/Rolex-Watch-PNG-Free-Image.png',
              price: 999.0,
            ),
          ),
        ),
      );

      expect(find.text('iPhone 15'), findsOneWidget);
      expect(find.text('\$999.00'), findsOneWidget);
      expect(find.text('Add to Cart'), findsOneWidget);
    });

    testWidgets('shows NEW and FEATURED badges when enabled', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductCard(
              id: 'p2',
              name: 'MacBook Pro',
              image:  'https://www.pngall.com/wp-content/uploads/2/Rolex-Watch-PNG-Free-Image.png',
               price: 949.0,
              isNew: true,
              isFeatured: true,
            ),
          ),
        ),
      );

      expect(find.text('NEW'), findsOneWidget);
      expect(find.text('FEATURED'), findsOneWidget);
    });

    testWidgets('renders rating and review count', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductCard(
              id: 'p3',
              name: 'AirPods',
              image:
                  'https://th.bing.com/th/id/OIP.bD1dv9TJypZJRnbJOPiZFwHaHk?w=220&h=220&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
              price: 199.0,
              rating: 4.5,
              reviewCount: 120,
            ),
          ),
        ),
      );

      expect(find.text('4.5'), findsOneWidget);
      expect(find.textContaining('120'), findsOneWidget);
    });

    testWidgets('shows discount when originalPrice is provided', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductCard(
              id: 'p4',
              name: 'Apple Watch',
              image:
                  'https://www.pngall.com/wp-content/uploads/2/Rolex-Watch-PNG-Free-Image.png',
              price: 300,
              originalPrice: 400,
            ),
          ),
        ),
      );

      expect(find.textContaining('% OFF'), findsOneWidget);
    });

    testWidgets('calls callbacks when tapped', (tester) async {
      bool tapped = false;
      bool favorited = false;
      bool addedToCart = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductCard(
              id: 'p5',
              name: 'iPad',
              image:
                  'https://th.bing.com/th/id/OIP.RGpTPYb2seFkXBnHm8n7dAHaHe?w=194&h=196&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
              price: 499,
              onTap: () => tapped = true,
              onFavorite: () => favorited = true,
              onAddToCart: () => addedToCart = true,
            ),
          ),
        ),
      );

      // Tap card
      await tester.tap(find.byType(InkWell).first);
      await tester.pump();
      expect(tapped, true);

      // Tap favorite
      await tester.tap(find.byIcon(Icons.favorite_border));
      await tester.pump();
      expect(favorited, true);

      // Tap add to cart
      await tester.tap(find.text('Add to Cart'));
      await tester.pump();
      expect(addedToCart, true);
    });
  });
}
