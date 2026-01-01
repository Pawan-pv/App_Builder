import 'package:flutter/material.dart';

class CourseCard extends StatelessWidget {
  final String id;
  final String title;
  final String thumbnail;
  final VoidCallback? onTap;

  const CourseCard({
    super.key,
    required this.id,
    required this.title,
    required this.thumbnail,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Image.network(thumbnail, width: 56, fit: BoxFit.cover),
        title: Text(title),
        onTap: onTap,
      ),
    );
  }
}
