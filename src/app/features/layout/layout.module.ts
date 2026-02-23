import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

// Material modules specific to the layout shell
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [
    SharedModule,
    LayoutRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
})
export class LayoutModule {}
