import { Component } from '@angular/core';
import { SpaceComponent } from '../../space/space.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SpaceComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
