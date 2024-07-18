const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const scrapeWebsite = async (url) => {
    let browser = null;
    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      const content = await page.content();
      const $ = cheerio.load(content);

      const name = $("title").text() || "Not found";
      const description = $('meta[name="description"]').attr("content") || "Not found";
      const favicon = $('link[rel="shortcut icon"]').attr("href") ||
                      $('link[rel="icon"]').attr("href") ||
                      $('link[rel="apple-touch-icon"]').attr("href") || "Not found";
      const facebookURL = $('a[href*="facebook.com"]').attr("href") || "Not found";
      const linkedinURL = $('a[href*="linkedin.com"]').attr("href") || "Not found";
      const twitterURL = $('a[href*="twitter.com"]').attr("href") || "Not found";
      const instagramURL = $('a[href*="instagram.com"]').attr("href") || "Not found";
      let address = $("address").text() || "Not found";
      if (!address) {
        address = $("footer").text() || $("body").text() || "Not found";
        const addressRegex =
          /[0-9]+ .+?(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Court|Ct|Lane|Ln|Terrace|Ter)\b/i;
        const matches = address.match(addressRegex);
        address = matches ? matches[0] : "Not found";
      }
      let phoneNumber = $('a[href^="tel:"]').first().text() || "Not found";
      if (!phoneNumber) {
        const phoneRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
        const bodyText = $("body").text();
        const phoneMatch = bodyText.match(phoneRegex);
        phoneNumber = phoneMatch ? phoneMatch[0] : "Not found";
      }
      let email = $('a[href^="mailto:"]').first().text() || "Not found";
      if (!email) {
        const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/;
        const bodyText = $("body").text();
        const emailMatch = bodyText.match(emailRegex);
        email = emailMatch ? emailMatch[0] : "Not found";
      }

      return {
        name,
        description,
        companyLogo: favicon,
        facebookURL,
        linkedinURL,
        twitterURL,
        instagramURL,
        address,
        phoneNumber,
        email,
      };
    } catch (error) {
        console.error('Error scraping website:', error);
        return null;
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = scrapeWebsite;