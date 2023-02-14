import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { contactsData } from '../data/contacts.data';
import { ContactModel, ContactWriteModel } from '../models/contact.model';
import { PageModel } from '../models/page.model';
import { DataService, GenericData } from './data.service';

@Injectable({ providedIn: 'root' })
export class ContactsService {
    constructor(private readonly dataService: DataService) {}

    getContacts(query?: GetContactsQuery): Observable<PageModel<ContactModel>> {
        return this.dataService.readData(this.getInitialSeed()).pipe(
            map((data: GenericData<ContactModel>) => {
                const contacts = data.data;
                const page = query?.page || 1;
                const perPage = query?.perPage || 20;
                const searchString = query?.searchString?.toLowerCase() || '';
                const foundContacts = searchString
                    ? contacts.filter(
                          (c) =>
                              c.firstName
                                  .toLowerCase()
                                  .includes(searchString) ||
                              c.lastName.toLowerCase().includes(searchString) ||
                              c.emailAddress
                                  ?.toLowerCase()
                                  .includes(searchString)
                      )
                    : contacts;

                const thisPageFirstIndex = (page - 1) * perPage;
                const nextPageFirstIndex = thisPageFirstIndex + perPage;

                const totalItems = foundContacts.length;
                const totalPages = Math.ceil(totalItems / perPage);

                return {
                    page,
                    perPage,
                    totalItems,
                    totalPages,
                    data: foundContacts
                        .filter(
                            (_, i) =>
                                i >= thisPageFirstIndex &&
                                i < nextPageFirstIndex
                        )
                        .map((c) => ({ ...c })),
                };
            })
        );
    }

    getContactById(id: number): Observable<ContactModel> {
        return this.findById(id).pipe(
            map((foundContact: ContactModel) => {
                return { ...foundContact };
            })
        );
    }

    createContact(contact: ContactWriteModel): Observable<ContactModel> {
        return this.dataService.readData(this.getInitialSeed()).pipe(
            concatMap((data: GenericData<ContactModel>) => {
                const contacts = data.data;
                const newContact = {
                    ...contact,
                    id: data.idCounter + 1,
                } as ContactModel;
                const newContacts = [...contacts, newContact];
                return this.dataService
                    .writeData({
                        idCounter: data.idCounter + 1,
                        data: newContacts,
                    })
                    .pipe(
                        map((_) => {
                            return { ...newContact };
                        })
                    );
            })
        );
    }

    updateContact(id: number, contact: ContactWriteModel): Observable<unknown> {
        return this.dataService.readData(this.getInitialSeed()).pipe(
            switchMap((data: GenericData<ContactModel>) => {
                const contacts = data.data;
                const foundContact = contacts.find((c) => c.id === id);

                if (!foundContact) {
                    throw new Error('Contact not found');
                }

                foundContact.firstName = contact.firstName;
                foundContact.lastName = contact.lastName;
                foundContact.emailAddress = contact.emailAddress;
                foundContact.address = contact.address;
                foundContact.phoneNumber = contact.phoneNumber;

                return this.dataService.writeData({
                    data: contacts,
                    idCounter: data.idCounter,
                });
            })
        );
    }

    deleteContact(id: number): Observable<unknown> {
        return this.dataService.readData(this.getInitialSeed()).pipe(
            concatMap((data: GenericData<ContactModel>) => {
                const contacts = data.data;
                const index = contacts.findIndex((c) => c.id === id);

                if (index === -1) {
                    throw new Error('Contact not found');
                }

                contacts.splice(index, 1);

                return this.dataService.writeData({
                    data: contacts,
                    idCounter: data.idCounter,
                });
            })
        );
    }

    //#region Private
    private findById(id: number): Observable<ContactModel> {
        return this.dataService.readData(this.getInitialSeed()).pipe(
            map((data: GenericData<ContactModel>) => {
                const contacts = data.data;
                const foundContact = contacts.find((c) => c.id === id);

                if (!foundContact) {
                    throw new Error('Contact not found');
                }

                return foundContact;
            })
        );
    }

    private getInitialSeed(): GenericData<ContactModel> {
        return {
            idCounter: contactsData.length,
            data: contactsData,
        };
    }
    //#endregion
}

export interface GetContactsQuery {
    page?: number;
    perPage?: number;
    searchString?: string;
}
