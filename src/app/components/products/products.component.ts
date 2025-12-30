import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { Router } from '@angular/router';

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

 interface Product {
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

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
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
  products: Product[] = [ { id: '1', name: 'Mock Chicken', subcategoryId: 'fvf', image: '🍗', createdDate: new Date('2025-01-01'), orderCount: 25 },
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
  allFilteredProducts: Product[] = [ { id: '1', name: 'Mock Chicken', subcategoryId: 'fvf', image: '🍗', createdDate: new Date('2025-01-01'), orderCount: 25 },
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


  constructor(private productsService: MaitreyaAdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    // this.categories = this.productsService.getCategories();
    if (this.categories.length > 0) {
      this.selectCategory(this.categories[0]);
    }
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.selectedSubcategory = null;
    // this.subcategories = this.productsService.getSubcategoriesByCategory(category.id);
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

    // this.allFilteredProducts = this.productsService.getProducts(
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
    this.products = this.allFilteredProducts.slice(startIndex, endIndex);
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

  editProduct(product: Product): void {
    console.log('Edit product:', product);
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      // if (this.productsService.deleteProduct(productId)) {
      //   this.applyFilters();
      // }
    }
  }

  openAddProductModal(): void {
    console.log('Open add product modal');
     this.router.navigateByUrl('/admin/products/:id')
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
}
