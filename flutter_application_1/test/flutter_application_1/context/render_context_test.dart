import 'package:flutter_test/flutter_test.dart';
import 'package:namer_app/context/render_context.dart';

// void main() {
//   test('RenderContext.navigate is called with correct arguments', () {
//     String? calledScreen;
//     Map<String, dynamic>? calledParams;

//     final ctx = RenderContext(
//       data: const {},
//       navigate: (screenId, {params}) {
//         calledScreen = screenId;
//         calledParams = params;
//       },
//     );

//     ctx.navigate(
//       'details',
//       params: {'id': 'p1'},
//     );

//     expect(calledScreen, 'details');
//     expect(calledParams, {'id': 'p1'});
//   });
// }


// import 'package:flutter_test/flutter_test.dart';
// import 'package:namer_app/context/render_context.dart';

void main() {
  test('navigate is called with correct screenId and params', () {
    String? calledScreen;
    Map<String, dynamic>? calledParams;

    final ctx = RenderContext(
      data: const {},
      navigate: (screenId, {params}) {
        calledScreen = screenId;
        calledParams = params;
      },
    );

    // Act
    ctx.navigate(
      'product-details',
      params: {
        'id': 'p1',
        'source': 'home',
      },
    );

    // Assert
    expect(calledScreen, 'product-details');
    expect(calledParams, {
      'id': 'p1',
      'source': 'home',
    });
  });
}
