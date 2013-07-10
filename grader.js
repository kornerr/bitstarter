#!/usr/bin/env node

var cheerio = require('cheerio');
var fs = require('fs');
var program = require('commander');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

function assertFileExists(fileName)
{
    strFileName = fileName.toString();
    if (!fs.existsSync(strFileName))
    {
        console.log("%s does not exist. Exiting.", strFileName);
        process.exit(1);
    }
    return strFileName;
}

function cheerioHTMLFile(fileName)
{
    return cheerio.load(fs.readFileSync(fileName));
}

function cheerioHTMLString(line)
{
    return cheerio.load(line);
}

function loadChecks(fileName)
{
    return JSON.parse(fs.readFileSync(fileName));
}

function checkHTML(doc, checksFile)
{
    $ = doc;
    var checks = loadChecks(checksFile).sort();
    var out = { }
    for (var i in checks)
    {
        var present = $(checks[i]).length > 0;
        out[checks[i]] = present;
    }
    return out;
}

function clone(fn)
{
    return fn.bind({});
}

if (require.main == module)
{
    program
        .option("-c, --checks <check_file>",
                "Path to checks.json",
                clone(assertFileExists),
                CHECKSFILE_DEFAULT)
        .option("-f, --file <html_file>",
                "Path to index.html",
                clone(assertFileExists),
                HTMLFILE_DEFAULT)
        .parse(process.argv);
    var checkJSON = checkHTML(cheerioHTMLFile(program.file), program.checks);
    var outJSON = JSON.stringify(checkJSON, null, 4);
    console.log(outJSON);
}
else
{
    exports.checkHTMLFile = checkHTMLFile;
}
