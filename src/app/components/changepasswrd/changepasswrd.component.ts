import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { OrdersComponent } from '../orders/orders.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-changepasswrd',
  templateUrl: './changepasswrd.component.html',
  styleUrls: ['./changepasswrd.component.css']
})
export class ChangepasswrdComponent implements OnInit {
  shipmentForm: any = FormGroup;
  salesprsnForm: any = FormGroup;
  submitted = false;
  //comman variables
  user: any;
  isLoggedIn: boolean = false;

  isDetails: boolean = false;
  isAddMember: boolean = false;
  ClientID: string = "";
  searchText: string = '';
  selectedCategory: string = 'All';
  categories: string[] = [];
  selectedFilter: string = 'All';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  passwordMismatch = false;
  showCurrentPwd = false;
  showNewPwd = false;
  showConfirmPwd = false;

  constructor(
    private adminService: MaitreyaAdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog, public dialogRef: MatDialogRef<HeaderComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit(): void {
  }

  toggleCurrentPwd() {
    this.showCurrentPwd = !this.showCurrentPwd;
  }
  checkPasswordMatch() {
    if (this.confirmPassword && this.newPassword) {
      this.passwordMismatch = this.newPassword !== this.confirmPassword;
    }
  }

  saveChange() {
    this.submitted = true;

    // Reset mismatch every submit
    this.passwordMismatch = false;

    // Stop if required fields missing
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      return;
    }

    // 🔴 PASSWORD MATCH CHECK
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    // ✅ All good → call API
    const payload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    console.log('Payload:', payload);
  }
}
