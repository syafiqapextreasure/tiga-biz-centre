export function canonicalOrigin(request,env={}){const origin=env.SITE_URL||new URL(request.url).origin;const u=new URL(origin);if(!['https:','http:'].includes(u.protocol))throw new Error('SITE_URL must use HTTP or HTTPS');return u.origin;}
export function cleanPath(pathname){if(pathname==='/index.html')return '/';if(pathname.endsWith('/index.html'))return pathname.slice(0,-11)||'/';if(pathname.endsWith('.html'))return pathname.slice(0,-5)||'/';if(pathname.length>1&&pathname.endsWith('/'))return pathname.slice(0,-1);return pathname;}
export default {async fetch(request,env){
 const url=new URL(request.url),clean=cleanPath(url.pathname);
 if(clean!==url.pathname){url.pathname=clean;return Response.redirect(url.toString(),301);}
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
 const response=await env.ASSETS.fetch(request);
 const type=response.headers.get('content-type')||'';
 if(!type.includes('text/html')&&!['/sitemap.xml','/robots.txt'].includes(url.pathname))return response;
 const origin=canonicalOrigin(request,env),headers=new Headers(response.headers);
 headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','strict-origin-when-cross-origin');headers.set('X-Frame-Options','DENY');headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
 headers.set('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; form-action https://wa.me; base-uri 'self'; frame-ancestors 'none'; object-src 'none'");
 headers.delete('content-length');headers.delete('etag');headers.set('Cache-Control','public, max-age=0, must-revalidate');
 if(request.method==='HEAD')return new Response(null,{status:response.status,headers});
 const body=(await response.text()).replaceAll('__SITE_ORIGIN__',origin);
 return new Response(body,{status:response.status,headers});
}};
