import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  noteForm: FormGroup;
  data: any = null;
  noteId: any;
  show_form: boolean = false;
  indexNo: number;
  notes: any[] = [];
  constructor(
    public fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data.id != undefined) {
        this.noteId = data.id;
        let noteList = this.api.getNotes();
        this.data = noteList.find((note) => note.id == this.noteId);
        this.noteForm = this.fb.group({
          title: [this.data.title, [Validators.required]],
          content: [this.data.content, [Validators.required]],
        });
        this.show_form = true;
      } else {
        this.noteForm = this.fb.group({
          title: ['', [Validators.required]],
          content: ['', [Validators.required]],
        });
        this.show_form = true;
      }
    });
  }
  ngOnInit() {
    let data = this.api.getNotes();
    this.notes = data == null ? [] : data;
    this.indexNo = this.notes.length;
  }
  createNote() {
    let input = {
      id: this.indexNo,
      title: this.noteForm.value.title,
      content: this.noteForm.value.content,
    };
    this.indexNo = this.indexNo + 1;
    this.notes.push(input);
    this.api.setNotes(this.notes);
    this.api.note.emit();
    this.router.navigate(['list']);
  }

  updateNote() {
    let input = {
      id: this.noteId,
      title: this.noteForm.value.title,
      content: this.noteForm.value.content,
    };
    this.notes[this.noteId] = input;
    this.api.setNotes(this.notes);
    this.api.note.emit();
    this.router.navigate(['list']);
  }
}
