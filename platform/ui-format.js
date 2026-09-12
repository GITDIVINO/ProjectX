(function(root){
'use strict';
// Formatting and markup helpers that depend on nothing: no state, no document, no model.
// They were defined four times over across app.js, planner-ui.js, market.js and guide.js,
// which is how an escaping rule gets fixed in one place and left wrong in three.

// Every value that reaches markup goes through this. Attribute values included: the quote
// characters are escaped too, so an interpolation inside an attribute cannot break out of it.
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Intl.NumberFormat is expensive to construct and toLocaleString builds a fresh one on every
// call. One formatter per pair of digit settings produces the same string for far less work.
const numberFormats=new Map();
const numberFormat=(min,max)=>{
 const key=min+':'+max;
 let f=numberFormats.get(key);
 if(!f){f=new Intl.NumberFormat('en-GB',{minimumFractionDigits:min,maximumFractionDigits:max});numberFormats.set(key,f);}
 return f;
};

// A missing figure prints as a dash rather than as zero: nothing entered is not the same
// claim as zero, and a budget must not read as complete because a field was left empty.
const fmt=(x,d=1)=>x===null||x===undefined||!Number.isFinite(x)?'—':numberFormat(d,d).format(x);
const num=x=>Number.isFinite(x)?numberFormat(0,20).format(x):'—';
const orDash=(x,d=0,unit='')=>x===null?'—':fmt(x,d)+unit;
const round=(x,d)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:x;

// Tonnage is typed with the thousands separators the table prints, including the narrow and
// non-breaking spaces a copy-paste brings with it.
const tonnage=text=>{const clean=String(text).replace(/[\s,  ]/g,'');return clean===''?0:Number(clean);};

// A total is only a total when every part of it is known. One missing part makes the sum
// unknown, not smaller.
const sumOf=xs=>xs.every(x=>x!==null&&x!==undefined&&Number.isFinite(x))?xs.reduce((a,x)=>a+x,0):null;

const table=(heads,rows,cls='')=>
 `<div class="table-wrap"><table class="${cls}"><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;

const foldBlock=(id,title,summary,body)=>
 `<details id="${id}" class="fold"><summary><strong>${esc(title)}</strong><span>${summary}</span></summary><div class="fold-body">${body}</div></details>`;

// Geometry is drawn with the y axis flipped: latitude grows north, SVG grows down.
const ringPath=ring=>`<path d="M${ring.map(p=>p[0].toFixed(2)+' '+(-p[1]).toFixed(2)).join('L')}Z"/>`;
const linePath=line=>`<path d="M${line.map(p=>p[0].toFixed(2)+' '+(-p[1]).toFixed(2)).join('L')}"/>`;

const api={esc,numberFormat,fmt,num,orDash,round,tonnage,sumOf,table,foldBlock,ringPath,linePath};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXFormat=api;
})(globalThis);
