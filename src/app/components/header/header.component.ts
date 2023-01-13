import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('assidebar') sidebarToggle:ElementRef;
  headerON: Boolean = false;

  constructor(public auth: AuthService) { }
  
  toggleSideNav() {
    const assidebar = this.sidebarToggle.nativeElement;
    if (assidebar) {
      if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
          document.body.classList.toggle('sb-sidenav-toggled');
          return localStorage.setItem('sb|sidebar-toggle', 'false');
      }else {
        document.body.classList.toggle('sb-sidenav-toggled');
        return localStorage.setItem('sb|sidebar-toggle', 'true');
      }
    }
  }
}
