import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormPageComponent } from './views/form-page/form-page.component';
import { ListPageComponent } from './views/list-page/list-page.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'form-page',
		pathMatch: 'full'
	},
	{
		path: 'form-page',
		component: FormPageComponent
	},
	{
		path: 'list-page',
		component: ListPageComponent
	}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
