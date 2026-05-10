// Main app — assembles configurators + result panel + tweaks.
const { useState: useStateApp, useEffect: useEffectApp, useRef: useRefApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "defectsVariant": "checklist"
}/*EDITMODE-END*/;

function emptyCfg() {
  return { series: null, variant: null, storage: null, defects: [], defectsCommitted: false };
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [fromCfg, setFromCfg] = useStateApp(emptyCfg);
  const [toCfg,   setToCfg]   = useStateApp(emptyCfg);
  const [toCfg2,  setToCfg2]  = useStateApp(emptyCfg);
  const [compareMode, setCompareMode] = useStateApp(false);
  const [history, pushHistory, clearHistory] = useHistory();
  const [toast, setToast] = useStateApp(null);

  // when a quote becomes ready, auto-save to history once
  const lastSavedRef = useRefApp("");
  useEffectApp(() => {
    const ready =
      fromCfg.series && fromCfg.variant && fromCfg.storage && fromCfg.defectsCommitted &&
      toCfg.series && toCfg.variant && toCfg.storage;
    if (!ready) return;
    const sig = JSON.stringify([fromCfg, toCfg]);
    if (sig === lastSavedRef.current) return;
    lastSavedRef.current = sig;
    const q = window.quoteRange(fromCfg, toCfg);
    pushHistory({
      fromText: window.summaryLine(fromCfg),
      toText: window.summaryLine(toCfg),
      amountText:
        q.direction === "even" ? "Even swap"
        : (q.direction === "add" ? "Add " : "Get ") + formatNairaShort(q.low) + "–" + formatNairaShort(q.high),
      from: fromCfg, to: toCfg, ts: Date.now(),
    });
  }, [fromCfg, toCfg]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const onSave = () => flash("Quote saved to your history");
  const onShare = async () => {
    const q = window.quoteRange(fromCfg, toCfg);
    const text = `Swap: ${window.summaryLine(fromCfg)} → ${window.summaryLine(toCfg)}\n` +
      (q.direction === "even" ? "Even swap" :
       (q.direction === "add" ? "You add " : "You receive ") +
       formatNaira(q.low) + " – " + formatNaira(q.high));
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      flash("Quote copied to clipboard");
    } catch {
      flash("Couldn't copy — try Save instead");
    }
  };

  const reset = () => {
    setFromCfg(emptyCfg()); setToCfg(emptyCfg()); setToCfg2(emptyCfg()); setCompareMode(false);
  };

  const useFromHistory = (entry) => {
    setFromCfg({ ...entry.from }); setToCfg({ ...entry.to });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M5 8 L11 3 L17 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 14 L11 19 L5 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="brand-words">
            <div className="brand-name">Swap</div>
            <div className="brand-tag">iPhone trade-in estimator</div>
          </div>
        </div>
        <nav className="topnav">
          <a href="#estimator" className="topnav-link topnav-link-active">Estimator</a>
          <a href="#how" className="topnav-link">How it works</a>
          <a href="#faq" className="topnav-link">FAQ</a>
          <button className="btn-primary btn-sm" onClick={reset}>New quote</button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-eyebrow">Trade-in estimator</div>
        <h1 className="hero-title">
          Find out what your <em>iPhone</em> is worth<br/>
          for a swap, in seconds.
        </h1>
        <p className="hero-sub">
          Configure the phone you're swapping from and what you'd like to swap to.
          We'll show you a confidence-range price in Naira.
        </p>
      </section>

      <main id="estimator" className="estimator">
        <div className="grid">
          <div className="col">
            <Configurator
              cfg={fromCfg}
              setCfg={setFromCfg}
              allowDefects={true}
              defectsVariant={tweaks.defectsVariant}
              title="Swapping from"
            />
          </div>

          <div className="col">
            <div className="to-stack">
              <Configurator
                cfg={toCfg}
                setCfg={setToCfg}
                allowDefects={false}
                title={compareMode ? "Swap to · Option A" : "Swapping to"}
              />

              <div className="compare-row">
                <button
                  className={"compare-toggle " + (compareMode ? "compare-toggle-on" : "")}
                  onClick={() => setCompareMode(!compareMode)}
                >
                  <span className="compare-dot" />
                  {compareMode ? "Comparing two options" : "Compare two swap-to options"}
                </button>
              </div>

              {compareMode && (
                <Configurator
                  cfg={toCfg2}
                  setCfg={setToCfg2}
                  allowDefects={false}
                  title="Swap to · Option B"
                />
              )}
            </div>
          </div>
        </div>

        <div className="result-wrap">
          <ResultPanel
            fromCfg={fromCfg}
            toCfg={toCfg}
            toCfg2={toCfg2}
            compareMode={compareMode}
            onSave={onSave}
            onShare={onShare}
          />
        </div>

        <HistoryStrip items={history} onClear={clearHistory} onUse={useFromHistory} />
      </main>

      <footer className="foot">
        <div className="foot-inner">
          <div className="foot-brand">Swap</div>
          <div className="foot-cols">
            <div>Estimates only · Final price at inspection</div>
            <div>Lagos · Abuja · Port Harcourt</div>
          </div>
        </div>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Defects UI">
          <TweakRadio
            label="Variant"
            value={tweaks.defectsVariant}
            options={[
              { value: "checklist", label: "Checklist" },
              { value: "severity", label: "Severity" },
            ]}
            onChange={(v) => setTweak("defectsVariant", v)}
          />
        </TweakSection>
      </TweaksPanel>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
