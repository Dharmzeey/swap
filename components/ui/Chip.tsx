interface ChipItem {
  id: number | string;
  label: string;
  sublabel?: string;
}

interface Props {
  items: ChipItem[];
  value: number | string | null;
  onChange: (id: number | string) => void;
  minWidth?: number;
}

export default function ChipGrid({ items, value, onChange, minWidth = 110 }: Props) {
  return (
    <div
      className="chip-grid"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
      }}
    >
      {items.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`chip ${selected ? "chip-selected" : ""}`}
          >
            <span className="chip-label">{item.label}</span>
            {item.sublabel && <span className="chip-sub">{item.sublabel}</span>}
          </button>
        );
      })}
    </div>
  );
}
