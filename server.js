const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.set('view engine', 'ejs');


class Node {
  constructor(data, frequency) {
    this.data = data;
    this.frequency = frequency;
    this.left = null;
    this.right = null;
  }
}


function buildHuffmanTree(data) {
  const frequencyMap = new Map();

  for (const char of data) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
  }

  const priorityQueue = Array.from(frequencyMap.entries()).map(([data, frequency]) => new Node(data, frequency));
  
  while (priorityQueue.length > 1) {
    
    const node1 = priorityQueue.shift();
    const node2 = priorityQueue.shift();

    const mergedNode = new Node(null, node1.frequency + node2.frequency);
    mergedNode.left = node1;
    mergedNode.right = node2;

    
    priorityQueue.push(mergedNode);
    priorityQueue.sort((a, b) => a.frequency - b.frequency);
  }

 
  return priorityQueue[0];
}


function generateHuffmanCodes(root, code = '', codes = {}) {
  if (root) {
    if (!root.left && !root.right) {
      codes[root.data] = code;
    }
    generateHuffmanCodes(root.left, code + '0', codes);
    generateHuffmanCodes(root.right, code + '1', codes);
  }
  return codes;
}


function huffmanEncode(data, codes) {
  return data.split('').map((char) => codes[char]).join('');
}

app.post('/compress', upload.single('file'), (req, res) => {
  try {
    const fileString = req.file.buffer.toString('utf-8');
    
    
    const huffmanTree = buildHuffmanTree(fileString);
    const huffmanCodes = generateHuffmanCodes(huffmanTree);

    
    const compressedData = huffmanEncode(fileString, huffmanCodes);

    res.render('compress', { compressedData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
app.get('/', (req, res) => {
  res.render('compress')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
