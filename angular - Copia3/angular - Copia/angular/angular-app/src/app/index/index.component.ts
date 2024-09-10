import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faBars } from '@fortawesome/free-solid-svg-icons';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faCoffee, faTimes,faAngleRight,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from '../components/footer/footer.component';
import { HomeloginComponent } from '../homelogin/homelogin.component';
import { SpaceComponent } from '../space/space.component';
import { RouterOutlet } from '@angular/router';
import { ClientesFormComponent } from '../clientes/clientes-form/clientes-form.component';
import { ComputerComponent } from '../computer/computer.component';
import { NavbarComponent } from '../navbar/navbar.component'; 
import { DashboardComponent } from '../dashboard/dashboard.component'; 
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  standalone: true,
  imports: [NavbarComponent,DashboardComponent, FontAwesomeModule, ComputerComponent,  CommonModule, FooterComponent, HomeloginComponent,SpaceComponent, ClientesFormComponent, RouterOutlet],
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  faCoffee = faCoffee;
  faBars = faBars;
  faTimes = faTimes;
  faAngleRight = faAngleRight;
  faMagnifyingGlass = faMagnifyingGlass;
}