import {
  Briefcase,
  Cpu,
  Mic,
  Mic2,
  PanelLeft,
  Play,
  Settings,
  SlidersHorizontal,
  Speaker,
  UserSquare2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./SuggstIllustration.module.css";

const sidebarItems = [
  { icon: UserSquare2, width: 4 },
  { icon: Briefcase, width: 5 },
  { icon: Cpu, width: 6 },
  { icon: SlidersHorizontal, width: 3 },
];

export default function SuggstIllustration({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("projects.suggst.illustration");

  return (
    <div
      data-project-illustration="suggst"
      role="img"
      aria-label={t("label")}
      className={`${styles.figure} ${className}`}
    >
      <div className={styles.canvas} aria-hidden="true">
        <div className={styles.window}>
          <div className={styles.sidebar}>
            <div className={styles.trafficLights}>
              <span />
              <span />
              <span />
            </div>

            <div className={styles.brand}>
              <span className={styles.appIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M4 10v4m4-7v10m4-13v16m4-13v10m4-7v4"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>Suggst</span>
            </div>

            <div className={styles.activeItem}>
              <Mic2 />
              <span>{t("listening")}</span>
            </div>

            <div className={styles.sidebarItems}>
              {sidebarItems.map(({ icon: Icon, width }, index) => (
                <div
                  key={width}
                  className={styles.sidebarItem}
                  data-separated={index === 2 ? "true" : undefined}
                >
                  <Icon />
                  <span
                    className={styles.skeleton}
                    style={{ width: `${width}em` }}
                  />
                </div>
              ))}
            </div>

            <div className={styles.sidebarStatus}>
              <span className={styles.statusDot} />
              <span className={styles.skeleton} />
            </div>
          </div>

          <div className={styles.content}>
            <PanelLeft className={styles.sidebarToggle} />

            <div className={styles.readyState}>
              <div className={styles.microphone}>
                <Mic />
              </div>
              <div className={styles.title}>{t("ready")}</div>
              <div className={styles.subtitle}>
                <span className={styles.skeleton} />
                <span className={styles.skeleton} />
              </div>
            </div>

            <div className={styles.controlBar}>
              <div className={styles.audioStatus}>
                <span className={styles.audioChannel}>
                  <Speaker />
                  <span className={styles.statusDot} />
                </span>
                <span className={styles.audioChannel}>
                  <Mic />
                  <span className={styles.statusDot} />
                </span>
                <span className={styles.divider} />
                <span className={styles.audioChannel}>
                  <Settings />
                  <span className={styles.statusDot} />
                </span>
              </div>
              <span className={styles.startButton}>
                <Play fill="currentColor" />
                <span>{t("start")}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
