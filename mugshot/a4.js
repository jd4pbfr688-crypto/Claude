const fs=require('fs');const { chromium } = require('playwright');
const items=[['ENAK','pancarte.html'],['MATHILDE','pancarte_mathilde.html'],['CHARLOTTE','pancarte_charlotte.html'],['ESTEBAN','pancarte_esteban.html'],['JADE','pancarte_jade.html']];
const css=`@page{size:A4 landscape;margin:0}html,body{margin:0;background:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:297mm;height:210mm;display:flex;align-items:center;justify-content:center;page-break-after:always;overflow:hidden}
.pg svg{width:285mm;height:198mm}`;
const svgOf=f=>{let s=fs.readFileSync(__dirname+'/'+f,'utf8');s=s.slice(s.indexOf('<svg'),s.indexOf('</svg>')+6);
 return s.replace(/ width="\d+" height="\d+" viewBox/,' viewBox');};
const page=b=>`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${b}</body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();
 const all=[];
 for(const [n,f] of items){const div=`<div class="pg">${svgOf(f)}</div>`;all.push(div);
  await p.setContent(page(div));await p.pdf({path:`${__dirname}/A4/pancarte_${n}_A4.pdf`,width:'297mm',height:'210mm',printBackground:true});}
 await p.setContent(page(all.join('')));await p.pdf({path:`${__dirname}/A4/pancartes_TOUTES_A4.pdf`,width:'297mm',height:'210mm',printBackground:true});
 await p.setViewportSize({width:1123,height:794});await p.setContent(page(all[1]));await p.screenshot({path:__dirname+'/A4/preview.png'});
 await br.close();})();
