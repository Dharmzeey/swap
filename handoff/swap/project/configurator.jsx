// Configurator: builds out a swap-from or swap-to spec via progressive reveal.
const { useState: useStateCfg, useEffect: useEffectCfg, useMemo: useMemoCfg, useRef: useRefCfg } = React;

function findSeries(seriesId) { return window.IPHONE_CATALOG.find((s) => s.id === seriesId); }
function findVariant(seriesId, variantId) {
  const s = findSeries(seriesId); return s && s.variants.find((v) => v.id === variantId);
}
function findStorage(seriesId, variantId, storageSize) {
  const v = findVariant(seriesId, variantId); return v && v.storages.find((st) => st.size === storageSize);
}

// computed base value of a config
function baseValue(cfg) {
  const st = cfg && cfg.series && cfg.variant && cfg.storage
    ? findStorage(cfg.series, cfg.variant, cfg.storage) : null;
  return st ? st.value : 0;
}

// total deduction multiplier from defects (capped at 0.55 to avoid silly numbers)
function defectMultiplier(defectIds = []) {
  const ds = window.DEFECTS;
  let total = 0;
  for (const id of defectIds) {
    const d = ds.find((x) => x.id === id); if (d) total += d.weight;
  }
  return 1 - Math.min(total, 0.55);
}

function configValue(cfg, withDefects = true) {
  const base = baseValue(cfg);
  if (!withDefects) return base;
  return base * defectMultiplier(cfg.defects || []);
}

// ----- Defects controls -----
function DefectsChecklist({ value, onChange }) {
  const groups = [
    { id: "function", title: "Functional" },
    { id: "parts",    title: "Replaced parts" },
    { id: "physical", title: "Physical condition" },
  ];
  const toggle = (id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div style={{ display: "grid", gap: 22 }}>
      {groups.map((g) => (
        <div key={g.id}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase",
            color: "var(--ink-3)", marginBottom: 10,
          }}>{g.title}</div>
          <div style={{ display: "grid", gap: 8 }}>
            {window.DEFECTS.filter((d) => d.group === g.id).map((d) => {
              const on = value.includes(d.id);
              return (
                <label key={d.id} className={"defect-row " + (on ? "defect-on" : "")}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-1)" }}>{d.label}</span>
                    <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{d.sublabel}</span>
                  </div>
                  <span className={"toggle " + (on ? "toggle-on" : "")}>
                    <span className="toggle-knob" />
                  </span>
                  <input type="checkbox" checked={on} onChange={() => toggle(d.id)} style={{
                    position: "absolute", opacity: 0, pointerEvents: "none",
                  }} />
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function DefectsSeverity({ value, onChange }) {
  // alt UI variant: 3-state pills (Perfect / Worn / Broken) per category
  const cats = [
    { id: "screen_b", label: "Screen", states: [
      { v: null, label: "Perfect" },
      { v: "screen_p", label: "Replaced", weight: ".10" },
      { v: "screen_b", label: "Cracked", weight: ".18" },
    ]},
    { id: "back_b", label: "Back glass", states: [
      { v: null, label: "Perfect" },
      { v: "rough", label: "Scratched", weight: ".05" },
      { v: "back_b", label: "Cracked", weight: ".08" },
    ]},
    { id: "battery", label: "Battery", states: [
      { v: null, label: "Original" },
      { v: "battery", label: "Replaced", weight: ".05" },
    ]},
    { id: "camera_p", label: "Camera", states: [
      { v: null, label: "Original" },
      { v: "camera_p", label: "Replaced", weight: ".08" },
    ]},
    { id: "faceid", label: "Face ID", states: [
      { v: null, label: "Working" },
      { v: "faceid", label: "Faulty", weight: ".12" },
    ]},
    { id: "other_p", label: "Other parts", states: [
      { v: null, label: "Original" },
      { v: "other_p", label: "Changed", weight: ".04" },
    ]},
  ];

  const setCat = (cat, sv) => {
    let next = [...value];
    // remove all ids present in this cat's options
    for (const s of cat.states) if (s.v) next = next.filter((x) => x !== s.v);
    if (sv) next.push(sv);
    onChange(next);
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {cats.map((c) => {
        const active = c.states.find((s) => s.v && value.includes(s.v));
        const activeV = active ? active.v : null;
        return (
          <div key={c.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, padding: "14px 16px",
            background: "var(--surface)", borderRadius: 14,
            border: "1px solid var(--hairline)",
          }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-1)" }}>{c.label}</span>
            <div className="seg">
              {c.states.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setCat(c, s.v)}
                  className={"seg-btn " + (activeV === s.v ? "seg-btn-on" : "")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----- Configurator -----
function Configurator({ cfg, setCfg, allowDefects = true, defectsVariant = "checklist", title }) {
  const update = (patch) => setCfg({ ...cfg, ...patch });

  const seriesPicked = !!cfg.series;
  const variantPicked = !!cfg.variant;
  const storagePicked = !!cfg.storage;

  const series = seriesPicked ? findSeries(cfg.series) : null;
  const variant = variantPicked ? findVariant(cfg.series, cfg.variant) : null;
  const storage = storagePicked ? findStorage(cfg.series, cfg.variant, cfg.storage) : null;

  // step state — what's currently being edited (null = move to next pending step)
  const [editing, setEditing] = useStateCfg(null);

  const editSeries = () => { setEditing("series"); };
  const editVariant = () => { setEditing("variant"); };
  const editStorage = () => { setEditing("storage"); };
  const editDefects = () => { setEditing("defects"); };

  const showSeries  = !seriesPicked || editing === "series";
  const showVariant = (seriesPicked && (!variantPicked || editing === "variant")) || editing === "variant";
  const showStorage = (variantPicked && (!storagePicked || editing === "storage")) || editing === "storage";
  const showDefects = allowDefects && storagePicked && (editing === "defects" || !cfg.defectsCommitted);

  // when series changes, reset variant + storage
  const pickSeries = (id) => {
    update({ series: id, variant: null, storage: null });
    setEditing(null);
  };
  const pickVariant = (id) => {
    update({ variant: id, storage: null });
    setEditing(null);
  };
  const pickStorage = (size) => {
    update({ storage: size });
    setEditing(null);
  };

  const seriesItems = window.IPHONE_CATALOG.map((s) => ({
    id: s.id, label: s.series.replace("iPhone ", ""), sublabel: String(s.year),
  }));
  const variantItems = series ? series.variants.map((v) => ({
    id: v.id, label: v.name.replace("iPhone ", ""),
  })) : [];
  const storageItems = variant ? variant.storages.map((st) => ({
    id: st.size, label: st.size,
  })) : [];

  return (
    <section className="card">
      {title && <div className="card-eyebrow">{title}</div>}

      {/* STEP 1 — Series */}
      <div className="step">
        <StepHeader
          index={1}
          title="Choose series"
          hint="Pick the iPhone generation"
          complete={seriesPicked && !showSeries}
          summary={series && series.series}
          onEdit={seriesPicked && !showSeries ? editSeries : null}
        />
        <Reveal open={showSeries}>
          <ChipGrid
            items={seriesItems}
            value={cfg.series}
            onChange={(id) => pickSeries(id)}
            minWidth={92}
          />
        </Reveal>
      </div>

      {/* STEP 2 — Variant */}
      {seriesPicked && (
        <div className="step">
          <div className="divider" />
          <StepHeader
            index={2}
            title="Choose model"
            hint={series ? `Pick a model in the ${series.series} family` : ""}
            complete={variantPicked && !showVariant}
            summary={variant && variant.name}
            onEdit={variantPicked && !showVariant ? editVariant : null}
          />
          <Reveal open={showVariant}>
            <ChipGrid items={variantItems} value={cfg.variant} onChange={pickVariant} minWidth={150} />
          </Reveal>
        </div>
      )}

      {/* STEP 3 — Storage */}
      {variantPicked && (
        <div className="step">
          <div className="divider" />
          <StepHeader
            index={3}
            title="Choose storage"
            hint="Storage available for this model"
            complete={storagePicked && !showStorage}
            summary={storage && storage.size}
            onEdit={storagePicked && !showStorage ? editStorage : null}
          />
          <Reveal open={showStorage}>
            <ChipGrid items={storageItems} value={cfg.storage} onChange={pickStorage} minWidth={110} />
          </Reveal>
        </div>
      )}

      {/* STEP 4 — Defects (only swap-from) */}
      {allowDefects && storagePicked && (
        <div className="step">
          <div className="divider" />
          <StepHeader
            index={4}
            title="Condition"
            hint="Toggle anything that applies — leave off if perfect"
            complete={cfg.defectsCommitted && editing !== "defects"}
            summary={cfg.defectsCommitted ? (
              cfg.defects && cfg.defects.length
                ? `${cfg.defects.length} issue${cfg.defects.length > 1 ? "s" : ""} noted`
                : "No issues — pristine"
            ) : null}
            onEdit={cfg.defectsCommitted && editing !== "defects" ? editDefects : null}
          />
          <Reveal open={showDefects}>
            <div style={{ paddingTop: 4 }}>
              {defectsVariant === "severity" ? (
                <DefectsSeverity value={cfg.defects || []} onChange={(d) => update({ defects: d })} />
              ) : (
                <DefectsChecklist value={cfg.defects || []} onChange={(d) => update({ defects: d })} />
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
                <button
                  className="btn-primary"
                  onClick={() => { update({ defectsCommitted: true }); setEditing(null); }}
                >
                  Confirm condition
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}

Object.assign(window, {
  Configurator, baseValue, configValue, findSeries, findVariant, findStorage, defectMultiplier,
});
