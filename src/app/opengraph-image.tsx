import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ededed",
            letterSpacing: 4,
          }}
        >
          ARZUNO COACHING
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 30,
            color: "#9ca3af",
          }}
        >
          1:1 Online Fitness &amp; Nutrition Coaching
        </div>
        <div
          style={{
            marginTop: 40,
            width: 120,
            height: 6,
            borderRadius: 3,
            background: "#3ddcff",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
