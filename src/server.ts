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