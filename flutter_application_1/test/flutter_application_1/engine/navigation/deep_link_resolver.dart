// import 'package:flutter_test/flutter_test.dart';
// import 'package:namer_app/engine/navigation/deep_link_resolver.dart';

// void main() {
//   test('resolves deep link with params', () {
//     final result = DeepLinkResolver.resolve(
//       'myapp://product-details?id=42&ref=home',
//     );

//     expect(result.screenId, 'product-details');
//     expect(result.params, {
//       'id': '42',
//       'ref': 'home',
//     });
//   });

//   test('falls back to home when path is empty', () {
//     final result = DeepLinkResolver.resolve('myapp://');

//     expect(result.screenId, 'home');
//     expect(result.params, {});
//   });
// }
