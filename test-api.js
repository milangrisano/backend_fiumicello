const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login', // Ajustar si el prefix de la api es diferente
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    try {
        console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch(e) {
        console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.log("Probando puerto sin /api prefix...");
});

req.write(JSON.stringify({
  email: 'admin@test.com',
  password: 'password123'
}));
req.end();
