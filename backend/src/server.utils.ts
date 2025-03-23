import fs from 'fs';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { inspect } from 'util';

const sslKeyPath = path.resolve(__dirname, '../ssl.key');
const sslCertPath = path.resolve(__dirname, '../ssl.crt');

export const options = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath),
};

export const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  const { headers, method, url } = req;
  console.log(`\x1b[34mHTTPS Server Receive: \x1b[0m`, inspect({ method, url, headers }, false, null, true));

  let body = '';
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let statusCode = 200;

    try {
      body = JSON.parse(body);
    } catch {
      // ignore parse error
    }

    console.log(`\x1b[34mHTTPS BODY: \x1b[0m [`, body, `]`);

    if (url && url.includes('wukong')) {
      statusCode = 404;
    }

    res.writeHead(statusCode);
    res.end();
  });
};
