#!/usr/bin/env node

var sys = require('sys');
var restler = require('restler');
var program = require('commander');



var assertUrlExists = function(url, callback){
    restler.get(url).on('complete', function(result){
        if(result instanceof Error ){
            console.log("result is an instance of Error");
            sys.puts("Error" + result.message);
            process.exit(1);
        } 
        callback(result);
    });
};

var doSomeOperation = function(data){
    console.log('data received from restler'+ data);
}

if(require.main == module){
    program.option('--url <url to download>', 'url to downloda')
    .option('-f --checks <check_file>', 'Path to checks.json')
    .parse(process.argv);
    
    if(!program.check_file){
        console.log("checkfile is not given");
    }
    console.log(program.url);
    
    //calling the function on downloaded data
    assertUrlExists(program.url,doSomeOperation);
}
