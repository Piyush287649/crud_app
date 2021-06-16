import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage {
  noteList: any = [];
  empty: boolean = false;
  noteListSearch: any = [];
  constructor(
    private api: ApiService,
    private router: Router,
    public alertController: AlertController
  ) {
    this.getNotes();
    this.api.note.subscribe((data) => {
      this.getNotes();
    });
  }

  getNotes() {
    this.noteList = this.api.getNotes();
    this.noteListSearch = this.noteList;
  }

  Createnote() {
    this.router.navigate(['home']);
  }

  Deletenote(id) {
    if (this.noteListSearch.length === 1) {
      let result = this.noteListSearch.find((note) => note.id == id);
      if (result) {
        this.noteListSearch = [];
        this.noteList = [];
        localStorage.removeItem('notes');
      }
    } else {
      this.noteListSearch = this.noteListSearch.splice(id, 1);
      this.noteList = this.noteListSearch;
      this.api.setNotes(this.noteListSearch);
    }
  }

  Updatenote(id) {
    this.router.navigate(['home'], { queryParams: { id: id } });
  }

  onInput(evt) {
    if (!evt.target.value) {
      this.noteList = this.noteListSearch;
    } else {
      this.noteList = this.noteListSearch.filter((e) => {
        var name = e.title.toLowerCase();
        var value = evt.target.value.toLowerCase();
        return name.includes(value);
      });
    }
  }
  segmentChanged(value) {
    this.presentAlertRadio(value);
  }
  async presentAlertRadio(type) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Radio',
      inputs: [
        {
          name: 'asc',
          type: 'radio',
          label: 'asc',
          value: 'asc',
          checked: true,
        },
        {
          name: 'desc',
          type: 'radio',
          label: 'desc',
          value: 'desc',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Ok',
          handler: (value) => {
            this.sort(type, value);
          },
        },
      ],
    });

    await alert.present();
  }

  sort(type, value) {
    if (type == 'title' || type == 'content') {
      this.noteList = this.noteListSearch.sort(function (a, b) {
        var x = a[type];
        var y = b[type];
        return x < y ? -1 : x > y ? 1 : 0;
      });
      if (value == 'asc') {
      } else {
        this.noteList.reverse();
      }
    }
  }
}
