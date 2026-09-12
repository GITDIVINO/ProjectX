'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const F=require('./ui-format'),Views=require('./register-view');

const view=Views.create({esc:F.esc,fmt:F.fmt,table:F.table});

const row=(over={})=>({
 id:'v-1',name:'Ust-Luga → Santos',revision:3,
 createdAt:'2026-09-01T08:00:00Z',updatedAt:'2026-09-11T16:30:00Z',
 responsibleId:'u-1',responsible:'A. Petrov',responsibleTitle:'Freight',
 createdBy:'A. Petrov',updatedBy:'M. Ivanova',
 vessel:'TBN 34K',parcels:2,ports:'Santos · Ust-Luga',
 cargoes:'Urea · Sulphur',tonnage:24000,deliveryPort:'Rotterdam',
 ...over
});

test('A row says who answers for the calculation, and what it is about',()=>{
 const html=view.render([row()],null,null);
 assert.match(html,/A\. Petrov/);
 assert.match(html,/Freight/,'the job title is shown beside the name');
 assert.match(html,/TBN 34K/);
 assert.match(html,/Santos · Ust-Luga/);
 assert.match(html,/11 Sept 2026/,'the last change is dated');
 assert.match(html,/M\. Ivanova/,'and attributed');
});

test('A calculation nobody holds says so instead of showing a blank',()=>{
 const html=view.render([row({responsible:null,responsibleTitle:null})],null,null);
 assert.match(html,/Unassigned/,'an empty cell would read as a rendering fault');
});

test('The open calculation is marked, so the register says where you are',()=>{
 const open=view.render([row(),row({id:'v-2',name:'Second'})],'v-2',null);
 const rows=open.split('<tr').filter(x=>x.includes('data-calculation='));
 assert.equal(rows.length,2);
 assert.ok(!rows[0].includes('register-row--open'),'the one that is not open is not marked');
 assert.ok(rows[1].includes('register-row--open'));
 assert.ok(rows[1].includes('<small>Open</small>'));
});

test('The count of what is yours is stated, once there is somebody to count for',()=>{
 const rows=[row(),row({id:'v-2',responsibleId:'u-2',responsible:'M. Ivanova'})];
 assert.match(view.render(rows,null,{id:'u-1'}),/2 calculations · 1 yours/);
 assert.match(view.render(rows,null,null),/2 calculations/);
 assert.doesNotMatch(view.render(rows,null,null),/yours/,'with no account there is no "yours"');
 assert.match(view.render([row()],null,{id:'u-1'}),/1 calculation · 1 yours/,'singular reads as singular');
});

test('A register that could not be read is not shown as an empty one',()=>{
 const html=view.render({ok:false,error:'permission denied for table voyages'},null,null);
 assert.match(html,/permission denied/);
 assert.doesNotMatch(html,/No calculations yet/,'unreadable and empty are different conditions');
});

test('An empty register invites the first calculation',()=>{
 const html=view.render([],null,null);
 assert.match(html,/No calculations yet/);
 assert.match(html,/data-action="new-calculation-row"/);
});

test('A name written by a person cannot become markup',()=>{
 const html=view.render([row({name:'<img src=x onerror=alert(1)>',responsible:'<script>bad</script>'})],null,null);
 assert.ok(!html.includes('<img src=x'));
 assert.ok(!html.includes('<script>bad'));
 assert.match(html,/&lt;img src=x/);
 assert.match(html,/&lt;script&gt;bad/);
});

test('A closed row offers to open, expand or delete, and nothing else',()=>{
 const html=view.render([row()],null,null);
 for(const action of ['open-calculation','expand-calculation','delete-calculation-row'])
  assert.match(html,new RegExp(`data-action="${action}"`),action+' is offered');
 assert.doesNotMatch(html,/register-editor/,'the editor appears only when the row is opened out');
});

test('An opened row shows what is in the calculation and offers to change it',()=>{
 const members=[{id:'u-1',name:'A. Petrov',title:'Freight'},{id:'u-2',name:'M. Ivanova',title:null}];
 const html=view.render([row()],null,null,'v-1',members);

 // What it contains, from what the row already carried — opening it costs no extra query.
 assert.match(html,/Urea · Sulphur/,'the cargo is named');
 assert.match(html,/24,000.0 t/,'and the tonnage totalled');
 assert.match(html,/Ballast from/,'a ballast approach names where it starts');
 assert.match(html,/Rotterdam/);

 // And the two things the register owns are editable in place.
 assert.match(html,/name="name" type="text" value="Ust-Luga → Santos"/);
 assert.match(html,/<select name="responsible">/);
 assert.match(html,/value="u-1" selected/,'the current holder is the one selected');
 assert.match(html,/data-action="save-calculation-row"/);
 assert.match(html,/aria-expanded="true"/);
});

test('Only the opened row is opened out',()=>{
 const html=view.render([row(),row({id:'v-2',name:'Second'})],null,null,'v-2',[]);
 assert.equal((html.match(/register-detail/g)||[]).length,2,'one detail row, named twice in its markup');
 assert.match(html,/data-detail="v-2"/);
 assert.doesNotMatch(html,/data-detail="v-1"/);
});

test('A calculation cannot be handed over where there is nobody to hand it to',()=>{
 const html=view.render([row()],null,null,'v-1',[]);
 assert.doesNotMatch(html,/<select name="responsible">/);
 assert.match(html,/No colleagues are listed/,'and the reason is stated rather than left blank');
 assert.match(html,/name="name"/,'renaming still works');
});

test('The page says what responsibility is, and what it is not',()=>{
 const html=view.render([row()],null,null);
 assert.match(html,/does not restrict who may open or edit/);
 assert.match(html,/head of freight/,'the commercial approval is not this');
});

test('Handing over offers the organisation and nobody else',()=>{
 const members=[{id:'u-1',name:'A. Petrov',title:'Freight'},{id:'u-2',name:'M. Ivanova',title:null}];
 const html=view.editor(row({responsibleId:'u-2'}),members);
 assert.match(html,/A\. Petrov · Freight/);
 assert.match(html,/value="u-2" selected/);
 assert.equal((html.match(/<option /g)||[]).length,2,'only the members, and each once');
});

test('A calculation name written by a person cannot become markup in the editor',()=>{
 const html=view.editor(row({name:'" onfocus="alert(1)'}),[]);
 assert.ok(!html.includes('" onfocus="alert(1)"'),'the quotes do not escape the attribute');
 assert.match(html,/&quot; onfocus=&quot;/);
});

test('A missing or unreadable date is a dash, not an invalid one',()=>{
 assert.equal(view.day(null),'—');
 assert.equal(view.day('not a date'),'—');
 assert.match(view.day('2026-09-11T16:30:00Z'),/11 Sept 2026/);
});
