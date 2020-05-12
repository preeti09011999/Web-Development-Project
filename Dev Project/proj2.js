let puppeteer = require("puppeteer");
let cheerio = require("cheerio");
let request = require("request");
require("console.table");
let url = process.argv[2];
let fs = require("fs");
let cName = process.argv[3];
(async function () {
   try{
        // browser create => icognito mode,fullscreen
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized", "--disable-notifications"]
    });
    //tab
    let tabs = await browser.pages();
    let tab = tabs[0];
    await tab.setDefaultNavigationTimeout(0); 
    // const options = {
    //     path :'images/corona.png',
    //     fullPage: true,
    //     omitBackground : true
    // };
    tab.goto(url, {waituntil:'load',timeout:0});
    // await t.setViewport({ width: 1280, height: 800 })
    // await tab.screenshot(options);


    // --------------------------------Total case-----------------------------------
    await tab.waitForSelector(".maincounter-number");
    const text = await tab.evaluate(() => Array.from(document.querySelectorAll('.maincounter-number span'), element => element.textContent));
    console.log('------------------------------------------------------------------');
    console.log('                    Covid19 World Status                     ');
    console.log("CoronaVirus Cases : " + text[0]);
    console.log("Deaths : " + text[1]);
    console.log("Recovered :" + text[2]);

    // --------------------------------Finding href----------------------------------
    const elementHandles = await tab.$$('a');
    const propertyJsHandles = await Promise.all(
      elementHandles.map(handle => handle.getProperty('href'))
    );
    const hrefs2 = await Promise.all(
      propertyJsHandles.map(handle => handle.jsonValue())
    );
  
    // await tab.goto(hrefs2[5]);
    // await tab.waitForNavigation({waituntil : "load"});
    // await tab.screenshot({path : 'country_data.png'});
    await tab.goto(url+ 'country/' + cName);
    await tab.waitForSelector(".maincounter-number");
    const cText = await tab.evaluate(() => Array.from(document.querySelectorAll('.maincounter-number span'), element => element.textContent));
    console.log('------------------------------------------------------------------');
    console.log('                    Covid19 '+cName + ' status                           ');
    console.log("CoronaVirus Cases : " + cText[0]);
    console.log("Deaths : " + cText[1]);
    console.log("Recovered :" + cText[2]);
    await tab.click('.flip_cases_front');
    await tab.waitForNavigation({waituntil : "load"});
    console.log('------------------------------------------------------------------');
    tab.screenshot({path : 'statistics.png'});
    let pUrl = hrefs2[4] + "#total-cases";
    await tab.goto(pUrl);
    await tab.waitForNavigation({waituntil : "load",timeout : 0});
    await tab.screenshot({path : 'total-cases_graph.png'});
    // await tab.goto(url+ 'worldwide-graphs');
    // await tab.waitForNavigation({waituntil : "load",timeout : 0});

    // ----------------------active-cases--------------------------------------------
    // await tab.goto('url'+active-cases);
    // await tab.waitForNavigation({waituntil : "load",timeout:0});
    // await tab.screenshot({path : 'active-cases_graph.png'});
    
    // // -----------------------total-death--------------------------------------------
    // await tab.goto('url'+total-deaths);
    // await tab.waitForNavigation({waituntil : "load",timeout:0});
    // await tab.screenshot({path : 'total_deaths_graph.png'});
  

   } catch(err){
       console.log(err);
   }
})()
