const net = require('net');

const client = net.connect(5432, 'localhost', () => {
  console.log('✅ Connected to PostgreSQL!');
  client.end();
});

client.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
});
