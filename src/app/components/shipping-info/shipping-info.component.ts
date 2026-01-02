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
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.css']
})
export class ShippingInfoComponent implements OnInit {
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

  dataInfo: any;
  editable: boolean = false;
  hdr: string = '';
  hdr2: string = '';
  tracking = {
    courierName: '',
    shippingDate: '',
    trackingId: ''
  };
  constructor(
    private adminService: MaitreyaAdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog, public dialogRef: MatDialogRef<OrdersComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit(): void {
  }


  addTracking() {
    this.submitted = true;
    if (!this.tracking.courierName ||
      !this.tracking.shippingDate ||
      !this.tracking.trackingId) {
      return;
    }
    const formattedDate = this.formatDate(this.tracking.shippingDate);
    console.log('Tracking Details:', this.tracking);
    let obj = {
      submitted: this.submitted,
      cname: this.tracking.courierName,
      shipdate: formattedDate,
      id: this.tracking.trackingId
    }
    this.dialogRef.close(obj)
    this.submitted = false; // reset
  }

  formatDate(date: string): string {
    if (!date) return '';

    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

}
