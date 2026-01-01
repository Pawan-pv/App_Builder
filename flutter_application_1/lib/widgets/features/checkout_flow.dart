import 'package:flutter/material.dart';

class CheckoutFlow extends StatelessWidget {
  final VoidCallback onComplete;

  const CheckoutFlow({
    super.key,
    required this.onComplete,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text('Checkout'),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: onComplete,
          child: const Text('Complete Order'),
        ),
      ],
    );
  }
}
