import 'package:flutter/material.dart';

class NativeVideoPlayer extends StatelessWidget {
  final String url;

  const NativeVideoPlayer({
    super.key,
    required this.url,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      color: Colors.black,
      alignment: Alignment.center,
      child: const Icon(Icons.play_arrow, color: Colors.white, size: 48),
    );
  }
}
