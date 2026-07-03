import { useState } from "react";
import CanvasRoot from "./canvas/CanvasRoot";
import ListView from "./components/ListView";

export default function App() {
  const [mode, setMode] = useState<"canvas" | "list">("canvas");

  return (
    <div className="grain">
      {mode === "canvas" ? (
        <CanvasRoot onListView={() => setMode("list")} />
      ) : (
        <ListView onCanvas={() => setMode("canvas")} />
      )}
    </div>
  );
}
