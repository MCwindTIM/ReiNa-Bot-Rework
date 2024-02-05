require('dotenv').config(); //envirment variables

//ReiNa Discord Bot with multi function
const ReiNa = require('./Core/bot.js'); //import ReiNa Class
ReiNaRework = new ReiNa(); //Create ReiNa Discord Bot Object

//Import inspect from util For Eval debugging
const { inspect } = require('util');
//Create terminal reader for input String
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
//Create function loop to keep monitor terminal input
const recursiveAsyncReadLine = () => {
  rl.question('', (toEval) => {
    try {
      console.log(inspect(eval(toEval, { depth: 0 })));
    } catch (e) {
      console.error(e);
    }
    recursiveAsyncReadLine();
  });
};
//Calling the function to get in the loop
recursiveAsyncReadLine();
