# MdCompiler

[![Project Status: Concept – Minimal or no implementation has been done yet, or the repository is only intended to be a limited example, demo, or proof-of-concept.](https://www.repostatus.org/badges/latest/concept.svg)](https://www.repostatus.org/#concept)

Node.js CLI to convert markdown files to html, with Github styling.

# Example

## Input

```markdown

# I'm a Header

`python 
def foo():
    print("This is sort of cool.")
`

- Markdown is better than Word
- Microsoft Word is too complicated
- But we need easy ways to compile Markdown to HTML
```

## Compile

```shell
>compile_md -f foo.md -o foo.html -s dark
```

## Output

<img width="705" alt="compile_md-example" src="https://user-images.githubusercontent.com/57968347/138459965-b5861132-b01d-4307-8e96-566a9c00cff4.PNG">

# Setup

1. Download [Node.js](https://nodejs.org/en/download/) ([what is Node.js?](https://en.wikipedia.org/wiki/Node.js))
2. `npm install -g git+https://github.com/jdoiro3/MdCompiler.git`
3. `compile_md -h`
