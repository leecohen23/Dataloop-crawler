import fs from 'fs/promises';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const urlQueue = [];
const seenAtDepth = {};
const imgs = { results: [] }
const maxDepth = 0;

const cleanUrl = (baseUrl, url) => {
    if (url === null || typeof url === 'undefined') return null;
    if (url.charAt(url.length - 1) === '/') url = url.slice(0, -1);
    if (url.includes('http')) return url;
    if (url.startsWith('//')) return url.splice(2);
    const urlObj = new URL(baseUrl);
    if (url.startsWith('/')) return urlObj.protocol + '//' + urlObj.hostname + url;
    else return null;
}

const getData = async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    let $ = cheerio.load(html);
    const links = seenAtDepth[url] + 1 <= maxDepth ? $('a').map((i, element) => element.attribs.href).get() : [];
    const images = $('img').map((i, element) => element.attribs.src).get();
    return { links, images };
}

const processUrl = (url, links, images) => {
    //add image to Image Object
    images.forEach((image) => {
        const imageUrl = cleanUrl(url, image);
        if (imageUrl !== null) imgs.results.push({ imageUrl, sourceUrl: url, depth: seenAtDepth[url] })
    })
    // Add children links to urlQueue if not visited
    links.forEach((link) => {
        const cleanLink = cleanUrl(url, link);
        console.log(cleanLink);
        if (!seenAtDepth.hasOwnProperty(cleanLink) && cleanLink !== null) {
            seenAtDepth[cleanLink] = seenAtDepth[url] + 1;
            urlQueue.push(cleanLink);
        }
    })
}

const crawl = async (startUrl) => {
    seenAtDepth[startUrl] = 0;
    urlQueue.push(startUrl);
    while (urlQueue.length > 0) {
        const currUrl = urlQueue.shift();
        const { links, images } = await getData(currUrl);
        processUrl(currUrl, links, images);
    }
    await fs.writeFile('./response.txt', JSON.stringify(imgs))

}

const urlTest = 'https://dataloop.ai/';
crawl(urlTest);