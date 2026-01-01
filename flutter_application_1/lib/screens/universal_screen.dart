// // lib/screens/universal_screen.dart
// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../engine/renderer/universal_widget_factory.dart';
// import '../models/app_model.dart';
// // import '../engine/api/collection_api.dart';
// import '../engine/api/collection_api.dart' hide debugPrint;


// /// ═══════════════════════════════════════════════════════
// /// UNIVERSAL SCREEN RENDERER
// /// ═══════════════════════════════════════════════════════
// /// Fetches data and renders ANY screen type

// class UniversalScreen extends StatefulWidget {
//   final String screenId;

//   const UniversalScreen({super.key, required this.screenId});

//   @override
//   State<UniversalScreen> createState() => _UniversalScreenState();
// }

// class _UniversalScreenState extends State<UniversalScreen> {
//   Map<String, List<dynamic>> collectionData = {};
//   bool isLoading = true;
//   String? error;

//   @override
//   void initState() {
//     super.initState();
//     _loadScreenData();
//   }

//   Future<void> _loadScreenData() async {
//     setState(() {
//       isLoading = true;
//       error = null;
//     });

//     try {
//       final app = Provider.of<AppModel>(context, listen: false);
//       final screen = app.findScreen(widget.screenId);

//       if (screen == null) {
//         throw Exception('Screen not found: ${widget.screenId}');
//       }

//       // Extract all dataSources from widget tree
//       final dataSources = _extractDataSources(screen.root);

//       // Fetch data for each collection
//       for (final source in dataSources) {
//         try {
//           final data = await CollectionAPI.fetch(app.id, source);
//           collectionData[source] = data;
//         } catch (e) {
//           debugPrint('⚠️ Failed to load $source: $e');
//           collectionData[source] = [];
//         }
//       }

//       setState(() {
//         isLoading = false;
//       });
//     } catch (e) {
//       setState(() {
//         error = e.toString();
//         isLoading = false;
//       });
//     }
//   }

//   /// Recursively find all dataSource properties
//   Set<String> _extractDataSources(Map<String, dynamic> widget) {
//     final sources = <String>{};

//     void traverse(dynamic node) {
//       if (node is Map) {
//         if (node['props']?['dataSource'] != null) {
//           sources.add(node['props']['dataSource']);
//         }

//         if (node['children'] is List) {
//           for (final child in node['children']) {
//             traverse(child);
//           }
//         }
//         if (node['child'] != null) {
//           traverse(node['child']);
//         }
//         if (node['itemTemplate'] != null) {
//           traverse(node['itemTemplate']);
//         }
//       }
//     }

//     traverse(widget);
//     return sources;
//   }

//   @override
//   Widget build(BuildContext context) {
//     final app = Provider.of<AppModel>(context);
//     final screen = app.findScreen(widget.screenId);

//     if (screen == null) {
//       return _buildErrorScaffold('Screen not found: ${widget.screenId}');
//     }

//     return Scaffold(
//       appBar: AppBar(
//         title: Text(screen.title),
//         actions: [
//           IconButton(
//             icon: const Icon(Icons.refresh),
//             onPressed: _loadScreenData,
//           ),
//         ],
//       ),
//       body: _buildBody(screen.root),
//     );
//   }

//   Widget _buildBody(Map<String, dynamic> root) {
//     if (isLoading) {
//       return const Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             CircularProgressIndicator(),
//             SizedBox(height: 16),
//             Text('Loading...'),
//           ],
//         ),
//       );
//     }

//     if (error != null) {
//       return Center(
//         child: Padding(
//           padding: const EdgeInsets.all(32),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               const Icon(Icons.error_outline, size: 64, color: Colors.red),
//               const SizedBox(height: 16),
//               Text(
//                 'Error: $error',
//                 textAlign: TextAlign.center,
//                 style: const TextStyle(color: Colors.red),
//               ),
//               const SizedBox(height: 16),
//               ElevatedButton(
//                 onPressed: _loadScreenData,
//                 child: const Text('Retry'),
//               ),
//             ],
//           ),
//         ),
//       );
//     }

//     return SafeArea(
//       child: SingleChildScrollView(
//         padding: const EdgeInsets.all(16),
//         child: _buildWidgetWithData(root),
//       ),
//     );
//   }

//   /// Inject collection data into widgets
//   Widget _buildWidgetWithData(dynamic widgetJson) {
//     if (widgetJson is! Map<String, dynamic>) {
//       return const SizedBox.shrink();
//     }

//     final widgetCopy = Map<String, dynamic>.from(widgetJson);

//     // Inject data if widget has dataSource
//     if (widgetCopy['props']?['dataSource'] != null) {
//       final dataSource = widgetCopy['props']['dataSource'];
//       final items = collectionData[dataSource] ?? [];
      
//       if (widgetCopy['props'] == null) {
//         widgetCopy['props'] = {};
//       }
//       widgetCopy['props']['items'] = items;
//     }

//     // Recursively process children
//     if (widgetCopy['children'] is List) {
//       widgetCopy['children'] = (widgetCopy['children'] as List)
//           .map((child) => _buildWidgetWithData(child))
//           .toList();
//     }

//     if (widgetCopy['child'] != null) {
//       widgetCopy['child'] = _buildWidgetWithData(widgetCopy['child']);
//     }

//     return UniversalWidgetFactory.build(
//       widgetCopy,
//       _handleNavigation,
//     );
//   }

//   void _handleNavigation(String targetScreenId, {Map<String, dynamic>? params}) {
//     Navigator.push(
//       context,
//       MaterialPageRoute(
//         builder: (_) => UniversalScreen(screenId: targetScreenId),
//       ),
//     );
//   }

//   Scaffold _buildErrorScaffold(String message) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('Error')),
//       body: Center(
//         child: Padding(
//           padding: const EdgeInsets.all(32),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               const Icon(Icons.error_outline, size: 64, color: Colors.red),
//               const SizedBox(height: 16),
//               Text(
//                 message,
//                 textAlign: TextAlign.center,
//                 style: const TextStyle(fontSize: 16),
//               ),
//               const SizedBox(height: 24),
//               ElevatedButton(
//                 onPressed: () => Navigator.of(context).pop(),
//                 child: const Text('Go Back'),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }



// lib/screens/universal_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../engine/renderer/universal_widget_factory.dart';
import '../engine/api/collection_api.dart' hide debugPrint;
import '../context/render_context.dart';
import '../models/app_model.dart';

class UniversalScreen extends StatefulWidget {
  final String screenId;

  const UniversalScreen({super.key, required this.screenId});

  @override
  State<UniversalScreen> createState() => _UniversalScreenState();
}

class _UniversalScreenState extends State<UniversalScreen> {
  final Map<String, List<dynamic>> _collectionData = {};
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadScreenData();
  }

  Future<void> _loadScreenData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final app = context.read<AppModel>();
      final screen = app.findScreen(widget.screenId);

      if (screen == null) {
        throw Exception('Screen not found: ${widget.screenId}');
      }

      final dataSources = _extractDataSources(screen.root);

      for (final source in dataSources) {
        _collectionData[source] =
            await CollectionAPI.fetch(app.id, source);
      }

      setState(() => _isLoading = false);
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  /// 🔍 Extract all dataSource usages
  Set<String> _extractDataSources(Map<String, dynamic> root) {
  final sources = <String>{};

  void walk(dynamic node) {
    if (node is Map) {
      final ds = node['props']?['dataSource'];
      if (ds is String) {
        sources.add(ds);
      }

      walk(node['child']);

      if (node['children'] is List) {
        for (final c in node['children']) {
          walk(c);
        }
      }

      walk(node['itemTemplate']);
    }
  }

  walk(root);
  return sources;
}


  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppModel>();
    final screen = app.findScreen(widget.screenId);

    if (screen == null) {
      return _errorScaffold('Screen not found');
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(screen.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadScreenData,
          ),
        ],
      ),
      body: _buildBody(screen.root),
    );
  }

  Widget _buildBody(Map<String, dynamic> root) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return _errorView(_error!);
    }

    final ctx = RenderContext(
      data: _collectionData,
      navigate: _navigate,
    );

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: UniversalWidgetFactory.build(root, ctx),
      ),
    );
  }

  void _navigate(String screenId, {Map<String, dynamic>? params}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => UniversalScreen(screenId: screenId),
      ),
    );
  }

  Widget _errorView(String message) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _loadScreenData,
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  Scaffold _errorScaffold(String message) {
    return Scaffold(
      appBar: AppBar(title: const Text('Error')),
      body: _errorView(message),
    );
  }
}
