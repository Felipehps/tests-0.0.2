const { Builder, By, Key } = require('selenium-webdriver');

const BASE_URL = 'https://opentdb.com/browse.php';

// ENV FLAG
const env = process.argv[4];

let driver = {};
let elements = {};

// Sets the enviroment
switch (env) {
  case '-docker':
    driver = new Builder()
      .forBrowser('chrome')
      .usingServer('http://selenium:4444')
      .build();
    break;
  case '-local':
    driver = new Builder().forBrowser('chrome').build();
    break;
  default:
    console.log('Invalid flag');
    process.exit();
}

// Functions
async function open() {
  await driver.get(BASE_URL);
  await getElements();
}

async function close() {
  await driver.quit();
  elements = {};
}

async function countListElements() {
  return await (
    await driver.findElements(By.xpath('//table/tbody/tr'))
  ).length;
}

async function isPaginationElPresent() {
  return await driver.findElement(By.className('pagination')).isDisplayed();
}

async function getElements() {
  elements.searchBar = driver.findElement(By.id('query'));
  elements.searchBtn = driver.findElement(By.className('btn-default'));
  elements.typeSelect = driver.findElement(By.name('type'));
}

/**
 * Test Cases
 */

/* search-questions.feature */
const firstCase = async () => {
  await elements.searchBar.sendKeys('Science: Computers');
  await elements.searchBtn.click();
  return await driver.findElement(By.className('alert')).getText();
};

/* search-category.feature */
const secondCase = async () => {
  await elements.typeSelect.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.ENTER);
  await elements.searchBar.sendKeys('Science: Computers');
  await elements.searchBtn.click();
  const res = {
    listItemsCount: await countListElements(),
    isPaginationEl: await isPaginationElPresent(),
  };
  return res;
};

/* custom-case.feature */
const customCase = async () => {
  const difficulties = ['Hard', 'Medium', 'Easy'];
  await elements.searchBar.sendKeys('Video Game', Key.ENTER);

  // Getting length
  const times = await (
    await driver.findElements(By.xpath('//table/tbody/tr'))
  ).length;

  // Validating difficulties
  for (let i = 0; i < times; i++) {
    const result = await driver
      .findElement(By.xpath(`//table/tbody/tr[${i + 1}]/td[4]`))
      .getText();
    if (!difficulties.includes(result)) {
      return { error: true };
    }
  }
};

module.exports = {
  open,
  close,
  firstCase,
  secondCase,
  customCase,
};
