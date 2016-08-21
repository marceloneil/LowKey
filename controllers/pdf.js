//https://github.com/brianc/node-pdf-text
var pdfText = require('pdf-text')

var pathToPdf = "coverletter.pdf";
var fs = require('fs')
var buffer = fs.readFileSync(pathToPdf)

pdfText(buffer, function(err, chunks) {
console.log(chunks.toString());
})