const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=__dirname;
let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">',()=>'<style>'+fs.readFileSync(path.join(dir,'styles.css'),'utf8')+'</style>');
for(const name of ['arithmetic.js','cargo-catalog.js','model.js','app.js']){
 const source=fs.readFileSync(path.join(dir,name),'utf8');
 new vm.Script(source,{filename:name});
 html=html.replace(`<script src="${name}"></script>`,()=>'<script>'+source.replace(/<\/script/gi,'<\\/script')+'</script>');
}
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if(scripts.length!==4||html.includes('<script src='))throw Error('Incomplete offline build');
scripts.forEach((script,i)=>new vm.Script(script[1],{filename:'embedded-'+i}));
fs.writeFileSync(path.join(dir,'ProjectX.html'),html);
console.log('Built and syntax-checked offline ProjectX.html');
