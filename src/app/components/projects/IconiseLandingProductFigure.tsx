"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./IconiseLandingProductFigure.module.css";

const previewSteps = ["1", "2", "3", "4", "5", "6", "7", "+"];
const previewOptions = ["A", "B", "C", "D", "E", "F"];

export default function IconiseLandingProductFigure({
  className = "",
}: {
  className?: string;
}) {
  const [selectedOption, setSelectedOption] = useState("C");
  const figureRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure || typeof IntersectionObserver === "undefined") return;

    let isVisible = false;
    const syncMotionState = () => {
      figure.dataset.motionActive =
        isVisible && !document.hidden ? "true" : "false";
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false;
        syncMotionState();
      },
      { threshold: 0.01 },
    );

    observer.observe(figure);
    document.addEventListener("visibilitychange", syncMotionState);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncMotionState);
      delete figure.dataset.motionActive;
    };
  }, []);

  return (
    <figure
      ref={figureRef}
      className={`${styles.figure} ${className}`}
      aria-labelledby="iconise-product-figure-heading"
    >
      <div className={styles.preview}>
        <div className={styles.topbar}>
          <Image
            className={styles.brand}
            src="/iconise-logo.svg"
            width={34}
            height={34}
            alt=""
            aria-hidden="true"
          />
          <strong className={styles.projectName}>Iconise</strong>
          <span className={styles.status}>5 / 8</span>
        </div>

        <div className={styles.body}>
          <div className={styles.rail} aria-hidden="true">
            {previewSteps.map((step) => (
              <span
                key={step}
                className={`${styles.railStep} ${
                  step === "5" ? styles.railStepActive : ""
                } ${step === "+" ? styles.railStepMore : ""}`}
              >
                {step}
              </span>
            ))}
          </div>

          <div className={styles.canvas}>
            <div className={styles.heading}>
              <span>Step 5</span>
              <h2 id="iconise-product-figure-heading">Choose a direction</h2>
              <p>Keep the decision that guides the next iteration.</p>
            </div>

            <div
              className={styles.board}
              role="group"
              aria-label="Iconise visual direction selector"
            >
              {previewOptions.map((option) => {
                const isSelected = option === selectedOption;
                return (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.option} ${
                      isSelected ? styles.optionActive : ""
                    }`}
                    aria-label={`Select visual direction ${option}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedOption(option)}
                  >
                    <i className={styles.shape} aria-hidden="true" />
                    <span className={styles.optionLabel}>{option}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.decision}>
              <span>Retained decision</span>
              <span className={styles.decisionOption} aria-live="polite">
                <span className={styles.decisionLabel}>Option</span>
                <strong className={styles.decisionValue} key={selectedOption}>
                  {selectedOption}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
