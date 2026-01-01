// render_context.dart
class RenderContext {
  final Map<String, dynamic> data;
  final void Function(String, {Map<String, dynamic>? params}) navigate;

  const RenderContext({
    required this.data,
    required this.navigate,
  });

  RenderContext withData(Map<String, dynamic> next) {
    return RenderContext(
      data: next,
      navigate: navigate,
    );
  }
}
