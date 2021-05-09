# Práctica 10. Cliente y servidor para una aplicación de procesamiento de notas de texto

```
Universidad: Universidad de La laguna
Asignatura: Desarrollo de Sistemas Informaticos
Curso: 2020 - 2021
Autor: XueMei Lin
```

## 1. Introducción

El propósito de esta practica es implementar un servidor y un cliente mediante el uso de los sockets proporcionados por el modulo `net` de Node.js.

Las operaciones que vamos a implementar en esta practica esta basado en la [practica08](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-XueMei-L/)

## 2. Objetivos

- Familiarizar con el [módulo `net` de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/net.html).
- Familiarícese con la clase [`EventEmitter` del módulo `Events` de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#events_class_eventemitter).
- Usar los paquetes [yargs](https://www.npmjs.com/package/yargs) y [chalk](https://www.npmjs.com/package/chalk).

## 3. Ejercicios realizados
En esta practica, tenemos que implementar por un lado un servidor y un cliente para una aplicación de procesamiento de notas de texto.

**La parte del servidor**

```
import {createServer} from 'net';
import {note, RequestType, ResponseType} from './type';
import {NoteInstance} from './note';
import {MessageEventEmitterServer} from './eventEmitterServer';


const noteInstance1 = NoteInstance.getNoteInstance();

/**
 * Create server, every time there are people connecting from port "number", it shows the Sokets message
 */
const server = createServer((connection) => {
  const emitter = new MessageEventEmitterServer(connection);
  console.log('Client connected');

  /**
   * Every time it produces an event, 
   * it performs the command and writes the response to the request.
   */
  emitter.on('request', (data) => {
    console.log('Request received from client');
    const request: RequestType = data;
    let response: ResponseType = {type: 'add', success: false, message: [[]]};
    /**
     * For different commands
     */
    switch (request.type) {
      case 'add':
        const nota: note = {
          user: request.user,
          title: request.title,
          body: request.body,
          color: request.color,
        };
        response = noteInstance1.addNotes(nota);
        break;
      case 'update':
        response = noteInstance1.modify(request.user as string, request.title as string, request.newtitle as string);
        break;
      case 'remove':
        response = noteInstance1.remove(request.user as string, request.title as string);
        break;
      case 'list':
        response = noteInstance1.list(request.user as string);
        break;
      case 'read':
        response = noteInstance1.read(request.user as string, request.title as string);
        break;
      default:
        response = {
          type: 'add',
          success: false,
          message: [['Invalid commnad'], 'red'],
        };
        break;
    }
    console.log(`Response sent to client`);
    connection.write(JSON.stringify(response) + '\n');
    connection.end();
  });

  /**
   * Control of error
   */
  connection.on('error', (err) => {
    if (err) {
      console.log(`Connection could not be established: ${err.message}`);
    }
  });

  /**
   * Control of close Soket
   */
  connection.on('close', () => {
    console.log('Client disconnected');
  });
});server.listen(60300, () => {
  console.log('Waiting for clients to connect');
});
```

Cada vez que hay un servidor conecta mediante host `60300` , se produce una conexión entre el servidor y el cliente `const server = createServer((connection)=>` ， y dependiendo de los distintos comandos `add` `list` `modify` `remove`, el servidor realiza distintas acciones. En el proceso de espera el servidor va a mostrar un mensaje `Waiting for clients to connect`, y cuando hay cliente se conecta, mostrará el mensaje `Client connected` , y al final cuando un cliente se desconecta mostrará otro mensaje `Client disconnected`.

**La parte del cliente**

```
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
```

En este caso, lo que hace es: conectar al servidor a través del puerto `60300`, y si el cliente quiere añadir una nota (u otra acción), el servidor actuará su comando, y el cliente recibirá un mensaje donde su acción fue exista. 

El proceso es lo siguiente:

**Cuando ejecuta el servidor:** Se queda esperando que algún cliente que se conecta

![image-20210510005354277](C:\Users\linyouzi\AppData\Roaming\Typora\typora-user-images\image-20210510005354277.png)

**Cuando un cliente quiere añadir una nota nueva**: el servidor responde que su acción haya realizado correctamente o no.

![image-20210510011338743](C:\Users\linyouzi\Desktop\image-20210510011338743.png)



Como resultado, vamos a probar con los paquetes ` mocha` :

![image-20210510005248600](C:\Users\linyouzi\Desktop\image-20210510005248600.png)



## 4. Conclusiones

Es una practica muy interesante, aunque haya aprendido el tema de `Socket` en otro lenguaje, pero me resulta más interesante en typescript. Además, nos ayuda mucho a profundizar sobre el lenguaje typescript.

## 5. Bibliografía

1. [Socket](https://tutorialedge.net/typescript/typescript-socket-io-tutorial/)

2. [Apuntes de la clase](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-sockets.html)

