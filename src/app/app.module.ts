import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular platform
    BrowserModule,
    BrowserAnimationsModule,

    // Our application modules
    CoreModule,        // Singleton services + HTTP interceptors
    SharedModule,      // Reusable UI components (header, sidebar, etc.)
    AppRoutingModule,  // Root routes — feature modules are lazy loaded
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
