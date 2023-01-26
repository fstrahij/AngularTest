import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  users:User[] =  []	

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  	this.users = [...this.userService.getUsers()];
  	console.info('Users Loaded', this.users);
  }

}
