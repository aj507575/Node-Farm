const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replace");
const tempOverview = fs.readFileSync(
  `${__dirname}/template/overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/template/product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/template/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const jsdata = JSON.parse(data);
//server

const server = http.createServer((req, res) => {
  //console.log(url.parse(req.url));
  const { query, pathname } = url.parse(req.url, true);
  //console.log(url.parse(req.url));
  //console.log(search);
  // let str = search.split("");
  //console.log(str);
  //let query = str[2];
  //console.log(query);
  //const path = req.url;
  // main page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const cardsHtml = jsdata
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  }
  //product page
  else if (pathname === "/product") {
    const strin = url.parse(req.url);
    const spl = strin.query.split("");
    const id = spl[1];
    // console.log(id);
    // const arr = strin.split("");
    //const id = arr[1];
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const products = jsdata[id];

    const output = replaceTemplate(tempProduct, products);
    res.end(output);
  }
  //api page
  else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  }
  //not found
  else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>error! page not found<h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
