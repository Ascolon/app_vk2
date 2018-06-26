import { Component, OnInit, NgZone } from '@angular/core';
import { VK } from './index.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  currentUser = undefined;
  userId: number = -1;
  isAuth = false;
  constructor(private zone: NgZone) {

  }

 
  ngOnInit() {
    VK.init({ apiId: 6615622 });
    if (localStorage.getItem('VKUser')) {
      this.userId = +localStorage.getItem('VKUser');
      this.userData(this.userId);
    }
  }


  auth() {
    VK.Auth.login((data) => {  
      this.userId = data.session.user.id;
      this.userData(this.userId);
      localStorage.setItem('VKUser', this.userId.toString());
    }, VK.access.FRIENDS);
  }

  isLogged() {
    VK.Auth.getLoginStatus((data) => {

      if (data.response) {
        this.userId = data.session.mid;
        this.userData(this.userId);
      }
    });
  }

  userData (id) {
    VK.Api.call('users.get', {
      user_ids: id, 
      v:"5.73",
      fields: 'online,photo_200'
    }, (data) => {
      this.currentUser = data.response[0];
      VK.Api.call('friends.search', {
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
    VK.Auth.logout(() => {
      this.isAuth = false;
      localStorage.removeItem('VKUser');
    });
  }
}
