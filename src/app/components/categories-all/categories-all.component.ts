import { Component, OnInit } from '@angular/core';
import { CategoryAddComponent } from '../category-add/category-add.component';
import {  HostListener,  ElementRef,  } from '@angular/core';
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
  selector: 'app-categories-all',
  templateUrl: './categories-all.component.html',
  styleUrls: ['./categories-all.component.css']
})
export class CategoriesAllComponent implements OnInit {  
  selectedCategory: string = 'Indian';
  newSubcategory: string = '';

  subcategories: any = {
    Indian: [
      'Frozen Veg Food',
      'Sauces / Pastes',
      'Frozen Vegan Buns'
    ],
    Malaysian: [
      'Frozen Vegetarian Food',
      'Frozen Vegan Dim Sum'
    ]
  };
  constructor(
      private adminService: MaitreyaAdminService,
      private router: Router,
      private snackBar: MatSnackBar,
      private dialog: MatDialog,
      private eRef: ElementRef
    ) { }
  
  ngOnInit(): void {
    
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  addSubcategory() {
    if (!this.newSubcategory.trim()) return;

    this.subcategories[this.selectedCategory].push(this.newSubcategory);
    this.newSubcategory = '';
  }

  editSubcategory(index: number) {
    alert('Edit clicked for index ' + index);
  }

  uploadImage(index: number) {
    alert('Upload image clicked for index ' + index);
  }

  deleteSubcategory(index: number) {
    this.subcategories[this.selectedCategory].splice(index, 1);
  }

  AddNewCategory(){
     let dialogRef = this.dialog.open(CategoryAddComponent, {
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
