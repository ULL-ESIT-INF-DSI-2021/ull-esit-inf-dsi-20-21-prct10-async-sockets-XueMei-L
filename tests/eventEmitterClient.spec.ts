import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterClient} from '../src/eventEmitterClient';
import {MessageEventEmitterServer} from '../src/eventEmitterServer';

describe('Prueba de EventEmitterClient', () => {
  it('02 - Test for eventEmitterClient', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);

    client.on('message', (message) => {
      expect(message).to.be.eql({'type': 'add', 'success': true, 'message': [['New note added!', 'green']]});
      done();
    });

    socket.emit('data', '{"type": "add", "success": true');
    socket.emit('data', ', "message": [["New note added!", "green"]]}');
    socket.emit('data', '\n');
  });

  it('02 - Test for eventEmitterClient', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);

    client.on('message', (message) => {
      expect(message).to.be.eql({'type': 'add', 'success': true, 'message': [['New note added!', 'blue']]});
      done();
    });

    socket.emit('data', '{"type": "add", "success": true');
    socket.emit('data', ', "message": [["New note added!", "blue"]]}');
    socket.emit('data', '\n');
  });
});


