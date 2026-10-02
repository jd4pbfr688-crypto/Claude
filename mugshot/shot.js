const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:800,height:1000}});
await p.goto('file://'+__dirname+'/mugshot.html');await (await p.$('#m')).screenshot({path:__dirname+'/mugshot_ENAK.png'});await b.close();})();
