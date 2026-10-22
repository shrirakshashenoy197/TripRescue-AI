import { useEffect, useMemo, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const defaultDeadline = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(20, 0, 0, 0);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const disruptionCopy = {
  delay: 'Your original service is running late.',
  cancellation: 'Your original service is no longer operating.',
  'missed-connection': 'You may not reach the next leg in time.',
  'route-unavailable': 'Your planned route cannot currently be used.'
};

function formatMoney(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(value);
}
function formatArrival(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit'
  });
}
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
}

export default function App() {
  const [journeys, setJourneys] = useState([]);
  const [disruptions, setDisruptions] = useState([]);
  const [journeyId, setJourneyId] = useState('');
  const [disruption, setDisruption] = useState('delay');
  const [budget, setBudget] = useState('1500');
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const [journeyRes, disruptionRes, healthRes] = await Promise.all([
          fetch(`${API_BASE}/api/journeys`),
          fetch(`${API_BASE}/api/disruptions`),
          fetch(`${API_BASE}/api/health`)
        ]);
        if (!journeyRes.ok || !disruptionRes.ok || !healthRes.ok) {
          throw new Error('The local service returned an error. Check that the backend is running.');
        }
        const journeyData = await journeyRes.json();
        const disruptionData = await disruptionRes.json();
        if (!active) return;
        setJourneys(journeyData.journeys || []);
        setJourneyId(journeyData.journeys?.[0]?.id || '');
        setDisruptions(disruptionData.disruptions || []);
        setApiOnline(true);
      } catch (e) {
        if (active) {
          setError(`${e.message} Start the backend in the server folder, then refresh this page.`);
          setApiOnline(false);
        }
      } finally {
        if (active) setInitialLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, []);

  const selectedJourney = useMemo(
    () => journeys.find((journey) => journey.id === journeyId),
    [journeys, journeyId]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResults(null);

    const numericBudget = Number(budget);
    if (!journeyId) {
      setError('Please choose a journey.');
      return;
    }
    if (budget.trim() === '' || !Number.isFinite(numericBudget) || numericBudget < 0) {
      setError('Enter a valid budget of ₹0 or more.');
      return;
    }
    if (!deadline || Number.isNaN(new Date(deadline).getTime())) {
      setError('Choose a valid arrival deadline.');
      return;
    }
    if (new Date(deadline).getTime() <= Date.now()) {
      setError('The arrival deadline must be in the future. Choose a later date and time.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyId,
          disruption,
          budget: numericBudget,
          arrivalDeadline: new Date(deadline).toISOString()
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not calculate recovery options.');
      setResults(data);
    } catch (e) {
      setError(`${e.message} Make sure the backend is running.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="TripRescue AI home">
          <span className="brand-mark">TR<span>↗</span></span>
          <span className="brand-name">TripRescue <b>AI</b></span>
        </a>
        <div className="topbar-right">
          <span className={`status-pill ${apiOnline ? 'online' : 'offline'}`}>
            <span className="status-dot" /> {initialLoading ? 'Connecting…' : apiOnline ? 'Prototype online' : 'Backend offline'}
          </span>
          <span className="demo-label">SAMPLE DATA</span>
        </div>
      </header>

      <main className="page-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> JOURNEY RECOVERY ASSISTANT</div>
            <h1>When plans change,<br /><span>find your next move.</span></h1>
            <p>Compare alternative travel plans after a disruption. Balance cost, time, and your arrival deadline—all in one place.</p>
            <div className="hero-trust">
              <span><i className="check-icon">✓</i> Transparent scoring</span>
              <span><i className="check-icon">✓</i> No paid API required</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="visual-center"><span>✈</span></div>
            <div className="float-card float-card-top"><span className="mini-icon teal">↗</span><div><b>New route</b><small>Options compared</small></div></div>
            <div className="float-card float-card-bottom"><span className="mini-icon lime">✓</span><div><b>Plan ahead</b><small>Know the trade-offs</small></div></div>
            <span className="visual-spark spark-one">✦</span><span className="visual-spark spark-two">✧</span>
          </div>
        </section>

        <section className="notice" role="note">
          <span className="notice-icon">i</span>
          <div><b>Prototype using illustrative sample data</b><p>Not live schedules, verified fares, traffic, ticket availability, or booking. Confirm all real travel details with transport providers.</p></div>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div><span className="section-kicker">01 / YOUR JOURNEY</span><h2>Let's get you moving again</h2></div>
            <span className="step-badge">Recovery planner <span>↗</span></span>
          </div>

          <div className="planner-grid">
            <form className="planner-card" onSubmit={handleSubmit}>
              <div className="card-title-row"><div className="card-icon">⌁</div><div><h3>Trip details</h3><p>Tell us what changed.</p></div></div>
              <label htmlFor="journey">Journey</label>
              <div className="select-wrap"><select id="journey" value={journeyId} onChange={(e) => { setJourneyId(e.target.value); setResults(null); }} disabled={initialLoading || journeys.length === 0}>
                {journeys.map((journey) => <option key={journey.id} value={journey.id}>{journey.origin} → {journey.destination}</option>)}
              </select><span>⌄</span></div>
              {selectedJourney && <div className="route-summary"><span className="route-pin">●</span><span>{selectedJourney.origin}</span><span className="route-dash" /><span className="route-pin destination">●</span><span>{selectedJourney.destination}</span></div>}

              <label htmlFor="disruption">What happened?</label>
              <div className="select-wrap"><select id="disruption" value={disruption} onChange={(e) => setDisruption(e.target.value)}>
                {disruptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select><span>⌄</span></div>
              <div className="disruption-hint"><span className="hint-icon">!</span>{disruptionCopy[disruption] || 'Choose the disruption that best describes your situation.'}</div>

              <div className="form-two-col">
                <div><label htmlFor="budget">Your budget (₹)</label><div className="input-with-prefix"><span>₹</span><input id="budget" type="number" min="0" step="1" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="1500" /></div></div>
                <div><label htmlFor="deadline">Arrive by</label><input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></div>
              </div>
              <button className="primary-button" type="submit" disabled={loading || initialLoading || !apiOnline}>
                {loading ? <><span className="spinner" /> Comparing options…</> : <>Find recovery options <span>→</span></>}
              </button>
              <p className="form-footnote"><span>✦</span> Results are calculated by the local sample-data recovery engine.</p>
            </form>

            <aside className="side-card">
              <div className="side-card-top"><div className="side-icon">◎</div><span className="side-tag">HOW IT WORKS</span></div>
              <h3>A clearer way<br />to reroute.</h3>
              <p>We compare sample alternatives against the things that matter to you—not just the fastest route.</p>
              <div className="factor-list">
                <div><span className="factor-icon cost-icon">₹</span><span><b>Within your budget</b><small>See the estimated cost upfront</small></span></div>
                <div><span className="factor-icon time-icon">◷</span><span><b>Arrival deadline</b><small>Know which options arrive in time</small></span></div>
                <div><span className="factor-icon route-icon">↗</span><span><b>Journey feasibility</b><small>Understand connection trade-offs</small></span></div>
              </div>
              <div className="score-note"><span>✦</span><p><b>One score, clear reasons.</b><br />Every result includes a calculated score and an explanation of its constraints.</p></div>
            </aside>
          </div>

          {error && <div className="error-banner" role="alert"><span>!</span><div><b>Something needs attention</b><p>{error}</p></div></div>}

          {results && <section className="results-section" aria-live="polite">
            <div className="results-heading"><div><span className="section-kicker">02 / YOUR OPTIONS</span><h2>Recovery options</h2><p>{results.journey?.origin} → {results.journey?.destination} · {results.disruptionLabel}</p></div><div className="results-count"><b>{results.alternatives.length}</b><span>sample options</span></div></div>
            <div className={`result-summary ${results.hasFeasibleOption ? 'summary-good' : 'summary-caution'}`}>
              <span className="summary-symbol">{results.hasFeasibleOption ? '✓' : '!'}</span>
              <div><b>{results.hasFeasibleOption ? 'We found options that meet your constraints.' : 'No option meets every constraint.'}</b><p>{results.summary}</p></div>
            </div>
            <div className="score-legend"><span><i className="legend-dot feasible-dot" /> Meets budget, deadline & connection requirements</span><span><i className="legend-dot" /> Has one or more constraints</span></div>
            {results.alternatives.length === 0 ? <div className="empty-state"><span>⌁</span><h3>No sample alternatives available</h3><p>Try another journey or check the sample journey data.</p></div> :
              <div className="alternatives-list">{results.alternatives.map((option, index) => <article className={`alternative-card ${option.feasible ? 'is-feasible' : ''}`} key={option.id}>
                <div className="option-rank">{String(index + 1).padStart(2, '0')}</div>
                <div className="option-main">
                  <div className="option-topline"><span className="mode-chip">{option.mode}</span>{index === 0 && option.feasible && <span className="best-chip">BEST MATCH</span>}{!option.feasible && <span className="constraint-chip">CHECK CONSTRAINTS</span>}</div>
                  <h3>{option.name}</h3>
                  <div className="option-route"><span>{option.origin}</span><span className="route-dash" /><span>{option.destination}</span></div>
                  <div className="option-metrics">
                    <div><small>EST. COST</small><b>{formatMoney(option.cost)}</b></div>
                    <div><small>JOURNEY TIME</small><b>{formatDuration(option.durationMinutes)}</b></div>
                    <div><small>EST. ARRIVAL</small><b>{formatArrival(option.arrivalTime)}</b></div>
                  </div>
                  <div className="reason-list">{option.reasons.map((reason, i) => <span className={reason.startsWith('Meets') || reason.startsWith('Connection is feasible') ? 'reason-positive' : 'reason-neutral'} key={i}><span>{reason.startsWith('Meets') || reason.startsWith('Connection is feasible') ? '✓' : '•'}</span>{reason}</span>)}</div>
                </div>
                <div className="score-panel"><div className="score-ring" style={{ '--score': `${option.score}%` }}><div><b>{option.score}</b><small>/100</small></div></div><span>SUITABILITY</span><em className={option.feasible ? 'feasibility-good' : 'feasibility-bad'}>{option.feasible ? 'Feasible' : 'Not fully feasible'}</em></div>
              </article>)}</div>}
            <p className="results-disclaimer">Illustrative results only. The suitability score is a comparison aid, not a guarantee or a real-world travel recommendation.</p>
          </section>}

          {!results && <section className="empty-prompt"><div className="empty-prompt-icon">↗</div><div><b>Your alternatives will appear here</b><p>Enter your trip details and select <strong>Find recovery options</strong> to compare the sample routes.</p></div><div className="empty-prompt-decoration">TR<span>↗</span></div></section>}
        </section>
      </main>
      <footer className="footer"><a className="footer-brand" href="#">TripRescue <b>AI</b></a><span>Built by CodeOrbit · DevHack prototype</span><span className="footer-disclaimer">Sample data only · Not for live travel decisions</span></footer>
    </div>
  );
}
