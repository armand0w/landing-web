import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { AplicativoService } from './services/aplicativo.service';

// Components
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavbarComponent,
    ModalComponent
  ],
  entryComponents: [
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    AplicativoService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
