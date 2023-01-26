import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  // save user to local storage
  save( user: User ){
  	const users:User[] = [...this.getUsers(), user];

  	localStorage.setItem(
        environment.LOCAL_STORAGE_DATA_KEY,
        JSON.stringify(users)
    );
  }

  // fetch users from local storage
  getUsers(): User[]{
  	const data = localStorage.getItem(environment.LOCAL_STORAGE_DATA_KEY);

  	return JSON.parse( data );
  }

  // returns new FormGroup for user form
  getForm( selectValue: string ): FormGroup{
  	return new FormGroup ({
	  	'firstName': new FormControl(null, Validators.required),
	  	'lastName': new FormControl(null, Validators.required),
	  	'email': new FormControl(null, [Validators.required, Validators.email]),
	  	'hobby': new FormControl(selectValue, Validators.required)
	  });
  }

  // returns new user from user form data
  getNewUserForm(data: FormGroup): User{
  	return new User(
  			data.get('firstName').value,
  			data.get('lastName').value,
  			data.get('email').value,
  			data.get('hobby').value
  		);
  }
}