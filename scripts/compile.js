const fs = require('fs');
const path = require('path');
const solc = require('solc');

const contractPath = path.resolve(__dirname, '../contracts/Imooc.sol');

const source = fs.readFileSync(contractPath, 'utf-8');

// const ret = solc.compile(source);

const input = {
  language: 'Solidity',
  sources: {
    "Imooc": {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}
var output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log(output.contracts["Imooc.sol"].CourseList);

Object.keys(output.contracts).forEach(name => {
  const filePath = path.resolve(__dirname, `../src/compiled/${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(output.contracts[name]));
  console.log(`${name}.json bingo!`);
});