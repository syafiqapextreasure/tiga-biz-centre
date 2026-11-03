import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
import worker,{cleanPath} from '../src/worker.mjs';
const dist=path.resolve('dist'),port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
async function assetFetch(request){const u=new URL(request.url);let pathname;try{pathname=decodeURIComponent(u.pathname)}catch{return new Response('Bad request',{status:400})}let file=path.resolve(dist,'.'+pathname);if(!file.startsWith(dist+path.sep)&&file!==dist)return new Response('Forbidden',{status:403});try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');const body=await readFile(file);return new Response(body,{headers:{'content-type':types[path.extname(file)]||'application/octet-stream'}})}catch{const body=await readFile(path.join(dist,'404.html'));return new Response(body,{status:404,headers:{'content-type':'text/html; charset=utf-8'}})}}
const server=http.createServer(async(req,res)=>{try{const request=new Request(`http://127.0.0.1:${port}${req.url}`,{method:req.method});const result=await worker.fetch(request,{ASSETS:{fetch:assetFetch},SITE_URL:process.env.SITE_URL});res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));}catch(e){res.writeHead(500);res.end('Preview error');console.error(e)}});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
