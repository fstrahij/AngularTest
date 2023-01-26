import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { ContactsService } from 'src/app/services/contacts.service';
import { ContactModel } from '../../models/contact.model';

@Component({
    selector: 'app-contacts-table',
    templateUrl: './contacts-table.component.html',
    styleUrls: ['./contacts-table.component.scss'],
})
export class ContactsTableComponent implements OnInit, OnDestroy {
    finish$ = new Subject();
    visibleColumns: string[] = [
        'id',
        'firstName',
        'lastName',
        'email',
        'address',
        'phoneNumber',
        'actions',
    ];
    pageSizes = [5,10,20,50];
    isLoading = false;
    isError = false;

    page: number = 1;
    perPage: number = 20;
    totalItems: number = 0;
    totalPages: number = 0;
    contacts: ContactModel[] = [];
    searchString = '';

    constructor(private readonly contactsService: ContactsService,
                private router: Router,
                private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.fetchContacts();
    }

    getPage(page: number, isIndex: boolean = false){
        this.page = isIndex ? this.getPaginatorNumber(page) : page;
        this.fetchContacts();
    }

    getPerPage(){
        this.page = 1;
        this.fetchContacts();
    }

    getPaginatorMin(): number{
        return (this.totalPages - this.page) >= 2 ? this.page - 1 : this.page - 3;
    }

    getPaginatorMax(): number{
        const maxPages: number = 4;
        return this.getPaginatorMin() + maxPages > this.totalPages ? this.totalPages : this.getPaginatorMin() + maxPages;
    }

    getPaginatorNumber(index: number): number{
        return this.getPaginatorMin() + 1 + index; 
    }

    fetchContacts(): void {
        [this.isLoading, this.isError] = [true, false];

        const query = {
            page: this.page,
            perPage: this.perPage,
            searchString: this.searchString
        };

        console.info('Contacts query', query);

        this.contactsService
            .getContacts( query )
            .pipe(
                takeUntil(this.finish$),
                catchError(error => {
                    [this.isLoading, this.isError] = [false, true];

                    const message = 'Error while loading contacts! Try refresh page!';
                    this.openSnackBar( message, true );
                    return throwError(error);
                })
            )
            .subscribe((data) => {
                console.info('Contacts response', data);

                this.page = data.page;
                this.perPage = data.perPage;
                this.totalItems = data.totalItems;
                this.totalPages = data.totalPages;
                this.contacts = data.data;

                this.isLoading = false;
            });
    }

    editContactRoute(id?: number){
        const route = id ? ['edit-contact', id] : ['edit-contact'];
        this.router.navigate( route );
    }

    deleteContact(id: number) {
        if ( !confirm('Are you sure you want to delete contact?') ) return;

        [this.isLoading, this.isError] = [true, false];

        this.contactsService
            .deleteContact( id )
            .pipe(
                takeUntil(this.finish$),
                catchError(error => {
                    [this.isLoading, this.isError] = [false, true];

                    const message = 'Error while deleting contact!';
                    this.openSnackBar( message, true );
                    return throwError(error);
                })
            )
            .subscribe(() => {
                this.isLoading = false;

                const message = 'Contact succesfully deleted!';
                this.openSnackBar( message );
            });
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
