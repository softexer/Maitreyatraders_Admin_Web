import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { OrdersComponent } from '../orders/orders.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {
  user: any;
  isLoggedIn: boolean = false;
  baseUrl: string = "";
  searhItem: string = "";
  @Output() close = new EventEmitter<void>();
  AllSearchItems: Array<any> = [];
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    // private dialog: MatDialog, public dialogRef: MatDialogRef<NotificationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private AdminService: MaitreyaAdminService
  ) { }

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
    if (this.data != '' || this.data == null) {
      this.searhItem = this.data.searchText;
      this.Calltoapi();
    }
  }
  Calltoapi() {
    const payload = {
      adminuniqueID: this.user.adminuniqueID,
      searchText : this.searhItem
    };

    this.AdminService.showLoader.next(true);
    this.AdminService.SearchinHdr(payload).subscribe(
      (res: any) => {
        console.log(res)
        if (res.response === 3) {
          this.AllSearchItems = res.SearchProducts

        } else {
          console.error("Unexpected response:", res.message);
        }
        this.AdminService.showLoader.next(false);
      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching:", err);
        this.openSnackBar(err.message, "");
        this.AdminService.showLoader.next(false);
      }
    );
  }
  markAllRead() {
    this.openSnackBar('All notifications marked as read', '');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: "red-snackbar",
    });
  }
}
