
## 1.Creación de un servidor
```
import * as net from 'net';

//Crear servidor, cada vez que hay gente que conecta desde el puerto 60300, muestra el mensaje de Sokets
//y net.createServer(connection) -> Sokets
const server = net.createServer((connection) => {
  // The connection object is emitted when a new connection is made
  // It is the socket object
  console.log(connection);
});

server.listen(60300);
```

## 2. Escritura en un socket
```
import * as net from 'net';


net.createServer((connection) => {
  console.log('A client has connected.');

  //mensaje que muestra en el cliente usando el metodo write.
  // dado que un objeto Socket hereda de EventEmmiter, lo que hacemos es registrar un manejador, a 
  //partir del método on, que se ejecuta una vez que se cierra (evento close) el socket. El manejador 
  //muestra un mensaje informativo por la consola.
  connection.write(`Connection established.`);

  //se crea un evento close en el sokets, si un cliente se cierra la conexion, se muestra el mensaje
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
```

## Prueba con un fichero
```
import * as net from 'net';
import {watchFile} from 'fs';

// Servidor proporciona una vigilancia del fichero (controla si hay fichero que pasa por la linea del comando) usando watchFile
// 3 es porque en la linea del comando, la tercera puesta es para el fichero
// node dist/server.js NAME_FILE
if (process.argv.length !== 3) {
  console.log('Please, provide a filename.');
} else {
  // crear una constante para el fichero que es el 3 parametro de mi proceso.
  const fileName = process.argv[2];

  net.createServer((connection) => {
    console.log('A client has connected.');

    connection.write(`Connection established: watching file ${fileName}.\n`);

    // recibie nombre del fichero(fileName, si hay cambio en le servidor, no en el cliente, se produce lo siguiente)
    // mostrará(en el caso de que está conectado, muestra mensajes de antes y despues de la modificacion)

    watchFile(fileName, (curr, prev) => {
      connection.write(`Size of file ${fileName} was ${prev.size}.\n`);
      connection.write(`Size of file ${fileName} now is ${curr.size}.\n`);
    });

    connection.on('close', () => {
      console.log('A client has disconnected.');
    });
  }).listen(60300, () => {
    console.log('Waiting for clients to connect.');
  });
}
```


**Despues de la modificacion sobre anterior**
```
import * as net from 'net';
import {watchFile} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, provide a filename.');
} else {
  const fileName = process.argv[2];

  net.createServer((connection) => {
    console.log('A client has connected.');

    // utilizamos el estilo JSON
    /*
    Esto se consigue utilizando el método JSON.stringify, el cual recibe un objeto JSON, esto es, un conjunto de pares clave-valor separados por comas y envueltos en {...}, y devuelve la representación en cadena de dicho JSON. A esta operación también se la conoce como serialización.
    */
    connection.write(JSON.stringify({'type': 'watch', 'file': fileName}) + '\n');

    watchFile(fileName, (curr, prev) => {
      connection.write(JSON.stringify({
        'type': 'change', 'prevSize': prev.size, 'currSize': curr.size}) + '\n');
    });

    connection.on('close', () => {
      console.log('A client has disconnected.');
    });
  }).listen(60300, () => {
    console.log('Waiting for clients to connect.');
  });
}
```


## Sockets desde el punto de vista de un cliente

