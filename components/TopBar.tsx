"use client";

interface Props {
  onReset: () => void;
}

export default function TopBar({ onReset }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <path
              d="M5 8L11 3L17 8"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 14L11 19L5 14"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div className="brand-name">Swap</div>
          <div className="brand-tag">iPhone trade-in estimator</div>
        </div>
      </div>

      <nav className="topnav">
        <a href="#estimator" className="topnav-link topnav-link-active">
          Estimator
        </a>
        <a href="#how" className="topnav-link">
          How it works
        </a>
        <button className="btn-primary btn-sm" onClick={onReset}>
          New quote
        </button>
      </nav>
    </header>
  );
}
