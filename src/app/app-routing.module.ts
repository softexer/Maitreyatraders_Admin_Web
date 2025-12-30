import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { SingoutComponent } from './components/singout/singout.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "admin", component: MainPageComponent, children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "orders", component: OrdersComponent },
      { path: "products", component: ProductsComponent },
       { path: "products/:id", component: AddNewProductComponent },
       
        { path: "signout", component: SingoutComponent },
    

    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
