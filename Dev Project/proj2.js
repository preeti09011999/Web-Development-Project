let puppeteer = require("puppeteer");
let cheerio = require("cheerio");
let request = require("request");
require("console.table");
let url = process.argv[2];
let fs = require("fs");

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
    
    // const options = {
    //     path :'images/corona.png',
    //     fullPage: true,
    //     omitBackground : true
    // };
    tab.goto(url, {waituntil:"networkidle2"});
    // await t.setViewport({ width: 1280, height: 800 })
    // await tab.screenshot(options);


    // --------------------------------Total case-----------------------------------
    await tab.waitForSelector(".maincounter-number");
    const tcase = await tab.$eval('.maincounter-number span',element => element.innerHTML);
    // browser.close();
    console.log('Totalcase :'+ tcase);
    
    // --------------------------------Finding href----------------------------------
    const elementHandles = await tab.$$('a');
    const propertyJsHandles = await Promise.all(
      elementHandles.map(handle => handle.getProperty('href'))
    );
    const hrefs2 = await Promise.all(
      propertyJsHandles.map(handle => handle.jsonValue())
    );
    console.log(hrefs2);
    await tab.goto(hrefs2[5]);
    await tab.waitForNavigation({waituntil : "load"});
    

    await tab.screenshot({path : 'country_data.png'});
    let pUrl = hrefs2[4] + "#total-cases";
    // console.log(pUrl);
    await tab.goto(pUrl);
    await tab.waitForNavigation({waituntil : "load",timeout : 0});
    await tab.screenshot({path : 'total-cases_graph.png'});
    await tab.goto('url'+worldwide-graphs);
    await tab.waitForNavigation({waituntil : "load",timeout : 0});

    // ----------------------active-cases--------------------------------------------
    await tab.goto('url'+active-cases);
    await tab.waitForNavigation({waituntil : "load",timeout:0});
    await tab.screenshot({path : 'active-cases_graph.png'});
    
    // -----------------------total-death--------------------------------------------
    await tab.goto('url'+total-deaths);
    await tab.waitForNavigation({waituntil : "load",timeout:0});
    await tab.screenshot({path : 'total_deaths_graph.png'});
    
    // -----------------------Using Cheerio to print table----------------------------
  //   request(hrefs2[5],function (err,res,html) {
  //   if(err === null && res.statusCode === 200){
  //       fs.writeFileSync("index.html",html);
  //           parseHtml(html);
        
  //   }else if(res.statusCode === 404){
  //       console.log("Invalid URL");
  //   }else{
  //       console.log(err);
  //       console.log(res.statusCode);
  //   }
  // })
  // function parseHtml(html){
  //   console.log("------------------------------------------------------------------------");
  //   let $ = cheerio.load(html);
  //   let itemWrapper = $("#main_table_countries_today.table.table-bordered.table-hover.main_table_countries.dataTable.no-footer");
  //   let text = $(itemWrapper).text();

  //   // console.log(text);
  //   fs.writeFileSync('file.json',text);
  //   browser.close();

  // }
  browser.close();

   } catch(err){
       console.log(err);
   }
})()