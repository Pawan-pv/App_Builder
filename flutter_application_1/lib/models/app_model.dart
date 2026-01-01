import '../core/theme/app_theme.dart';
import 'screen_model.dart';
import 'collection_metadata.dart';

class AppModel {
  final String id;
  final String name;
  final AppTheme theme;
  final List<ScreenModel> screens;
  final List<CollectionMetadata> collections;

  AppModel({
    required this.id,
    required this.name,
    required this.theme,
    required this.screens,
    this.collections = const [],
  });

  factory AppModel.fromJson(Map<String, dynamic> json) {
    // Handle both direct and wrapped responses
    final data = json.containsKey('data') ? json['data'] : json;
    final appData = data['app'] ?? data;

    return AppModel(
      id: appData['id'] ?? appData['appId'] ?? 'unknown',
      name: appData['name'] ?? appData['appName'] ?? 'Untitled App',
      theme: AppTheme.fromJson(appData['theme'] ?? {}),
      screens: (data['screens'] as List<dynamic>? ?? [])
          .map((s) => ScreenModel.fromJson(s))
          .toList(),
      collections: (data['collections'] as List<dynamic>? ?? [])
          .map((c) => CollectionMetadata.fromJson(c))
          .toList(),
    );
  }

  ScreenModel? findScreen(String id) {
    try {
      return screens.firstWhere((s) => s.id == id);
    } catch (e) {
      print('⚠️ Screen not found: $id');
      return null;
    }
  }

  CollectionMetadata? findCollection(String name) {
    try {
      return collections.firstWhere((c) => c.name == name);
    } catch (e) {
      return null;
    }
  }
}