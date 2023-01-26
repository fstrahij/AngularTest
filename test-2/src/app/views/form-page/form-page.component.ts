import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  userForm:FormGroup;
  user: User;

  hobbies = [
  	'football',
		'handball',
		'basketball',
		'diving',
    'hiking'
	];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
  	this.userForm = this.userService.getForm( this.hobbies[0] );
  }

  setView(){
  	console.log('Set view');

  	if (!this.userForm.valid) {
  		this.userForm.markAllAsTouched();
  		return;
  	}

  	this.user = this.userService.getNewUserForm( this.userForm );
  	console.info('User', this.user);
  }

  reset(){
  	console.log('Reseting form');
  	this.userForm.reset();
  }

  remove(){
  	console.log('Removing user from view');
  	this.user = null;
  }

  save(){
  	console.log('Saving user');
  	this.userService.save( this.user );
  }

}
