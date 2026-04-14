const http = require('http');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQHRlc3QuY29tIiwic3ViIjoiZmNlMzk1M2EtMWJhYS00N2JlLWFkYWEtYTgyNTU2ZTJiMzgwIiwicm9sZSI6IkFkbWluIiwicGVybWlzc2lvbnMiOlsidXRpbGl0aWVzOmFjY2VzcyIsInV0aWxpdGllczpyb2xlcyIsInV0aWxpdGllczp1c2VycyIsInV0aWxpdGllczpwcm9kdWN0cyIsInV0aWxpdGllczpwYXltZW50X21ldGhvZHMiLCJ1dGlsaXRpZXM6Y2F0ZWdvcmllcyIsInV0aWxpdGllczpyZXN0YXVyYW50cyIsInV0aWxpdGllczp0ZXJtaW5hbHMiLCJ0YWJsZXM6bWFuYWdlIiwic2FsZXM6dmlld19oaXN0b3J5Iiwia2l0Y2hlbjp2aWV3Iiwia2l0Y2hlbjplZGl0Iiwic2FsZXM6bWFuYWdlIl0sImRlZmF1bHRSb3V0ZSI6Ii91dGlsaXRpZXMiLCJpYXQiOjE3NzYxNzg3MTksImV4cCI6MTc3NjE4MjMxOX0.nryKuiKxmzZ8ShOlWD0c7jVaBinnF6SoEo7B4onP9so";

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users', // admin@test.com tiene el permiso utilities:users, debería dar 200
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`STATUS PROTECTED: ${res.statusCode}`);
  });
});
req.end();
