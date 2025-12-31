import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoriesAllComponent } from '../categories-all/categories-all.component';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {
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

  NewCategory = '';

  constructor(
    private adminService: MaitreyaAdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog, public dialogRef: MatDialogRef<CategoriesAllComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(false);
  }
  submit() {
    this.submitted = true;

    // validation
    if (!this.NewCategory || !this.NewCategory.trim()) {
      return;
    }

    const payload = {
      categoryName: this.NewCategory.trim()
    };

    // close dialog and send data back
    this.dialogRef.close(payload);
  }
}

