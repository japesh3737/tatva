// Prepare lightweight frames once; the browser no longer seeks videos on scroll.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const sharp = require('sharp');
const fs = require('node:fs/promises');
(async () => {
 await fs.mkdir('public/entrance-frames', {recursive:true});
 await fs.mkdir('public/tour-frames', {recursive:true});
 const browser = await chromium.launch({headless:true,channel:'msedge'});
 try {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.setContent('<body style="margin:0"></body>');
  await page.evaluate(async () => {
   const video = document.createElement('video');video.muted=true;
   document.body.append(video);
   await new Promise((resolve,reject)=>{video.requestVideoFrameCallback(resolve);video.onerror=reject;video.src='/entrance-reference.mp4';});
   window.frameVideo=video;
  });
  for(let i=0;i<241;i++) {
   const data = await page.evaluate(async i => {
    const v=window.frameVideo;
    const time=Math.min((i+0.5)/30,v.duration-.02);
    if(Math.abs(v.currentTime-time)>=.001){await new Promise(r=>{v.requestVideoFrameCallback(r);v.currentTime=time;});}
    const c=document.createElement('canvas');c.width=1280;c.height=720;
    const ctx=c.getContext('2d');ctx.drawImage(v,0,0,1280,720);
    const im=ctx.getImageData(0,0,1280,720),d=im.data;
    for(let j=0;j<d.length;j+=4){const max=Math.max(d[j],d[j+2]);const excess=(d[j+1]-max)/255;const t=Math.max(0,Math.min(1,(excess-.08)/.24));d[j+3]=Math.round(255*(1-t*t*(3-2*t)));d[j+1]=Math.min(d[j+1],max+9);}
    ctx.putImageData(im,0,0);return c.toDataURL('image/png').split(',')[1];
   },i);
   await sharp(Buffer.from(data,'base64')).webp({quality:82,alphaQuality:95}).toFile(`public/entrance-frames/frame_${String(i).padStart(4,'0')}.webp`);
   if(i===0) await sharp(Buffer.from(data,'base64')).webp({quality:90}).toFile('public/entrance-poster.webp');
   if(i%60===0)console.log('Door frames',i);
  }
 } finally {await browser.close();}
 for(let start=0;start<480;start+=4){await Promise.all(Array.from({length:Math.min(4,480-start)},(_,n)=>{const f=`frame_${String(start+n).padStart(4,'0')}.webp`;return sharp('public/showcase-frames/'+f).resize(1280).webp({quality:80}).toFile('public/tour-frames/'+f);}));if(start%120===0)console.log('Room frames',start);}
 console.log('Prepared 241 door frames and 480 room frames.');
})();


