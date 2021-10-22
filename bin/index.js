#! /usr/bin/env node

// import all required modules
const path = require('path')
const node_modules = require('node_modules-path');
const yargs = require("yargs");
const marked = require("marked");
const hljs   = require('highlight.js');
const fs = require('fs');
// get the key used to call index.js
const package_json = require('../package.json');
const command_name = Object.keys(package_json.bin)[0]

function fileExists(filename) {
    try {
      fs.accessSync(filename, fs.R_OK);
      return true;
    } catch (e) {
      return false;
    }
}

// setup CLI
var argv = yargs(process.argv.slice(2))
    .usage(`Usage: ${command_name} -f [markdown file] -o [html file] -s [style to use]`)
    .example(
        `${command_name} -f foo.md -o foo.html -s light`, 
        'compile foo.md to HTML, outputting the result to foo.html.')
    .alias('f', 'file').nargs('f', 1).describe('f', 'load a file')
    .alias('o', 'output').nargs('o', 1).describe('o', 'specify file to output, including .html')
    .alias('s', 'style').describe('s', 'style to use').choices('s', ["light", "dark"])
    .demandOption(['f', 'o'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2021')
    .check((argv) => {
        if (fileExists(argv.file)) {
           return true;
        }
        throw new Error('Error: filepath is not a readable file');
    })
    .check((argv) => {
        if (path.extname(argv.output) === ".html") {
            return true;
        }
        throw new Error('Error: output must be an html file');
    })
    .argv;

// set marked options for using highlight.js for code highlighting
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
});

// define styling based on user input
if (argv.style === "light" || argv.style === "dark") {
    var style_file = `github-markdown-${argv.style}.css`;
    if (argv.style === "light") {
        var code_highlight_file = `github.css`
    } else {
        var code_highlight_file = `github-dark.css`
    }
} else {
    var style_file = `github-markdown.css`;
    var code_highlight_file = `github.css`
}

const node_modules_path = node_modules();
const markdownString = fs.readFileSync(argv.file,"utf8");
const github_style = fs.readFileSync(`${node_modules_path}\\github-markdown-css\\${style_file}`, "utf8");
const code_style = fs.readFileSync(`${node_modules_path}\\highlight.js\\styles\\${code_highlight_file}`, "utf8");

const html = `
<!DOCTYPE html>
<head>
    <style>
        html {
            background-color: #0d1117;
        }
        ${code_style}
        ${github_style}
        .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }

        @media (max-width: 767px) {
            .markdown-body {
                padding: 15px;
            }
        }
    </style>
</head>
<article class="markdown-body">
	${marked(markdownString)}
</article>`

fs.writeFileSync(argv.output,  html);
console.log(`Success: ${argv.file} -> ${argv.output}`);




