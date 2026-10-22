import test from 'node:test';
import assert from 'node:assert/strict';
import { journeys } from './sampleData.js';
import { calculateRecoveryOptions } from './recoveryEngine.js';

test('returns ranked options and computes scores', () => {
  const now = new Date('2027-01-01T08:00:00.000Z');
  const result = calculateRecoveryOptions({
    journey: journeys.find((item) => item.id === 'bengaluru-mysuru'),
    budget: 1000,
    arrivalDeadline: '2027-01-01T14:00:00.000Z',
    now
  });
  assert.equal(result.alternatives.length, 5);
  assert.ok(result.alternatives.every((option) => option.score >= 0 && option.score <= 100));
  assert.ok(result.alternatives[0].feasible);
  assert.ok(result.alternatives.some((option) => !option.connectionFeasible));
});

test('reports when no option meets all constraints', () => {
  const now = new Date('2027-01-01T08:00:00.000Z');
  const result = calculateRecoveryOptions({
    journey: journeys.find((item) => item.id === 'mangaluru-bengaluru'),
    budget: 1,
    arrivalDeadline: '2027-01-01T08:10:00.000Z',
    now
  });
  assert.equal(result.hasFeasibleOption, false);
  assert.ok(result.alternatives.length > 0);
});
