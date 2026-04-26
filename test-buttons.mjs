import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Wait for AuthButtons to load
  await page.waitForSelector('text/Log In', { timeout: 5000 }).catch(() => console.log("Login button not found"));
  
  const loginBtn = await page.$('text/Log In');
  if (loginBtn) {
    const isIntersecting = await loginBtn.isIntersectingViewport();
    console.log("Login Button intersecting viewport:", isIntersecting);
    
    // Evaluate if it's covered by something
    const box = await loginBtn.boundingBox();
    const elementAtPoint = await page.evaluate((x, y) => {
      const el = document.elementFromPoint(x, y);
      return el ? el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : '') : 'null';
    }, box.x + box.width/2, box.y + box.height/2);
    console.log("Element at Login Button center:", elementAtPoint);
  }

  await browser.close();
})();
