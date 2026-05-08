import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0f172a",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 17,
            fontWeight: 700,
            fontFamily: "serif",
            letterSpacing: -0.5,
          }}
        >
          R
        </span>
        <span
          style={{
            color: "#4A7CF7",
            fontSize: 17,
            fontWeight: 700,
            fontFamily: "serif",
            letterSpacing: -0.5,
          }}
        >
          R
        </span>
      </div>
    ),
    { ...size }
  );
}
