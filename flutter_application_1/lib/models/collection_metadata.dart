// lib/models/collection_metadata.dart
// ═══════════════════════════════════════════════════════

class CollectionMetadata {
  final String name;
  final List<String> fields;
  final int count;

  CollectionMetadata({
    required this.name,
    required this.fields,
    this.count = 0,
  });

  factory CollectionMetadata.fromJson(Map<String, dynamic> json) {
    return CollectionMetadata(
      name: json['name'] ?? '',
      fields: (json['fields'] as List<dynamic>?)
              ?.map((f) => f.toString())
              .toList() ??
          [],
      count: json['count'] ?? 0,
    );
  }
}