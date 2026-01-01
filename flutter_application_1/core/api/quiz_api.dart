import 'api_client.dart';
import 'api_endpoints.dart';

class QuizApi {
  final _client = ApiClient();

  Future<void> submitQuiz({
    required String quizId,
    required int score,
  }) async {
    await _client.post(
      ApiEndpoints.submitQuiz,
      data: {
        "quizId": quizId,
        "score": score,
      },
    );
  }
}
