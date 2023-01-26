import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { ContactsService } from 'src/app/services/contacts.service';
import { ContactWriteModel } from '../../models/contact.model';
@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit-contact.component.html',
    styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit, OnDestroy {
    finish$ = new Subject();
	contactForm: FormGroup = new FormGroup({
		'firstName': new FormControl(null, Validators.required),
		'lastName': new FormControl(null, Validators.required),
		'emailAddress': new FormControl(null, Validators.email),
		'address': new FormControl(null),
		'phoneNumber': new FormControl(null, [Validators.pattern('^[0-9+ ]*$')])
	});

	id: number = -1;
    isLoading = false;

    constructor(private readonly contactsService: ContactsService,
    			private router: Router,
    			private route: ActivatedRoute,
                private snackBar: MatSnackBar) {}

    ngOnInit() {
    	this.id = +this.route.snapshot.params['id'];

    	this.fetchContact();
    }

    save(){
    	if (this.contactForm.valid) {
    		this.isLoading = true;

    		let message = isNaN(this.id) ? 'New contact created!' : 'Contact updated success!'
    		const observable = isNaN(this.id) ? 
    			this.contactsService.createContact( this.constructContact() ) : this.contactsService.updateContact( this.id, this.constructContact() );

			observable
			.pipe(
                takeUntil(this.finish$),
                catchError(error => {
                    this.isLoading = false;

                    message = 'Error while saving contact data!';
                    this.openSnackBar( message, true );
                    return throwError(error);
                })
            )
            .subscribe(()=> {
                this.openSnackBar( message );
            	this.isLoading = false;
            }); 
    		
    	}else{
    		this.contactForm.markAllAsTouched();
    	}
    }

    cancelClick(): void {
        this.router.navigate( [''] );
    }

    private fetchContact(): void{
    	if (isNaN(this.id)) return;

    	this.isLoading = true;

    	console.log(`Edited contact id ${this.id}`);

		this.contactsService
			.getContactById( this.id )
			.pipe(
                takeUntil(this.finish$),
                catchError(error => {
                    this.isLoading = false;

                    const message = 'Error while loading contact! Try refresh page!';
                    this.openSnackBar( message, true );
                    return throwError(error);
                })
            )
			.subscribe(contact => {
				console.info('Contact loaded', contact);

				this.contactForm.patchValue({
					firstName: contact.firstName,
					lastName: contact.lastName,
					emailAddress: contact.emailAddress,
					address: contact.address,
					phoneNumber: contact.phoneNumber,
				});
    			this.isLoading = false;
			});
    	
    }

    private constructContact(): ContactWriteModel{
    	return {    		
			firstName: this.contactForm.get('firstName')?.value,
			lastName: this.contactForm.get('lastName')?.value,
			emailAddress: this.contactForm.get('emailAddress')?.value,
			address: this.contactForm.get('address')?.value,
			phoneNumber: this.contactForm.get('phoneNumber')?.value,
    	}
    }

    private openSnackBar(message: string, isError: boolean = false){
        const action = 'Close';
        const styleClass = isError ? 'snackbar-error' : 'snackbar-success';
        this.snackBar.open(message, action, {
        	duration: 10000,
            panelClass: [styleClass]
        });
    }

    ngOnDestroy(): void{
        this.finish$.next();
        this.finish$.complete();
    }
}
