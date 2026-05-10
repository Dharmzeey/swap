"use client";

import type { HistoryEntry } from "@/lib/types";

interface Props {
  items: HistoryEntry[];
  onClear: () => void;
  onUse: (entry: HistoryEntry) => void;
}

export default function HistoryStrip({ items, onClear, onUse }: Props) {
  if (!items.length) return null;

  return (
    <div className="history">
      <div className="history-head">
        <div className="eyebrow">Recently checked</div>
        <button className="btn-ghost btn-tiny" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="history-row">
        {items.map((entry, i) => (
          <button key={i} className="history-card" onClick={() => onUse(entry)}>
            <div className="history-card-from">{entry.fromText}</div>
            <div className="history-card-arrow">→</div>
            <div className="history-card-to">{entry.toText}</div>
            <div className="history-card-amt">{entry.amountText}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
