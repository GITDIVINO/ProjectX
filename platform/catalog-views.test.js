'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),F=require('./ui-format'),Views=require('./catalog-views');

// The registers are the screens where a person's own text reaches markup: cargo names, port
// names, terminals, vessel names. These build the views the way app.js does.
function views(state){
 const get=path=>path.split('.').reduce((a,k)=>a[k],state);
 const input=(path,label,options={})=>
  `<input aria-label="${F.esc(label)}" data-path="${path}" value="${F.esc(get(path))}"${options.disabled?' disabled':''}>`;
 const select=(path,label,values)=>
  `<select aria-label="${F.esc(label)}" data-path="${path}">`+
  values.map(v=>{const [id,name]=Array.isArray(v)?v:[v,v];return `<option value="${F.esc(id)}">${F.esc(name)}</option>`;}).join('')+
  `</select>`;
 const field=(path,label,options)=>`<label class="field">${label}${input(path,label,options)}</label>`;
 const portNames=()=>[...new Set(state.portRecords.filter(p=>p.name.trim()).map(p=>p.name))].map(n=>[n,n]);
 return Views.create({M,getState:()=>state,esc:F.esc,fmt:F.fmt,input,select,field,table:F.table,portNames});
}

const INJECTION='<img src=x onerror=alert(1)>"\'';

test('A cargo name written by a person cannot become markup',()=>{
 const state=M.initial();
 const cargo=state.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
 cargo.name=INJECTION;
 cargo.family=INJECTION;
 const html=views(state).cargoView();
 assert.ok(!html.includes('<img src=x'),'the tag is not emitted');
 assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'),'it is shown as text');
 // The search key is written into an attribute, so the quotes must be escaped as well.
 assert.ok(!/data-catalog-name="[^"]*"[^>]*onerror/.test(html),'nothing escapes the attribute it sits in');
});

test('A port name written by a person cannot become markup',()=>{
 const state=M.initial();
 state.portRecords[0].name=INJECTION;
 const html=views(state).portView();
 assert.ok(!html.includes('<img src=x'));
 assert.ok(html.includes('&lt;img src=x'));
});

test('A vessel name written by a person cannot become markup',()=>{
 const state=M.initial();
 state.vesselProfiles[0].name=INJECTION;
 state.vesselProfiles[0].model=INJECTION;
 const html=views(state).vesselView();
 assert.ok(!html.includes('<img src=x'));
 assert.ok(html.includes('&lt;img src=x'));
});

test('Each register names itself and offers the one way to add a record',()=>{
 const state=M.initial();
 const v=views(state);
 for(const [markup,title,action] of [
  [v.saleView(),'SALES','new-sale'],
  [v.portView(),'PORTS','new-port'],
  [v.cargoView(),'CARGOES','new-cargo'],
  [v.vesselView(),'VESSELS','new-vessel']
 ]){
  assert.ok(markup.includes(`<h2>${title}</h2>`),title+' names itself');
  assert.equal((markup.match(new RegExp(`data-action="${action}"`,'g'))||[]).length,1,title+' offers exactly one add control');
 }
});

test('A register with no records says so instead of printing an empty table',()=>{
 const state=M.initial();
 state.sales=[];
 const html=views(state).saleView();
 assert.ok(html.includes('No sales yet'));
 assert.ok(!html.includes('<tbody></tbody>'),'no empty table is drawn');
});

test('CARGO offers only what can actually be planned',()=>{
 const state=M.initial();
 const plannable=state.cargoTypes.filter(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
 const html=views(state).cargoView();
 assert.equal((html.match(/data-catalog-name=/g)||[]).length,plannable.length,
  'a row per bulk cargo that carries a planning SF, and no others');
 assert.ok(plannable.length<state.cargoTypes.length,'the rest of the catalogue is kept, not shown');
});

test('The registers build markup and never reach for a document',()=>{
 const source=require('node:fs').readFileSync(__dirname+'/catalog-views.js','utf8');
 for(const forbidden of ['document.','innerHTML','getElementById'])
  assert.ok(!source.includes(forbidden),`catalog-views.js must not use ${forbidden}: the caller places the markup`);
});

test('A tab the registers do not own falls back to the vessel register',()=>{
 const state=M.initial();
 const v=views(state);
 assert.equal(v.render('sale'),v.saleView());
 assert.equal(v.render('vessel'),v.vesselView());
 assert.equal(v.render('anything-else'),v.vesselView());
});
