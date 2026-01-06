import { Component, HostListener, OnInit, ElementRef, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ChangepasswrdComponent } from '../changepasswrd/changepasswrd.component';
import { SearchPageComponent } from '../search-page/search-page.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //comman variables
  user: any;
  adminuser: any;
  isLoggedIn: boolean = false;
  adminname: string = "Lorem ipsum";
  baseUrl: string = '';
  //header css
  notificationbadge: number = 0;
  UserActiveStatus: boolean = false;

  constructor(
    private adminService: MaitreyaAdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private eRef: ElementRef
  ) { }




  ngOnInit(): void {
    this.baseUrl = this.adminService.baseUrl;
    let usr = localStorage.getItem('MAdmin');
    this.baseUrl = this.adminService.baseUrl
    if (usr) {
      this.user = JSON.parse(usr);
      console.log(this.user)
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      this.router.navigateByUrl('/login');
    }


  }

  notification() {
  }


  // showNotifications = false;

  showSearch = false;
  showNotifications = false;
  showAdmin = false;
  searchText: string = "";
  displaylist: boolean = false;

  closeAll() {
    this.showSearch = false;
    this.showNotifications = false;
    this.showAdmin = false;
  }
  closeSearch() {
    this.showSearch = false;
    this.searchText = "";
    this.displaylist = false;
  }

  // 🔴 Detect click outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeAll();
    }
  }

  toggleSearch() {
    this.closeAll();
    this.showSearch = true;

  }
  AllSearchItems: Array<any> = [];
  GotoSearch() {
    if (!this.searchText || !this.searchText.trim()) {
      // this.displaylist = false;
      return;
    }

    const payload = {
      adminuniqueID: this.user.adminuniqueID,
      searchText: this.searchText
    };
    this.displaylist = true;
    this.adminService.showLoader.next(true);
    this.adminService.SearchinHdr(payload).subscribe(
      (res: any) => {
        console.log(res)
        if (res.response === 3) {
          this.AllSearchItems = res.SearchProducts || [];
          //  this.displaylist = this.AllSearchItems.length > 0;
        } else {
          this.AllSearchItems = [];
          console.error("Unexpected response:", res.message);
        }
        this.adminService.showLoader.next(false);
      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching:", err);
        this.openSnackBar(err.message, "");
        this.adminService.showLoader.next(false);
      }
    );


  }

  toggleAdmin() {

    this.closeAll();
    this.showAdmin = !this.showAdmin;
  }
  gotoAllProducts() { }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: "red-snackbar",
    });
  }
  toggleNotifications() {
    this.closeAll();
    this.showNotifications = !this.showNotifications;
    let dialogRef = this.dialog.open(NotificationsComponent, {
      width: '320px',
      panelClass: 'notification-dialog',
      backdropClass: 'transparent-backdrop',
      hasBackdrop: true,
      disableClose: false,
      position: {
        top: '60px',
        right: '20px'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // console.log(res)
        // const dispatchedDate = new Date(res.dis_date).getTime().toString();
        // const expectedDeliveryDate = new Date(res.exp_date).getTime().toString();
        // let payload = {
        //   // adminuserID: this.user.userID,
        //   // orderID: ship.orderID,
        //   // courierCompanyName: res.cname,
        //   // dispatchedDate: dispatchedDate,
        //   // expectedDeliveryDate: expectedDeliveryDate,
        //   // TrackingID: res.trk_id,
        // }
        // let token = localStorage.getItem("token");
        // console.log(payload);
        // // this.adminService.showLoader.next(true);
      }
    })
  }

  ProductView(pd: any){

  }
  signout() {
    this.router.navigateByUrl('/admin/signout')
  }
  PasswordChng() {
    this.closeAll();
    let dialogRef = this.dialog.open(ChangepasswrdComponent, {
      width: '320px',
      panelClass: 'notification-dialog',
      backdropClass: 'transparent-backdrop',
      hasBackdrop: true,
      disableClose: false,

    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

      }
    })
  }
}