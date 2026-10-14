type PlatformIconProps = {
  className?: string;
};

export function AndroidIcon({ className }: PlatformIconProps) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
      aria-hidden="true"
    >
      <path d="M7.1 7.7 5.8 5.4a.42.42 0 0 1 .73-.42l1.33 2.3a7.3 7.3 0 0 1 8.28 0l1.33-2.3a.42.42 0 0 1 .73.42l-1.3 2.3a6.85 6.85 0 0 1 2.5 5.25H4.6A6.85 6.85 0 0 1 7.1 7.7ZM8.2 10a.68.68 0 1 0 0-1.36.68.68 0 0 0 0 1.36Zm7.6 0a.68.68 0 1 0 0-1.36.68.68 0 0 0 0 1.36ZM4.6 13.95h14.8v4.25c0 .55-.45 1-1 1h-.9v2.15a1.05 1.05 0 0 1-2.1 0V19.2H8.6v2.15a1.05 1.05 0 0 1-2.1 0V19.2h-.9c-.55 0-1-.45-1-1v-4.25Zm-2.35-.95c.69 0 1.25.56 1.25 1.25v3.2a1.25 1.25 0 0 1-2.5 0v-3.2c0-.69.56-1.25 1.25-1.25Zm19.5 0c.69 0 1.25.56 1.25 1.25v3.2a1.25 1.25 0 0 1-2.5 0v-3.2c0-.69.56-1.25 1.25-1.25Z" />
    </svg>
  );
}

export function WindowsIcon({ className }: PlatformIconProps) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
      aria-hidden="true"
    >
      <path d="M2.5 5.4 10.7 4.3v7.1H2.5V5.4Zm9.4-1.25 9.6-1.3v8.55h-9.6V4.15ZM2.5 12.8h8.2v7.1l-8.2-1.1v-6Zm9.4 0h9.6v8.55l-9.6-1.3V12.8Z" />
    </svg>
  );
}
