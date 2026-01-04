import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import { useMemo } from "react";

export function Preview() {
  const { appId } = useUniversalBuilder(); // or hardcode temporarily

  const previewUrl = useMemo(() => {
    return `http://localhost:5000/?appId=${
      appId ?? "11111111-1111-1111-1111-111111111111"
    }`;
  }, [appId]);

  return (
    <iframe
      src={previewUrl}
      className="w-full h-full border-l bg-slate-100"
    />
  );
}
