// lib/builders/hybrid/course_card_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';

class CourseCardBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    // Placeholder until CourseCard UI is finalized
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Text(
        'CourseCard (native) not implemented yet',
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
    );
  }
}
