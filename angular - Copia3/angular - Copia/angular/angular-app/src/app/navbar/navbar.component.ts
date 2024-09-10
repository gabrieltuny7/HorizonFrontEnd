import { Component, OnInit } from '@angular/core';
declare var $: any;
import { faTrash, faAngleRight, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  faTrash = faTrash;
  faAngleRight = faAngleRight;
  faMagnifyingGlass = faMagnifyingGlass;

  constructor() { }
  ngOnInit(): void {
    $(document).ready(() => {
      $(".page-wrapper").removeClass("toggled");
      

      $("#close-sidebar").click(() => {
        $(".page-wrapper").removeClass("toggled");
      });

      $("#show-sidebar").click(() => {
        $(".page-wrapper").addClass("toggled");
      });

      const searchInput = document.querySelector('.search-menu') as HTMLInputElement;
      const menuItems = document.querySelectorAll('.sidebar-menu .sidebar-content');

      searchInput.addEventListener('input', function (event) {
        const searchText = searchInput.value.trim().toLowerCase();

        menuItems.forEach(function (menuItem: any) { 
          const menuItemText = menuItem.textContent.trim().toLowerCase();

          if (menuItemText.includes(searchText)) {
            menuItem.style.display = 'block';
          } else {
            menuItem.style.display = 'none';
          }
        });
      });
    });}
  }
