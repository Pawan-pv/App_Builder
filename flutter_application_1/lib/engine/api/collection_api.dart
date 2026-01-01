// lib/engine/api/collection_api.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

/// ═══════════════════════════════════════════════════════
/// COLLECTION API SERVICE
/// ═══════════════════════════════════════════════════════
/// Fetches data from universal entity endpoints

class CollectionAPI {
  // ✅ Update with your backend URL
  static const baseUrl = 'http://localhost:4000/api/entities';
  static const timeout = Duration(seconds: 10);

  /// Fetch all items from a collection
  static Future<List<dynamic>> fetch(
    String appId,
    String collectionName, {
    int? limit,
    int? offset,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/$appId/$collectionName');
      
      debugPrint('🔍 Fetching: $uri');

      final response = await http.get(uri).timeout(timeout);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);

        if (json['success'] == true && json['data'] is List) {
          debugPrint('✅ Fetched ${json['data'].length} items from $collectionName');
          return json['data'];
        }

        throw Exception('Invalid response format');
      }

      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    } catch (e) {
      debugPrint('❌ Collection fetch error: $e');
      return []; // Return empty instead of crashing
    }
  }

  /// Fetch single item by ID
  static Future<Map<String, dynamic>?> fetchOne(
    String appId,
    String collectionName,
    String itemId,
  ) async {
    try {
      final uri = Uri.parse('$baseUrl/$appId/$collectionName/$itemId');
      final response = await http.get(uri).timeout(timeout);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        return json['data'];
      }

      return null;
    } catch (e) {
      debugPrint('❌ Item fetch error: $e');
      return null;
    }
  }

  /// Search across collections
  static Future<List<dynamic>> search(
    String appId,
    String query, {
    String? collection,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/$appId/search').replace(
        queryParameters: {
          'q': query,
          if (collection != null) 'collection': collection,
        },
      );

      final response = await http.get(uri).timeout(timeout);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        return json['data'] ?? [];
      }

      return [];
    } catch (e) {
      debugPrint('❌ Search error: $e');
      return [];
    }
  }

  /// Create new item (for authenticated users)
  static Future<Map<String, dynamic>?> create(
    String appId,
    String collectionName,
    Map<String, dynamic> data,
    String token,
  ) async {
    try {
      final uri = Uri.parse('$baseUrl/$appId/$collectionName');
      
      final response = await http.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(data),
      ).timeout(timeout);

      if (response.statusCode == 201) {
        final json = jsonDecode(response.body);
        return json['data'];
      }

      throw Exception('Create failed: ${response.statusCode}');
    } catch (e) {
      debugPrint('❌ Create error: $e');
      return null;
    }
  }

  /// Update item
  static Future<bool> update(
    String entityId,
    Map<String, dynamic> data,
    String token,
  ) async {
    try {
      final uri = Uri.parse('$baseUrl/$entityId');
      
      final response = await http.put(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(data),
      ).timeout(timeout);

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('❌ Update error: $e');
      return false;
    }
  }

  /// Delete item
  static Future<bool> delete(String entityId, String token) async {
    try {
      final uri = Uri.parse('$baseUrl/$entityId');
      
      final response = await http.delete(
        uri,
        headers: {'Authorization': 'Bearer $token'},
      ).timeout(timeout);

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('❌ Delete error: $e');
      return false;
    }
  }
}

void debugPrint(String message) {
  print(message);
}