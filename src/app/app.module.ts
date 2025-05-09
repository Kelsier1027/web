import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import SwiperCore, { Autoplay, Navigation, Pagination, Virtual } from 'swiper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JWTInterceptor } from './core/interceptor/jwt-interceptor';
import { HttpDefaultOptions, JWTOptions } from './core/model/option';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireModule } from '@angular/fire/compat';
import { AnalyticsService } from './services/analytics.service';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from "./shared/shared.module";

SwiperCore.use([Virtual, Navigation, Pagination, Autoplay]);

export class CoreJWTOptions extends JWTOptions {
  override key = '';
}

export class CoreHttpDefaultOptions extends HttpDefaultOptions {
  override baseApiURL = environment.baseApiUrl; // input api base url.
}

export class EnvConfig {
  baseApiUrl = environment.baseApiUrl;
  orgId = environment.orgId;
  siteKey = environment.siteKey;
  rememberMeKey = environment.rememberMeKey;
  loginGuide = environment.loginGuide;
  googleAnalyticsKey = environment.googleAnalyticsKey;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    MatDialogModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.fireBaseConfig),
    SharedModule
],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true,
    },
    { provide: HttpDefaultOptions, useClass: CoreHttpDefaultOptions },
    { provide: JWTOptions, useClass: CoreJWTOptions },
    { provide: EnvConfig, useClass: EnvConfig },
    DatePipe,
    AnalyticsService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
