import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { AppCommon } from 'src/app/app.common'; 
import { FileOpener } from '@ionic-native/file-opener/ngx';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AppCommon, useClass: AppCommon },
    FileOpener,
    FileTransferObject,
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
  ],
});

defineCustomElements(window);