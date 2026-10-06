"use client";

import "@google/model-viewer";

export default function CoffeeCupViewer() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-[1.75rem] bg-[#d8c9b8] shadow-[0_24px_70px_rgba(45,31,28,0.14)]">
      <model-viewer
        src="/models/latte-art.glb"
        alt="3D model of a latte art coffee cup"
        camera-controls
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="15deg"
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        interaction-prompt="none"
        camera-target="0m 0m 0m"
        camera-orbit="0deg 42deg 3.75m"
        field-of-view="32deg"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent",
        }}
      />
    </div>
  );
}
