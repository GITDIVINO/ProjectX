const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=__dirname;
let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">',()=>'<style>'+fs.readFileSync(path.join(dir,'styles.css'),'utf8')+'</style>');
const FILES=['ui-format.js','arithmetic.js','cargo-catalog.js','model.js','market.js','guide.js','sea-data.js','sea-table.js','sea-route.js','planning.js','planner-ui.js','schema.js','storage-local.js','storage-supabase.js','storage.js','session.js','voyage-map.js','catalog-views.js','dialogs.js','sign-in.js','planner-view.js','register-view.js','forward.js','forward-view.js','app.js'];
for(const name of FILES){
 const source=fs.readFileSync(path.join(dir,name),'utf8');
 new vm.Script(source,{filename:name});
 html=html.replace(`<script src="${name}"></script>`,()=>'<script>'+source.replace(/<\/script/gi,'<\\/script')+'</script>');
}
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if(scripts.length!==FILES.length||html.includes('<script src='))throw Error('Incomplete offline build');
scripts.forEach((script,i)=>new vm.Script(script[1],{filename:'embedded-'+i}));
fs.writeFileSync(path.join(dir,'ProjectX.html'),html);
console.log('Built and syntax-checked offline ProjectX.html');
