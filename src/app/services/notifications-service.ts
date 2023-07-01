import { Injectable } from '@angular/core';
import {Capacitor} from '@capacitor/core';
import { ActionPerformed, PushNotifications } from '@capacitor/push-notifications';
import { NavController } from '@ionic/angular';

@Injectable({    providedIn: 'root'})

export class NotificationsService 
{    
    constructor(
        public navCtrl: NavController,
    ) 
    { 

    }    
    initPush() 
    {        
        if (Capacitor.getPlatform() !== 'web') 
        {            
            this.registerPush();        
        }    
    }    

    private registerPush() 
    {        
        PushNotifications.requestPermissions().then(permission => {            
            if (permission.receive === 'granted') {                
                PushNotifications.register();           
            }   else {                
                // If permission is not granted            
            }        
        });       
        PushNotifications.addListener('registration', (token) => {       
            localStorage.setItem('token',token.value);
            console.log('token - '+token);       
         });        
         PushNotifications.addListener('registrationError', (err)=> {            
            console.log(err);        
        }); 
        PushNotifications.addListener('pushNotificationReceived',(notifications)=> {            
            console.log(notifications);       
         });

         PushNotifications.addListener('pushNotificationActionPerformed',(notification: ActionPerformed) => {

            console.log('App opened',JSON.stringify(notification)) 

            // var n = JSON.parse(notification)
            console.log("notification.data ->"+notification.notification.data);
            var data = notification.notification.data;
            var module = data.module;
            var path = data.path;
            console.log("path ->"+path);

            this.navCtrl.navigateRoot('menu/'+path);
            // var module = notification.data['module'];
            // console.log("module ->"+module);
            
        });
   }
}