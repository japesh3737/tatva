const sharp = require('sharp');
const fs = require('node:fs/promises');
(async () => {
 await fs.mkdir('public/room-stream-v2', {recursive:true});
 let before=0,after=0;
 for(let start=0;start<480;start+=4){
  const sizes=await Promise.all(Array.from({length:Math.min(4,480-start)},async(_,n)=>{
   const name=`frame_${String(start+n).padStart(4,'0')}.webp`;
   const original=await fs.stat('public/room-hd-frames/'+name);
   const result=await sharp('public/showcase-frames/'+name).sharpen({sigma:0.5,m1:0.3,m2:0.8}).webp({quality:78,effort:4}).toFile('public/room-stream-v2/'+name);
   return [original.size,result.size];
  }));
  for(const [a,b] of sizes){before+=a;after+=b;}
 }
 console.log(JSON.stringify({before,after,reduction:Math.round((1-after/before)*100)+'%'}));
})();
