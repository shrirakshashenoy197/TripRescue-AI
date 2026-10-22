export const disruptions = [
  { id: 'delay', label: 'Delay' },
  { id: 'cancellation', label: 'Cancellation' },
  { id: 'missed-connection', label: 'Missed connection' },
  { id: 'route-unavailable', label: 'Route unavailable' }
];

// All values below are illustrative and are not live transport information.
export const journeys = [
  {
    id: 'mangaluru-bengaluru',
    origin: 'Mangaluru',
    destination: 'Bengaluru',
    label: 'Mangaluru → Bengaluru',
    alternatives: [
      { id: 'mb-bus-express', name: 'Express bus', mode: 'Bus', cost: 850, durationMinutes: 390, arrivalOffsetMinutes: 390, connectionFeasible: true, notes: 'Direct sample service; no transfer needed.' },
      { id: 'mb-train-connect', name: 'Train with one transfer', mode: 'Train', cost: 620, durationMinutes: 510, arrivalOffsetMinutes: 510, connectionFeasible: true, notes: 'Sample transfer buffer is included in the duration.' },
      { id: 'mb-car-share', name: 'Shared car', mode: 'Car share', cost: 1450, durationMinutes: 360, arrivalOffsetMinutes: 360, connectionFeasible: true, notes: 'Illustrative road journey; real traffic is not checked.' },
      { id: 'mb-budget-bus', name: 'Budget overnight bus', mode: 'Bus', cost: 550, durationMinutes: 570, arrivalOffsetMinutes: 570, connectionFeasible: true, notes: 'Lower sample cost, with a longer estimated journey.' },
      { id: 'mb-tight-transfer', name: 'Train with tight transfer', mode: 'Train', cost: 700, durationMinutes: 420, arrivalOffsetMinutes: 420, connectionFeasible: false, notes: 'Sample connection buffer is too short to mark as feasible.' }
    ]
  },
  {
    id: 'bengaluru-mysuru',
    origin: 'Bengaluru',
    destination: 'Mysuru',
    label: 'Bengaluru → Mysuru',
    alternatives: [
      { id: 'bm-express-bus', name: 'Express bus', mode: 'Bus', cost: 300, durationMinutes: 180, arrivalOffsetMinutes: 180, connectionFeasible: true, notes: 'Illustrative direct service.' },
      { id: 'bm-train', name: 'Direct train', mode: 'Train', cost: 220, durationMinutes: 165, arrivalOffsetMinutes: 165, connectionFeasible: true, notes: 'Illustrative direct service.' },
      { id: 'bm-car-share', name: 'Shared car', mode: 'Car share', cost: 700, durationMinutes: 150, arrivalOffsetMinutes: 150, connectionFeasible: true, notes: 'Real road conditions are not checked.' },
      { id: 'bm-budget-bus', name: 'Budget bus', mode: 'Bus', cost: 180, durationMinutes: 225, arrivalOffsetMinutes: 225, connectionFeasible: true, notes: 'Lower sample fare with a longer estimated duration.' },
      { id: 'bm-tight-transfer', name: 'Train with tight transfer', mode: 'Train', cost: 190, durationMinutes: 140, arrivalOffsetMinutes: 140, connectionFeasible: false, notes: 'Sample connection buffer is too short to mark as feasible.' }
    ]
  },
  {
    id: 'mangaluru-udupi',
    origin: 'Mangaluru',
    destination: 'Udupi',
    label: 'Mangaluru → Udupi',
    alternatives: [
      { id: 'mu-express-bus', name: 'Express bus', mode: 'Bus', cost: 160, durationMinutes: 75, arrivalOffsetMinutes: 75, connectionFeasible: true, notes: 'Illustrative direct service.' },
      { id: 'mu-local-bus', name: 'Local bus', mode: 'Bus', cost: 90, durationMinutes: 105, arrivalOffsetMinutes: 105, connectionFeasible: true, notes: 'Lower sample fare with a longer estimated duration.' },
      { id: 'mu-car-share', name: 'Shared car', mode: 'Car share', cost: 450, durationMinutes: 65, arrivalOffsetMinutes: 65, connectionFeasible: true, notes: 'Real road conditions are not checked.' },
      { id: 'mu-train', name: 'Train', mode: 'Train', cost: 130, durationMinutes: 95, arrivalOffsetMinutes: 95, connectionFeasible: true, notes: 'Illustrative service duration.' },
      { id: 'mu-tight-transfer', name: 'Train with tight transfer', mode: 'Train', cost: 110, durationMinutes: 70, arrivalOffsetMinutes: 70, connectionFeasible: false, notes: 'Sample connection buffer is too short to mark as feasible.' }
    ]
  }
];
