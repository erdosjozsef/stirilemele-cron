const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const News = require("../models/Article");

exports.postScraping = async (req, res, next) => {
  try {
    const source = [
      {
        id: 1,
        link: "https://www.maszol.ro/belfold",
        categoryId: 4,
      },
      { id: 2, link: "https://www.maszol.ro/gazdasag", categoryId: 9 },
      { id: 3, link: "https://www.maszol.ro/kultura", categoryId: 8 },
      { id: 4, link: "https://www.maszol.ro/velemeny", categoryId: 11 },
      { id: 5, link: "https://www.maszol.ro/eletmod", categoryId: 12 },
      { id: 6, link: "https://www.maszol.ro/kulfold", categoryId: 5 },
      { id: 7, link: "https://www.maszol.ro/sport", categoryId: 1 },
      { id: 8, link: "https://www.maszol.ro/videok", categoryId: 17 },
    ];
    let resultFromWeb = [];
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    for (let i = 0; i < source.length; i++) {
      await page.goto(source[i].link, {
        waitUntil: "load",
        // Remove the timeout
        timeout: 0,
      });
      const html = await page.content();
      const $ = cheerio.load(html);
      $("article").map(async (index, element) => {
        const titleElement = $(element).find("h2 > a");
        const urlElement = $(element).find("h2 > a");
        const imageUrlElement = $(element).find("div > a > picture > img");
        const title = $(titleElement).text();
        const url = $(urlElement).attr("href");
        const imageUrl =
          "https://maszol.ro" + $(imageUrlElement).attr("data-src");
        const categoryId = source[i].categoryId;
        return resultFromWeb.push({ title, url, imageUrl, categoryId });
      });
    }
    async function saveData() {
      for (let i = 0; i < resultFromWeb.length; i++) {
        const checkDb = await News.findAll({
          where: {
            title: resultFromWeb[i].title.trim(),
          },
        });

        if (
          checkDb.length < 1 &&
          resultFromWeb[i].url !== undefined &&
          resultFromWeb[i].title.length != 0
        ) {
          await News.create({
            imageUrl: resultFromWeb[i].imageUrl.trim(),
            link: resultFromWeb[i].url.trim(),
            title: resultFromWeb[i].title.trim(),
            categoryId: resultFromWeb[i].categoryId,
            sourceId: 5,
            clicked: 0,
            seoUrl: resultFromWeb[i].title
              .trim()
              .replace(/[^a-zA-Z ]/g, "")
              .replace(/ /g, "-")
              .toLowerCase(),
          });
        }
      }
    }

    await browser.close();
    await saveData();

    return res.json({
      status: 200,
      msg: "Success",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      msg: "Failed",
    });
  }
};
