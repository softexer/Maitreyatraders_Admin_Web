import { Component } from '@angular/core';


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
  categories: string[] = [
    'Meat',
    'Seafood',
    'Vegetarian',
    'Frozen',
    'Snacks'
  ];

  categoryMap: { [key: string]: string[] } = {
    Meat: ['Chicken', 'Mutton', 'Beef'],
    Seafood: ['Fish', 'Prawns', 'Crab'],
    Vegetarian: ['Vegetables', 'Paneer', 'Tofu'],
    Frozen: ['Frozen Chicken', 'Frozen Veg', 'Ice Cream'],
    Snacks: ['Chips', 'Nuts', 'Biscuits']
  };

  subCategories: string[] = [];

  // currencies: Currency[] = [
  //   { code: 'INR', symbol: '₹' },
  //   { code: 'USD', symbol: '$' },
  //   { code: 'EUR', symbol: '€' }
  // ];

  weightUnits: string[] = ['g', 'kg', 'ml', 'ltr'];

  stockStatuses: string[] = [
    'In Stock',
    'Out of Stock',
    'Low Stock'
  ];

  /* ---------------------------
   * FORM DATA MODEL
   * --------------------------- */

  formData = {
    basicDetails: {
      productName: '',
      productHighlights: '',
      productDescription: '',
      category: '',
      subCategory: ''
    },

    pricing: {
      currency: 'INR',
      productPrice: null as number | null,
      discountedPrice: null as number | null,
      weight: null as number | null,
      weightUnit: 'g',
      taxIncluded: true
    },

    expiration: {
      startDate: '',
      endDate: ''
    },

    inventory: {
      unlimited: true,
      stockQuantity: 'Unlimited',
      stockStatus: 'In Stock',

      highlight: false
    }
  };

  /* ---------------------------
   * IMAGE HANDLING
   * --------------------------- */

  mainImagePreview: string | null = null;
  thumbnailPreviews: string[] = [];

  /* ---------------------------
   * METHODS
   * --------------------------- */


  onCategoryChange(category: string) {
    this.subCategories = this.categoryMap[category] || [];
    this.formData.basicDetails.subCategory = ''; // reset subcategory
  }

  onStockQuantityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.formData.inventory.unlimited = value === 'Unlimited';
  }

  publishProduct(): void {
    console.log('Product Data:', this.formData);

    const payload = {
      ...this.formData,
      images: {
        main: this.mainImagePreview,
        thumbnails: this.thumbnailPreviews
      }
    };

    console.log('Final Payload:', payload);

    // API call can be added here
    // this.productService.createProduct(payload).subscribe(...)
  }

  /* ---------------------------
   * IMAGE UPLOAD HANDLERS
   * --------------------------- */

  onMainImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.mainImagePreview = reader.result as string;
    };
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    reader.readAsDataURL(file);
    Array.from(files).forEach(file => {
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

    const reader = new FileReader();
    reader.onload = () => {
      this.mainImagePreview = reader.result as string;
    };

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  removeThumbnail(index: number): void {
    this.thumbnailPreviews.splice(index, 1);
  }

  pricingVariants: any[] = [];

  addPricing() {
    const p = this.formData.pricing;

    // Basic validation
    if (!p.productPrice || !p.weight) {
      return;
    }

    this.pricingVariants.push({
      currency: p.currency,
      productPrice: p.productPrice,
      discountedPrice: p.discountedPrice,
      weight: p.weight,
      weightUnit: p.weightUnit,
      taxIncluded: p.taxIncluded
    });

    // Reset ONLY pricing inputs
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

  // getCurrencySymbol(): string {
  //   return (
  //     this.currencies.find(c => c.code === this.formData.pricing.currency)
  //       ?.symbol || '₹'
  //   );
  // }
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
