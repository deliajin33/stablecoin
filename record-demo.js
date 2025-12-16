const { chromium } = require('playwright');

async function recordStablecoinDemo() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideoDir: './demo-recordings',
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  console.log('开始录制 stablecoin demo...');

  // 1. 打开应用
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(2000);

  // 2. 演示 Scan & Pay 功能
  console.log('演示 Scan & Pay...');
  await page.click('button:has-text("Scan & Pay")');
  await page.waitForTimeout(4000); // 等待扫描动画完成
  await page.waitForSelector('text:has-text("Payment Ready")');
  await page.waitForTimeout(2000);

  // 3. 演示 Payment Code
  console.log('演示 Payment Code...');
  await page.click('button:has-text("Back to Wallet")');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Payment Code")');
  await page.waitForTimeout(3000);

  // 4. 演示 Transfer 功能
  console.log('演示 Transfer...');
  await page.click('button:has-text("Back to Wallet")');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Transfer")');
  await page.waitForTimeout(2000);

  // 5. 演示 Receive Code
  console.log('演示 Receive Code...');
  await page.click('button:has-text("Back to Wallet")');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Receive Code")');
  await page.waitForTimeout(3000);

  // 6. 演示 Admin Dashboard
  console.log('演示 Admin Dashboard...');
  await page.click('button:has-text("Back to Wallet")');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Admin")');
  await page.waitForTimeout(4000);

  // 7. 演示移动端响应式
  console.log('演示移动端响应式...');
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone 12 尺寸
  await page.waitForTimeout(2000);

  console.log('录制完成！');

  await context.close();
  await browser.close();

  console.log('视频已保存到 ./demo-recordings/ 文件夹');
}

recordStablecoinDemo().catch(console.error);