let puppeteer = require("puppeteer");
// let fs = require("fs")
// let url = process.argv[2];
(async function () {
    try{
        // launch browser
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized", "--disable-notifications"]
    });
    //tab
    let tabs = await browser.pages();
    let page = tabs[0]
    
    await page.goto('https://www.ilovepdf.com/pdf_to_word/', { waitUntil: "networkidle2" });

    const [filechoser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.uploader')
    ]) 
    await filechoser.accept(['/home/trinity/Desktop/Preeti_37_WT_Assignment-2.pdf']);
    await Promise.all([
      page.click(".btn.btn--process.btn--red.pdfoffice.pulse"),
      page.waitForNavigation({waitUntil:"networkidle2"})
    ])
    await page.waitForSelector(".btn.btn--process.btn--red.pdfoffice.pulse");
    
      await page.click(".btn.btn--process.btn--red.pdfoffice.pulse");

    // await browser.close();
    console.log("File Downloaded successfully");

    }catch(err){
        console.log(err);
    }
})()