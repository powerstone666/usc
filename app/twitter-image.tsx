import { ImageResponse } from "next/og";
import { site } from "@/app/(config)/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
          background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #0d47a1 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: 900,
              color: "#0d47a1",
              letterSpacing: "-2px",
            }}
          >
            USC
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "48px", fontWeight: 900, color: "#ffffff" }}>
              Urban Service Company
            </div>
            <div style={{ fontSize: "26px", fontWeight: 600, color: "#bbdefb", marginTop: "4px" }}>
              Appliance Repair in Bengaluru
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "20px",
            fontSize: "20px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Same-day repair · Verified technicians · Quality assured
        </div>
        <div style={{ marginTop: "12px", fontSize: "18px", color: "rgba(255,255,255,0.6)" }}>
          Call +91 9019349170
        </div>
      </div>
    ),
    size,
  );
}
