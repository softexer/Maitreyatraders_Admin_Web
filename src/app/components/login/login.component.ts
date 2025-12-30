import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router";

import { PushMessagingService } from "src/app/services/push-messaging.service";
import { v4 as uuidv4 } from 'uuid';
import { MaitreyaAdminService } from "src/app/services/maitreya-admin.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  isLoading = false
  errorMessage = ""
  deviceID: any;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private pushMessageService: PushMessagingService,
    private AdminService: MaitreyaAdminService
  ) {
    this.deviceID = uuidv4();
    this.pushMessageService.requestPermission();
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  /**
   * Initialize the login form with validation rules
   */
  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    })
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    //  this.router.navigateByUrl('/admin/dashboard')
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm)
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    const { username, password, rememberMe } = this.loginForm.value

    // Simulate API call
    this.performLogin(username, password, rememberMe)
  }

  /**
   * Perform login authentication
   * Replace this with your actual authentication service
   */
  private performLogin(username: string, password: string, rememberMe: boolean): void {
    // Simulate API delay
    setTimeout(() => {

      const enteredPassword = this.loginForm.get('password')?.value;
      let deviceToken = this.pushMessageService.fcmToken;
      if (this.loginForm.valid) {
        this.isLoading = true;
        let obj = {
          emailID: this.loginForm.get('username')?.value,
          password: enteredPassword,
          deviceType: "web",
          deviceID: "" + this.deviceID,
          deviceToken: "" + deviceToken,
        }
        console.log(obj)
        this.AdminService.AdminLogin(obj).subscribe((posRes: any) => {
          console.log(posRes)
          if (posRes.response == 3) {
            let data = posRes.loginInfo;
            localStorage.setItem("MAdmin", JSON.stringify(data));
            let deviceObj = {
              deviceID: "" + this.deviceID,
              deviceToken: "" + deviceToken,
            }
            localStorage.setItem("deviceobj", JSON.stringify(deviceObj));
            this.AdminService.checkIsLoggedIn.next(true);
            this.router.navigateByUrl('/admin/dashboard')

          } else {
            this.openSnackBar(posRes.message, "")
          }
          this.isLoading = false;
        }, (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.openSnackBar(err.message, "")
          if (err.error instanceof Error) {
            console.warn("Client Error", err.error)
          } else {
            console.warn("Server Error", err.error)
          }
        })
      } else {
        this.openSnackBar("Enter Valid User ID/Password", "")
      }
    }, 1500)
  }
  openSnackBar(message: string, action: string) {
    // this.snackBar.open(this.translateService.instant(message.trim()), action, {
    //   duration: 3000,
    //   panelClass: "red-snackbar",
    // });
  }
  /**
   * Mark all fields in the form group as touched
   * This will trigger validation messages
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key)
      control?.markAsTouched()

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control)
      }
    })
  }

  /**
   * Get form control for easy access in template
   */
  get username() {
    return this.loginForm.get("username")
  }

  get password() {
    return this.loginForm.get("password")
  }
}
