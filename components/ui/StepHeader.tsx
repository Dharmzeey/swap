interface Props {
  index: number;
  title: string;
  hint?: string;
  complete?: boolean;
  summary?: string;
  onEdit?: () => void;
}

export default function StepHeader({ index, title, hint, complete, summary, onEdit }: Props) {
  return (
    <div className="step-header">
      <div className="step-header-left">
        <span className={`step-index ${complete ? "step-index-done" : ""}`}>
          {complete ? "✓" : String(index).padStart(2, "0")}
        </span>
        <div>
          <h2 className="step-title">{title}</h2>
          {hint && !complete && <p className="step-hint">{hint}</p>}
          {complete && summary && <p className="step-summary">{summary}</p>}
        </div>
      </div>
      {complete && onEdit && (
        <button className="btn-ghost" onClick={onEdit}>
          Edit
        </button>
      )}
    </div>
  );
}
