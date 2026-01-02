import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PromotionsComponent } from '../promotions/promotions.component';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.css']
})
export class OfferCardComponent implements OnInit {
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
  // categories: string[] = [];
  selectedFilter: string = 'All';

  NewCategory = '';

  offerTypes = ['Buy X Get Y', 'Flat Discount', 'Percentage Discount'];

  categories = [
    { name: 'Food', sub: ['Veg', 'Non-Veg'] },
    { name: 'Beverages', sub: ['Hot', 'Cold'] },
    { name: 'Snacks', sub: ['Fried', 'Baked'] }
  ];

  products = ['Soya Chop', 'Paneer Tikka', 'Chicken Roll'];

  subCategories: string[] = [];

  imagePreview: string | null = null;

  offer: any = {
    offerType: '',
    buyQty: '',
    getQty: '',
    category: '',
    subCategory: '',
    freeProduct: ''
  };

 viewtype: string="";
  constructor(
    private adminService: MaitreyaAdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog, public dialogRef: MatDialogRef<PromotionsComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit(): void {
    this.viewtype = this.data.obj.type
  }

  close() {
    this.dialogRef.close(false);
  }

  onCategoryChange() {
    const selected = this.categories.find(
      c => c.name === this.offer.category
    );
    this.subCategories = selected ? selected.sub : [];
    this.offer.subCategory = '';
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  cancel() {
    console.log('Cancelled');
    this.dialogRef.close(false)
  }

  submit() {
    console.log('Offer Payload:', this.offer);
  }

}


