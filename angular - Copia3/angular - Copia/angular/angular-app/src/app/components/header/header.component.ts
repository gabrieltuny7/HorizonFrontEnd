import { Component, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  toggleResponsive() {
    const x = this.elementRef.nativeElement.querySelector('#myTopnav');
    if (x.classList.contains('responsive')) {
        x.classList.remove('responsive');
    } else {
        x.classList.add('responsive');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
