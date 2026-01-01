// lib/builders/hybrid/checkout_flow_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';

class CheckoutFlowBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const Icon(Icons.payment, size: 48),
          const SizedBox(height: 16),
          const Text(
            'Checkout Flow',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {},
            child: const Text('Proceed to Payment'),
          ),
        ],
      ),
    );
  }
}
