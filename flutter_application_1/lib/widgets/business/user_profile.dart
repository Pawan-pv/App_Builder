import 'package:flutter/material.dart';

class UserProfile extends StatelessWidget {
  final String name;
  final String? avatar;

  const UserProfile({
    super.key,
    required this.name,
    this.avatar,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          backgroundImage: avatar != null ? NetworkImage(avatar!) : null,
          child: avatar == null ? const Icon(Icons.person) : null,
        ),
        const SizedBox(width: 12),
        Text(name, style: const TextStyle(fontSize: 16)),
      ],
    );
  }
}
