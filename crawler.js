import fs from 'fs/promises';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const urlQueue = [];
const seenAtDepth = {};
const imgs = { results: [] }

// const cleanUrl = (url) => {

// }

const getData = async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    // console.group(html);
    let $ = cheerio.load(html);
    const links = $('a').map((i, element) => element.attribs.href).get();
    const images = $('img').map((i, element) => element.attribs.src).get();
    console.log(links, images);
    return { links, images };
}

const processUrl = (url, links, images) => {
//add img and process children (clean children url)
}

const crawl = async (startUrl) => {
    seenAtDepth[startUrl] = 0;
    urlQueue.push(startUrl);
    while (urlQueue.length > 0) {
        const currUrl = urlQueue.shift();
        const { links, images } = await getData(currUrl);
        processUrl(url, links, images);
    }
    await fs.writeFile('./response.txt', JSON.stringify(imgs))

}

const urlTest = 'https://www.google.com/';
crawl(urlTest);