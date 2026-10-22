const SCORE_WEIGHTS = {
  cost: 35,
  duration: 30,
  deadline: 25,
  connection: 10
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function scoreAlternative(alternative, budget, deadlineMs, nowMs) {
  const costScore = budget === 0
    ? (alternative.cost === 0 ? SCORE_WEIGHTS.cost : 0)
    : alternative.cost <= budget
      ? SCORE_WEIGHTS.cost * clamp(1 - (alternative.cost / budget) * 0.55, 0.45, 1)
      : 0;

  // A shorter sample duration earns more points. 12 hours is the scoring ceiling.
  const durationScore = SCORE_WEIGHTS.duration *
    (1 - clamp(alternative.durationMinutes / 720, 0, 1));

  const arrivalMs = nowMs + alternative.arrivalOffsetMinutes * 60_000;
  const meetsDeadline = arrivalMs <= deadlineMs;
  const deadlineScore = meetsDeadline ? SCORE_WEIGHTS.deadline : 0;
  const connectionScore = alternative.connectionFeasible ? SCORE_WEIGHTS.connection : 0;
  const score = Math.round(clamp(costScore + durationScore + deadlineScore + connectionScore, 0, 100));

  const withinBudget = alternative.cost <= budget;
  const feasible = withinBudget && meetsDeadline && alternative.connectionFeasible;
  const reasons = [];

  reasons.push(withinBudget
    ? `Meets your budget of ₹${Math.round(budget).toLocaleString('en-IN')}.`
    : `Estimated cost ₹${Math.round(alternative.cost).toLocaleString('en-IN')} is over your budget of ₹${Math.round(budget).toLocaleString('en-IN')}.`);
  reasons.push(meetsDeadline
    ? 'Meets your arrival deadline (sample estimate).'
    : 'Estimated arrival is after your required deadline.');
  reasons.push(alternative.connectionFeasible
    ? 'Connection is feasible in the sample plan.'
    : 'Connection is marked too tight in the sample plan.');
  reasons.push(alternative.notes);

  return {
    ...alternative,
    arrivalTime: new Date(arrivalMs).toISOString(),
    score,
    withinBudget,
    meetsDeadline,
    connectionFeasible: Boolean(alternative.connectionFeasible),
    feasible,
    reasons
  };
}

/**
 * Rank illustrative alternatives against a user's budget and arrival deadline.
 * The score weights are explicit and intentionally easy to explain in a demo.
 */
export function calculateRecoveryOptions({ journey, budget, arrivalDeadline, now = new Date() }) {
  const nowMs = now.getTime();
  const deadlineMs = new Date(arrivalDeadline).getTime();
  const scored = journey.alternatives.map((alternative) =>
    scoreAlternative(alternative, budget, deadlineMs, nowMs)
  );

  scored.sort((a, b) => {
    if (a.feasible !== b.feasible) return a.feasible ? -1 : 1;
    if (a.score !== b.score) return b.score - a.score;
    return a.cost - b.cost;
  });

  const hasFeasibleOption = scored.some((option) => option.feasible);
  const summary = hasFeasibleOption
    ? 'At least one sample option fits your budget, arrival deadline, and connection requirements. Confirm real schedules and fares before travelling.'
    : 'None of the sample options fits your budget, arrival deadline, and connection requirements at the same time. Review each reason, or change your budget/deadline and try again.';

  return {
    journey: { id: journey.id, origin: journey.origin, destination: journey.destination, label: journey.label },
    hasFeasibleOption,
    summary,
    scoring: {
      weights: SCORE_WEIGHTS,
      explanation: 'Score = cost (0–35) + duration (0–30) + deadline (0 or 25) + connection (0 or 10). Feasible options are ranked first, then by score, then lower cost.'
    },
    alternatives: scored
  };
}

export { SCORE_WEIGHTS };
