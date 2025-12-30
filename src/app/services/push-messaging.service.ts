import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushMessagingService {
  private fcmTokenSubject = new BehaviorSubject<string | null>(null);  // Use BehaviorSubject to store the token
  public token$ = this.fcmTokenSubject.asObservable();  // Expose token as an observable
  currentMessage = new BehaviorSubject<any>(null);
  fcmToken: string | null = null;
  constructor(private afMessaging: AngularFireMessaging) {
    this.receiveMessage();
  }

  /**
   * Request permission and get FCM token.
   */
  async requestPermission(): Promise<void> {
    try {
      if (!('Notification' in window)) {
        console.error('This browser does not support notifications.');
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.warn('Notification permission not granted.');
        return;
      }

      // Wait for the service worker to be ready
      const swRegistration = await navigator.serviceWorker.ready;
      console.log('Service Worker is ready:', swRegistration);

      // Now get the token from AngularFire
      this.afMessaging.requestToken.subscribe(
        (token) => {
          if (token) {
            this.fcmTokenSubject.next(token);  // Update the token
            localStorage.setItem('fcm_token', token);
            console.log('FCM Token:', token);
            this.fcmToken = token
          } else {
            console.warn('No FCM token received.');
            this.fcmTokenSubject.next(null);  // Token is not available, update the observable
          }
        },
        (error) => {
          console.error('Error getting FCM token:', error);
          this.fcmTokenSubject.next(null);  // On error, update the observable
        }
      );
    } catch (error) {
      console.error('Failed during permission/token request:', error);
      this.fcmTokenSubject.next(null);  // On error, update the observable
    }
  }

  
  /**
   * Listen for incoming messages
   */
  receiveMessage(): void {
    this.afMessaging.messages.subscribe((payload: any) => {
      this.currentMessage.next(payload);
      this.showCustomNotification(payload);
      console.log('Foreground message received:', payload);
    });
  }

  /**
   * Return observable message stream
   */
  getMessage() {
    return this.currentMessage.asObservable();
  }

  /**
   * Show a browser notification
   */
  private showCustomNotification(payload: any): void {
    const notifyData = payload?.notification;
    if (!notifyData) return;

    const title = notifyData.title || 'New Notification';
    const options: NotificationOptions = {
      body: notifyData.body || '',
      icon: notifyData.icon || '/assets/icons/icon-72x72.png',
    };

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}







// import { Injectable, inject } from '@angular/core';
// import {  getToken, onMessage } from 'firebase/messaging';
// import { BehaviorSubject } from 'rxjs';
// import { Messaging } from '@angular/fire/messaging';   // Angular DI token

// import { environment } from '../../environments/environment';


// @Injectable({
//   providedIn: 'root'
// })
// export class PushMessagingService {
 
//   private messaging = inject(Messaging);
//   currentMessage = new BehaviorSubject<any>(null);

//   constructor() {
//     this.listenToMessages();
//   }

//   async requestPermission() {
//     const permission = await Notification.requestPermission();
//     if (permission !== 'granted') {
//       console.error('Notification permission not granted.');
//       return null;
//     }

//     try {
//       const token = await getToken(this.messaging, {
//         vapidKey: environment.vapidKey
//       });
//       console.log('FCM Token:', token);
//       return token;
//     } catch (err) {
//       console.error('Unable to get FCM token', err);
//       return null;
//     }
//   }

//   listenToMessages() {
//     onMessage(this.messaging, (payload) => {
//       console.log('Foreground message received: ', payload);
//       this.currentMessage.next(payload);
//       this.showCustomNotification(payload);
//     });
//   }

//   showCustomNotification(payload: any) {
//     const title = payload.notification?.title || 'Notification';
//     const body = payload.notification?.body || '';

//     if ('Notification' in window) {
//       Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//           new Notification(title, { body });
//         }
//       });
//     }
//   }
// }