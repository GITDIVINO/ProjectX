const fs=require('node:fs');
require('./platform/build.cjs');
fs.copyFileSync(__dirname+'/platform/ProjectX.html',__dirname+'/index.html');
console.log('Built GitHub Pages entry point');
