import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/runtime/app_id_resolver.dart'; // ✅ NEW
import 'core/services/config_service.dart';
import 'models/app_model.dart';
import 'screens/universal_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AppBootstrapper());
}

/// =====================================================
/// GLOBAL RUNTIME CONFIG
/// =====================================================
class AppRuntimeConfig {
  static bool isPreview = true;
}

/// =====================================================
/// APP BOOTSTRAPPER
/// =====================================================
class AppBootstrapper extends StatefulWidget {
  const AppBootstrapper({super.key});

  @override
  State<AppBootstrapper> createState() => _AppBootstrapperState();
}

class _AppBootstrapperState extends State<AppBootstrapper> {
  AppModel? appModel;
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  /// -----------------------------------------------------
  /// Load App Manifest from Backend
  /// -----------------------------------------------------
Future<void> _initializeApp() async {
  setState(() {
    isLoading = true;
    error = null;
  });

  try {
    // ✅ Platform-safe appId resolution
    final appId = await AppIdResolver.resolve();

    final configService = ConfigService();
    final config = await configService.load(appId);
    final model = AppModel.fromJson(config);

    if (model.screens.isEmpty) {
      throw Exception('No screens found in app configuration');
    }

    setState(() {
      appModel = model;
      isLoading = false;
    });
  } catch (e) {
    setState(() {
      error = e.toString();
      isLoading = false;
    });
    debugPrint('❌ Initialization error: $e');
  }
}


  @override
  Widget build(BuildContext context) {
    // ─────────────────────────────────────────
    // Loading State
    // ─────────────────────────────────────────
    if (isLoading) {
      return const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text('Loading app preview...'),
              ],
            ),
          ),
        ),
      );
    }

    // ─────────────────────────────────────────
    // Error State
    // ─────────────────────────────────────────
    if (error != null) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  const Text(
                    'Failed to load app',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    error!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _initializeApp,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    if (appModel == null) {
      return const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          body: Center(child: Text('No app data available')),
        ),
      );
    }

    return UniversalApp(appModel: appModel!);
  }
}

/// =====================================================
/// UNIVERSAL APP (PREVIEW SHELL)
/// =====================================================
class UniversalApp extends StatelessWidget {
  final AppModel appModel;

  const UniversalApp({
    super.key,
    required this.appModel,
  });

  @override
  Widget build(BuildContext context) {
    final initialScreen = appModel.screens.firstWhere(
      (s) => s.isInitial,
      orElse: () => appModel.screens.first,
    );

    return Provider<AppModel>.value(
      value: appModel,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: appModel.name,
        theme: appModel.theme.toFlutterTheme(),
        home: Scaffold(
          backgroundColor: const Color(0xFFEEF2F7),
          body: Center(
            child: _PreviewDeviceShell(
              child: SafeArea(
                child: UniversalScreen(screenId: initialScreen.id),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// =====================================================
/// DEVICE PREVIEW SHELL (CRITICAL)
/// =====================================================
class _PreviewDeviceShell extends StatelessWidget {
  final Widget child;

  const _PreviewDeviceShell({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 375,
      height: 812,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 30,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: child,
      ),
    );
  }
}
