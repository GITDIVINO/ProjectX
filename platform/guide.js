(function(root){
'use strict';
// Describes what the tabs actually enforce. Keep in step with app.js, not with the intended process.
const {esc}=typeof module!=='undefined'&&module.exports?require('./ui-format'):root.ProjectXFormat;

const STEPS=[
 {tab:'CARGO',title:'Register the cargo',
  body:'Each product a sale can be written against lives here with its planning stowage factor. A cargo without a positive SF cannot be selected in SALE, so fill the SF first. Properties are edited here and nowhere else: PLANNER shows them read-only.'},
 {tab:'PORT',title:'Register ports and berths',
  body:'One row per berth, not per port: a port with published per-berth limits holds several rows sharing its name. Country, terminal, berth and the size limits are all editable. SALE offers only ports listed here, so an empty register blocks the first sale.'},
 {tab:'VESSEL',title:'Choose the vessel type',
  body:'Editable size classes with deadweight, dimensions, hold volumes, speeds and consumption. Apply to voyage copies the card into the current voyage and replaces its hold list, so apply before you distribute cargo rather than after.'},
 {tab:'SALE',title:'Record the concluded sale',
  body:'The trader enters deal date, cargo, volume, load and discharge port, shipment window and FOB price. Cargo comes from CARGO and both ports come from PORT; nothing else is accepted. A sale already used in a voyage cannot be deleted until it is removed from PLANNER.'},
 {tab:'PLANNER',title:'Build the voyage',
  body:'Add sales as parcels, order the calls, enter hold volumes and deductions, distribute cargo, then complete the cost inputs. Parcels can only come from SALE. Save, Save PDF and Clear calculation live here.'}
];

const PLANNER_STEPS=[
 ['1','Sales in voyage','Add sales as parcels, select them and review shipment sources. Edit shipment properties in SALE.'],
 ['2','Vessel and rotation','Apply a vessel, record sources and deductions, order calls and check arrival / departure limits.'],
 ['3','Stowage by hold','Preview a volume allocation, apply or undo it, or edit by hand. Review each state and sourced limits in Checks. Cargo distribution screens every arrival and departure for mass gathered in one end, empty holds between loaded ones and similar patterns; these are preliminary signals, not a stability or strength calculation.'],
 ['4','Voyage calculation','Distances, speeds, port time, fuel prices, hire, DA, freight and commission.'],
 ['5','Cost by sale','The voyage cost split across the parcels, to the cent, on the chosen basis.']
];

function box(x,y,w,h,label,note,accent){
 return '<g>'+
  '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" class="guide-box'+(accent?' guide-box-accent':'')+'"/>'+
  '<text x="'+(x+16)+'" y="'+(y+27)+'" class="guide-box-title">'+esc(label)+'</text>'+
  '<text x="'+(x+16)+'" y="'+(y+47)+'" class="guide-box-note">'+esc(note)+'</text>'+
 '</g>';
}
// Elbow connector: out to a shared column, down or up, then into the target.
function elbow(x1,y1,x2,y2){
 const mid=x1+(x2-x1)/2;
 return '<path class="guide-link" d="M'+x1+' '+y1+' H'+mid+' V'+y2+' H'+(x2-9)+'" marker-end="url(#guide-arrow)"/>';
}

function diagram(){
 return '<div class="guide-diagram">'+
 '<svg viewBox="0 0 900 330" role="img" aria-label="Cargo, port and vessel registers feed a sale, and the sale feeds the voyage planner">'+
  '<defs><marker id="guide-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'+
   '<path d="M0 0 L10 5 L0 10 z" class="guide-arrowhead"/></marker></defs>'+
  '<text x="24" y="22" class="guide-lane">Reference registers</text>'+
  '<text x="330" y="22" class="guide-lane">Commercial record</text>'+
  '<text x="560" y="22" class="guide-lane">Voyage workspace</text>'+
  box(24,36,190,62,'CARGO','Products and planning SF')+
  box(24,124,190,62,'PORT','Berths and size limits')+
  box(24,212,190,62,'VESSEL','Size class and holds')+
  box(330,80,170,62,'SALE','The concluded deal',true)+
  '<rect x="560" y="36" width="316" height="238" rx="10" class="guide-box guide-box-wide"/>'+
  '<text x="580" y="63" class="guide-box-title">PLANNER</text>'+
  PLANNER_STEPS.map(([n,name],i)=>'<text x="580" y="'+(90+i*32)+'" class="guide-box-note"><tspan class="guide-step-n">'+n+'</tspan>  '+esc(name)+'</text>').join('')+
  elbow(214,67,330,100)+
  elbow(214,155,330,122)+
  elbow(500,111,560,111)+
  '<path class="guide-link" d="M214 243 H272 V300 H620 V274" marker-end="url(#guide-arrow)"/>'+
 '</svg>'+
 '<p class="form-note">MARKET sits outside this flow: an offline archive you can read at any point. It never changes a voyage.</p>'+
 '</div>';
}

function render(){
 return '<section class="guide"><div class="heading"><div><h2>GUIDE</h2>'+
  '<p class="section-intro">How a voyage is put together, tab by tab.</p></div></div>'+
  diagram()+
  '<h3>Order of work</h3>'+
  '<ol class="guide-steps">'+STEPS.map(s=>'<li><div class="guide-step-head"><span class="guide-step-tab">'+esc(s.tab)+'</span><strong>'+esc(s.title)+'</strong></div><p>'+esc(s.body)+'</p></li>').join('')+'</ol>'+
  '<h3>Inside PLANNER</h3>'+
  '<ol class="guide-steps guide-steps-inner">'+PLANNER_STEPS.map(([n,name,note])=>'<li><div class="guide-step-head"><span class="guide-step-tab">'+esc(n)+'</span><strong>'+esc(name)+'</strong></div><p>'+esc(note)+'</p></li>').join('')+'</ol>'+
  '<h3>Worth knowing before you start</h3>'+
  '<ul class="guide-notes">'+[
   'Everything is stored in this browser only. There is no server, no shared voyage and no account: another browser or another machine starts empty.',
   'A figure left empty is unknown, not zero. The calculation refuses to produce a budget rather than guess a missing input.',
   'Volume distribution, intake and the port size limits are planning aids. None of them is a stability, strength or draft approval for a real call.',
   'Reference values shipped with the platform, including stowage factors and port limits, need confirming against the shipment and the terminal before fixing.'
  ].map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'+
 '</section>';
}

const api={render,STEPS,PLANNER_STEPS};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXGuide=api;
})(typeof window==='undefined'?globalThis:window);
