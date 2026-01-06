import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { MaitreyaproductsService } from 'src/app/services/maitreya-admin.service';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

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
export class ProductsComponent implements OnInit {
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  selectedCategory!: Category | null;
  selectedSubcategory!: Subcategory | null;

  searchTerm = '';
  allProducts: Array<any> = [];  // full list
  products: Array<any> = [];     // filtered list
  itemsPerPage: number = 10;
  pagination: PaginationState = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };
baseUrl : string= '';

  constructor(private productsService: MaitreyaAdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.baseUrl = this.productsService.baseUrl;
    this.GetCategories();
    this.loadCategories();
  }

  GetCategories() {
    const payload = {
      categoryID: "All"
    };
    console.log(payload)
    this.productsService.showLoader.next(true);
    this.productsService.GetAllCats(payload).subscribe(
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
          this.pagination.currentPage = res.currentPage;
          this.pagination.totalPages = res.totalpages;

          // Optional (if backend doesn't send total count)
          this.pagination.totalItems =
            res.totalpages * this.pagination.pageSize;

        } else {
          console.error("Unexpected response:", res.message);
        }

        this.productsService.showLoader.next(false);
      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching:", err.message);
        this.openSnackBar(err.message, "");
        this.productsService.showLoader.next(false);
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: "red-snackbar",
    });
  }
  loadCategories(): void {
    // this.categories = this.productsService.getCategories();
    if (this.categories.length > 0) {
      this.selectCategory(this.categories[0]);
    }
  }

  selectCategory(category: Category): void {
    console.log(category)
    this.selectedCategory = category;
    this.subcategories = category.subcategories || [];
    this.selectedSubcategory = null;

    if (this.subcategories.length) {
      this.selectSubcategory(this.subcategories[0]);
    } else {
      this.products = [];
    }

    this.searchTerm = '';
    this.pagination.currentPage = 1;
  }


  selectSubcategory(subcategory: Subcategory): void {
    this.selectedSubcategory = subcategory;
    console.log(this.selectedSubcategory)
    this.pagination.currentPage = 1;
    this.searchTerm = '';
    this.getProductsBySubCategory(subcategory.id);
  }
  getProductsBySubCategory(subCategoryId: string): void {
    if (!this.selectedCategory) {
      console.error('Category not selected');
      return;
    }

    const payload = {
      productID: 'All',
      categoryID: this.selectedCategory.id,
      subCategoryID: subCategoryId,
      pageNo: this.pagination.currentPage,
      size: this.pagination.pageSize,
      searchText: this.searchTerm
    };

    this.productsService.showLoader.next(true);

    this.productsService.ProductsFetch(payload).subscribe(
      (res: any) => {
        console.log(res)
        if (res.response === 3) {
          this.allProducts = res.Products;
          this.products = res.Products

          this.pagination.currentPage = res.currentPage;
          this.pagination.totalPages = res.totalpages;

          // Optional (if backend doesn't send total count)
          this.pagination.totalItems = res.totalpages * this.pagination.pageSize;
          // this.applyFilters();
        } else {
          this.allProducts = [];
          this.products = [];
        }
        this.productsService.showLoader.next(false);
      },
      () => {
        this.allProducts = [];
        this.products = [];
        this.productsService.showLoader.next(false);
      }
    );
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.pagination.currentPage = 1;
    this.applyFilters();
  }
  applyFilters(): void {
    let filtered = this.allProducts;

    if (this.selectedSubcategory) {
      filtered = filtered.filter(
        p => p.subcategoryId === this.selectedSubcategory!.id
      );
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term)
      );
    }

    this.products = filtered;
    // this.updatePagination();
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
formatDate23(timestamp: string | number): string {
  if (!timestamp) return '-';

  const date = new Date(Number(timestamp)); // 🔑 convert to number

  if (isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
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


  getItemIndex(index: number): number {
    return (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
  }
  //pagination
  // updatePagination(): void {
  //   this.pagination.totalItems = this.allFilteredProducts.length;
  //   this.pagination.pageSize = this.itemsPerPage;
  //   this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.itemsPerPage);

  //   const startIndex = (this.pagination.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.Mainproducts = this.allFilteredProducts.slice(startIndex, endIndex);
  // }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.pagination.totalPages) {
      this.pagination.currentPage = pageNumber;
      if (this.selectedSubcategory) {
        this.getProductsBySubCategory(this.selectedSubcategory.id);
      }
    }
  }

  previousPage(): void {
    if (this.pagination.currentPage > 1) {
      this.pagination.currentPage--;
      if (this.selectedSubcategory) {
        this.getProductsBySubCategory(this.selectedSubcategory.id);
      }
    }
  }

  nextPage(): void {
    if (this.pagination.currentPage < this.pagination.totalPages) {
      this.pagination.currentPage++;
      if (this.selectedSubcategory) {
        this.getProductsBySubCategory(this.selectedSubcategory.id);
      }
    }
  }
}
