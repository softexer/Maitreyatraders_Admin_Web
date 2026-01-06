import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';

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
interface Currency {
  code: string;
  symbol: string;
}


@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})
export class AddNewProductComponent {
  user: any;
  isLoggedIn: boolean = false;
  baseUrl: string = "";

  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  selectedCategory!: Category | null;
  selectedSubcategory!: Subcategory | null;
  isSubCategoryEnabled = false;
  weightUnits: string[] = ['g', 'kg', 'ml', 'ltr'];
  stockStatuses: string[] = [
    'In Stock',
    'Out of Stock',
    'Low Stock'
  ];
  formData = {
    basicDetails: {
      productName: '',
      productHighlights: '',
      productDescription: '',
      category: null as Category | null,
      subCategory: null as Subcategory | null
    },

    pricing: {
      productPrice: null as number | null,
      discountedPrice: null as number | null,

      currency: 'INR',
      currencySymbol: '₹',

      weight: null as number | null,
      weightUnit: 'g',

      taxIncluded: true
    },

    expiration: {
      startDate: '',
      endDate: '',
      start_eph: '',
      end_eph:''
    },

    inventory: {
      unlimited: true,
      stockQuantity: 'Unlimited',
      stockStatus: 'In Stock',

      highlight: false
    }
  };
  selectedThumbnailIndex: number | null = null;
  mainImagePreview: string | null = null;
  thumbnailPreviews: string[] = [];

  mainImageFile: File | null = null;
thumbnailFiles: File[] = [];

  errors: any = {};
  pricingErrors: any = {};
  pricingTableError = '';


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
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

    this.LoadCategories();

  }
  LoadCategories() {
    const payload = {
      categoryID: "All"
    };
    console.log(payload)
    this.AdminService.showLoader.next(true);
    this.AdminService.GetAllCats(payload).subscribe(
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

        this.AdminService.showLoader.next(false);
      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching:", err.message);
        this.openSnackBar(err.message, "");
        this.AdminService.showLoader.next(false);
      }
    );
  }

  selectCategory(category: Category | null): void {
    // Reset always
    this.subcategories = [];
    this.formData.basicDetails.subCategory = null;
    this.isSubCategoryEnabled = false;

    if (!category) {
      return; // no category selected
    }

    if (category.subcategories && category.subcategories.length > 0) {
      this.subcategories = category.subcategories;
      this.isSubCategoryEnabled = true; // ✅ enable only if exists
    }
  }


  selectSubcategory(sub: Subcategory | null): void {
    this.formData.basicDetails.subCategory = sub;
  }

  onStartDateChange(event: Event): void {
    const dateValue = (event.target as HTMLInputElement).value; // "2026-01-20"
    if (!dateValue) return;

    const date = new Date(dateValue);
    date.setHours(0, 0, 0, 0);
console.log(this.formData.expiration.startDate)
    const epoch = date.getTime(); // 13-digit epoch
    console.log(epoch); // 👉 1765804800000

    this.formData.expiration.start_eph = epoch.toString();
  }

  

  onEndDateChange(event: Event): void {
    const dateValue = (event.target as HTMLInputElement).value; // YYYY-MM-DD
    if (!dateValue) return;

    const date = new Date(dateValue);
    date.setHours(23, 59, 59, 999); // end of day

    const epoch = date.getTime();
    console.log('End Date Epoch:', epoch);

    this.formData.expiration.end_eph = epoch.toString();
  }

  onCategoryChange(category: string) {
    // this.subCategories = this.categoryMap[category] || [];
    this.formData.basicDetails.subCategory = null; // reset subcategory
  }

  onStockQuantityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.formData.inventory.unlimited = value === 'Unlimited';
  }
  validateForm(): boolean {
    this.errors = {}; // reset

    const basic = this.formData.basicDetails;
    const pricing = this.formData.pricing;
    const expiration = this.formData.expiration;
    const inventory = this.formData.inventory;

    if (!basic.productName.trim()) {
      this.errors.productName = 'Product name is required';
    }

    if (!basic.productHighlights.trim()) {
      this.errors.productHighlights = 'Enter Product Highlights';
    }

    if (!basic.productDescription.trim()) {
      this.errors.productDescription = 'Product Description is required';
    }

    if (!basic.category) {
      this.errors.category = 'Please select a category';
    }

    if (this.isSubCategoryEnabled && !basic.subCategory) {
      this.errors.subCategory = 'Please select a sub category';
    }

    if (!pricing.productPrice || pricing.productPrice <= 0) {
      this.errors.productPrice = 'Enter a valid product price';
    }

    if (!expiration.startDate) {
      this.errors.startDate = 'Start date is required';
    }

    if (!expiration.endDate) {
      this.errors.endDate = 'End date is required';
    }

    if (
      expiration.startDate &&
      expiration.endDate &&
      Number(expiration.endDate) < Number(expiration.startDate)
    ) {
      this.errors.endDate = 'End date must be after start date';
    }

    if (!inventory.unlimited && (!inventory.stockQuantity || Number(inventory.stockQuantity) <= 0)) {
      this.errors.stockQuantity = 'Enter stock quantity';
    }

    return Object.keys(this.errors).length === 0;
  }

  publishProduct(): void {
    console.log('Product Data:', this.formData);
    if (!this.validateForm()) {
      return;
    }
    if (!this.validatePricingRow()) {
      return;
    }
    const payload = {
      ...this.formData,
      images: {
        main: this.mainImagePreview,
        thumbnails: this.thumbnailPreviews
      }
    };

    console.log('Final Payload:', payload);

    let formData2 = new FormData();
    const category = this.formData.basicDetails.category;
    const subCategory = this.formData.basicDetails.subCategory;

    const weightList = this.pricingVariants.map(p => ({
  weight: Number(p.weight),
  weightUnit: p.weightUnit,
  productPrice: Number(p.productPrice),
  discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
  currency: p.currency,
  taxIncluded: p.taxIncluded
}));

    const conpayload = {
      productName: this.formData.basicDetails.productName,

      categoryID: category?.id || '',
      categoryName: category?.name || '',

      subCategoryID: subCategory?.id || '',
      subCategoryName: subCategory?.name || '',

      productPrice:  Number(this.formData.pricing.productPrice) || 0,
      taxIncludedPrice: this.formData.pricing.taxIncluded,

      weightList: weightList,

      expirationStartDate: this.formData.expiration.start_eph?.toString() || '',
      expirationEndDate: this.formData.expiration.end_eph?.toString() || '',

      stockQuantity: this.formData.inventory.unlimited
        ? 0
        : Number(this.formData.inventory.stockQuantity),

      isStockUnlimited: this.formData.inventory.unlimited,
      stockStatus: this.formData.inventory.stockStatus,

      isHighlightedProduct: this.formData.inventory.highlight
    }

    let token = localStorage.getItem('token');
    // formData2.append("productimages", this.thumbnailPreviews[]);
    this.thumbnailFiles.forEach((file, index) => {
  formData2.append('productimages', file); 
  // backend will receive as array
});

    formData2.append("productsData", JSON.stringify(conpayload));
    console.log(conpayload)
    this.AdminService.showLoader.next(true);
    this.AdminService.InsertNewProduct(formData2).subscribe(
      (posRes: any) => {
        console.log(posRes)
        if (posRes.response == 3) {

        } else {
          // this.openSnackBar(res.message, "");
        }
        this.AdminService.showLoader.next(false);
      }, (err: HttpErrorResponse) => {
        this.openSnackBar(err.message, "");
        this.AdminService.showLoader.next(false);
        if (err.error instanceof Error) {
          console.warn("Client SIde Error", err.error);
        } else {
          console.warn("Server Error", err.error);
        }
      })
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: "red-snackbar",
    });
  }
  /* ---------------------------
   * IMAGE UPLOAD HANDLERS
   * --------------------------- */

  onMainImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

      // Reset
  this.thumbnailFiles = [];
  this.thumbnailPreviews = [];

    const reader = new FileReader();
    reader.onload = () => {
      this.mainImagePreview = reader.result as string;
    };
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    reader.readAsDataURL(file);
    Array.from(files).forEach(file => {
       this.thumbnailFiles.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

  }

  removeMainImage(): void {
    this.mainImagePreview = null;
  }

  onThumbnailSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
  selectThumbnail(index: number): void {
    this.selectedThumbnailIndex = index;
    this.mainImagePreview = this.thumbnailPreviews[index];
  }
  onReplaceImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || this.selectedThumbnailIndex === null) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newImage = reader.result as string;

      // replace EXACT position (2nd / 4th / etc)
      this.thumbnailPreviews[this.selectedThumbnailIndex!] = newImage;
      this.mainImagePreview = newImage;
      this.mainImagePreview = null;
    };

    reader.readAsDataURL(file);
  }
  removeThumbnail(index: number): void {
    this.thumbnailPreviews.splice(index, 1);

    if (this.selectedThumbnailIndex === index) {
      this.mainImagePreview = null;
      this.selectedThumbnailIndex = null;
    }
  }

  pricingVariants: any[] = [];

  validatePricingRow(): boolean {
    this.pricingErrors = {};

    const pricing = this.formData.pricing;

    if (!pricing.productPrice || pricing.productPrice <= 0) {
      this.pricingErrors.productPrice = 'Product price is required';
    }
    if (!pricing.discountedPrice || pricing.discountedPrice <= 0) {
      this.pricingErrors.discountedPrice = 'Discount is required';
    }

    if (!pricing.currency) {
      this.pricingErrors.currency = 'Currency is required';
    }

    if (!pricing.weight || pricing.weight <= 0) {
      this.pricingErrors.weight = 'Weight is required';
    }

    if (!pricing.weightUnit) {
      this.pricingErrors.weightUnit = 'Weight unit is required';
    }

    return Object.keys(this.pricingErrors).length === 0;
  }



  addPricing(): void {
    if (!this.validatePricingRow()) {
      return;
    }

    this.pricingVariants.push({
      productPrice: this.formData.pricing.productPrice!,
      discountedPrice: this.formData.pricing.discountedPrice ?? undefined,
      currencyCode: this.formData.pricing.currency,
      currencySymbol: this.formData.pricing.currencySymbol,
      weight: this.formData.pricing.weight!,
      weightUnit: this.formData.pricing.weightUnit,
      taxIncluded: this.formData.pricing.taxIncluded
    });

    // reset only FORM, not table
    this.resetPricingForm();
  }
  resetPricingForm(): void {
    this.formData.pricing.productPrice = null;
    this.formData.pricing.discountedPrice = null;
    this.formData.pricing.weight = null;
    this.formData.pricing.weightUnit = 'g';
  }

  currencies = [
    { code: 'INR', symbol: '₹', flag: '🇮🇳' },
    { code: 'USD', symbol: '$', flag: '🇺🇸' },
    { code: 'GBP', symbol: '£', flag: '🇬🇧' },
    { code: 'EUR', symbol: '€', flag: '🇪🇺' }
  ];


  getCurrencySymbol(): string {
    const currency = this.currencies.find(
      curr => curr.code === this.formData.pricing.currency
    );
    return currency ? currency.symbol : '';
  }
  onUnlimitedToggle() {
    if (this.formData.inventory.unlimited) {
      // Toggle ON → Unlimited
      this.formData.inventory.stockQuantity = 'Unlimited';
    } else {
      // Toggle OFF → Allow quantity entry
      this.formData.inventory.stockQuantity = '';
    }
  }

}
