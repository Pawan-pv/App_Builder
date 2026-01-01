import 'package:flutter/material.dart';
import '../../screens/universal_screen.dart';

class ActionExecutor {
  static void execute(BuildContext context, Map? json) {
    if (json == null) return;

    final String type = json["type"] ?? "";
    final String? target = json["target"];
    final Map params = json["params"] ?? {};

    switch (type) {
      case "navigate":
        if (target != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => UniversalScreen(screenId: target),
            ),
          );
        }
        // break; // ✅ Added break  Unnecessary 'break' statement.
                  // Try removing the 'break'.dartunnecessary_breaks // ✅ Added break

      case "stripe_pay":
        _showPaymentSheet(context, params);
        // break; // ✅ Added break  Unnecessary 'break' statement.
                  // Try removing the 'break'.dartunnecessary_breaks // ✅ Added break

      case "cart_add":
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Added item ${params['id']} to cart!")),
        );
        // break; // ✅ Added break  Unnecessary 'break' statement.
                  // Try removing the 'break'.dartunnecessary_breaks // ✅ Added break

      case "alert":
        showDialog(
          context: context,
          builder: (_) => AlertDialog(
            title: Text(json["title"] ?? "Message"),
            content: Text(json["message"] ?? ""),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text("OK"),
              ),
            ],
          ),
        );
        // // break; // ✅ Added break  Unnecessary 'break' statement.
                  // Try removing the 'break'.dartunnecessary_breaks // ✅ Added break  Unnecessary 'break' statement.
                  
      default:
        debugPrint("Unknown action: $type");
    }
  }

  static void _showPaymentSheet(BuildContext context, Map params) {
    debugPrint("Opening payment sheet for amount: ${params['amount']}");
    // Implement actual Stripe/Razorpay integration here
  }
}