#!/usr/bin/env node

/*
  Automatically grade files for the presence of specified HTML tags/attributes.
  Uses commander.js and cheerio. Teaches command line application development
  and basic DOM parsing.

  References:

  + cheerio
  - https://github.com/MatthewMueller/cheerio
  - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
  - http://maxogden.com/scraping-with-node.html

  + commander.js
  - https://github.com/visionmedia/commander.js
  - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

  + JSON
  - http://en.wikipedia.org/wiki/JSON
  - https://developer.mozilla.org/en-US/docs/JSON
  - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://fierce-tundra-3049.herokuapp.com/";
var restler = require('restler');

var assertFileExists = function(infile){
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
        console.log("%s does not exists. Existing.", instr);
        process.exit(1);
    }
    return instr;
};

var validateUrl = function(err, restResp, checksfile){
    if(restResp.statusCode != 200){
        console.log("Error:" + err);
        process.exit(1);
    }else{
        $ = cheerio.load(restResp.rawEncoded);
        //console.log('loading' + checksfile);
        var checks = loadChecks(checksfile);
        var out = {};
        for(var ii in checks){
            var present = $(checks[ii]).length> 0;
            out[checks[ii]] = present;
        }
        console.log("Url:" +  JSON.stringify(out, null, 4));
    }
}

var checkUrl = function(url, checksfile){
    console.log("loading "+ url);
    restler.get(url).on('complete', function(err, response){
        validateUrl(err, response, checksfile);
    });
};

var cheerioHtmlFile = function(htmlfile){
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile){
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile){
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile);
    var out = {};
    for(var ii in checks){
        var present = $(checks[ii]).length> 0;
        out[checks[ii]] = present;
    }
    return out;
};



var clone = function(fn){
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
}

if(require.main == module){
    program
           .option('-c, --checks <check_file>', 'Path to checks.json',  clone(assertFileExists), CHECKFILE_DEFAULT)
           .option('-f --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
           .option('--url <url to index.html>', 'url to index.html')
           .parse(process.argv);
    
    if(program.url){
        console.log(program.url);
        checkUrl(program.url, program.checks);         
    }

    if(program.file){
        var checkJson = checkHtmlFile(program.file, program.checks); 
       console.log("program file:" + JSON.stringify(checkJson, null, 4));
    }
}else{
    exports.checkHtmlFile = checkHtmlFile;
}

