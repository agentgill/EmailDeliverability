const puppeteer = require("puppeteer");
var args = process.argv;
var enableLogs = (args[4]=='Finest')?true:false;
if(enableLogs){console.log('args',args);}

var WORKSPACE = args[2];
var JOB_NAME=args[3];
var url = args[5];
var SANDBOX_NAME = args[6];
var CMD_STR = args[7];

var frames
var myframe 

// Custom Variables
var cmdSpl = (CMD_STR.replace("[","").replace("]","")).split(', ')

// Take Screenshot
var ssCount = 100;
var baseURL = 'https://'+url.replace('http://','').replace('.com//','.com/').replace('https://','').split(/[/?#]/)[0];
if(enableLogs){console.log('baseURL',baseURL);}

async function takeScreenshot(page,enableLogs,JOB_NAME,screenName) {
    ssCount = ssCount+1
    if(enableLogs){await page.screenshot({ path: WORKSPACE+"/runtimeResources/debugScreenshots/"+JOB_NAME+"/"+ssCount+"_"+screenName+".png" });}
    return null;
}


(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = browser.defaultBrowserContext();
  await context.overridePermissions(url, ["notifications"]);
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 })
  console.log('Done');
  console.log('Waiting to initiate page ... Done');
  
  


  // Login to SF
  try{
    console.log('Login to Salesforce... ');
    const navigationPromise = page.waitForNavigation()
    await page.goto(url, {
      waitUntil: "networkidle2"
    });

    await page.waitForTimeout(5000);
    await takeScreenshot(page,enableLogs,JOB_NAME,"LoginToSalesforce")
    console.log('Done ');

    
    /**
     * Switch to Classic View
     */ 
    console.log('Switch to classic view ...');
    await page.goto(baseURL+'/ltng/switcher?destination=classic&referrer=%2Flightning%2Fpage%2Fhome%3F0.source%3DalohaHeader', {
        waitUntil: "networkidle2"
    });
    await navigationPromise
    await page.waitForTimeout(1000);
    await takeScreenshot(page,enableLogs,JOB_NAME,"Switch_To_Classic")

    /**
     * Start Tasks
     */ 
 
    console.log('Goto email admin and change Access Level to All Email ...');
    await page.goto(baseURL+'/email-admin/editOrgEmailSettings.apexp', {
        waitUntil: "networkidle2"
    });
    await navigationPromise
    await page.waitForTimeout(1000);
    await takeScreenshot(page,enableLogs,JOB_NAME,"Email_Deliverabliity_Page_Display")

    const emailPicklist = '[name="thePage:theForm:editBlock:sendEmailAccessControlSection:sendEmailAccessControl:sendEmailAccessControlSelect"]'
    await page.waitForSelector(emailPicklist)
    await page.$eval(emailPicklist, el => el.value ='2');
    await page.waitForTimeout(1000);
    await takeScreenshot(page,enableLogs,JOB_NAME,"Email_Deliverabliity_SelectAllEmail")

    const saveBtn = '[title="Save"]'
    await page.waitForSelector(saveBtn)
    await page.click(saveBtn)
    await page.waitForTimeout(1000);
    await takeScreenshot(page,enableLogs,JOB_NAME,"Email_Deliverabliity_Saved")



  }catch(all){
    const allStr = all.toString()
    console.log('Puppeteer Catch Error: ',allStr);
    if(allStr.includes('No node found for selector: #currentpassword')){
      console.log('Error OK. Skipping Error notification');
    }else{
      await page.screenshot({ path: WORKSPACE+"/runtimeResources/debugScreenshots/"+JOB_NAME+"/100_ERROR.png" });
      await browser.close();
      return;
    }
  }

  await browser.close();
  return;
})();