import {connect} from 'net';
import * as chalk from 'chalk';
import {RequestType, ResponseType} from './type';
import {MessageEventEmitterClient} from './eventEmitterClient';


const error = chalk.bold.red;
const informative = chalk.bold.green;

/**
 * Function that performs the commands received from yang in 
 * ResquestTYPEbe format, produces a call to the client function
 */
export function clientRequest(request: RequestType) {
  const socket = connect({port: 60300});
  const client = new MessageEventEmitterClient(socket);

  /**
   * When client receive menssage, print in terminal
   */
  socket.write(JSON.stringify(request) + '\n', (err) => {
    if (err) {
      console.log(`Request could not be made: ${err.message}`);
    }
  });

  /**
   * Client receives event
   */
  client.on('message', (data) => {
    const res: ResponseType = data;
    res.message.forEach((mes) => {
      colorsprint(mes?.[1] as string, mes?.[0] as string);
    });
  });

  /**
   * In case of an error
   */
  socket.on('error', (err) => {
    console.log(err.message);
  });
}

/**
   * Methods showing the color of the test on the screen
   * @param {string} color color
   * @param {string} text title
   */
function colorsprint(color: string, text: string) {
  switch (color) {
    case 'red': console.log(chalk.bold.red(text));
      break;
    case 'yellow': console.log(chalk.bold.yellow(text));
      break;
    case 'green': console.log(chalk.bold.green(text));
      break;
    case 'blue': console.log(chalk.bold.blue(text));
      break;
    default: console.log(chalk.bold.black(text));
      break;
  }
}