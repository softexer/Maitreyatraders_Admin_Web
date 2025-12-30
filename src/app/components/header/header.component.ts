import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ChangepasswrdComponent } from '../changepasswrd/changepasswrd.component';

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
  ) { }




  ngOnInit(): void {
    this.baseUrl = this.adminService.baseUrl;
    // let usr = localStorage.getItem('aiuser');
    // if (usr) {
    //   this.user = JSON.parse(usr);
    //   this.isLoggedIn = true;
    //   this.adminname = this.user.FirstName + ' ' + this.user.LastName;
    // } else {
    //   this.isLoggedIn = false;
    //   this.router.navigateByUrl('/login');
    // }


  }

  notification() {
  }


  // showNotifications = false;

  showSearch = false;
  showNotifications = false;
  showAdmin = false;

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.showNotifications = false;
    this.showAdmin = false;
  }

  // toggleNotifications() {
  //   this.showNotifications = !this.showNotifications;
  //   this.showSearch = false;
  //   this.showAdmin = false;
  // }

  toggleAdmin() {
    this.showAdmin = !this.showAdmin;
    this.showSearch = false;
    this.showNotifications = false;
  }

  toggleNotifications() {
      this.showSearch = false;
    this.showAdmin = false;
    this.showNotifications = !this.showNotifications;
    // let dialogRef = this.dialog.open(NotificationsComponent, {
    //   panelClass: 'col-md-3',
    //   hasBackdrop: true,
    //   disableClose: true,
    //   // data: nav_data,
    // });

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
        // // this.AdminService.showLoader.next(true);
      }
    })
  }

  signout(){
      this.router.navigateByUrl('/admin/signout')
  }
  PasswordChng(){
     this.showSearch = false;
    this.showAdmin = false;
    this.showNotifications = false;
     let dialogRef = this.dialog.open(ChangepasswrdComponent, {
      width: '320px',
      panelClass: 'notification-dialog',
      backdropClass: 'transparent-backdrop',
      hasBackdrop: true,
      disableClose: false,
      // position: {
      //   top: '60px',
      //   right: '20px'
      // }
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
        // // this.AdminService.showLoader.next(true);
      }
    })
  }
}