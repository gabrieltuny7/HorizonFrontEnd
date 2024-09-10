import { Component } from '@angular/core';
import { SpaceComponent } from '../space/space.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SpaceComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
