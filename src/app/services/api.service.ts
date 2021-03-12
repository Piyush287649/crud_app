import { EventEmitter, Injectable, Output } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  @Output() user: EventEmitter<any> = new EventEmitter();
  baseUrl = "https://crud-ionic-app-41c34-default-rtdb.firebaseio.com/users";

  constructor(public http: HttpClient, public toastController: ToastController,
    public loadingController: LoadingController) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      // duration: 2000
    });
    await loading.present();
  }

  async dismissLoading() {
    this.loadingController.dismiss();
  }

  public Post(formData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + ".json", formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public Get(id) {
    return new Promise((resolve, reject) => {
      if (id != null) {
        this.http.get(this.baseUrl + '/' + id + ".json")
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      }
      else {
        this.http.get(this.baseUrl + ".json")
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      }
    });
  }



  public Delete(id) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.baseUrl + '/' + id + ".json")
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public Update(id, data) {
    return new Promise((resolve, reject) => {
      this.http.patch(this.baseUrl + '/' + id + ".json", data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}
