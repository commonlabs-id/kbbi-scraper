const fs = require("fs");

const puppeteer = require("puppeteer");

let browser = null;

const selectors = {
  inputPosel: "input#Posel",
  inputKataSandi: "input#KataSandi",
  buttonSubmit: "input.btn",
  entry: "div.col-md-3 > a",
  buttonNextPage: 'div.col-lg-2 > a.btn[title="Ke halaman berikutnya"]'
};

const user = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const getLoggedInKBBI = async () => {
  if (!browser) {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://kbbi.kemdikbud.go.id/Account/Login", {
      waitUntil: "networkidle2"
    });
    await page.waitForSelector(selectors.inputPosel);
    await page.type(selectors.inputPosel, user.username);
    await page.type(selectors.inputKataSandi, user.password);
    await page.click(selectors.buttonSubmit);
    return browser;
  } else {
    return browser;
  }
};

async function scrapeEntriesFromPage(page, letter = "") {
  let p = 0;
  let entries = [];
  let nextPageButton = "";
  let nextPageURL = "";
  let url = "";
  do {
    nextPageButton = await page.$(selectors.buttonNextPage);
    nextPageURL = await page.evaluate(n => n.href, nextPageButton);
    url = page.url();
    const entryNodes = await page.$$(selectors.entry);
    for (const entryNode of entryNodes) {
      const entry = await page.evaluate(n => n.innerText, entryNode);
      const href = await page.evaluate(n => n.href, entryNode);
      entries.push({ entry, href });
    }
    // const ms = Math.floor(Math.random() * 750) + 750;
    // console.log(`sleeping for ${ms}`);
    // await sleep(ms);

    await page.click(selectors.buttonNextPage);
    await page.waitForSelector(selectors.buttonNextPage);
    console.log(letter, ++p, entries.length);
  } while (nextPageURL !== url);
  return entries;
}

async function main() {
  const KBBI = await getLoggedInKBBI();
  const page = await KBBI.newPage();
  try {
    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i].toUpperCase();
      await page.goto(
        `https://kbbi.kemdikbud.go.id/Cari/Alphabet?masukan=${letter}&masukanLengkap=${letter}&page=1`
      );
      const entries = await scrapeEntriesFromPage(page, letter);
      console.log(entries.length);
      fs.writeFileSync(`data/${letter}.json`, JSON.stringify({ entries }));
    }
  } catch (error) {
    console.error(error);
  }
}

main();
