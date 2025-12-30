import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  isMainAdmin: boolean = false;
  user: any;
  isLoggedIn: boolean = false;
baseUrl: string = "";
  isSideNavOpen: boolean = true;
  isdetailsPage: boolean = false;
  iscustomerPage: boolean = false;
  isbarberPage: boolean = false;
  isappointmPage: boolean = false;
  isSettingsPage: boolean = false;
  isRedmPage: boolean = false;
  issubscriPage: boolean = false;

  constructor(
    private AdminService: MaitreyaAdminService,
    private router: Router,
    private dialog: MatDialog,) {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)) // Type Guard
      .subscribe((event: NavigationEnd) => {
        console.log("Navigation Event:", event.urlAfterRedirects);
        this.isdetailsPage = event.urlAfterRedirects.includes("/admin/dashboard");
      });

  }
  ngOnInit() {
    let usr = localStorage.getItem('MAdmin');
    this.baseUrl = this.AdminService.baseUrl
    if (usr) {
      this.user = JSON.parse(usr);
      console.log(this.user)
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      this.router.navigateByUrl('/login');
    }
  }
  logOut() {
  }

  openSideNav(): void {
    this.isSideNavOpen = true;
  }

}

