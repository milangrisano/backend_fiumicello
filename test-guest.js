const http = require('http');

// 1. Log in as Guest
const reqLogin = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    const token = json.access_token;
    
    // 2. Try to access /api/users
    const reqUsers = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/users',
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    }, (res2) => {
        console.log(`GUEST ACCESS STATUS: ${res2.statusCode}`);
    });
    reqUsers.end();
  });
});

reqLogin.write(JSON.stringify({
  email: 'user@test.com', // Este es un Guest en el seed
  password: 'password123'
}));
reqLogin.end();
