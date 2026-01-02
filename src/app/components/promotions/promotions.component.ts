import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ShippingInfoComponent } from '../shipping-info/shipping-info.component';
import { Router } from '@angular/router';
import { OfferCardComponent } from '../offer-card/offer-card.component';


interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {

  searchText = '';
  openIndex: number | null = null;

  promotions = [
    { offer: '10% Off', date: '01-01-2025', status: 'Active' },
    { offer: 'Buy 3 Get 1 Free', date: '01-01-2025', status: 'Deactive' },
    { offer: '10% Off', date: '01-01-2025', status: 'Active' },
    { offer: '10% Off', date: '01-01-2025', status: 'Active' }
  ];
  Filterpromotions = [
    { offer: '10% Off', date: '01-01-2025', status: 'Active' },
    { offer: 'Buy 3 Get 1 Free', date: '01-01-2025', status: 'Deactive' },
    { offer: '10% Off', date: '01-01-2025', status: 'Active' },
    { offer: '10% Off', date: '01-01-2025', status: 'Active' }
  ];
  itemsPerPage: number = 10;
  pagination: PaginationState = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };

  constructor(
    private AdminService: MaitreyaAdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.pagination.currentPage = 1;
    this.updatePagination();
  }

  AddNewOffer() {
     let obj = {
     type: 'add'
    }
    let dialogRef = this.dialog.open(OfferCardComponent, {
      // width: '320px',
      // panelClass: 'notification-dialog',
      // backdropClass: 'transparent-backdrop',
      // hasBackdrop: true,
      // disableClose: false,

      panelClass: 'offer-dialog',
      hasBackdrop: true,
      disableClose: true,
      width: '480px',
      maxHeight: '85vh',
      position: {
        top: '40px'
      },
       data: { obj }
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
  toggleMenu(index: number, event?: MouseEvent) {
    event?.stopPropagation();
    this.openIndex = this.openIndex === index ? null : index;
  }


  toggleBlockCustomer(barbr: any) {
    barbr.accstatus =
      barbr.accstatus === 'Block' ? 'UnBlock' : 'Block';
    this.openIndex = null;
  }

  removeCustomer(barbr: any) {
    console.log('Remove', barbr);
    this.openIndex = null;
  }

  view(item: any) {
    console.log('View', item);
    this.openIndex = null;
    let obj = {
     type: 'view'
    }
    this.openIndex = null;
       let dialogRef = this.dialog.open(OfferCardComponent, {
      // width: '320px',
      // panelClass: 'notification-dialog',
      // backdropClass: 'transparent-backdrop',
      // hasBackdrop: true,
      // disableClose: false,

      panelClass: 'offer-dialog',
      hasBackdrop: true,
      disableClose: true,
      width: '480px',
      maxHeight: '85vh',
      position: {
        top: '40px'
      },
     data: { obj }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    })
  }

  edit(item: any) {
    console.log('Edit', item);
    let obj = {
     type: 'edit'
    }
    this.openIndex = null;
       let dialogRef = this.dialog.open(OfferCardComponent, {
      // width: '320px',
      // panelClass: 'notification-dialog',
      // backdropClass: 'transparent-backdrop',
      // hasBackdrop: true,
      // disableClose: false,

      panelClass: 'offer-dialog',
      hasBackdrop: true,
      disableClose: true,
      width: '480px',
      maxHeight: '85vh',
      position: {
        top: '40px'
      },
     data: { obj }
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

  deactivate(item: any) {
    item.status = 'Deactive';
    this.openIndex = null;
  }

  delete(item: any) {
    console.log('Delete', item);
    this.openIndex = null;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // If click is OUTSIDE action menu + dots
    if (!target.closest('.action-wrapper')) {
      this.openIndex = null;
    }
  }


  // pagination code
  updatePagination(): void {
    this.pagination.totalItems = this.Filterpromotions.length;
    this.pagination.pageSize = this.itemsPerPage;
    this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.itemsPerPage);

    const startIndex = (this.pagination.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.promotions = this.Filterpromotions.slice(startIndex, endIndex);
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
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.pagination.totalPages) {
      this.pagination.currentPage = pageNumber;
      this.updatePagination();
    }
  }

  isPageActive(pageNumber: number): boolean {
    return this.pagination.currentPage === pageNumber;
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

}
