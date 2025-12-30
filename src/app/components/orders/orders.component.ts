import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ShippingInfoComponent } from '../shipping-info/shipping-info.component';
interface Statistic {
  title: string;
  amount: string;
  percentage: number;
  comparison: string;
  icon: string;
}
interface Category {
  id: string;
  name: string;
  image: string;
}

interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
}

interface MaiProduct {
  id: string;
  name: string;
  subcategoryId: string;
  image: string;
  createdDate: Date;
  orderCount: number;
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}



interface OrderData {
  orderId: string;              // → {{ orderData.orderId }}
  status: string;               // → {{ orderData.status }}

  customer: {
    fullName: string;           // → {{ orderData.customer.fullName }}
    email: string;              // → {{ orderData.customer.email }}
    phone: string;              // → {{ orderData.customer.phone }}
  };

  orderInfo: {
    shipping: string;           // → {{ orderData.orderInfo.shipping }}
    paymentMethod: string;      // → {{ orderData.orderInfo.paymentMethod }}
    status: string;             // → {{ orderData.orderInfo.status }}
  };

  deliveryAddress: {
    address: string;            // → {{ orderData.deliveryAddress.address }}
    city: string;               // → {{ orderData.deliveryAddress.city }}
    state: string;              // → {{ orderData.deliveryAddress.state }}
  };

  payment: {
    cardType: string;           // → {{ orderData.payment.cardType }}
    cardNumber: string;         // → {{ orderData.payment.cardNumber }}
    businessName: string;       // → {{ orderData.payment.businessName }}
    phone: string;              // → {{ orderData.payment.phone }}
  };

  products: Product[];       // → *ngFor="let product of orderData.products"

  subtotal: number;             // → {{ orderData.subtotal.toFixed(2) }}
  tax: number;                  // → {{ orderData.tax.toFixed(2) }}
  discount: number;             // → {{ orderData.discount }}
  shippingRate: number;         // → {{ orderData.shippingRate }}
  total: number;                // → {{ orderData.total.toFixed(2) }}
}

interface Product {
  id: string;                   // → Product identifier
  name: string;                 // → {{ product.name }}
  image: string;                // → [src]="product.image"
  orderId: string;              // → {{ product.orderId }}
  quantity: number;             // → {{ product.quantity }}
  total: number;                // → ₹{{ product.total.toFixed(2) }}
  selected: boolean;            // → [checked]="product.selected"
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  statistics: Statistic[] = [
    {
      title: 'Total Orders',
      amount: '126,5',
      percentage: 34.7,
      comparison: 'Compared to Nov 2025',
      icon: '📦'
    },
    {
      title: 'New Orders',
      amount: '126,500',
      percentage: 34.7,
      comparison: 'Compared to Nov 2025',
      icon: '🔄'
    },
    {
      title: 'Completed Orders',
      amount: '136,500',
      percentage: 34.7,
      comparison: 'Compared to Nov 2025',
      icon: '✓'
    },
    {
      title: 'Cenceled Orders',
      amount: '136,500',
      percentage: 34.7,
      comparison: 'Compared to Nov 2025',
      icon: '✓'
    }
  ];


  orderData: OrderData = {
    orderId: '#6743',
    status: 'Pending',

    customer: {
      fullName: 'Shristi Singh',
      email: 'shristi@gmail.com',
      phone: '+91 904 231 1212'
    },

    orderInfo: {
      shipping: 'Next express',
      paymentMethod: 'Paypal',
      status: 'Pending'
    },

    deliveryAddress: {
      address: 'Dharam Colony',
      city: 'Palam Vihar',
      state: 'Gurgaon, Haryana'
    },

    payment: {
      cardType: 'Master Card',
      cardNumber: '**** **** 6557',
      businessName: 'Shristi Singh',
      phone: '+91 904 231 1212'
    },
    products: [
      {
        id: '1',
        name: 'Lorem Ipsum',
        image: 'https://via.placeholder.com/50',
        orderId: '#25421',
        quantity: 2,
        total: 800.40,
        selected: false
      }
      // ... more products
    ],

    subtotal: 3201.6,
    tax: 640.32,
    discount: 0,
    shippingRate: 0,
    total: 3841.92
  };

  // DisplayStatus = ['All','Pending','Delivered'  ];
  activeTab: string = 'All';
  tabs: string[] = [
    'All', 'Pending', 'Delivered'
  ];
  products: Product[] = [
    {
      id: '1',
      name: 'Lorem Ipsum',
      image: 'https://via.placeholder.com/50',
      orderId: '#25421',
      quantity: 2,
      total: 800.40,
      selected: false
    }
  ];
  categories: Category[] = [
    { id: 'myd', name: 'Malaysian Delights', image: '🍜' },
    { id: 'ind', name: 'Indian Delights', image: '🍛' },
    { id: 'thi', name: 'Thai Cuisine', image: '🥘' },
    { id: 'chi', name: 'Chinese Delights', image: '🥡' }
  ];
  subcategories: Subcategory[] = [
    { id: 'all', categoryId: 'all', name: 'All Product' },
    { id: 'fvf', categoryId: 'myd', name: 'Frozen Vegan Food' },
    { id: 'fvf-ind', categoryId: 'ind', name: 'Frozen Vegan Food' },
    { id: 'fvdf', categoryId: 'myd', name: 'Frozen Vegetarian Food' },
    { id: 'sp', categoryId: 'myd', name: 'Sauces / Pastes' },
    { id: 'fvds', categoryId: 'myd', name: 'Frozen Vegan Dim Sum' },
    { id: 'fvb', categoryId: 'myd', name: 'Frozen Vegan Buns' },
    { id: 'ssm', categoryId: 'ind', name: 'Snacks & Spices Mix' },
    { id: 'ds', categoryId: 'ind', name: 'Dried Spices' }
  ];
  Mainproducts: MaiProduct[] = [{ id: '1', name: 'Mock Chicken', subcategoryId: 'fvf', image: '🍗', createdDate: new Date('2025-01-01'), orderCount: 25 },
  { id: '2', name: 'Vegan Satay', subcategoryId: 'fvf', image: '🍢', createdDate: new Date('2025-01-02'), orderCount: 18 },
  { id: '3', name: 'Tofu Curry', subcategoryId: 'fvdf', image: '🍲', createdDate: new Date('2025-01-03'), orderCount: 32 },
  { id: '4', name: 'Vegetable Spring Rolls', subcategoryId: 'fvf', image: '🥠', createdDate: new Date('2025-01-04'), orderCount: 45 },
  { id: '5', name: 'Mushroom Biryani', subcategoryId: 'fvf-ind', image: '🍚', createdDate: new Date('2025-01-05'), orderCount: 28 },
  { id: '6', name: 'Lentil Soup Mix', subcategoryId: 'sp', image: '🍲', createdDate: new Date('2025-01-06'), orderCount: 15 },
  { id: '7', name: 'Chili Paste', subcategoryId: 'sp', image: '🌶️', createdDate: new Date('2025-01-07'), orderCount: 22 },
  { id: '8', name: 'Dim Sum Assorted', subcategoryId: 'fvds', image: '🥢', createdDate: new Date('2025-01-08'), orderCount: 38 },
  { id: '9', name: 'Vegan Buns', subcategoryId: 'fvb', image: '🥐', createdDate: new Date('2025-01-09'), orderCount: 41 },
  { id: '10', name: 'Coconut Curry Paste', subcategoryId: 'sp', image: '🥥', createdDate: new Date('2025-01-10'), orderCount: 19 },
  { id: '11', name: 'Paneer Tikka', subcategoryId: 'fvf-ind', image: '🧀', createdDate: new Date('2025-01-11'), orderCount: 35 },
  { id: '12', name: 'Samosa Mix', subcategoryId: 'ssm', image: '🥟', createdDate: new Date('2025-01-12'), orderCount: 27 },
  { id: '13', name: 'Garam Masala', subcategoryId: 'ds', image: '🌿', createdDate: new Date('2025-01-13'), orderCount: 20 },
  { id: '14', name: 'Cumin Seeds', subcategoryId: 'ds', image: '🌰', createdDate: new Date('2025-01-14'), orderCount: 16 },
  { id: '15', name: 'Noodle Mix', subcategoryId: 'fvf', image: '🍜', createdDate: new Date('2025-01-15'), orderCount: 33 },
  { id: '16', name: 'Rice Paper', subcategoryId: 'fvf', image: '📜', createdDate: new Date('2025-01-16'), orderCount: 24 },
  { id: '17', name: 'Bean Paste', subcategoryId: 'sp', image: '🍶', createdDate: new Date('2025-01-17'), orderCount: 17 },
  { id: '18', name: 'Vegetable Medley', subcategoryId: 'fvdf', image: '🥬', createdDate: new Date('2025-01-18'), orderCount: 29 },
  { id: '19', name: 'Tempeh Chips', subcategoryId: 'ssm', image: '🍤', createdDate: new Date('2025-01-19'), orderCount: 21 },
  { id: '20', name: 'Tamarind Paste', subcategoryId: 'sp', image: '🍯', createdDate: new Date('2025-01-20'), orderCount: 14 },
  { id: '21', name: 'Seitan Strips', subcategoryId: 'fvf', image: '🍖', createdDate: new Date('2025-01-21'), orderCount: 26 },
  { id: '22', name: 'Miso Soup Mix', subcategoryId: 'sp', image: '🍲', createdDate: new Date('2025-01-22'), orderCount: 31 },
  { id: '23', name: 'Cashew Curry', subcategoryId: 'fvf-ind', image: '🥜', createdDate: new Date('2025-01-23'), orderCount: 37 },
  { id: '24', name: 'Vegetable Dumplings', subcategoryId: 'fvds', image: '🥟', createdDate: new Date('2025-01-24'), orderCount: 40 },
  { id: '25', name: 'Fried Tofu Puffs', subcategoryId: 'fvb', image: '⚪', createdDate: new Date('2025-01-25'), orderCount: 19 },
  { id: '26', name: 'Coriander Powder', subcategoryId: 'ds', image: '🌿', createdDate: new Date('2025-01-26'), orderCount: 12 },
  { id: '27', name: 'Turmeric Root', subcategoryId: 'ds', image: '🌾', createdDate: new Date('2025-01-27'), orderCount: 13 },
  { id: '28', name: 'Black Garlic', subcategoryId: 'sp', image: '🧄', createdDate: new Date('2025-01-28'), orderCount: 23 },
  { id: '29', name: 'Jackfruit Steak', subcategoryId: 'fvf', image: '🍃', createdDate: new Date('2025-01-29'), orderCount: 34 },
  { id: '30', name: 'Sweet Potato Fries', subcategoryId: 'fvf', image: '🍟', createdDate: new Date('2025-01-30'), orderCount: 42 }];
  allFilteredProducts: MaiProduct[] = [{ id: '1', name: 'Mock Chicken', subcategoryId: 'fvf', image: '🍗', createdDate: new Date('2025-01-01'), orderCount: 25 },
  { id: '2', name: 'Vegan Satay', subcategoryId: 'fvf', image: '🍢', createdDate: new Date('2025-01-02'), orderCount: 18 },
  { id: '3', name: 'Tofu Curry', subcategoryId: 'fvdf', image: '🍲', createdDate: new Date('2025-01-03'), orderCount: 32 },
  { id: '4', name: 'Vegetable Spring Rolls', subcategoryId: 'fvf', image: '🥠', createdDate: new Date('2025-01-04'), orderCount: 45 },
  { id: '5', name: 'Mushroom Biryani', subcategoryId: 'fvf-ind', image: '🍚', createdDate: new Date('2025-01-05'), orderCount: 28 },
  { id: '6', name: 'Lentil Soup Mix', subcategoryId: 'sp', image: '🍲', createdDate: new Date('2025-01-06'), orderCount: 15 },
  { id: '7', name: 'Chili Paste', subcategoryId: 'sp', image: '🌶️', createdDate: new Date('2025-01-07'), orderCount: 22 },
  { id: '8', name: 'Dim Sum Assorted', subcategoryId: 'fvds', image: '🥢', createdDate: new Date('2025-01-08'), orderCount: 38 },
  { id: '9', name: 'Vegan Buns', subcategoryId: 'fvb', image: '🥐', createdDate: new Date('2025-01-09'), orderCount: 41 },
  { id: '10', name: 'Coconut Curry Paste', subcategoryId: 'sp', image: '🥥', createdDate: new Date('2025-01-10'), orderCount: 19 },
  { id: '11', name: 'Paneer Tikka', subcategoryId: 'fvf-ind', image: '🧀', createdDate: new Date('2025-01-11'), orderCount: 35 },
  { id: '12', name: 'Samosa Mix', subcategoryId: 'ssm', image: '🥟', createdDate: new Date('2025-01-12'), orderCount: 27 },
  { id: '13', name: 'Garam Masala', subcategoryId: 'ds', image: '🌿', createdDate: new Date('2025-01-13'), orderCount: 20 },
  { id: '14', name: 'Cumin Seeds', subcategoryId: 'ds', image: '🌰', createdDate: new Date('2025-01-14'), orderCount: 16 },
  { id: '15', name: 'Noodle Mix', subcategoryId: 'fvf', image: '🍜', createdDate: new Date('2025-01-15'), orderCount: 33 },
  { id: '16', name: 'Rice Paper', subcategoryId: 'fvf', image: '📜', createdDate: new Date('2025-01-16'), orderCount: 24 },
  { id: '17', name: 'Bean Paste', subcategoryId: 'sp', image: '🍶', createdDate: new Date('2025-01-17'), orderCount: 17 },
  { id: '18', name: 'Vegetable Medley', subcategoryId: 'fvdf', image: '🥬', createdDate: new Date('2025-01-18'), orderCount: 29 },
  { id: '19', name: 'Tempeh Chips', subcategoryId: 'ssm', image: '🍤', createdDate: new Date('2025-01-19'), orderCount: 21 },
  { id: '20', name: 'Tamarind Paste', subcategoryId: 'sp', image: '🍯', createdDate: new Date('2025-01-20'), orderCount: 14 },
  { id: '21', name: 'Seitan Strips', subcategoryId: 'fvf', image: '🍖', createdDate: new Date('2025-01-21'), orderCount: 26 },
  { id: '22', name: 'Miso Soup Mix', subcategoryId: 'sp', image: '🍲', createdDate: new Date('2025-01-22'), orderCount: 31 },
  { id: '23', name: 'Cashew Curry', subcategoryId: 'fvf-ind', image: '🥜', createdDate: new Date('2025-01-23'), orderCount: 37 },
  { id: '24', name: 'Vegetable Dumplings', subcategoryId: 'fvds', image: '🥟', createdDate: new Date('2025-01-24'), orderCount: 40 },
  { id: '25', name: 'Fried Tofu Puffs', subcategoryId: 'fvb', image: '⚪', createdDate: new Date('2025-01-25'), orderCount: 19 },
  { id: '26', name: 'Coriander Powder', subcategoryId: 'ds', image: '🌿', createdDate: new Date('2025-01-26'), orderCount: 12 },
  { id: '27', name: 'Turmeric Root', subcategoryId: 'ds', image: '🌾', createdDate: new Date('2025-01-27'), orderCount: 13 },
  { id: '28', name: 'Black Garlic', subcategoryId: 'sp', image: '🧄', createdDate: new Date('2025-01-28'), orderCount: 23 },
  { id: '29', name: 'Jackfruit Steak', subcategoryId: 'fvf', image: '🍃', createdDate: new Date('2025-01-29'), orderCount: 34 },
  { id: '30', name: 'Sweet Potato Fries', subcategoryId: 'fvf', image: '🍟', createdDate: new Date('2025-01-30'), orderCount: 42 }];

  selectedCategory: Category | null = null;
  selectedSubcategory: Subcategory | null = null;
  searchTerm: string = '';

  itemsPerPage: number = 10;
  pagination: PaginationState = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };
  IsDetailPage: boolean = false;

  constructor(
    private AdminService: MaitreyaAdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
    // this.currentPage = 1;
  }
  loadCategories(): void {
    // this.categories = this.AdminService.getCategories();
    if (this.categories.length > 0) {
      this.selectCategory(this.categories[0]);
    }
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.selectedSubcategory = null;
    // this.subcategories = this.AdminService.getSubcategoriesByCategory(category.id);
    if (this.subcategories.length > 0) {
      this.selectSubcategory(this.subcategories[0]);
    }
    this.pagination.currentPage = 1;
    this.searchTerm = '';
    this.applyFilters();
  }

  selectSubcategory(subcategory: Subcategory): void {
    this.selectedSubcategory = subcategory;
    this.pagination.currentPage = 1;
    this.applyFilters();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.pagination.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    if (!this.selectedCategory || !this.selectedSubcategory) return;

    // this.allFilteredProducts = this.AdminService.getProducts(
    //   this.selectedCategory.id,
    //   this.selectedSubcategory.id,
    //   this.searchTerm
    // );

    this.updatePagination();
  }

  updatePagination(): void {
    this.pagination.totalItems = this.allFilteredProducts.length;
    this.pagination.pageSize = this.itemsPerPage;
    this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.itemsPerPage);

    const startIndex = (this.pagination.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.Mainproducts = this.allFilteredProducts.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.pagination.totalPages) {
      this.pagination.currentPage = pageNumber;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.pagination.currentPage > 1) {
      this.pagination.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.pagination.currentPage < this.pagination.totalPages) {
      this.pagination.currentPage++;
      this.updatePagination();
    }
  }

  editProduct(product: any): void {
    console.log('Edit product:', product);
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      // if (this.AdminService.deleteProduct(productId)) {
      //   this.applyFilters();
      // }
    }
  }

  openAddProductModal(): void {
    console.log('Open add product modal');
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 10;

    if (this.pagination.totalPages <= maxVisible) {
      for (let i = 1; i <= this.pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisible / 2);
      let start = this.pagination.currentPage - half;
      let end = this.pagination.currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisible;
      } else if (end > this.pagination.totalPages) {
        end = this.pagination.totalPages;
        start = end - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  isCategoryActive(category: Category): boolean {
    return this.selectedCategory?.id === category.id;
  }

  isSubcategoryActive(subcategory: Subcategory): boolean {
    return this.selectedSubcategory?.id === subcategory.id;
  }

  isPageActive(pageNumber: number): boolean {
    return this.pagination.currentPage === pageNumber;
  }

  getSubcategoryName(subcategoryId: string): string {
    const subcategory = this.subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : 'N/A';
  }

  DisplayOrderDetails(Order: any) {
    this.IsDetailPage = true;

  }
  handleOrderAction() {
    if (this.orderData.status === 'Pending') {
      this.markAsShipped();
    } else if (this.orderData.status === 'Delivered') {
      // this.goToDelivered();
    }
  }
  markAsShipped() {

    let dialogRef = this.dialog.open(ShippingInfoComponent, {
      panelClass: 'col-md-3',
      hasBackdrop: true,
      disableClose: true,
      // data: nav_data,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log(res)
        const dispatchedDate = new Date(res.dis_date).getTime().toString();
        const expectedDeliveryDate = new Date(res.exp_date).getTime().toString();
        let payload = {
          // adminuserID: this.user.userID,
          // orderID: ship.orderID,
          // courierCompanyName: res.cname,
          // dispatchedDate: dispatchedDate,
          // expectedDeliveryDate: expectedDeliveryDate,
          // TrackingID: res.trk_id,
        }
        let token = localStorage.getItem("token");
        console.log(payload);
        this.AdminService.showLoader.next(true);
        // this.AdminService.ShipIndo_Add(payload, token).subscribe(
        //   (res: any) => {
        //     console.log(res);
        //     if (res.response === 3) {
        //       this.openSnackBar(res.message, "");
        //       this.FetchOrdersList();
        //     } else {
        //       this.openSnackBar(res.message, "");
        //     }
        //     this.AdminService.showLoader.next(false);
        //   },
        //   (err: HttpErrorResponse) => {
        //     console.log(err);
        //     console.error("Error:", err.message);
        //     this.openSnackBar(err.message, "");
        //     this.AdminService.showLoader.next(false);
        //   }
        // );
      }
    })
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: "red-snackbar",
    });
  }
  viewProfile() { }

  downloadInfo() { }

  toggleProduct(order: any) { }

  getTaxPercentage() { }
}
