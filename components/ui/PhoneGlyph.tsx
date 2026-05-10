type Tone = "graphite" | "silver" | "mid";

interface Props {
  size?: number;
  tone?: Tone;
}

const TONES: Record<Tone, { body: string; screen: string }> = {
  graphite: { body: "#1d1d1f", screen: "#2a2a2c" },
  silver:   { body: "#e5e5e7", screen: "#f5f5f7" },
  mid:      { body: "#cfcfd2", screen: "#e8e8ea" },
};

export default function PhoneGlyph({ size = 64, tone = "graphite" }: Props) {
  const { body, screen } = TONES[tone];
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 40 64"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="36" height="60" rx="7.5" fill={body} />
      <rect x="4" y="4" width="32" height="56" rx="5.5" fill={screen} />
      <rect x="14" y="6.5" width="12" height="3" rx="1.5" fill={body} opacity="0.7" />
    </svg>
  );
}
