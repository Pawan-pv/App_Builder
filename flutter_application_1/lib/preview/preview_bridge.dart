// import 'dart:html' as html;

class PreviewBridge {
  static void init(void Function(Map) onSchema) {
    html.window.onMessage.listen((event) {
      final data = event.data;
      if (data is Map && data['type'] == 'SYNC_SCHEMA') {
        onSchema(Map<String, dynamic>.from(data));
      }
    });
  }
}
