import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  go_to_fa(){
    this.router.navigate(['/home/fa'])
  }

  go_to_maintenance(){
    this.router.navigate(['/home/maintenance'])
  }

}
