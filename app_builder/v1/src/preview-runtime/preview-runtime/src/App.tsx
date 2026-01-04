import { useEffect, useState } from "react";

/* Reuse your Screen + Widget types if possible */
type Screen = {
  id: string;
  name: string;
  widgets: any[];
};

export default function App() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type === "SYNC_SCREENS") {
        setScreens(event.data.screens);

        const initial = event.data.screens.find((s: any) => s.isInitial);
        setActiveScreenId(initial?.id ?? event.data.screens[0]?.id);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const activeScreen = screens.find((s) => s.id === activeScreenId);

  return (
    <div className="h-screen bg-gray-200 flex justify-center items-center">
      {/* Device Frame */}
      <div className="w-[375px] h-[812px] bg-white shadow-xl overflow-auto">
        {!activeScreen && (
          <div className="p-4 text-gray-400">
            Waiting for preview…
          </div>
        )}

        {activeScreen && (
          <div className="p-4 space-y-3">
            {activeScreen.widgets.map((w) => (
              <RuntimeWidget key={w.id} widget={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔥 Minimal Runtime Renderer */
function RuntimeWidget({ widget }: { widget: any }) {
  switch (widget.type) {
    case "Text":
      return <p style={widget.props?.style}>{widget.props?.content?.text}</p>;

    case "Button":
      return (
        <button
          style={widget.props?.style}
          className="px-4 py-2 rounded text-white"
        >
          {widget.props?.content?.text}
        </button>
      );

    case "Input":
      return (
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder={widget.props?.content?.placeholder}
          type={widget.props?.content?.type}
        />
      );

    default:
      return null;
  }
}
