console.log("Hello World");

import fs from 'fs';

// läs innehålet i en katalog

// sync
const folderContent = fs.readdirSync('.');

// vilken datatyp har folderContent?
console.log(typeof folderContent); // object

// testa att iterera resultatet med en foreach iteration
folderContent.forEach(filesAndFolders => {
  // console.log(filesAndFolders)
});

// async
fs.readdir('.', (error, files) => {
  if (error) {
    console.log("Ett fel vid läsning av katalog")
  }
  console.log(files)
})

// Läs innehållet i en fil 

// sync
// ange parametrar: path, options {}
const content = fs.readFileSync('package.json', {encoding: 'utf-8'});

console.log(content)

// To string
// console.log(content.toString())

