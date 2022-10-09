---
title: three-ts-template
date: 
author: Mizok
version: 0.0.1
tags: 
---

## Introduction

A webpack boilerplate that uses `ejs` as the template engine.

## Installation And Uasge

- Run `npm install` or `npm i` first to install all dependencies.
- Run `npm run dev` to start the dev-server.

### Where to put my entry `ejs` files?

You have to put your entry `ejs` files in `./src/pages`.

### I would like to make some `ejs` files sharable as templates(ex:header.ejs)，how can I make this?

- You have to put your template `ejs` files in `./src/template`.
- In your `ejs` file which you want to insert your template:

```html
<%- include('./src/template/header.ejs') %>
```

for more detail, please check links below:

- https://github.com/dc7290/template-ejs-loader  
- https://ejs.bootcss.com/  

### How to connect `ejs` file with entry `ts` file/ entry `scss` file?

Here we are actually talking about `webpack` entry chunks.

When designing this boilerplate, we tried to make chunk setting easy.

By Default, if you want your output page name to be `index.html`, and you are not going to use a specfic entry chunk, you will need:

- an `index.ejs` file in `./src/pages`  
- an `index.ts` file in `./src/ts`
- an `index.scss` file in `./src/scss`

On the other hand, if you want your output page name to be `index.html`,and using a chunk named `main`, then you will need:

- an `index.main.ejs` file in `./src/pages`  
- a `main.ts` file in `./src/ts`
- a `main.scss` file in `./src/scss`

### I want to get webpack `mode` environment argument in `ejs` and `js` files, how can I make this?

Like this (in your `ejs` file) :

```ejs
<!-- this will output development|production -->
<div><%= mode%></div>  
```

And this (in your `js` file) :

```javascript
console.log(PROCESS.MODE) // this will output development|production
```

### My `img` tag is not showing because `webpack` seems to get my `src` wrong.

You have to use `alias` path , not relative path(like below):

```html
<img src="~@img/logo.png">
```




