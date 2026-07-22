const path = require('path');
const os = require('os');
const fs = require('fs');
console.log(path);

console.log(os.platform());
console.log(__dirname, __filename);

const requestPath = path.join(__dirname, 'index.js');
console.log(requestPath);

console.log(path.extname('index.js'));

// D:/nodearya/index.js

const fileData = 'resume.img';

const extenstion = path.extname(fileData);
if (extenstion === '.pdf' || extenstion === '.docx') {
  console.log('accept the resume');
} else {
  console.log('format not supported');
}

const filepath = path.join(__dirname, 'copydata.txt');
console.log(filepath);
fs.readFile(filepath, 'utf-8', (err, data) => {
  console.log(data);
});

// console.log(__dirname + '\uploads\' + image.png'
// )

console.log(path.join(__dirname, 'uploads', 'img.png'));

// REPL = READ , EVALUATE , PRINT  ,
