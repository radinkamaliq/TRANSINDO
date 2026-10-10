// Test via the proxy at port 5173 (like the frontend would)
const today = new Date();
const dateStr = today.toISOString().split('T')[0];

const payload = {
  originStationId: '2',
  destinationStationId: '1',
  targetTime: '08:00',
  mode: 'arrive_by',
  date: dateStr,
  preference: 'fastest',
};

// Test 1: Direct to backend
console.log('=== TEST 1: Direct to backend (port 5000) ===');
fetch('http://localhost:5000/api/journey/plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
  .then(async res => {
    const text = await res.text();
    console.log('Status:', res.status);
    try {
      const data = JSON.parse(text);
      console.log('Routes:', data.routes?.length || 0);
      console.log('First route type:', data.routes?.[0]?.type);
      console.log('SUCCESS: Backend returns valid JSON\n');
    } catch (e) {
      console.log('ERROR: Non-JSON response:', text.slice(0, 200));
    }
  })
  .catch(e => console.error('FETCH ERROR:', e.message));

// Test 2: Via Vite proxy (port 5173) 
console.log('\n=== TEST 2: Via proxy (port 5173) ===');
fetch('http://localhost:5173/api/journey/plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
  .then(async res => {
    const text = await res.text();
    console.log('Status:', res.status);
    try {
      const data = JSON.parse(text);
      console.log('Routes:', data.routes?.length || 0);
      console.log('SUCCESS: Proxy returns valid JSON\n');
    } catch (e) {
      console.log('ERROR: Non-JSON response:', text.slice(0, 300));
    }
  })
  .catch(e => console.error('FETCH ERROR (proxy):', e.message));

// Test 3: Validation test (invalid input)
console.log('\n=== TEST 3: Validation (same origin/dest) ===');
fetch('http://localhost:5000/api/journey/plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...payload, destinationStationId: '2' }),
})
  .then(async res => {
    const text = await res.text();
    console.log('Status:', res.status, '(expected 400)');
    try {
      const data = JSON.parse(text);
      console.log('Error:', data.error);
      console.log('Details:', data.details);
    } catch (e) {
      console.log('Non-JSON:', text.slice(0, 200));
    }
  })
  .catch(e => console.error('FETCH ERROR:', e.message));

// Test 4: Empty body
console.log('\n=== TEST 4: Empty body ===');
fetch('http://localhost:5000/api/journey/plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({}),
})
  .then(async res => {
    const text = await res.text();
    console.log('Status:', res.status, '(expected 400)');
    try {
      const data = JSON.parse(text);
      console.log('Error:', data.error);
    } catch (e) {
      console.log('Non-JSON:', text.slice(0, 200));
    }
  })
  .catch(e => console.error('FETCH ERROR:', e.message));
