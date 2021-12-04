const { Builder, By, Key } = require('selenium-webdriver');

const BASE_URL = 'https://opentdb.com/browse.php';

// ENV FLAG
const env = process.argv[2];

let driver;

// Sets the enviroment
switch (env) {
  case '--docker':
    driver = new Builder()
      .forBrowser('chrome')
      .usingServer('http://selenium:4444')
      .build();
    break;
  case '--local':
    driver = new Builder().forBrowser('chrome').build();
    break;
  default:
    console.log('Invalid flag');
    process.exit();
}

// Selecting elements
const searchBar = driver.findElement(By.id('query'));
const searchBtn = driver.findElement(By.className('btn-default'));
const typeSelect = driver.findElement(By.name('type'));

// Functions
async function countListElements() {
  return await (
    await driver.findElements(By.xpath('//table/tbody/tr'))
  ).length;
}

async function isPaginationElPresent() {
  return await driver.findElement(By.className('pagination')).isDisplayed();
}

/**
 * Test Cases
 */

/* banco-de-questoes.feature */
const firstCase = async () => {
  await driver.get(BASE_URL);
  await searchBar.sendKeys('Science: Computers');
  await searchBtn.click();
  return await driver.findElement(By.className('alert')).getText();
};

/* busca-categoria.feature */
const secondCase = async () => {
  await driver.get(BASE_URL);
  await typeSelect.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.ENTER);
  await searchBar.sendKeys('Science: Computers');
  await searchBtn.click();
  const res = {
    listItemsCount: await countListElements(),
    isPaginationEl: await isPaginationElPresent(),
  };
  return res;
};

/* valida-dificuldaddes.feature */
const customCase = async () => {
  const difficulties = ['Hard', 'Medium', 'Easy'];
  await driver.get(BASE_URL);
  await searchBar.sendKeys('Video Game', Key.ENTER);
  await searchBtn.click();

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
      throw 'A divergent difficulty was found.';
    }
  }
};

module.exports = {
  firstCase,
  secondCase,
  customCase,
};
