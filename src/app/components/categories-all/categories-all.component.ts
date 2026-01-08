import { Component, OnInit } from '@angular/core';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { HostListener, ElementRef, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ChangepasswrdComponent } from '../changepasswrd/changepasswrd.component';

interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
}

@Component({
  selector: 'app-categories-all',
  templateUrl: './categories-all.component.html',
  styleUrls: ['./categories-all.component.css']
})
export class CategoriesAllComponent implements OnInit {
  // selectedCategory: string = 'Indian';
  newSubcategory: string = '';


  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  selectedCategory!: Category | null;
  selectedSubcategory!: Subcategory | null;
   editsub: boolean = false;
  constructor(
    private adminService: MaitreyaAdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private eRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.GetCategories();
  }

  GetCategories() {
    const payload = {
      categoryID: "All"
    };
    console.log(payload)
    this.adminService.showLoader.next(true);
    this.adminService.GetAllCats(payload).subscribe(
      (res: any) => {
        console.log(res);
        if (res.response === 3) {
          this.categories = res.categorydata.map((cat: any) => ({
            id: cat.categoryID,
            name: cat.categoryName,
            image: cat.CategoryImage,
            subcategories: cat.subCategorys.map((sub: any) => ({
              id: sub.subCategoryID,
              name: sub.subCategoryName
            }))
          }));

          // Auto select first category
          if (this.categories.length) {
            this.selectCategory(this.categories[0]);
          }

        } else {
          console.error("Unexpected response:", res.message);
        }

        this.adminService.showLoader.next(false);
      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching:", err.message);
        this.openSnackBar(err.message, "");
        this.adminService.showLoader.next(false);
      }
    );
  }
  selectCategory(category: Category): void {
    console.log(category)
    this.selectedCategory = category;
    this.subcategories = category.subcategories || [];
    this.selectedSubcategory = null;

    if (this.subcategories.length) {
      this.selectSubcategory(this.subcategories[0]);
    }
  }


  selectSubcategory(subcategory: Subcategory): void {
    this.selectedSubcategory = subcategory;
    console.log(this.selectedSubcategory)
  }


  addSubcategory() {
    if (!this.newSubcategory.trim()) return;
    if (!this.selectedCategory) return;
   

    console.log(this.editsub)

    if (!this.editsub) {
      console.log(this.selectedCategory)
      let payload =
      {
        categoryID: this.selectedCategory.id,
        subCategoryName: this.newSubcategory.trim()
      }
      console.log(payload)
      this.adminService.Add_SubCategory(payload).subscribe(
        (res: any) => {
          console.log(res);
          if (res.response === 3) {
            this.newSubcategory = '';
            this.GetCategories();
          } else {
            console.error("Unexpected response:", res.message);
            this.openSnackBar(res.message, "");
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
    else {
       if(!this.selectedSubcategory) return;
      console.log(this.selectedCategory)
      let payload =
      // {
      //   categoryID: this.selectedCategory.id,
      //   subCategoryName: this.newSubcategory.trim()
      // }
      {
        categoryID: this.selectedCategory.id,
        subCategoryID: this.selectedSubcategory.id,
        subCategoryName:this.newSubcategory
      }
      console.log(payload)
      this.adminService.Update_SubCategory(payload).subscribe(
        (res: any) => {
          console.log(res);
          if (res.response === 3) {
            this.newSubcategory = '';
            this.editsub = false;
            this.GetCategories();
          } else {
            console.error("Unexpected response:", res.message);
            this.openSnackBar(res.message, "");
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

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: "red-snackbar",
    });
  }
 
  editSubcategory(sub: Subcategory) {
    console.log(sub);
    this.newSubcategory = sub.name
    this.editsub = true;
     console.log(this.editsub)


  }

  deleteSubcategory(sub: Subcategory) {
    console.log(sub);
    if (!this.selectedCategory) return;
       let payload = {
        // categoryID: this.selectedCategory.id,
         subCategoryID: sub.id,
        //  subCategoryName: sub.name
        }
        console.log(payload)
        this.adminService.Del_SubCat(payload).subscribe(
          (res: any) => {
            console.log(res);
            if (res.response === 3) {
               this.openSnackBar(res.message, "");
              this.GetCategories();

            } else {
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


  uploadImage(index: number) {
    alert('Upload image clicked for index ' + index);
  }


  AddNewCategory() {
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
        console.log(res)
        let payload = {
          categoryName: res.categoryName,
          subcategory: [{ "subCategoryName": "" }]
        }
        this.adminService.AddCategory(payload).subscribe(
          (res: any) => {
            console.log(res);
            if (res.response === 3) {
              this.GetCategories();

            } else {
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
    })
  }
}
