var log = require('./log');
var fs = require('fs');
var md = require('marked');
var config = require('./package.json').config;
var moment = require('moment');
var express = require('express');

var app = express();
app.listen(config.web.port);
log.info("Listening on port " + config.web.port);

log.info("Starting up!");

var postsdir = 'posts';
var staticsdir = 'public';

app.get("/", function(req, res){
    var body = "";
    var middle = [
        fs.readFileSync(staticsdir+"/posthead.html"),
        fs.readFileSync(staticsdir+"/posttail.html")
    ];
    fs.readdir(postsdir,function(err, files){
        if(err){
            log.error("Unable to read posts directory!");
        } else {
            files.reverse();
            files.forEach(function(file){
                if((file.substring(file.lastIndexOf('.')+1)) == "md"){
                    data = fs.readFileSync(postsdir+'/'+file,{'encoding':'utf-8'});
                    var stat = fs.statSync(postsdir+'/'+file);
                    var stats = '<span title="' + stat.mtime;
                    stats += '" class="date">' + moment(stat.mtime).fromNow();
                    stats += '</span>';
                    body += middle[0] + stats + md(data) + middle[1];
                    log.info("Rendering " + file);
                } else {
                    log.info("Skipping " + file + " (not Markdown)");
                }
            });
        }

        var head = fs.readFileSync(staticsdir+'/head.html');
        var tail = fs.readFileSync(staticsdir+'/tail.html');
        body = head + body + tail;
        res.send(body);
    });
});
