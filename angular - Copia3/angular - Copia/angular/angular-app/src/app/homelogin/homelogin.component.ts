import { Component, OnInit } from '@angular/core';
import { SpaceComponent } from '../space/space.component';

@Component({
  selector: 'app-homelogin',
  standalone: true,
  imports: [SpaceComponent],
  templateUrl: './homelogin.component.html',
  styleUrl: './homelogin.component.css'
})
export class HomeloginComponent implements OnInit {

  ngOnInit(): void {
    const test = document.getElementById("test");
    const text = "Bem Vindo!";
    let result = "";

    for (let i = 0; i < text.length; i++) {
      setTimeout(function () {
        result += text[i];
        if (test) {
          test.innerHTML = result;
        }
      }, 200 * i);
    }
  }

}