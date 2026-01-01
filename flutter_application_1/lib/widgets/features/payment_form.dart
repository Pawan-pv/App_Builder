import 'package:flutter/material.dart';

class PaymentForm extends StatelessWidget {
  final VoidCallback onPay;

  const PaymentForm({
    super.key,
    required this.onPay,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const TextField(decoration: InputDecoration(labelText: 'Card Number')),
        const SizedBox(height: 12),
        ElevatedButton(
          onPressed: onPay,
          child: const Text('Pay'),
        ),
      ],
    );
  }
}
