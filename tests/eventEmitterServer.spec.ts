import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterServer} from '../src/eventEmitterServer';
import {RequestType} from '../src/type';


describe('Prueba de EventEmitterServer', () => {
    it('01 - Test for eventEmitterServer', (done) => {
      const socket = new EventEmitter();
      const server = new MessageEventEmitterServer(socket);

      server.on('request', (solicitud: RequestType) => {
        expect(solicitud.type).to.be.equal("add");
        expect(solicitud.user).to.be.equal("alu");
        expect(solicitud.title).to.be.equal("This is a test");
        expect(solicitud.body).to.be.equal("Test");
        expect(solicitud.color).to.be.equal("blue");
        done();
      });
  
      socket.emit('data', '{"type": "add",');
      socket.emit('data', ' "user": "alu", ');
      socket.emit('data', `"title": "This is a test", `);
      socket.emit('data', `"body": "Test"`);
      socket.emit('data', `, "color": "blue"}\n`);;
      socket.emit('end');
    });

    it('02 - Test for eventEmitterServer', (done) => {
        const socket = new EventEmitter();
        const server = new MessageEventEmitterServer(socket);
  
        server.on('request', (solicitud: RequestType) => {
          expect(solicitud.type).to.be.equal("read");
          expect(solicitud.user).to.be.equal("alu");
          expect(solicitud.title).to.be.equal("This is test02");
          expect(solicitud.body).to.be.equal("Test");
          expect(solicitud.color).to.be.equal("green");
          done();
        });
    
        socket.emit('data', '{"type": "read",');
        socket.emit('data', ' "user": "alu", ');
        socket.emit('data', `"title": "This is test02", `);
        socket.emit('data', `"body": "Test"`);
        socket.emit('data', `, "color": "green"}\n`);;
        socket.emit('end');
      });
  });