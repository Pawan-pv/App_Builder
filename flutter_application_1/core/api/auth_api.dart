import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_client.dart';
import 'api_endpoints.dart';

class AuthApi {
  final _client = ApiClient();
  final _storage = const FlutterSecureStorage();

  Future<void> login({
    required String email,
    required String password,
  }) async {
    final res = await _client.post(
      ApiEndpoints.login,
      data: {
        "email": email,
        "password": password,
      },
    );

    final token = res.data["data"]["token"];
    await _storage.write(key: "token", value: token);
  }

  Future<void> register({
    required String email,
    required String password,
  }) async {
    await _client.post(
      ApiEndpoints.register,
      data: {
        "email": email,
        "password": password,
      },
    );
  }

  Future<void> logout() async {
    await _storage.delete(key: "token");
  }
}
