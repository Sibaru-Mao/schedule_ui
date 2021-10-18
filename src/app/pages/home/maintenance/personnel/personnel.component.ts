import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  personnel_list

  isVisible = false;
  isConfirmLoading = false;


  constructor(private data: DataService) {}

  async ngOnInit(): Promise<void>{
    this.personnel_list=await this.data.show_personnel()
  }

  add_personnel(){

  }

  /* NG-ZORRO */
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }


}
