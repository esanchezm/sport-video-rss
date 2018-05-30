'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
import cheerio from 'cheerio';
import request from 'request';
import rss from 'rss';

const server = express();
const torrentSite = "https://www.sport-video.org.ua/"

server.use(bodyParser.json());
server.get('/', (req, res, next) => {
  request(torrentSite, (err, response, html) => {
    if (err) {
      res.status(500).send(err);
    }

    var $ = cheerio.load(html);
    var feed = new rss({title: "Sport torrents RSS"});
    $('a[title=TORRENT]').each(function(i, element) {
      var url = $(this).attr("href");
      var title = $(this).parent().parent().find('a.style3').text();
      
      feed.item({
        title: title,
        // For this specific site, the URL in the href is 
        // relative, so I need to append it to the site URK
        url: torrentSite + url
      });
    });
    
    res.status(200).send(feed.xml({indent: true}));
    }
  );
});
module.exports = Webtask.fromExpress(server);

