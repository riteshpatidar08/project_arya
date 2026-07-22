// console.log('hii')

// console.log(window);

// console.log(document);

// import fs from 'fs' ;
// import  * as pdf from 'pdf-parse'
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
//read file
console.log(typeof pdf);

// console.log('file reading started ...')
// const data = fs.readFileSync('./data.txt' , 'utf-8' );
// console.log(data)
// console.log('file reading ended ...')

// fs.writeFileSync('./new.txt' , 'welcome to node js');

// fs.unlinkSync('./new.txt');

// fs.appendFileSync('./data.txt' , ' adding new data')

// const result = fs.existsSync('./data.txt');
// console.log(result)

console.log('file reading started');

fs.readFile('./data.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
console.log('file reading ended..');

fs.readFile('./product-data.pdf', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    pdf(data).then((text) => {
      console.log(text);
    });
  }
});

//package.json  generate
// package isntall krna konsa pdf-parse
const filepath = path.join(__dirname  , 'data.txt');

fs.readFile('./data.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    fs.writeFile('./copydata.txt', data, () => {});
  }
});


