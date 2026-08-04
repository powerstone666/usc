import { ImageResponse } from "next/og";
import { site } from "@/app/(config)/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: 900,
              color: "#0d47a1",
              letterSpacing: "-2px",
            }}
          >
            USC
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "52px", fontWeight: 900, color: "#ffffff" }}>
              Urban Service Company
            </div>
            <div style={{ fontSize: "28px", fontWeight: 600, color: "#bbdefb", marginTop: "4px" }}>
              Appliance Repair in Bengaluru
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["Microwave", "AC", "Washing Machine", "Refrigerator", "Water Filter", "Chimney"].map(
            (s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {s} Repair
              </div>
            ),
          )}
        </div>
        <div
          style={{
            marginTop: "40px",
            fontSize: "22px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Same-day slots · Verified technicians · 84+ neighbourhoods
        </div>
      </div>
    ),
    size,
  );
}
