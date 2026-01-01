import 'package:flutter/material.dart';
import '../../context/render_context.dart';
import '../../widgets/business/product_card.dart';
import '../../engine/binding/binding_resolver.dart';

/// Hybrid builder for ProductCard
/// Takes JSON props but renders native widget
class ProductCardBuilder {
  static Widget build(Map json, RenderContext ctx) {
    final props = json['props'] ?? {};

    // Resolve data bindings
    final resolvedProps = BindingResolver.resolve(props, ctx.data) as Map;

    // Extract and validate required fields
    final id = resolvedProps['id']?.toString();
    final name = resolvedProps['name']?.toString();
    final image = resolvedProps['image']?.toString();
    final price = _parseDouble(resolvedProps['price']);

    // Validate required fields
    if (id == null || name == null || image == null || price == null) {
      return _buildError('ProductCard missing required fields');
    }

    // Extract optional fields
    final originalPrice = _parseDouble(resolvedProps['originalPrice']);
    final rating = _parseDouble(resolvedProps['rating']);
    final reviewCount = _parseInt(resolvedProps['reviewCount']);
    final isNew = resolvedProps['isNew'] == true;
    final isFeatured = resolvedProps['isFeatured'] == true;

    // Extract actions
    final onTapAction = resolvedProps['onTap'];
    final onFavoriteAction = resolvedProps['onFavorite'];
    final onAddToCartAction = resolvedProps['onAddToCart'];

    // Build native widget
    return ProductCard(
      id: id,
      name: name,
      image: image,
      price: price,
      originalPrice: originalPrice,
      rating: rating,
      reviewCount: reviewCount,
      isNew: isNew,
      isFeatured: isFeatured,
      onTap: onTapAction != null ? () => _handleAction(onTapAction, ctx) : null,
      onFavorite: onFavoriteAction != null
          ? () => _handleAction(onFavoriteAction, ctx)
          : null,
      onAddToCart: onAddToCartAction != null
          ? () => _handleAction(onAddToCartAction, ctx)
          : null,
    );
  }

  static void _handleAction(dynamic action, RenderContext ctx) {
    if (action is! Map) return;
    final type = action['type']?.toString();
    final target = action['target']?.toString();
    // ✅ Safe params casting
    final rawParams = action['params'];
    final Map<String, dynamic>? params = rawParams is Map
        ? Map<String, dynamic>.from(rawParams)
        : null;

    if (type == 'navigate' && target != null) {
      ctx.navigate(target, params: params);
    }
  }

  static double? _parseDouble(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }

  static int? _parseInt(dynamic value) {
    if (value == null) return null;
    if (value is int) return value;
    if (value is double) return value.toInt();
    if (value is String) return int.tryParse(value);
    return null;
  }

  static Widget _buildError(String message) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.red.shade50,
      child: Text('Error: $message', style: const TextStyle(color: Colors.red)),
    );
  }
}
