// lib/models/screen_model.dart
// ═══════════════════════════════════════════════════════

class ScreenModel {
  final String id;
  final String title;
  final Map<String, dynamic> root;
  final bool isInitial;

  ScreenModel({
    required this.id,
    required this.title,
    required this.root,
    this.isInitial = false,
  });

  factory ScreenModel.fromJson(Map<String, dynamic> json) {
    return ScreenModel(
      id: json['id'] ?? 'screen_${DateTime.now().millisecondsSinceEpoch}',
      title: json['title'] ?? json['name'] ?? 'Untitled',
      root: Map<String, dynamic>.from(json['root'] ?? {}),
      isInitial: json['isInitial'] ?? false,
    );
  }
}