import * as fs from 'fs';
const chalk = require('chalk');
import {note, ResponseType} from './type';


/**
 * Class NoteInstance
 */
export class NoteInstance {
  private static noteInstance: NoteInstance;
  private constructor() {
    if (fs.existsSync('./Note/')) {
      fs.mkdirSync(`./Notes/`, {recursive: true});
    }
  }

  /**
   * Method in charge of verifying that only a single is generated
   */
  public static getNoteInstance(): NoteInstance {
    if (!NoteInstance.noteInstance) {
      NoteInstance.noteInstance = new NoteInstance();
    }
    return NoteInstance.noteInstance;
  }

  /**
   * Method in charge of adding a note to the notes database
   */
  addNotes(nota: note) {
    const data = JSON.stringify(nota, null, 2);
    const ruta: string = `./Notes/${nota.user}/${nota.title}.json`;
    const test: ResponseType = {type: 'add', success: false, message: [[]]};
    if (fs.existsSync(`./Notes/${nota.user}/`)) {
      if (fs.existsSync(ruta)) {
        test.message = [['Note title taken', 'red']];
        test.success = false;
      } else {
        fs.writeFileSync(ruta, data);
        test.message = [[`New note added in ${nota.user}!`, 'green']];
        test.success = true;
      }
    } else {
      fs.mkdirSync(`./Notes/${nota.user}/`, {recursive: true});
      fs.writeFileSync(ruta, data);
      test.message = [[`New note added in ${nota.user}!`, 'green']];
      test.success = true;
    }
    return test;
  }

  /**
   * Method in charge of making a modification to the database
   */
  modify(user:string, title: string, newtitle: string) {
    const ruta: string = `./Notes/${user}/${title}.json`;
    const newruta: string = `./Notes/${user}/${newtitle}.json`;
    const test: ResponseType = {type: 'update', success: false, message: [[]]};
    if (fs.existsSync(ruta)) {
      fs.renameSync(ruta, newruta);
      test.message = [[`${title}.json rename to ${newtitle}.json`, 'green']];
      test.success = true;
    } else {
      test.message = [['You cannot modify a non-existent note!', 'red']];
      test.success = false;
    }
    return test;
  }

  /**
   * Method that to delete a note from a certain user
   */
  remove(user: string, title: string) {
    const ruta: string = `./Notes/${user}/${title}.json`;
    const test: ResponseType = {type: 'remove', success: false, message: [[]]};
    if (fs.existsSync(ruta)) {
      fs.rmSync(ruta);
      test.message = [[`Remove ${title}`, 'green']];
      test.success = true;
    } else {
      test.message = [['You cannot remove a non-existent note!', 'red']];
      test.success = false;
    }
    return test;
  }

  /**
   * Method in charge of listing the titles of the notes of a certain user
   */
  list(user: string) {
    const ruta: string = `./Notes/${user}/`;
    const test: ResponseType = {type: 'list', success: true, message: [[]]};
    test.message.pop();
    if (fs.existsSync(ruta)) {
      const titles = fs.readdirSync(ruta);
      test.message.push([`Your Notes`]);
      titles.forEach((note) => {
        const text = fs.readFileSync(ruta + note);
        const titleBody = JSON.parse(text.toString());
        test.message.push([titleBody.title, titleBody.color]);
      });
    } else {
      test.message.push(['This user has no notes!', 'red']);
      test.success = false;
    }
    return test;
  }

  /**
   * Method in charge of reading the body of a certain note
   */
  read(user: string, title: string) {
    const ruta: string = `./Notes/${user}/${title}.json`;
    const test: ResponseType = {type: 'read', success: false, message: [[]]};
    test.message.pop();
    if (fs.existsSync(ruta)) {
      const text = fs.readFileSync(ruta);
      const titleBody = JSON.parse(text.toString());
      test.message.push([titleBody.title]);
      test.message.push([titleBody.body, titleBody.color]);
      test.success = true;
    } else {
      test.message.push(['Note not found!', 'red']);
      test.success = false;
    }
    return test;
  }
}