import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EnvConfig } from 'src/app/app.module';
import { JWTInterceptor } from 'src/app/core/interceptor/jwt-interceptor';
import { HttpDefaultOptions, JWTOptions } from 'src/app/core/model/option';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireModule } from '@angular/fire/compat';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppLoadingMaskComponent } from './components/app-loading-mask/app-loading-mask.component';
import { LoaderComponent } from './components/loader/loader.component';


export class JinghoJWTOptions extends JWTOptions {
  override key = 'jingho-web';
}

export class JinghoHttpDefaultOptions extends HttpDefaultOptions {
  override baseApiURL = environment.baseApiUrl; // input api base url.
}

export class JinghoEnvConfig {
  baseApiUrl = environment.baseApiUrl;
  orgId = environment.orgId;
  siteKey = environment.siteKey;
  rememberMeKey = environment.rememberMeKey;
  loginGuide = environment.loginGuide;
  googleAnalyticsKey = environment.googleAnalyticsKey;
}

@NgModule({
  declarations: [AppComponent, AppLoadingMaskComponent, LoaderComponent],
  imports: [
    MatDialogModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.fireBaseConfig),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true,
    },
    { provide: HttpDefaultOptions, useClass: JinghoHttpDefaultOptions },
    { provide: JWTOptions, useClass: JinghoJWTOptions },
    { provide: EnvConfig, useClass: JinghoEnvConfig },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
