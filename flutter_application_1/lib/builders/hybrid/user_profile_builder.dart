// lib/builders/hybrid/user_profile_builder.dart
import 'package:flutter/material.dart';
import '../../context/render_context.dart';

class UserProfileBuilder {
  static Widget build(
    Map json,
    RenderContext ctx,
  ) {
    final props = json['props'] ?? {};

    return ListTile(
      leading: const CircleAvatar(child: Icon(Icons.person)),
      title: Text(props['name']?.toString() ?? 'User'),
      subtitle: Text(props['email']?.toString() ?? ''),
    );
  }
}
