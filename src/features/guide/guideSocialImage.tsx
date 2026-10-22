import { ImageResponse } from "next/og";

export const guideSocialAlt =
  "Guide pratique pour décrocher son premier emploi de développeur en 2026";

export const guideSocialSize = {
  width: 1200,
  height: 630,
};

export function createGuideSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          padding: 64,
          color: "#f5f5f5",
          backgroundImage: "linear-gradient(135deg, #171717 0%, #292929 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 770,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: "#ef4444",
              }}
            />
            <span
              style={{
                color: "#d4d4d4",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              GUIDE GRATUIT · DÉVELOPPEMENT WEB
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                color: "#ffffff",
                fontSize: 70,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              Premier emploi
            </span>
            <span
              style={{
                color: "#f87171",
                fontSize: 70,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              développeur
            </span>
          </div>

          <span style={{ color: "#a3a3a3", fontSize: 24 }}>
            CV · Portfolio · Réseau · Entretiens
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
            width: 270,
            marginLeft: 30,
            padding: 24,
            borderRadius: 24,
            border: "1px solid #525252",
            background: "rgba(38, 38, 38, 0.8)",
          }}
        >
          {[
            "01  Construire son profil",
            "02  Trouver des opportunités",
            "03  Réussir ses entretiens",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "16px 14px",
                borderRadius: 14,
                background: "#333333",
                color: "#e5e5e5",
                fontSize: 18,
              }}
            >
              {label}
            </div>
          ))}
          <span
            style={{
              marginTop: 12,
              color: "#d4d4d4",
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            Vincent DESBROSSES
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            right: -100,
            top: -170,
            width: 420,
            height: 420,
            borderRadius: 210,
            border: "1px solid rgba(248, 113, 113, 0.2)",
          }}
        />
      </div>
    ),
    guideSocialSize,
  );
}
