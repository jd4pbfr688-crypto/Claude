const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:520}});
await p.goto('file://'+__dirname+'/pancarte_esteban.html');await (await p.$('#p')).screenshot({path:__dirname+'/pancarte_ESTEBAN.png'});await b.close();})();
