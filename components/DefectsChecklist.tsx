"use client";

import type { DefectType } from "@/lib/types";

interface Props {
  defects: DefectType[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

const CATEGORY_LABELS: Record<DefectType["category"], string> = {
  damage: "Physical Damage",
  functional: "Functional Issues",
  replaced_part: "Replaced Parts",
};

const CATEGORY_ORDER: DefectType["category"][] = [
  "damage",
  "functional",
  "replaced_part",
];

export default function DefectsChecklist({ defects, selectedIds, onChange }: Props) {
  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {CATEGORY_ORDER.map((cat) => {
        const group = defects.filter((d) => d.category === cat);
        if (!group.length) return null;
        return (
          <div key={cat}>
            <div className="defect-group-label">{CATEGORY_LABELS[cat]}</div>
            <div style={{ display: "grid", gap: 8 }}>
              {group.map((defect) => {
                const on = selectedIds.includes(defect.id);
                return (
                  <label
                    key={defect.id}
                    className={`defect-row ${on ? "defect-on" : ""}`}
                  >
                    <div className="defect-info">
                      <span className="defect-name">{defect.name}</span>
                      {defect.description && (
                        <span className="defect-desc">{defect.description}</span>
                      )}
                    </div>
                    <span className={`toggle ${on ? "toggle-on" : ""}`}>
                      <span className="toggle-knob" />
                    </span>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(defect.id)}
                      style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
