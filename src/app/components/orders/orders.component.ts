import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ShippingInfoComponent } from '../shipping-info/shipping-info.component';
import { Router } from '@angular/router';
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
  no: number;
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  orderTime: Date;
  price: number;
  status: string;
  trackingdt: {
    coriername: string;            // → {{ orderData.deliveryAddress.address }}
    shipingdt: string;               // → {{ orderData.deliveryAddress.city }}
    trackingID: string;              // → {{ orderData.deliveryAddress.state }}
  };
  rawOrder: any;
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
    corname: string;           // → {{ orderData.orderInfo.shipping }}
    shipdt: string;      // → {{ orderData.orderInfo.paymentMethod }}
    trackid: string;             // → {{ orderData.orderInfo.status }}
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
  user: any;
  isLoggedIn: boolean = false;
  baseUrl: string = "";
  statistics: Statistic[] = [
    {
      title: 'Total Orders',
      amount: '0',
      percentage: 34.7,
      comparison: 'Compared to Nov 2025',
      icon: '📦'
    },
    {
      title: 'New Orders',
      amount: '0',
      percentage: 34.7,
      comparison: 'Compared to Nov 2025',
      icon: '🔄'
    },
    {
      title: 'Completed Orders',
      amount: '0',
      percentage: 34.7,
      comparison: 'Compared to Nov 2025',
      icon: '✓'
    },
    {
      title: 'Cenceled Orders',
      amount: '0',
      percentage: 0,
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
      corname: 'Next express',
      shipdt: 'Paypal',
      trackid: 'Pending'
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

  activeTab: string = 'All';
  tabs: string[] = [
    'All', 'New', 'Shipped', 'Delivered',];
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
  Mainproducts: MaiProduct[] = [
    //   { id: '1', name: 'Mock Chicken', subcategoryId: 'fvf', image: '🍗', createdDate: new Date('2025-01-01'), orderCount: 25 },
    // { id: '2', name: 'Vegan Satay', subcategoryId: 'fvf', image: '🍢', createdDate: new Date('2025-01-02'), orderCount: 18 },
    // { id: '3', name: 'Tofu Curry', subcategoryId: 'fvdf', image: '🍲', createdDate: new Date('2025-01-03'), orderCount: 32 },
    // { id: '4', name: 'Vegetable Spring Rolls', subcategoryId: 'fvf', image: '🥠', createdDate: new Date('2025-01-04'), orderCount: 45 },
    // { id: '5', name: 'Mushroom Biryani', subcategoryId: 'fvf-ind', image: '🍚', createdDate: new Date('2025-01-05'), orderCount: 28 },
    // { id: '6', name: 'Lentil Soup Mix', subcategoryId: 'sp', image: '🍲', createdDate: new Date('2025-01-06'), orderCount: 15 },
    // { id: '7', name: 'Chili Paste', subcategoryId: 'sp', image: '🌶️', createdDate: new Date('2025-01-07'), orderCount: 22 },
    // { id: '8', name: 'Dim Sum Assorted', subcategoryId: 'fvds', image: '🥢', createdDate: new Date('2025-01-08'), orderCount: 38 },
    // { id: '9', name: 'Vegan Buns', subcategoryId: 'fvb', image: '🥐', createdDate: new Date('2025-01-09'), orderCount: 41 },
    // { id: '10', name: 'Coconut Curry Paste', subcategoryId: 'sp', image: '🥥', createdDate: new Date('2025-01-10'), orderCount: 19 },
    // { id: '11', name: 'Paneer Tikka', subcategoryId: 'fvf-ind', image: '🧀', createdDate: new Date('2025-01-11'), orderCount: 35 },
    // { id: '12', name: 'Samosa Mix', subcategoryId: 'ssm', image: '🥟', createdDate: new Date('2025-01-12'), orderCount: 27 },
    // { id: '13', name: 'Garam Masala', subcategoryId: 'ds', image: '🌿', createdDate: new Date('2025-01-13'), orderCount: 20 },
    // { id: '14', name: 'Cumin Seeds', subcategoryId: 'ds', image: '🌰', createdDate: new Date('2025-01-14'), orderCount: 16 },
    // { id: '15', name: 'Noodle Mix', subcategoryId: 'fvf', image: '🍜', createdDate: new Date('2025-01-15'), orderCount: 33 },
    // { id: '16', name: 'Rice Paper', subcategoryId: 'fvf', image: '📜', createdDate: new Date('2025-01-16'), orderCount: 24 },
    // { id: '17', name: 'Bean Paste', subcategoryId: 'sp', image: '🍶', createdDate: new Date('2025-01-17'), orderCount: 17 },
    // { id: '18', name: 'Vegetable Medley', subcategoryId: 'fvdf', image: '🥬', createdDate: new Date('2025-01-18'), orderCount: 29 },
    // { id: '19', name: 'Tempeh Chips', subcategoryId: 'ssm', image: '🍤', createdDate: new Date('2025-01-19'), orderCount: 21 },
    // { id: '20', name: 'Tamarind Paste', subcategoryId: 'sp', image: '🍯', createdDate: new Date('2025-01-20'), orderCount: 14 },
    // { id: '21', name: 'Seitan Strips', subcategoryId: 'fvf', image: '🍖', createdDate: new Date('2025-01-21'), orderCount: 26 },
    // { id: '22', name: 'Miso Soup Mix', subcategoryId: 'sp', image: '🍲', createdDate: new Date('2025-01-22'), orderCount: 31 },
    // { id: '23', name: 'Cashew Curry', subcategoryId: 'fvf-ind', image: '🥜', createdDate: new Date('2025-01-23'), orderCount: 37 },
    // { id: '24', name: 'Vegetable Dumplings', subcategoryId: 'fvds', image: '🥟', createdDate: new Date('2025-01-24'), orderCount: 40 },
    // { id: '25', name: 'Fried Tofu Puffs', subcategoryId: 'fvb', image: '⚪', createdDate: new Date('2025-01-25'), orderCount: 19 },
    // { id: '26', name: 'Coriander Powder', subcategoryId: 'ds', image: '🌿', createdDate: new Date('2025-01-26'), orderCount: 12 },
    // { id: '27', name: 'Turmeric Root', subcategoryId: 'ds', image: '🌾', createdDate: new Date('2025-01-27'), orderCount: 13 },
    // { id: '28', name: 'Black Garlic', subcategoryId: 'sp', image: '🧄', createdDate: new Date('2025-01-28'), orderCount: 23 },
    // { id: '29', name: 'Jackfruit Steak', subcategoryId: 'fvf', image: '🍃', createdDate: new Date('2025-01-29'), orderCount: 34 },
    // { id: '30', name: 'Sweet Potato Fries', subcategoryId: 'fvf', image: '🍟', createdDate: new Date('2025-01-30'), orderCount: 42 }
  ];
  allFilteredProducts: MaiProduct[] = [
    //   { id: '1', name: 'Mock Chicken', subcategoryId: 'fvf', image: '🍗', createdDate: new Date('2025-01-01'), orderCount: 25 },
    // { id: '2', name: 'Vegan Satay', subcategoryId: 'fvf', image: '🍢', createdDate: new Date('2025-01-02'), orderCount: 18 },
    // { id: '3', name: 'Tofu Curry', subcategoryId: 'fvdf', image: '🍲', createdDate: new Date('2025-01-03'), orderCount: 32 },
    // { id: '4', name: 'Vegetable Spring Rolls', subcategoryId: 'fvf', image: '🥠', createdDate: new Date('2025-01-04'), orderCount: 45 },
    // { id: '5', name: 'Mushroom Biryani', subcategoryId: 'fvf-ind', image: '🍚', createdDate: new Date('2025-01-05'), orderCount: 28 },
    // { id: '6', name: 'Lentil Soup Mix', subcategoryId: 'sp', image: '🍲', createdDate: new Date('2025-01-06'), orderCount: 15 },
    // { id: '7', name: 'Chili Paste', subcategoryId: 'sp', image: '🌶️', createdDate: new Date('2025-01-07'), orderCount: 22 },
    // { id: '8', name: 'Dim Sum Assorted', subcategoryId: 'fvds', image: '🥢', createdDate: new Date('2025-01-08'), orderCount: 38 },
    // { id: '9', name: 'Vegan Buns', subcategoryId: 'fvb', image: '🥐', createdDate: new Date('2025-01-09'), orderCount: 41 },
    // { id: '10', name: 'Coconut Curry Paste', subcategoryId: 'sp', image: '🥥', createdDate: new Date('2025-01-10'), orderCount: 19 },
    // { id: '11', name: 'Paneer Tikka', subcategoryId: 'fvf-ind', image: '🧀', createdDate: new Date('2025-01-11'), orderCount: 35 },
    // { id: '12', name: 'Samosa Mix', subcategoryId: 'ssm', image: '🥟', createdDate: new Date('2025-01-12'), orderCount: 27 },
    // { id: '13', name: 'Garam Masala', subcategoryId: 'ds', image: '🌿', createdDate: new Date('2025-01-13'), orderCount: 20 },
    // { id: '14', name: 'Cumin Seeds', subcategoryId: 'ds', image: '🌰', createdDate: new Date('2025-01-14'), orderCount: 16 },
    // { id: '15', name: 'Noodle Mix', subcategoryId: 'fvf', image: '🍜', createdDate: new Date('2025-01-15'), orderCount: 33 },
    // { id: '16', name: 'Rice Paper', subcategoryId: 'fvf', image: '📜', createdDate: new Date('2025-01-16'), orderCount: 24 },
    // { id: '17', name: 'Bean Paste', subcategoryId: 'sp', image: '🍶', createdDate: new Date('2025-01-17'), orderCount: 17 },
    // { id: '18', name: 'Vegetable Medley', subcategoryId: 'fvdf', image: '🥬', createdDate: new Date('2025-01-18'), orderCount: 29 },
    // { id: '19', name: 'Tempeh Chips', subcategoryId: 'ssm', image: '🍤', createdDate: new Date('2025-01-19'), orderCount: 21 },
    // { id: '20', name: 'Tamarind Paste', subcategoryId: 'sp', image: '🍯', createdDate: new Date('2025-01-20'), orderCount: 14 },
    // { id: '21', name: 'Seitan Strips', subcategoryId: 'fvf', image: '🍖', createdDate: new Date('2025-01-21'), orderCount: 26 },
    // { id: '22', name: 'Miso Soup Mix', subcategoryId: 'sp', image: '🍲', createdDate: new Date('2025-01-22'), orderCount: 31 },
    // { id: '23', name: 'Cashew Curry', subcategoryId: 'fvf-ind', image: '🥜', createdDate: new Date('2025-01-23'), orderCount: 37 },
    // { id: '24', name: 'Vegetable Dumplings', subcategoryId: 'fvds', image: '🥟', createdDate: new Date('2025-01-24'), orderCount: 40 },
    // { id: '25', name: 'Fried Tofu Puffs', subcategoryId: 'fvb', image: '⚪', createdDate: new Date('2025-01-25'), orderCount: 19 },
    // { id: '26', name: 'Coriander Powder', subcategoryId: 'ds', image: '🌿', createdDate: new Date('2025-01-26'), orderCount: 12 },
    // { id: '27', name: 'Turmeric Root', subcategoryId: 'ds', image: '🌾', createdDate: new Date('2025-01-27'), orderCount: 13 },
    // { id: '28', name: 'Black Garlic', subcategoryId: 'sp', image: '🧄', createdDate: new Date('2025-01-28'), orderCount: 23 },
    // { id: '29', name: 'Jackfruit Steak', subcategoryId: 'fvf', image: '🍃', createdDate: new Date('2025-01-29'), orderCount: 34 },
    // { id: '30', name: 'Sweet Potato Fries', subcategoryId: 'fvf', image: '🍟', createdDate: new Date('2025-01-30'), orderCount: 42 }
  ];

  selectedCategory: Category | null = null;
  selectedSubcategory: Subcategory | null = null;
  searchTerm: string = '';

  itemsPerPage: number = 10;
  pagination: PaginationState = {
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0
  };
  IsDetailPage: boolean = false;
  sortType: string = "Ascending";

  constructor(
    private AdminService: MaitreyaAdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
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
    // this.getPageNumbers()
    // this.pageInputControl.setValue(this.currentPage.toString());
    this.GatAllOrders();
    // this.loadCategories();
  }

  ChangeSort() {
    this.sortType = this.sortType === 'Ascending' ? 'Descending' : 'Ascending';
    this.GatAllOrders();
  }
  GatAllOrders() {
    const payload = {
      adminuniqueID: this.user.adminuniqueID,
      pageNo: this.pagination.currentPage,
      size: this.pagination.pageSize,
      orderlistType: this.activeTab,
      sortingType: this.sortType,
    };
    console.log(payload)
    this.AdminService.showLoader.next(true);
    this.AdminService.GetAllOrders(payload).subscribe(
      (res: any) => {
        console.log(res);
        if (res.response === 3) {
          const counts = res.OrdersCount?.[0];

          if (counts) {
            this.statistics = [
              {
                title: 'Total Orders',
                amount: counts.Total_Orders_Count.toString(),
                percentage: 0,
                comparison: 'Compared to last period',
                icon: '📦'
              },
              {
                title: 'New Orders',
                amount: counts.New_Orders_Count.toString(),
                percentage: 0,
                comparison: 'Compared to last period',
                icon: '🔄'
              },
              {
                title: 'Completed Orders',
                amount: counts.Completed_Orders_Count.toString(),
                percentage: 0,
                comparison: 'Compared to last period',
                icon: '✓'
              },
              {
                title: 'Cancelled Orders',
                amount: counts.Cancelled_Orders_Count.toString(),
                percentage: 0,
                comparison: 'Compared to last period',
                icon: '✕'
              }
            ];
          }

          this.Mainproducts = res.ordersData.map((order: any, index: number) => {
            const products = order.Products || [];
            const firstProduct = products[0] || {};
            const tracking = order.orderTrackingDetails;
            let displayStatus: 'New' | 'Shipped' | 'Delivered' = 'New';
            // ✅ DECLARE FIRST
            const hasTracking =
              tracking &&
              tracking.trackingID &&
              tracking.trackingID.trim() !== '';


            // ✅ Delivered has TOP priority
            if (order.orderStatus === 'Completed') {
              displayStatus = 'Delivered';
            }
            else if (hasTracking) {
              displayStatus = 'Shipped';
            }
            else {
              displayStatus = 'New';
            }


            const totalProductPrice = products.reduce(
              (sum: number, p: any) => sum + p.price * p.quantity,
              0
            );

            return {
              no: index + 1,
              id: order._id,
              orderId: order.orderId,

              productName: firstProduct.productName || '-',
              productImage: firstProduct.productImagePath || '',

              orderTime: new Date(+order.orderTimeStamp),
              price: totalProductPrice || order.totalToPay,

              status: displayStatus,   // ✅ safe usage

              trackingdt: hasTracking
                ? {
                  coriername: tracking.courierServiceName,
                  shipingdt: tracking.shippingDate,
                  trackingID: tracking.trackingID
                }
                : null,

              rawOrder: order
            };
          });

          this.pagination.currentPage = res.currentPage;
          this.pagination.totalPages = res.totalpages;

          // Optional (if backend doesn't send total count)
          this.pagination.totalItems = res.totalpages * this.pagination.pageSize;


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
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.pagination.currentPage = 1;
    this.GatAllOrders();
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

  backtoorders() {
    this.IsDetailPage = false;
    this.GatAllOrders();
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

  selectedOrderId: string | null = null;


  DisplayOrderDetails(item: MaiProduct) {
    const order = item.rawOrder;
    console.log(order)
    this.selectedOrderId = item.orderId;
    this.orderData = {
      orderId: order.orderId,
      status: item.trackingdt ? 'Shipped' : 'Pending',

      customer: {
        fullName: `${order.addressDetails.firstName} ${order.addressDetails.lastName}`,
        email: order.emailID || '-',
        phone: order.phoneNumber || order.contactData || '-'
      },

      orderInfo: {
        corname: order.orderTrackingDetails.courierServiceName,
        shipdt: order.orderTrackingDetails.shippingDate,
        trackid: order.orderTrackingDetails.trackingID
      },

      deliveryAddress: {
        address: order.addressDetails.address,
        city: order.addressDetails.city,
        state: order.addressDetails.state
      },

      payment: {
        cardType: order.paymentType,
        cardNumber: order.paymentData?.transactionid || '-',
        businessName: 'N/A',
        phone: order.phoneNumber || '-'
      },

      products: order.Products.map((p: any) => ({
        id: p.productID,
        name: p.productName,
        image: p.productImagePath,
        orderId: order.orderId,
        quantity: p.quantity,
        total: p.price * p.quantity,
        selected: false
      })),

      subtotal: order.subTotal,
      tax: 0,
      discount: order.coupanAmount,
      shippingRate: order.deliveryFee,
      total: order.totalToPay
    };
    console.log(this.orderData)
    this.IsDetailPage = true;
  }

  handleOrderAction() {
    console.log(this.orderData.status)
    if (this.orderData.status === 'Pending') {
      this.markAsShipped();
    } else if (this.orderData.status === 'Shipped') {
      this.goToDelivered();
    }
  }
  goToDelivered() {
    let payload = {
      adminuniqueID: this.user.adminuniqueID,
      orderId: this.selectedOrderId
    }
    this.AdminService.SendtoDelivery(payload).subscribe(
      (res: any) => {
        console.log(res);
        if (res.response === 3) {

          this.backtoorders();
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
  markAsShipped() {
    let dialogRef = this.dialog.open(ShippingInfoComponent, {
      panelClass: 'col-md-3',
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res)
      if (res.submitted) {
        let payload = {
          adminuniqueID: this.user.adminuniqueID,
          orderId: this.orderData.orderId,
          orderTrackingDetails: {
            courierServiceName: res.cname,
            shippingDate: res.shipdate,
            trackingID: res.id
          }
        }
        // let token = localStorage.getItem("token");
        console.log(payload);
        this.AdminService.showLoader.next(true);
        this.AdminService.AddTracking(payload).subscribe(
          (res1: any) => {
            console.log(res1);
            if (res1.response === 3) {
              this.openSnackBar(res1.message, "");
              this.GatAllOrders();
              this.GatAllOrders2(true);

            } else {
              this.openSnackBar(res1.message, "");
            }
            this.AdminService.showLoader.next(false);
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            console.error("Error:", err.message);
            this.openSnackBar(err.message, "");
            this.AdminService.showLoader.next(false);
          }
        );
      }
    })
  }
  GatAllOrders2(reselect: boolean = false) {
    const payload = {
      adminuniqueID: this.user.adminuniqueID,
      pageNo: this.pagination.currentPage,
      size: this.pagination.pageSize,
      orderlistType: this.activeTab,
      sortingType: this.sortType,
    };
    console.log(payload)
    this.AdminService.showLoader.next(true);
    this.AdminService.GetAllOrders(payload).subscribe(
      (res: any) => {
        console.log(res);
        if (res.response === 3) {

          this.Mainproducts = res.ordersData || [];

          if (reselect && this.selectedOrderId) {
            const updatedOrder = this.Mainproducts.find(
              o => o.orderId === this.selectedOrderId
            );

            if (updatedOrder) {
              this.DisplayOrderDetails(updatedOrder); // ✅ refresh details
            }
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



  //pagination
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
      this.GatAllOrders();
    }
  }

  previousPage(): void {
    if (this.pagination.currentPage > 1) {
      this.pagination.currentPage--;
      this.GatAllOrders();
    }
  }

  nextPage(): void {
    if (this.pagination.currentPage < this.pagination.totalPages) {
      this.pagination.currentPage++;
      this.GatAllOrders();
    }
  }

}
