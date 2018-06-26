import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  VK_API: any;
  currentUser = undefined;
  userId: number = -1;
  isAuth = false;
  constructor(private zone: NgZone) {
    this.VK_API = window['VK'];
  }

 
  ngOnInit() {
    this.VK_API.init({ apiId: 6615622 });
    this.isLogged();
  }


  auth() {
    this.VK_API.Auth.login((data) => {  
      this.userId = data.session.user.id;
      this.userData(this.userId);
    }, this.VK_API.access.FRIENDS);
  }

  isLogged() {
    this.VK_API.Auth.getLoginStatus((data) => {

      if (data.response) {
        this.userId = data.session.mid;
        this.userData(this.userId);
      }

    });
  }

  userData (id) {
    this.VK_API.Api.call('users.get', {
      user_ids: id, 
      v:"5.73",
      fields: 'online,photo_200'
    }, (data) => {
      this.currentUser = data.response[0];
      this.VK_API.Api.call('friends.search', {
        user_id: id,
        count: 5,
        fields: 'photo_100,online',
        v:"5.73"
      }, (friends) => {
        this.zone.run(() => {
          this.currentUser.friends = friends.response.items;
          this.isAuth = true;
        })
        console.log(this.currentUser);
      });
    });
  }

  logout() {
    this.VK_API.Auth.logout(() => {
      this.isAuth = false;
    });
  }
}
