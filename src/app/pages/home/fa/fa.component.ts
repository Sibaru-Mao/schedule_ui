import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fa',
  templateUrl: './fa.component.html',
  styleUrls: ['./fa.component.css']
})
export class FaComponent implements OnInit {
  check_dot_bool=true
  constructor(private router :Router) {

    
   }

  ngOnInit(): void {
  }

  go_to_summary(){
    this.router.navigate(['/home/fa/summary'])
    this.check_dot_bool=true
  }

  go_to_detail(){
    this.router.navigate(['/home/fa/detail'])
    this.check_dot_bool=false
  }
}
