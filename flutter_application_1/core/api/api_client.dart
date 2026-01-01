import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'api_exception.dart';
import 'api_endpoints.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  ApiClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: "token");
          if (token != null) {
            options.headers["Authorization"] = "Bearer $token";
          }
          handler.next(options);
        },
        onError: (error, handler) {
          final message =
              error.response?.data?["error"] ?? "Network error";
          handler.reject(
            DioException(
              requestOptions: error.requestOptions,
              error: ApiException(
                message,
                error.response?.statusCode,
              ),
            ),
          );
        },
      ),
    );
  }

  Future<Response<T>> get<T>(String path) => _dio.get(path);

  Future<Response<T>> post<T>(
    String path, {
    required Map<String, dynamic> data,
  }) =>
      _dio.post(path, data: data);
}
