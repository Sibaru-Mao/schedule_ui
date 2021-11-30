import { KeycloakService } from 'keycloak-angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private keycloak: KeycloakService) {

  }

  ngOnInit(): void {
  }

  logout() {
    localStorage.clear();
    this.keycloak.logout();
  }

}
