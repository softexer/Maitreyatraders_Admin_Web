import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaitreyaAdminService {
  public baseUrl: string = "http://18.205.217.76:3000";
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

  //signout
  SignoutApi(data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/api/admin/signout`,
      data,
      // { headers: { trimandcut: token } }
    );
  }

  //chgPWD
  ChangePWD(data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/api/admin/changepassword`,
      data,
      // { headers: { trimandcut: token } }
    );
  }

  //search
  SearchinHdr(data: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/api/admin/productsearch?searchText=${data.searchText}`
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

  //Orders
  GetAllOrders(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/admin/orderslist`,
      data
      // { headers: { maitreya: token } }
    );
  }


  //tracking
  AddTracking(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/admin/addtrackingdetails`,
      data
      // { headers: { maitreya: token } }
    );
  }

  //ord-delivrd
  SendtoDelivery(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/admin/orderdelivered`,
      data
      // { headers: { maitreya: token } }
    );
  }
  //CategoryFetch
  GetAllCats(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/categories/fetchcategorys`,
      data
      // { headers: { maitreya: token } }
    );
  }

  //Fetchproducts
  ProductsFetch(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/product/fetchproduct`,
      data
      // { headers: { maitreya: token } }
    );
  }


  //Add-Product
  InsertNewProduct(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/product/addproduct`,
      data
      // { headers: { maitreya: token } }
    );
  }

  //Del-prod
    DeleteProd(data: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // maitreya: token,
      }),
      body: data,
    };
    return this.http.delete(`${this.baseUrl}/api/product/deleteproduct`, options);
  }


  //Categoy-module
  //cat insert
  AddCategory(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/categories/categoryinsert`,
      data
      // { headers: { maitreya: token } }
    );
  }

   Add_SubCategory(data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/api/categories/subcategoryinsert`,
      data
      // { headers: { maitreya: token } }
    );
  }

    Update_SubCategory(data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/api/categories/subcategoryupdate`,
      data
      // { headers: { maitreya: token } }
    );
  }

      Del_SubCat(data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/api/categories/subcategorypulldata`,
      data
      // { headers: { maitreya: token } }
    );
  }


}
