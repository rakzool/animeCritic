const http = require("http");
const fs = require("fs");
const url = require("url");
const { ENETUNREACH } = require("constants");

const replaceTemplate = (temp, anime) => {
  let output = temp;
  output = output.replace(/{%GENER%}/g, anime.gener);
  output = output.replace(/{%IMAGE%}/g, anime.image);
  output = output.replace(/{%RATEING%}/g, anime.rating);
  output = output.replace(/{%TITLE%}/g, anime.title);
  output = output.replace(/{%SEASON%}/g, anime.seasons);
  output = output.replace(/{%EPISODES%}/g, anime.episodes);
  output = output.replace(/{%DESCRIPTION%}/g, anime.description);
  output = output.replace(/{%HEADIMAGE%}/g, anime.headImage);
  output = output.replace(/{%ID%}/g, anime.id);
  return output;
};

const templateHome = fs.readFileSync(
  `${__dirname}/template/template-home.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/template/template-card.html`,
  "utf-8"
);
const templateAnime = fs.readFileSync(
  `${__dirname}/template/template-anime.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/Data/data.json`, "utf-8");
dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  const cardsHtml = dataObj
    .map((el) => replaceTemplate(templateCard, el))
    .join(" ");
  const output = templateHome.replace("{%PRODUCT_CARD%}", cardsHtml);

  if (pathname === "/" || pathname === "/home") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    res.end(output);
  } else if (pathname === "/anime") {
    const anime = dataObj[query.id];

    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const output = replaceTemplate(templateAnime, anime);

    res.end(output);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });

    res.end("<h1>404 Page Not Found !!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("%cListening at port 8000", "color:green,font-size:2rem");
});
