import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  firestore: Firestore = inject(Firestore);
  unsubTrash;
  unsubNotes;
 
  

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList(); 
  }


  ngOnDestroy() {
    this.unsubTrash();
    this.unsubNotes();
  }


  subTrashList() {
   
    return onSnapshot(this.getTrashRef(),(list)=> {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
        
      });

    });

  }


  subNotesList() {
    
    return onSnapshot(this.getNotesRef(),(list)=> {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
        
      });

    });

  }

  

   

  getTrashRef() {
    return collection (this.firestore, 'trash');
  }


  getNotesRef() {
    return collection (this.firestore, 'notes');
  }


  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }


  setNoteObject(obj: any, id: string):Note {
    return{
      id:id,
      type:obj.type || 'note',
      titel:obj.title || '',
      content:obj.conteent || '',
      marked:obj.marked || false

    }
  }
}

