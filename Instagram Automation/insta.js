let fs=require("fs");
let puppeteer=require("puppeteer");
let cFile=process.argv[2];
let username=process.argv[3];
let nPost=process.argv[4];
(async function(){
   try{
    // browser create => icognito mode,fullscreen
    let data = await fs.promises.readFile(cFile);
    let{url,pwd,user} = JSON.parse(data);
    // launch browser
    let browser=await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        slowMo:100,
        args:["--incognito","--start-maximized","--disable-notifications"]
    });
    // tab
    let tabs = await browser.pages();
    let tab = tabs[0];
    // dom => html 
    //  browser=> 500ms request 
    // hk login page
    
    await tab.goto( url, { waitUntil : "networkidle2" });
    await tab.waitForSelector("input[name=username]",{visible:true})
    await tab.type("input[name=username]", user, {delay : 20});
    await tab.type("input[name=password]", pwd, {delay : 20});
    await Promise.all([tab.click("button[type=submit]"), tab.waitForNavigation({ waitUntil : "networkidle2"})]);
    await tab.waitForSelector(".XTCLo.x3qfX",{visible:true});
    await tab.type(".XTCLo.x3qfX",username);
    await tab.keyboard.press("Enter");
    await tab.waitForSelector(".Ap253",{visible : true});
    let ipages = await tab.$$(".Ap253");
    await Promise.all([ipages[0].click(), tab.waitForNavigation({waitUntil:"networkidle2"})]);
    let idx=0;
               
     do{
           await tab.waitForSelector(".ySN3v .KL4Bh",{ timeout : 0});
           let likes = await tab.$$(".KL4Bh");
           if(likes == null){
               console.log(idx);
               return;
           }
           
           await Promise.all([likes[idx].click(), tab.waitForNavigation({waitUntil:"networkidle2"})]);
           await tab.waitForSelector(".fr66n");
           await tab.click(".fr66n", { delay : 100});
           await Promise.all([tab.click("svg[aria-label=Close]", {delay : 100}), tab.waitForNavigation({waitUntil:"networkidle2"})]);
           idx++;
           
     }
      while (idx < nPost)
    }catch(err){
        console.log(err);
    }

    })();