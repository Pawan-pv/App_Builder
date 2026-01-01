import 'package:flutter/material.dart';

/// =====================================================
/// AppState
/// -----------------------------------------------------
/// • Central runtime state for the app
/// • UI state (search, filters)
/// • Lesson progress + completion
/// • Video resume support
/// • Quiz scores
/// • Backend-ready (sync hooks added)
/// =====================================================
class AppState extends ChangeNotifier {
  // =====================================================
  // 🔹 GENERIC UI STATE (search, filters, toggles)
  // =====================================================
  final Map<String, dynamic> _uiState = {};

  T? getValue<T>(String key) {
    return _uiState[key] as T?;
  }

  void setValue(String key, dynamic value) {
    _uiState[key] = value;
    notifyListeners();
  }

  // =====================================================
  // 🔹 LESSON PROGRESS & COMPLETION
  // =====================================================
  final Map<String, double> _lessonProgress = {};
  final Set<String> _completedLessons = {};

  /// Progress between 0.0 → 1.0
  double getLessonProgress(String lessonId) {
    return _lessonProgress[lessonId] ?? 0.0;
  }

  void updateLessonProgress(String lessonId, double progress) {
    final clamped = progress.clamp(0.0, 1.0);

    if (_lessonProgress[lessonId] == clamped) return;

    _lessonProgress[lessonId] = clamped;
    notifyListeners();
  }

  bool isLessonCompleted(String lessonId) {
    return _completedLessons.contains(lessonId);
  }

  void completeLesson(String lessonId) {
    if (_completedLessons.contains(lessonId)) return;

    _completedLessons.add(lessonId);
    _lessonProgress[lessonId] = 1.0;

    notifyListeners();
  }

  // =====================================================
  // 🔹 VIDEO RESUME (TIMESTAMP)
  // =====================================================
  final Map<String, Duration> _videoPositions = {};

  Duration getVideoPosition(String lessonId) {
    return _videoPositions[lessonId] ?? Duration.zero;
  }

  void setVideoPosition(String lessonId, Duration position) {
    _videoPositions[lessonId] = position;
  }

  // =====================================================
  // 🔹 QUIZ STATE
  // =====================================================
  final Map<String, int> _quizScores = {};

  int? getQuizScore(String quizId) {
    return _quizScores[quizId];
  }

  void setQuizScore(String quizId, int score) {
    _quizScores[quizId] = score;
    notifyListeners();
  }

  bool isQuizPassed(String quizId) {
    return (_quizScores[quizId] ?? 0) > 0;
  }

  // =====================================================
  // 🔹 LOCKED LESSON LOGIC (Prerequisites)
  // =====================================================
  bool isLessonLocked(String prerequisiteLessonId) {
    return !_completedLessons.contains(prerequisiteLessonId);
  }

  bool canAccessLesson({
    required String lessonId,
    String? prerequisite,
  }) {
    if (prerequisite == null) return true;
    return _completedLessons.contains(prerequisite);
  }

  // =====================================================
  // 🔹 BACKEND SYNC (hooks – no API calls yet)
  // =====================================================

  /// Call this after login
  void hydrateFromServer({
    required Map<String, double> lessonProgress,
    required List<String> completedLessons,
    required Map<String, int> quizScores,
    required Map<String, Duration> videoPositions,
  }) {
    _lessonProgress
      ..clear()
      ..addAll(lessonProgress);

    _completedLessons
      ..clear()
      ..addAll(completedLessons);

    _quizScores
      ..clear()
      ..addAll(quizScores);

    _videoPositions
      ..clear()
      ..addAll(videoPositions);

    notifyListeners();
  }

  /// Prepare payload for backend sync
  Map<String, dynamic> toBackendPayload() {
    return {
      "lessonProgress": _lessonProgress,
      "completedLessons": _completedLessons.toList(),
      "quizScores": _quizScores,
      "videoPositions": _videoPositions.map(
        (k, v) => MapEntry(k, v.inMilliseconds),
      ),
    };
  }
}
