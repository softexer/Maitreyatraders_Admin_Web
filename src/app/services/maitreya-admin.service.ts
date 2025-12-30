import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaitreyaAdminService {
  public baseUrl: string = "http://192.168.1.16:3000";
  public userID: string = "";
  public checkIsLoggedIn = new BehaviorSubject(false);
  public Signout = new BehaviorSubject(false);
  showLoader = new BehaviorSubject(false);
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public proceedCartPayment = new BehaviorSubject(false);
  public cartCountItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public cartTotalCount = this.cartCountItems.asObservable();
  public addcartItems: any[] = [];
  public allCategoriesList: Array<any> = [];


  constructor(private http: HttpClient) { }

  //Login
  AdminLogin(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/admin/login`,
      data
    );
  }

  
  //Dashboard
  GetDashboard(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/admin/dashboard`,
      data
      // { headers: { maitreya: token } }
    );
  }


  //homepage Products
  // HomepageData(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/api/product/customerhomepage`);
  // }

  // //homepage Cats
  // LoadAllCategories(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/api/product/fetchcategories`);
  // }

  // //homepage Cats
  // GetProducts_Of_Subcats(data: any): Observable<any> {
  //   return this.http.post(
  //     `${this.baseUrl}/api/product/productlist`,
  //     data,
  //     // { headers: { aieonki: token } }
  //   );
  // }




}
