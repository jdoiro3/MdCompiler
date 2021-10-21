#! /usr/bin/env node

const node_modules = require('node_modules-path');
const yargs = require("yargs");
const marked = require("marked");
const hljs   = require('highlight.js');
const fs = require('fs');
const package_json = require('../package.json');

var argv = yargs(process.argv.slice(2))
    .usage(`Usage: ${Object.keys(package_json.bin)[0]} -f [markdown file] -o [html file] -s [style to use]`)
    .example(
        `${Object.keys(package_json.bin)[0]} -f foo.md -o foo.html -s light`, 
        'compile foo.md to HTML, outputting the result to foo.html.')
    .alias('f', 'file').nargs('f', 1).describe('f', 'load a file')
    .alias('o', 'output').nargs('o', 1).describe('o', 'specify file to output, including .html')
    .alias('s', 'style').describe('s', 'style to use').choices('s', ["light", "dark"])
    .demandOption(['f'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2021')
    .argv;

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
const doc = `
<!DOCTYPE html>
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
<article class="markdown-body">
	${marked(markdownString)}
</article>`

fs.writeFileSync(argv.output,  doc);




