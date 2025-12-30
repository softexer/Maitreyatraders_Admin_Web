import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';

@Component({
  selector: 'app-singout',
  templateUrl: './singout.component.html',
  styleUrls: ['./singout.component.css']
})
export class SingoutComponent implements OnInit {
  user: any;
  isLoggedIn: boolean = false;
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private AdminService: MaitreyaAdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let usr = localStorage.getItem('MAdmin');
    if (usr) {
      this.user = JSON.parse(usr);
      console.log(this.user)
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      this.router.navigateByUrl('/login');
    }
  }

 

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  close() {
    this.router.navigateByUrl('/admin/dashboard');
  }
  submit() {
    // let payload = {
    //   userID: this.user.userID,
    //   deviceID: this.user.deviceID,
    //   deviceToken: this.user.deviceToken,
    //   deviceType: "web"
    // }
    // console.log(payload)
    // let token = localStorage.getItem('token');
    // this.AdminService.showLoader.next(true);
    // this.AdminService.LogOut(payload, token).subscribe((res: any) => {
    //   console.log(res)
    //   if (res.response === 3) {
    //     this.isLoggedIn = false;
    //     this.AdminService.showLoader.next(false);
    //     this.AdminService.Signout.next(true);
    //     this.cdr.detectChanges();
    //     localStorage.clear();
    //     localStorage.removeItem('gogouser');
    //     localStorage.removeItem('token');
    //     this.router.navigateByUrl("/login");
    //   }
    //   else {
    //     this.AdminService.showLoader.next(false);
    //   }
    // }, (err: HttpErrorResponse) => {
    //   this.openSnackBar(err.message, "");
    //   this.AdminService.showLoader.next(false);
    //   if (err.error instanceof Error) {
    //     console.warn("CSError", err.error)
    //   } else {
    //     console.warn("SSError", err.error)
    //   }
    // })
  }
}
