import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaitreyaAdminService } from 'src/app/services/maitreya-admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Chart } from 'chart.js';
import type { ChartOptions, ChartType, ChartTypeRegistry } from 'chart.js';


interface Statistic {
  title: string;
  amount: string;
  percentage: number;
  comparison: string;
  icon: string;
  trend: 'increase' | 'decrease';
}

interface BestSeller {
  name: string;
  image: string;
  price: string;
  sales: string;
}

interface RecentOrder {
  id: string;
  product: string;
  orderId: string;
  date: string;
  customerName: string;
  customerAvatar: string;
  status: string;
  amount: string;
  selected: boolean;
}
type ViewType = 'Today' | 'Week' | 'Month' | 'Year';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  fromDate: string = '2023-10-11';
  toDate: string = '2023-11-11';
  // selectedPeriod: string = 'MONTHLY';
  user: any;
  isLoggedIn: boolean = false;
  baseUrl: string = "";

  statistics: Statistic[] = [];

  bestSellers: BestSeller[] = [];

  recentOrders: RecentOrder[] = [
    {
      id: '1',
      product: 'Lorem Ipsum',
      orderId: '#25426',
      date: 'Nov 8th,2023',
      customerName: 'Kevin',
      customerAvatar: '👤',
      status: 'Delivered',
      amount: '£200.00',
      selected: false
    },
  ];

  //Pagination
  paginatedItems: RecentOrder[] = [];
  @Input() totalPages = 1
  @Input() currentPage = 1
  @Input() pageSize = 20
  @Output() pageChange = new EventEmitter<number>()
  @Output() pageSizeChange = new EventEmitter<number>()

  pageNumbers: number[] = []
  pageInputControl = new FormControl(this.currentPage.toString());
  isDropdownOpen2 = false
  dropdownDirection: 'down' | 'up' = 'down';

  @ViewChild('pageDropdown', { static: false }) dropdownRef!: ElementRef;
  chartData = {
    months: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    values: [100, 150, 120, 180, 280, 350]
  };
  Dashboard_grapph: any[] = [];
  view: ViewType = 'Year';
  selectedPeriod: ViewType = 'Year';
  periods: ViewType[] = ['Today', 'Week', 'Month', 'Year'];

  // public lineChartData: ChartConfiguration<'line'>['data'] = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //   datasets: [
  //     {
  //       data: [30, 40, 60, 35, 25, 50, 40, 15, 35, 60, 70, 80],
  //       // label: 'Count',
  //       fill: true,
  //       tension: 0.5,
  //       pointRadius: 4,
  //       pointBorderColor: 'rgba(255, 105, 180, 1)',
  //       pointBackgroundColor: 'black',
  //       borderWidth: 2,
  //       // borderColor: 'rgba(147,112,219,0.8)',
  //        borderColor: 'rgba(247, 128, 22, 0.2)',
  //       backgroundColor: 'rgba(147,112,219,0.3)'
  //     }
  //   ]
  // };


  // public lineChartOptions: ChartOptions<'line'> = {
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   layout: {
  //     padding: 10
  //   },
  //   animation: false,
  //   plugins: {
  //     tooltip: {
  //       backgroundColor: 'rgba(255, 105, 180, 1)',
  //       titleColor: '#FFFFFF',
  //       bodyColor: '#FFFFFF',
  //       displayColors: false,
  //       padding: 10,
  //       bodyFont: {
  //         size: 14,
  //       },
  //       titleFont: {
  //         size: 14,
  //       },
  //       callbacks: {
  //         title: (context) => {
  //           const label = context[0].label || '';
  //           return `Month: ${label}`;
  //         },
  //         label: (context) => {
  //           const value = context.parsed.y || 0;
  //           return `Count: ${value}`;
  //         },
  //       },
  //     },
  //     legend: {
  //       display: false,
  //     }
  //   },
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       ticks: {
  //         stepSize: 1,
  //         callback: (value) => {
  //           const numericValue = Number(value);
  //           return numericValue % 1 === 0 ? numericValue : '';
  //         },
  //       },
  //     },
  //   },
  //   elements: {
  //     line: {
  //       borderWidth: 2,
  //       tension: 0.4,
  //       borderColor: 'rgba(6, 21, 43, 1)',
  //     },
  //     point: {
  //       radius: 5,
  //       backgroundColor: 'black',
  //       borderWidth: 1,
  //       hoverRadius: 7,
  //     },
  //   },
  // };
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [40, 40, 45, 75, 50, 360],
        fill: false, // ✅ NO background fill
        tension: 0.45, // smooth curve
        pointRadius: 0, // hide points
        pointHoverRadius: 6,

        borderColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return;

          const gradient = ctx.createLinearGradient(
            chartArea.left,
            0,
            chartArea.right,
            0
          );

          gradient.addColorStop(0, 'rgba(247, 128, 22, 0.35)');
          gradient.addColorStop(1, 'rgba(254, 179, 41, 0.99)');

          return gradient;
        },

        borderWidth: 3,
      }
    ]
  };


  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        displayColors: false,
        callbacks: {
          label: (context) => `Count: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      }
    },
    elements: {
      line: {
        capBezierPoints: true
      }
    }
  };


  public lineChartLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];

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
    this.generatePageNumbers()
    this.pageInputControl.setValue(this.currentPage.toString());
    this.LoadDashboard();
  }

  startDate: string = "";
  endDate: string = "";
  selectPeriod(period: ViewType) {
    this.selectedPeriod = period;
    this.view = period;        // ✅ keeps chart in sync
    // this.LoadDashboard();
    // this.updateChart();        // ✅ refresh chart

    
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (period) {

    case 'Today':
      start = new Date(now);
      start.setHours(0, 1, 0, 0);        // 12:01 AM

      end = new Date(now);
      end.setHours(23, 59, 59, 999);     // 11:59:59 PM
      break;

    case 'Week':
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // Sunday
      start.setHours(0, 1, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6); // Saturday
      end.setHours(23, 59, 59, 999);
      break;

    case 'Month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 1, 0, 0);

      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'Year':
      start = new Date(now.getFullYear(), 0, 1);
      start.setHours(0, 1, 0, 0);

      end = new Date(now.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      break;

    default:
      return;
  }

  // Convert to TIMESTAMP format (string)
  this.startDate = start.getTime().toString();
  this.endDate = end.getTime().toString();

  console.log('Start:', this.startDate);
  console.log('End:', this.endDate);
  }


  toggleAllOrders(event: any) {
    const checked = event.target.checked;
    this.recentOrders.forEach(order => order.selected = checked);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  LoadDashboard() {
    const payload = {
      adminuniqueID: this.user.adminuniqueID,
      pageNo: 1,
      size: 10,
      selectTypeGraph: this.view,
      startDate:this.startDate,
      endDate: this.endDate
      // startDate: "1736506168000",
      // endDate: "1767091768000"

    };
    this.AdminService.showLoader.next(true);
    this.AdminService.GetDashboard(payload).subscribe(
      (res: any) => {
        console.log(res);
        if (res.response === 3) {
          const previousMonth = this.getPreviousMonthLabel();

          this.statistics = [
            {
              title: 'Total Orders',
              amount: res.TotalOrders,
              percentage: res.TotalOrdersPercentage?.percentageChange || 0,
              comparison: `Compared to ${previousMonth}`,
              icon: '📦',
              trend: res.TotalOrdersPercentage?.trend
            },
            {
              title: 'Active Orders',
              amount: res.ActiveOrders,
              percentage: res.TotalOrdersActivePercentage?.percentageChange || 0,
              comparison: `Compared to ${previousMonth}`,
              icon: '🔄',
              trend: res.TotalOrdersActivePercentage?.trend
            },
            {
              title: 'Completed Orders',
              amount: res.CompvaredOrders,
              percentage: res.TotalOrdersCompletedPercentage?.percentageChange || 0,
              comparison: `Compared to ${previousMonth}`,
              icon: '✓',
              trend: res.TotalOrdersCompletedPercentage?.trend
            }
          ];

          if (res?.ProductsTopSales?.length) {
            this.bestSellers = res.ProductsTopSales.map((product: any) => ({
              name: product.productName,
              image: product.productImagesList?.length
                ? `${this.baseUrl}${product.productImagesList[0]}`
                : '',
              price: `₹${product.productPrice}`,
              sales: product.stockQuantity
                ? `${product.stockQuantity} sales`
                : '0 sales'
            }));
          }
          if (res?.NewOrders?.length) {
            this.recentOrders = res.NewOrders.map((order: any) => {
              const firstProduct = order.Products?.[0];

              return {
                id: order._id,
                product: firstProduct?.productName || '—',
                orderId: order.orderId,
                date: new Date(Number(order.orderTimeStamp))
                  .toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }),
                customerName: `${order.addressDetails?.firstName || ''} ${order.addressDetails?.lastName || ''}`,
                customerAvatar: '👤',
                status: order.orderStatus,
                amount: `₹${order.totalToPay}`,
                selected: false
              };
            });
          } else {
            this.recentOrders = [];
          }

          this.Dashboard_grapph = res.GraphData;
          console.log(this.Dashboard_grapph);
          this.updateChart();

        } else {

          console.error("Unexpected response:", res.message);
        }

        this.AdminService.showLoader.next(false);
      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching drivers:", err.message);
        this.openSnackBar(err.message, "");
        this.AdminService.showLoader.next(false);
      }
    );
  }
  getPreviousMonthLabel(): string {
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return prevMonthDate.toLocaleString('default', {
      month: 'short',
      year: 'numeric'
    });
  }

  updateChart() {

    /* ---------------- WEEK (keep as-is) ---------------- */
    if (this.view === 'Week') {
      const analyticData = this.Dashboard_grapph;

      this.lineChartData = {
        labels: analyticData.map((item: any) => item.day),
        datasets: [
          {
            data: analyticData.map((item: any) => item.count),
            label: 'Count',
            fill: true,
            tension: 0.5,
            pointRadius: 4,
            borderWidth: 2,
            borderColor: 'rgba(147,112,219,0.8)',
            backgroundColor: 'rgba(147,112,219,0.3)',
            pointBorderColor: 'rgba(255, 105, 180, 1)',
            pointBackgroundColor: 'black',
          },
        ]
      };
    }

    /* ---------------- MONTH (keep as-is) ---------------- */
    if (this.view === 'Month') {
      const analyticData = this.Dashboard_grapph;

      this.lineChartData = {
        labels: analyticData.map((item: any) => this.formatDatemonth(item.day)),
        datasets: [
          {
            data: analyticData.map((item: any) => item.count),
            label: 'Count',
            fill: true,
            tension: 0.5,
            pointRadius: 4,
            borderWidth: 2,
            borderColor: 'rgba(147,112,219,0.8)',
            backgroundColor: 'rgba(147,112,219,0.3)',
            pointBorderColor: 'rgba(255, 105, 180, 1)',
            pointBackgroundColor: 'black',
          },
        ]
      };
    }

    /* ---------------- YEAR (MODIFIED) ---------------- */
    if (this.view === 'Year') {
      const analyticData = this.Dashboard_grapph;

      this.lineChartData = {
        labels: analyticData.map((item: any) =>
          this.formatDateyear(item.month)
        ),
        datasets: [
          {
            data: analyticData.map((item: any) => item.count),
            label: 'Count',

            fill: false,           // ✅ NO background fill
            tension: 0.45,         // smooth curve
            pointRadius: 0,        // hide points
            pointHoverRadius: 6,

            borderWidth: 3,
            borderColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return;

              const gradient = ctx.createLinearGradient(
                chartArea.left,
                0,
                chartArea.right,
                0
              );

              gradient.addColorStop(0, 'rgba(247, 128, 22, 0.35)');
              gradient.addColorStop(1, 'rgba(254, 179, 41, 0.99)');

              return gradient;
            },
          },
        ],
      };
    }
  }

  updateChart2() {
    if (this.view === 'Week') {
      let analyticData = this.Dashboard_grapph;
      console.log(analyticData)
      this.lineChartLabels = [];
      this.lineChartData = {
        labels: analyticData.map((item: any) => item.day),
        datasets: [
          {
            data: analyticData.map((item: any) => item.count),
            label: 'Count',
            fill: true,
            tension: 0.5,
            pointRadius: 4,
            borderWidth: 2,
            borderColor: 'rgba(147,112,219,0.8)',
            backgroundColor: 'rgba(147,112,219,0.3)',
            pointBorderColor: 'rgba(255, 105, 180, 1)',
            pointBackgroundColor: 'black',
          },
        ]

      };
    }
    if (this.view === 'Month') {
      let analyticData = this.Dashboard_grapph;
      console.log(analyticData)
      this.lineChartLabels = [];
      this.lineChartData = {
        labels: analyticData.map((item: any) => this.formatDatemonth(item.date)), // use item.date
        datasets: [
          {
            data: analyticData.map((item: any) => item.count),
            label: 'Count',
            fill: true,
            tension: 0.5,
            pointRadius: 4,
            borderWidth: 2,
            borderColor: 'rgba(147,112,219,0.8)',
            backgroundColor: 'rgba(147,112,219,0.3)',
            pointBorderColor: 'rgba(255, 105, 180, 1)',
            pointBackgroundColor: 'black',
          },
        ]
      };

    }
    if (this.view === 'Year') {
      const analyticData = this.Dashboard_grapph;

      this.lineChartData = {
        labels: analyticData.map((item: any) =>
          this.formatDateyear(item.month)
        ),
        datasets: [
          {
            data: analyticData.map((item: any) => item.count), // ✅ FIX
            label: 'Count',
            fill: true,
            tension: 0.5,
            pointRadius: 4,
            borderWidth: 2,
            borderColor: 'rgba(147,112,219,0.8)',
            backgroundColor: 'rgba(147,112,219,0.3)',
            pointBorderColor: 'rgba(255, 105, 180, 1)',
            pointBackgroundColor: 'black',
          },
        ],
      };
    }

    // if (this.view === 'Year') {
    //   let analyticData = this.Dashboard_grapph;
    //   console.log(analyticData)
    //   this.lineChartLabels = [];
    //   this.lineChartData = {
    //     labels: analyticData.map((item: any) => this.formatDateyear(item.month)),
    //     datasets: [
    //       {
    //         data: analyticData.map((item: any) => item.totalCompletedCount),
    //         label: 'Count',
    //         fill: true,
    //         tension: 0.5,
    //         pointRadius: 4,
    //         borderWidth: 2,
    //         borderColor: 'rgba(147,112,219,0.8)',
    //         backgroundColor: 'rgba(147,112,219,0.3)',
    //         pointBorderColor: 'rgba(255, 105, 180, 1)',
    //         pointBackgroundColor: 'black',
    //       },
    //     ]

    //   };
    // }

  }
formatDatemonth(dateStr: string): string {
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const date = new Date(dateStr); // parse the date string
  const day = date.getDate();
  const monthName = monthNamesEn[date.getMonth()]; // get month from date
  return `${monthName} ${day}`;
}


  formatDateyear(month: string): string {
    // English month names
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // month comes like "2025-09"
    if (!month) return '';

    const monthNumber = Number(month.split('-')[1]); // "09" → 9

    if (monthNumber >= 1 && monthNumber <= 12) {
      return monthNames[monthNumber - 1];
    }

    return month;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: "red-snackbar",
    });
  }
  //Pagination-code  
  ngOnChanges(): void {
    this.generatePageNumbers()
    this.pageInputControl.setValue(this.currentPage.toString())
  }
  getItemIndex(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1
  }
  generatePageNumbers(): void {
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1)
    console.log(this.pageNumbers)
  }
  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.currentPage = page
      this.pageInputControl.setValue(page.toString())
      this.isDropdownOpen2 = false
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1)
    }
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1)
    }
  }
  toggleDropdown2() {
    this.isDropdownOpen2 = !this.isDropdownOpen2;

    if (this.isDropdownOpen2) {
      setTimeout(() => this.setDropdownDirection(), 0); // wait for dropdown to render
    }
  }
  setDropdownDirection() {
    const dropdownEl = this.dropdownRef?.nativeElement;
    const rect = dropdownEl?.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 200; // fixed or estimated

    this.dropdownDirection = spaceBelow < dropdownHeight + 10 ? 'up' : 'down';
  }
  closeDropdown(): void {
    this.isDropdownOpen2 = false
  }
  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      const pageNum = Number.parseInt(this.pageInputControl.value || "", 10)
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages) {
        this.goToPage(pageNum)
      }
      event.preventDefault()
    }
  }
  onPageInputEnter() {
    const page = Number(this.pageInputControl.value);
    if (!isNaN(page) && page >= 1 && page <= this.totalPages) {
      this.goToPage(page);
    } else {
      this.pageInputControl.setValue(this.currentPage.toString());

    }
  }
}
