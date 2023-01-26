import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  isFormPageActive = true;
  isListPageActive = false; 	 	

  constructor() { }

  ngOnInit(): void {  	
    const page = window.location.pathname === '/list-page' ? 2 : 1;
    this.switchPage(page);
  }

  switchPage(activePage: number = 1){
    (activePage === 1) && this.setActivePage(true, false);
    (activePage === 2) && this.setActivePage(false, true);
  }

  private setActivePage(isForm, isList){
      [this.isFormPageActive, this.isListPageActive] = [isForm, isList];    
  }

}
