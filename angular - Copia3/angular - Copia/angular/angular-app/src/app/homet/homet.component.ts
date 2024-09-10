import { Component } from '@angular/core';
import { SpaceComponent } from '../space/space.component';
import { AboutComponent } from '../about/about.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ContactComponent } from '../contact/contact.component';
import { TeamComponent } from '../team/team.component';
import { QuestionComponent } from '../question/question.component';
@Component({
  selector: 'app-homet',
  standalone: true,
  imports: [QuestionComponent, SpaceComponent,AboutComponent, FooterComponent,ContactComponent, TeamComponent],
  templateUrl: './homet.component.html',
  styleUrls: ['./homet.component.scss', './homet.component.css'],
})
export class HometComponent {

}
