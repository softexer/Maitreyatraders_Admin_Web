import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { PushMessagingService } from './services/push-messaging.service';

import { AngularFireModule } from '@angular/fire/compat';
// NEW AngularFire v18 imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { HttpClientModule } from '@angular/common/http';



import { environment } from 'src/environments/environment';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent } from './components/login/login.component';
import { SingoutComponent } from './components/singout/singout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { NgChartsModule } from 'ng2-charts';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { ShippingInfoComponent } from './components/shipping-info/shipping-info.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChangepasswrdComponent } from './components/changepasswrd/changepasswrd.component';
import { CategoriesAllComponent } from './components/categories-all/categories-all.component';
import { CategoryAddComponent } from './components/category-add/category-add.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { OfferCardComponent } from './components/offer-card/offer-card.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    LoginComponent,
    SingoutComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    OrdersComponent,
    ProductsComponent,
    AddNewProductComponent,
    ShippingInfoComponent,
    NotificationsComponent,
    ChangepasswrdComponent,
    CategoriesAllComponent,
    CategoryAddComponent,
    PromotionsComponent,
    OfferCardComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
     NgChartsModule,
AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [PushMessagingService,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging())

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
