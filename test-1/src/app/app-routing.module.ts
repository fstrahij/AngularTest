import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsTableComponent } from './views/contacts-table/contacts-table.component';
import { EditContactComponent } from './views/edit-contact/edit-contact.component';

const routes: Routes = [
    {
        path: '',
        component: ContactsTableComponent,
    },
    {
        path: 'edit-contact',
        component: EditContactComponent,
    },
    {
        path: 'edit-contact/:id',
        component: EditContactComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
