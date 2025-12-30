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
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

   @Output() close = new EventEmitter<void>();
  constructor(
    private adminService: MaitreyaAdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    // private dialog: MatDialog, public dialogRef: MatDialogRef<NotificationsComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }
  notifications = [
    { title: 'Lorem Ipsum', amount: 140, date: 'Nov 15, 2023' },
    { title: 'Lorem Ipsum', amount: 140, date: 'Nov 15, 2023' },
    { title: 'Lorem Ipsum', amount: 140, date: 'Nov 15, 2023' },
    { title: 'Lorem Ipsum', amount: 140, date: 'Nov 15, 2023' }
  ];

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
