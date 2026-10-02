const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:900}});
await p.goto('file://'+__dirname+'/pancarte_mathilde.html');await (await p.$('#p')).screenshot({path:__dirname+'/pancarte_MATHILDE.png'});await b.close();})();
