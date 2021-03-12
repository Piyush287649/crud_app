import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  userList: any = [];
  empty: boolean = false;
  userListSearch: any = [];
  constructor(private api: ApiService, private router: Router, public alertController: AlertController) {
    this.getUsers();
    this.api.user.subscribe(data => {
      this.getUsers();
    })
  }

  getUsers() {
    this.userList = [];
    this.userList = [];
    this.api.Get(null).then(data => {
      console.log(data);
      if (data != null) {
        this.empty = false;
        Object.entries(data).map(item => {
          this.userList.push({ id: item[0], userData: item[1] });
        })

        this.userListSearch = this.userList;
        console.log(this.userList);
      }
      else {
        this.empty = true;
      }
      console.log(this.userList);
    }).catch(d => {
      console.log(d);
    })
  }

  CreateUser() {
    this.router.navigate(['home']);
  }

  DeleteUser(id) {
    console.log(id);
    this.api.presentLoading();
    this.api.Delete(id).then(data => {
      console.log(data);
      setTimeout(() => {
        this.api.presentToast("Successfully deleted");
        this.api.dismissLoading();
      }, 1000);
      this.getUsers();
    }).catch(d => {
      console.log(d);
      setTimeout(() => {
        this.api.presentToast("Please try again");
        this.api.dismissLoading();
      }, 1000);
    })
  }

  UpdateUser(id) {
    this.router.navigate(['home'], { queryParams: { id: id } })
  }

  onInput(evt) {
    if (!evt.target.value) {
      this.userList = this.userListSearch;
    } else {
      this.userList = this.userListSearch.filter(e => {
        var name = e[1].Name.toLowerCase();
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
          checked: true
        },
        {
          name: 'desc',
          type: 'radio',
          label: 'desc',
          value: 'desc'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (value) => {
            console.log(type);
            console.log(value);
            this.sort(type, value);
          }
        }
      ]
    });

    await alert.present();
  }

  sort(type, value) {
    if (type == 'Name' || type == 'Email' || type == 'Gender') {
      this.userList = this.userListSearch.sort(function (a, b) {
        var x = a['userData'][type]; var y = b['userData'][type];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
      if (value == 'asc') {
        this.userList.reverse();
      }
      else { }
    }
    else {
      this.userList = this.userListSearch.sort(function (a, b) {
        var x = a['userData']['Address'][type]; var y = b['userData'][type];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
      if (value == 'asc') {
        this.userList.reverse();
      }
      else { }
    }


  }

  ngOnInit() {
  }

}
