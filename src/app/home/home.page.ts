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
  userForm: FormGroup;
  data: any = null;
  user_id: any;
  show_form: boolean = false;
  constructor(public fb: FormBuilder, private api: ApiService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(data => {
      this.api.presentLoading();
      if (data.id != undefined) {
        this.user_id = data.id;
        this.api.Get(data.id).then(data => {
          this.data = data;
          this.userForm = this.fb.group({
            name: [this.data.Name, [Validators.required]],
            email: [this.data.Email, [Validators.required, Validators.email]],
            phone_no: [this.data.Phone_no, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            gender: [this.data.Gender, [Validators.required]],
            street: [this.data.Address.Street, [Validators.required]],
            city: [this.data.Address.City, [Validators.required]],
            zip_code: [this.data.Address.Zip_code, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
            country: [this.data.Address.Country, [Validators.required]]
          })
          setTimeout(() => {
            this.api.dismissLoading();
            this.show_form = true;
          }, 1000)
        }).catch(d => {
          setTimeout(() => {
            this.api.dismissLoading();
            this.show_form = true;
          }, 1000)
        })


      }
      else {
        this.userForm = this.fb.group({
          name: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          phone_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          gender: ['', [Validators.required]],
          street: ['', [Validators.required]],
          city: ['', [Validators.required]],
          zip_code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
          country: ['', [Validators.required]]
        })

        setTimeout(() => {
          this.api.dismissLoading();
          this.show_form = true;
        }, 1000)
      }

    })

  }



  CreateUser() {
    this.api.presentLoading();
    let input = {
      "Name": this.userForm.value.name,
      "Email": this.userForm.value.email,
      "Phone_no": this.userForm.value.phone_no,
      "Gender": this.userForm.value.gender,
      "Address": {
        "Street": this.userForm.value.street,
        "City": this.userForm.value.city,
        "Zip_code": this.userForm.value.zip_code,
        "Country": this.userForm.value.country,
      }
    }
    this.api.Post(input).then(data => {
      this.api.user.emit();
      this.api.presentToast("User successfully created");
      setTimeout(() => {
        this.api.dismissLoading();
        this.router.navigate(['list']);
      }, 1000);
    }).catch(d => {
      console.log(d);
      this.api.presentToast("Please try again later");
      setTimeout(() => {
        this.api.dismissLoading();
      }, 1000);
    })
  }


  UpdateUser() {
    this.api.presentLoading();
    let input = {
      "Name": this.userForm.value.name,
      "Email": this.userForm.value.email,
      "Phone_no": this.userForm.value.phone_no,
      "Gender": this.userForm.value.gender,
      "Address": {
        "Street": this.userForm.value.street,
        "City": this.userForm.value.city,
        "Zip_code": this.userForm.value.zip_code,
        "Country": this.userForm.value.country,
      }
    }
    this.api.Update(this.user_id, input).then(data => {
      this.api.user.emit();
      this.api.presentToast("User successfully updated");
      setTimeout(() => {
        this.api.dismissLoading();
        this.router.navigate(['list']);
      }, 1000);
    }).catch(d => {
      this.api.presentToast("Please try again later");
      setTimeout(() => {
        this.api.dismissLoading();
      }, 1000);
    })
  }

  ngOnInit() {
  }

}
