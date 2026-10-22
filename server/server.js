import express from 'express';
import cors from 'cors';
import { journeys, disruptions } from './sampleData.js';
import { calculateRecoveryOptions } from './recoveryEngine.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TripRescue AI API', sampleData: true });
});

app.get('/api/journeys', (_req, res) => {
  res.json({
    journeys: journeys.map(({ id, origin, destination, label, alternatives }) => ({
      id, origin, destination, label,
      alternativeCount: alternatives.length
    }))
  });
});

app.get('/api/disruptions', (_req, res) => {
  res.json({ disruptions });
});

app.post('/api/recover', (req, res) => {
  const { journeyId, disruption, budget, arrivalDeadline } = req.body ?? {};

  if (typeof journeyId !== 'string' || !journeyId.trim()) {
    return res.status(400).json({ error: 'Choose a journey before requesting recovery options.' });
  }
  const journey = journeys.find((item) => item.id === journeyId);
  if (!journey) {
    return res.status(400).json({ error: 'That journey was not found in the sample data. Choose one of the listed journeys.' });
  }
  if (typeof disruption !== 'string' || !disruptions.some((item) => item.id === disruption)) {
    return res.status(400).json({ error: 'Choose a valid disruption type.' });
  }
  const numericBudget = Number(budget);
  if (budget === undefined || budget === null || budget === '' || !Number.isFinite(numericBudget) || numericBudget < 0) {
    return res.status(400).json({ error: 'Budget must be a valid number of ₹0 or more.' });
  }
  if (typeof arrivalDeadline !== 'string' || !arrivalDeadline.trim() || Number.isNaN(Date.parse(arrivalDeadline))) {
    return res.status(400).json({ error: 'Provide a valid arrival deadline.' });
  }
  if (Date.parse(arrivalDeadline) <= Date.now()) {
    return res.status(400).json({ error: 'Arrival deadline must be in the future.' });
  }

  const recovery = calculateRecoveryOptions({
    journey,
    budget: numericBudget,
    arrivalDeadline,
    now: new Date()
  });

  return res.json({
    ...recovery,
    disruption,
    disruptionLabel: disruptions.find((item) => item.id === disruption).label,
    dataNotice: 'Illustrative sample data only. Not live schedules, confirmed fares, or booking availability.'
  });
});

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Request body must contain valid JSON.' });
  }
  console.error('Unexpected API error:', err);
  return res.status(500).json({ error: 'An unexpected server error occurred. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`TripRescue AI API listening at http://localhost:${PORT}`);
  console.log('Reminder: all journey data is illustrative sample data.');
});
