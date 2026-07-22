const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/products' && req.method === 'GET') {
    const productName = 'APPLE MACBOOK PRO';
    res.end(productName);
  } else if (req.url === '/users' && req.method === 'GET') {
    const userName = 'ROHAN';
    res.end(userName);
  } else {
    res.end('<h1 style="color:red">404 NOT FOUND</h1>');
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`server is connected on PORT ${PORT}`);
});

//NOTE  localhost:5173
//NOTE  localhost:3000
