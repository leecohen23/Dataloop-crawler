import fs from 'fs/promises';

const urlQueue = [];
const seenAtDepth = {};
const imgs = {results : []}

// const cleanUrl = (url) => {

// }

// const getData = () => {

// }

// const processUrl = () => {

// }

const crawl = async (startUrl) => {
    seenAtDepth[startUrl] = 0;
    urlQueue.push(startUrl);
    while (urlQueue.length > 0){
        const currUrl = urlQueue.shift();
        const {links, images} = getData(currUrl);
        processUrl(url, links, images);
    }
    await fs.writeFile('./response.txt', imgs)
    
}

crawl('https://www.fivesigmalabs.com/');