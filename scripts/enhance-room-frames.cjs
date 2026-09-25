const sharp = require('sharp');
const fs = require('node:fs/promises');
(async () => {
 await fs.mkdir('public/room-hd-frames', {recursive:true});
 for(let start=0; start<480; start+=4) {
  await Promise.all(Array.from({length:Math.min(4,480-start)}, (_,n) => {
   const name=`frame_${String(start+n).padStart(4,'0')}.webp`;
   return sharp('public/showcase-frames/'+name)
    .sharpen({sigma:0.7,m1:0.5,m2:1.5})
    .webp({quality:92,effort:4}).toFile('public/room-hd-frames/'+name);
  }));
  if(start%120===0) console.log('Enhanced', start, '/ 480');
 }
 console.log('All 480 original full-HD frames preserved and enhanced.');
})();
