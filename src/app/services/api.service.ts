import { EventEmitter, Injectable, Output } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  @Output() note: EventEmitter<any> = new EventEmitter();

  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {}

  setNotes(value) {
    localStorage.setItem('notes', JSON.stringify(value));
  }

  getNotes() {
    if (localStorage.getItem('notes')) {
      let data = localStorage.getItem('notes');
      let notes = JSON.parse(data);
      return notes;
    } else {
      return null;
    }
  }
}
