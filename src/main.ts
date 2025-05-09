import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (!environment.enableLogging) {
  if(window){
    window.console.log = function(){};
  }
}

function bootstrap() {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
};


 if (document.readyState === 'complete') {
   bootstrap();
   registerServiceWorker();
 } else {
   document.addEventListener('DOMContentLoaded', bootstrap);
   registerServiceWorker();
 }
 
 function registerServiceWorker(){
  navigator.serviceWorker.register('firebase-messaging-sw.js')
 .then((registration) => {
   console.log('Service Worker registered with scope: ', registration.scope);
 }).catch((err) => {
   console.error('Service worker registration failed:', err);
 });
}
