import 'package:flutter/material.dart';

/// Native ProductCard widget
/// This is a real Flutter widget with full control
class ProductCard extends StatelessWidget {
  final String id;
  final String name;
  final String image;
  final double price;
  final double? originalPrice;
  final double? rating;
  final int? reviewCount;
  final bool isNew;
  final bool isFeatured;
  final VoidCallback? onTap;
  final VoidCallback? onFavorite;
  final VoidCallback? onAddToCart;

  const ProductCard({
    super.key,
    required this.id,
    required this.name,
    required this.image,
    required this.price,
    this.originalPrice,
    this.rating,
    this.reviewCount,
    this.isNew = false,
    this.isFeatured = false,
    this.onTap,
    this.onFavorite,
    this.onAddToCart,
  });
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image with badges
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12),
                  ),
                  child: Image.network(
                    image,
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => Container(
                      height: 180,
                      color: Colors.grey.shade200,
                      child: const Icon(Icons.broken_image, size: 48),
                    ),
                  ),
                ),
                
                // Badges
                Positioned(
                  top: 8,
                  left: 8,
                  child: Row(
                    children: [
                      if (isNew)
                        _Badge('NEW', Colors.green),
                      if (isFeatured)
                        _Badge('FEATURED', Colors.orange),
                    ],
                  ),
                ),
                
                // Favorite button
                Positioned(
                  top: 8,
                  right: 8,
                  child: Material(
                    color: Colors.white,
                    shape: const CircleBorder(),
                    elevation: 2,
                    child: IconButton(
                      icon: const Icon(Icons.favorite_border),
                      color: Colors.red,
                      onPressed: onFavorite,
                    ),
                  ),
                ),
              ],
            ),
            
            // Product details
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Rating
                  if (rating != null)
                    Row(
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          rating!.toStringAsFixed(1),
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        if (reviewCount != null)
                          Text(
                            ' ($reviewCount)',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 12,
                            ),
                          ),
                      ],
                    ),
                  
                  const SizedBox(height: 8),
                  
                  // Price
                  Row(
                    children: [
                      Text(
                        '\$${price.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                      if (originalPrice != null) ...[
                        const SizedBox(width: 8),
                        Text(
                          '\$${originalPrice!.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade600,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.red.shade100,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            '${_calculateDiscount()}% OFF',
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.red.shade700,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  
                  const SizedBox(height: 12),
                  
                  // Add to cart button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: onAddToCart,
                      icon: const Icon(Icons.shopping_cart, size: 18),
                      label: const Text('Add to Cart'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  int _calculateDiscount() {
    if (originalPrice == null) return 0;
    return ((originalPrice! - price) / originalPrice! * 100).round();
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final Color color;

  const _Badge(this.text, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 4),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}