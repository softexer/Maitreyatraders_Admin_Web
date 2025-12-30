import { Component, OnInit, } from '@angular/core';
// import { ProtaskerService } from './services/protasker.service';
import { ViewChild, ElementRef, HostListener } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { MaitreyaAdminService } from './services/maitreya-admin.service';
import { OnDestroy } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Maitreya-Admin';
  // selectedLanguage: string = "ch";
  user: any;
  isLoggedIn: boolean = true;
  loading: boolean = false;
  refferObj: any;
  SmartBanner: any;
  @ViewChild("sidenav", { static: true }) sideNav!: MatSidenav;
  @ViewChild("sideNavContainer", { static: true }) sideNavContainer!: ElementRef;
  countryCode: any;
  lat: any;
  lang: any;
  selectCountryInfo: any;
  Findurl: boolean = true;
  isUrl: string = "";
  token: string = "";
  notificationsdisplay: any;
  isDarkMode: boolean = true;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobileView: boolean = false;
  logoutUser: any;
  activeItem = 'Dashboard';
  isdetailsPage: boolean = false;
  isSideNavOpen: boolean = false;
  isMainAdmin: boolean = false;
  constructor(
    private router: Router,
    private adminService: MaitreyaAdminService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.adminService.showLoader.subscribe((flag: boolean) => {
      if (this.loading !== flag) {
        this.loading = flag;
      }
    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (evt instanceof NavigationEnd) {
        this.isUrl = "" + evt.url;
        let urlstr = this.isUrl.substring(this.isUrl.lastIndexOf('/') + 1);
        console.log(urlstr)
        this.getActiveUrl(urlstr);
        if (this.isUrl != '/login') {
          this.Findurl = true;
        } else {
          this.Findurl = false;
        }
      }
      console.log(this.isUrl)
      window.scrollTo(0, 0);
    });

    this.adminService.isUserLoggedIn.subscribe((val) => {
      if (val) {
        this.isLoggedIn = true;
        this.isupdateuser();
      }
    });


  }



  ngOnInit(): void {
    // window.onbeforeunload = () => {
    //   this.clearCookies();
    // };
    // this.checkLoginStatus();
    this.checkViewport();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
    });

    window.addEventListener('resize', this.checkViewport.bind(this));


  }
  ngOnDestroy(): void {
    window.onbeforeunload = null;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }
  checkLoginStatus() {
    const token = localStorage.getItem('token');
    console.log("CHECK TOKEN IN APP:", token);
    this.isLoggedIn = !!token;
  }


  checkViewport() {
    this.isMobileView = window.innerWidth < 768;
    this.closeSideNav();
  }

  closeSideNav() {
    if (this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }
  isupdateuser() {
    let usr = localStorage.getItem('adminuser');
    console.log("user", usr)

    if (usr) {
      this.user = JSON.parse(usr);
      this.logoutUser = {
        userID: this.user.userID
      }
      console.log("mmlogeg instatus", this.isLoggedIn)
      this.isLoggedIn = true;
    }

    this.adminService.isUserLoggedIn.next(false);
  }

  closedStart() {
    document.body.style.overflow = "auto";
  }
  initializeSmartAppBanner() { }
  openedStart() {
    document.body.style.overflow = "hidden";
  }
  openSideNav() {
    this.sideNav.toggle();
    setTimeout(() => {
      // const sideNavContainer = document.getElementById('sideNavContainer');
      // if (sideNavContainer && sideNavContainer.classList.contains('mat-drawer-container-has-open')) {
      //   document.body.style.overflow = 'hidden';
      // } else {
      //   document.body.style.overflow = 'auto';
      // }
    }, 2000);
  }

  setActiveItem(label: string): void {
    this.activeItem = label;
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
  scrollCheck() {
    let mybutton = document.getElementById("myBtn");
    if (mybutton) {
      if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.style.opacity = "1";
      } else {
        mybutton.style.opacity = "0";
      }
    }
  }
  scroll() {
    window.scroll(0, 0);
  }
  toggle() {
    this.sideNav.toggle();
  }


  getActiveUrl(urlinfo: string) {
    console.log(urlinfo)
    switch (urlinfo) {
      case "dashboard":
        this.activeItem = "dashboard"
        break;
      case "rides":
        this.activeItem = "rides"
        break;
      case "clients":
        this.activeItem = "clients"
        break;
      case "clients":
        this.activeItem = "clients"
        break;
      case "mapview":
        this.activeItem = "mapview"
        break;
      case "reports":
        this.activeItem = "reports"
        break;
      case "notifications":
        this.activeItem = "notifications"
        break;
      case "settings":
        this.activeItem = "settings"
        break;
      case "logout":
        this.activeItem = "logout"
        break;

      default:
        this.activeItem = "dashboard"
        break;
    }
  }
  checkScreenSize() {
    // this.isMobile = window.innerWidth <= 768;
    const screenWidth = window.innerWidth;

    // Adjust this threshold according to your design needs
    const threshold = 768;

    if (screenWidth >= threshold) {
      // Close the sidenav when the window width is greater than or equal to the threshold
      this.sideNav.close();
    }
  }


}