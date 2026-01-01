import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import { useEffect, useRef } from "react";

export function Preview() {
  const { screens } = useUniversalBuilder();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Sync screens to the Flutter Preview Iframe
    iframeRef.current?.contentWindow?.postMessage(
      { type: "SYNC_SCREENS", screens },
      "*"
    );
  }, [screens]);

  return (
    <iframe
      ref={iframeRef}
      src="https://preview.yourdomain.com"
      className="w-full h-full border-l bg-slate-100"
    />
  );
}