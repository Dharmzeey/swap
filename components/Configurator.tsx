"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ConfigState, DefectType, IphoneModel, IphoneSeries, StorageVariant } from "@/lib/types";
import ChipGrid from "./ui/Chip";
import DefectsChecklist from "./DefectsChecklist";
import Reveal from "./ui/Reveal";
import StepHeader from "./ui/StepHeader";

interface Props {
  config: ConfigState;
  onChange: (config: ConfigState) => void;
  seriesList: IphoneSeries[];
  defects: DefectType[];
  allowDefects?: boolean;
  title: string;
}

type Step = "series" | "model" | "storage" | "defects" | null;

export default function Configurator({
  config,
  onChange,
  seriesList,
  defects,
  allowDefects = false,
  title,
}: Props) {
  const [models, setModels] = useState<IphoneModel[]>([]);
  const [storage, setStorage] = useState<StorageVariant[]>([]);
  const [editingStep, setEditingStep] = useState<Step>(null);

  // Load models when series changes
  useEffect(() => {
    if (!config.seriesId) { setModels([]); return; }
    console.log("Fetching models for series", config.seriesId);
    console.log(typeof config.seriesId);
    api.models(config.seriesId).then(setModels).catch(console.error);
  }, [config.seriesId]);

  // Load storage when model changes
  useEffect(() => {
    if (!config.modelId) { setStorage([]); return; }
    api.storage(config.modelId).then(setStorage).catch(console.error);
  }, [config.modelId]);

  const update = (patch: Partial<ConfigState>) =>
    onChange({ ...config, ...patch });

  const pickSeries = (id: number | string) => {
    onChange({ seriesId: Number(id), modelId: null, storageId: null, defectIds: [], defectsCommitted: false });
    setEditingStep(null);
  };
  const pickModel = (id: number | string) => {
    update({ modelId: Number(id), storageId: null });
    setEditingStep(null);
  };
  const pickStorage = (id: number | string) => {
    update({ storageId: Number(id) });
    setEditingStep(null);
  };

  const seriesPicked  = config.seriesId !== null;
  const modelPicked   = config.modelId !== null;
  const storagePicked = config.storageId !== null;

  const activeSeries  = seriesList.find((s) => s.id === config.seriesId);
  const activeModel   = models.find((m) => m.id === config.modelId);
  const activeStorage = storage.find((s) => s.id === config.storageId);

  const showSeries  = !seriesPicked || editingStep === "series";
  const showModel   = seriesPicked && (!modelPicked || editingStep === "model");
  const showStorage = modelPicked && (!storagePicked || editingStep === "storage");
  const showDefects = allowDefects && storagePicked && (!config.defectsCommitted || editingStep === "defects");

  return (
    <section className="card">
      <div className="card-eyebrow">{title}</div>

      {/* Step 1 — Series */}
      <div className="step">
        <StepHeader
          index={1}
          title="Choose series"
          hint="Pick the iPhone generation"
          complete={seriesPicked && editingStep !== "series"}
          summary={activeSeries ? `iPhone ${activeSeries.name}` : undefined}
          onEdit={seriesPicked && editingStep !== "series" ? () => setEditingStep("series") : undefined}
        />
        <Reveal open={showSeries}>
          <ChipGrid
            items={seriesList.map((s) => ({ id: s.id, label: s.name }))}
            value={config.seriesId}
            onChange={pickSeries}
            minWidth={80}
          />
        </Reveal>
      </div>

      {/* Step 2 — Model */}
      {seriesPicked && (
        <div className="step">
          <div className="divider" />
          <StepHeader
            index={2}
            title="Choose model"
            hint={activeSeries ? `Pick a model in the iPhone ${activeSeries.name} family` : ""}
            complete={modelPicked && editingStep !== "model"}
            summary={activeModel?.name}
            onEdit={modelPicked && editingStep !== "model" ? () => setEditingStep("model") : undefined}
          />
          <Reveal open={showModel}>
            <ChipGrid
              items={models.map((m) => ({ id: m.id, label: m.name }))}
              value={config.modelId}
              onChange={pickModel}
              minWidth={150}
            />
          </Reveal>
        </div>
      )}

      {/* Step 3 — Storage */}
      {modelPicked && (
        <div className="step">
          <div className="divider" />
          <StepHeader
            index={3}
            title="Choose storage"
            hint="Select the storage capacity"
            complete={storagePicked && editingStep !== "storage"}
            summary={activeStorage?.capacity}
            onEdit={storagePicked && editingStep !== "storage" ? () => setEditingStep("storage") : undefined}
          />
          <Reveal open={showStorage}>
            <ChipGrid
              items={storage.map((s) => ({ id: s.id, label: s.capacity }))}
              value={config.storageId}
              onChange={pickStorage}
              minWidth={100}
            />
          </Reveal>
        </div>
      )}

      {/* Step 4 — Defects (swap-from only) */}
      {allowDefects && storagePicked && (
        <div className="step">
          <div className="divider" />
          <StepHeader
            index={4}
            title="Condition"
            hint="Toggle anything that applies — leave off if perfect"
            complete={config.defectsCommitted && editingStep !== "defects"}
            summary={
              config.defectsCommitted
                ? config.defectIds.length
                  ? `${config.defectIds.length} issue${config.defectIds.length > 1 ? "s" : ""} noted`
                  : "No issues — pristine"
                : undefined
            }
            onEdit={config.defectsCommitted && editingStep !== "defects" ? () => setEditingStep("defects") : undefined}
          />
          <Reveal open={showDefects}>
            <div style={{ paddingTop: 4 }}>
              <DefectsChecklist
                defects={defects}
                selectedIds={config.defectIds}
                onChange={(ids) => update({ defectIds: ids })}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    update({ defectsCommitted: true });
                    setEditingStep(null);
                  }}
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
