'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('./model'),P=require('./planning'),Sea=require('./sea-route'),F=require('./ui-format');
const Forward=require('./forward'),View=require('./forward-view');

// The screen as app.js builds it: the same helpers, and nothing standing in for the document.
function screen(state){
 const get=path=>path.split('.').reduce((a,k)=>a?.[k],state);
 const input=(path,label,options={})=>
  `<input aria-label="${F.esc(label)}" data-path="${path}" value="${F.esc(options.tonnage?F.fmt(get(path),1):get(path))}">`;
 const select=(path,label,values)=>
  `<select aria-label="${F.esc(label)}" data-path="${path}">`+
  values.map(v=>{const [id,name]=Array.isArray(v)?v:[v,v];
   return `<option value="${F.esc(id)}"${String(get(path)??'')===String(id)?' selected':''}>${F.esc(name)}</option>`;}).join('')+
  `</select>`;
 const forward=Forward.create({M,Sea,getState:()=>state});
 const view=View.create({M,esc:F.esc,fmt:F.fmt,input,select,table:F.table});
 return {forward,view,html:()=>view.markup(forward.prepare())};
}

function desk({basis='CFR',assessments=null}={}){
 const s=M.demo();P.ensure(s);
 s.hire=13500;s.prices={main:520,eca:760,aux:760};
 const cargo=s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
 s.forward={origin:'Ust-Luga',quantity:30000,cargoId:cargo.id,ports:[
  {name:'Ust-Luga',rate:8000,da:60000},
  {name:'Santos',rate:6000,da:85000},
  {name:'Paranaguá',rate:6000,da:80000}
 ]};
 s.priceAssessments=assessments??[
  {id:'PA-1',cargoId:cargo.id,cargoName:cargo.name,destination:'Santos',month:'2026-10',basis,value:445,source:'Profercy',date:'2026-09-11'},
  {id:'PA-2',cargoId:cargo.id,cargoName:cargo.name,destination:'Paranaguá',month:'2026-10',basis,value:448,source:'Profercy',date:'2026-09-11'},
  {id:'PA-3',cargoId:cargo.id,cargoName:cargo.name,destination:'Santos',month:'2026-11',basis,value:452,source:'ICIS',date:'2026-09-12'}
 ];
 return {s,cargo,...screen(s)};
}

test('The matrix names its months and its destinations',()=>{
 const html=desk().html();
 assert.ok(html.includes('<h2>FORWARD</h2>'));
 assert.ok(html.includes('Oct 2026')&&html.includes('Nov 2026'),'months are named, not printed as 2026-10');
 assert.ok(html.includes('>Santos<')&&html.includes('>Paranaguá<'));
 assert.ok(html.includes('Distance, nm')&&html.includes('Cost, USD/MT'));
});

test('The best figure in a month is marked, and only in months that have one',()=>{
 const {html}=desk();
 const markup=html();
 // Paranaguá leaves more in October although it costs more to reach; November has only one
 // figure, and the single figure there is the best of what is entered.
 const cells=[...markup.matchAll(/<td class="forward-cell( forward-cell--best)?"[^>]*>([\d.]+)</g)]
  .map(m=>({best:!!m[1],value:Number(m[2])}));
 assert.equal(cells.filter(c=>c.best).length,1,
  'October has two figures and a leader; November holds one and is not a comparison');
 const october=cells.filter(c=>Math.abs(c.value-420.88)<1||Math.abs(c.value-418.02)<1);
 assert.equal(october.filter(c=>c.best).length,1);
 assert.ok(october.find(c=>c.best).value>october.find(c=>!c.best).value);
});

test('A cell with no assessment names what is missing rather than showing a figure',()=>{
 const {html}=desk();
 const markup=html();
 assert.ok(markup.includes('[assessment]'),'Paranaguá has no November figure and says so');
 assert.equal((markup.match(/\[assessment\]/g)||[]).length,1);
});

test('Every margin carries the publication it came from',()=>{
 const markup=desk().html();
 assert.ok(markup.includes('title="445.00 CFR · Profercy · 11 Sept 2026"'));
 assert.ok(markup.includes('title="452.00 CFR · ICIS · 12 Sept 2026"'));
});

test('The cost every cell rests on is named on the screen, not in a footnote',()=>{
 const markup=desk().html();
 assert.ok(markup.includes('TBN 34K'),'the vessel');
 assert.ok(markup.includes('hire 13,500 USD/day'));
 assert.ok(markup.includes('main fuel 520'));
 assert.ok(markup.includes('does not carry a month-by-month freight curve'),
  'and what it deliberately does not do');
});

test('The assumptions are on the same screen as what they produce',()=>{
 const markup=desk().html();
 assert.ok(markup.includes('Handling rate, t/day')&&markup.includes('DA, USD'),
  'headed the way PLANNER heads the same two figures');
 assert.ok(markup.includes('data-path="forward.ports.0.rate"'));
 assert.ok(markup.includes('data-path="forward.ports.1.da"'));
 assert.ok(markup.includes('not register facts'),'labelled as assumptions');
});

test('With nothing entered the screen says where to enter it',()=>{
 const markup=desk({assessments:[]}).html();
 assert.ok(markup.includes('Nothing to compare yet'));
 assert.ok(markup.includes('PRICES'));
 assert.ok(!markup.includes('<td class="forward-cell'),'no table of empty cells is drawn');
});

test('A port name written by a person cannot become markup',()=>{
 const {s,cargo,html}=desk();
 const injection='<img src=x onerror=alert(1)>';
 s.portRecords[0].name=injection;
 s.priceAssessments=[{id:'PA-1',cargoId:cargo.id,cargoName:cargo.name,destination:injection,
  month:'2026-10',basis:'CFR',value:445,source:injection,date:'2026-09-11'}];
 s.forward.ports=[{name:injection,rate:6000,da:80000}];
 const markup=html();
 assert.ok(!markup.includes('<img src=x'),'the tag is not emitted');
 assert.ok(markup.includes('&lt;img src=x'),'it is shown as text');
 assert.ok(!/title="[^"]*onerror/.test(markup),'nor does it escape the attribute it sits in');
});

test('The screen builds markup and never reaches for a document',()=>{
 const source=require('node:fs').readFileSync(__dirname+'/forward-view.js','utf8');
 for(const forbidden of ['document.','innerHTML','getElementById','window.'])
  assert.ok(!source.includes(forbidden),`forward-view.js must not use ${forbidden}`);
});

test('Drawing the screen settles the assumptions it is about to ask for',()=>{
 const s=M.demo();P.ensure(s);
 const cargo=s.cargoTypes.find(c=>M.isBulkCargo(c)&&M.ok(c.sf,true));
 s.priceAssessments=[{id:'PA-1',cargoId:cargo.id,cargoName:cargo.name,destination:'Santos',
  month:'2026-10',basis:'CFR',value:445,source:'Profercy',date:'2026-09-11'}];
 delete s.forward;
 const markup=screen(s).html();
 assert.deepEqual(s.forward.ports.map(p=>p.name),['Ust-Luga','Santos'],
  'a row for the origin and for each destination compared');
 assert.equal(s.forward.cargoId,cargo.id,'and the cargo the screen opened on');
 assert.ok(markup.includes('[reference parcel size]'),
  'with no parcel size stated, the cell says so rather than assuming one');
});
