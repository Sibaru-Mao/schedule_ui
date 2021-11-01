import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  personnel_list

  id_data
  name_data
  mail_data
  permission_data
  check_data

  isConfirmLoading = false;
  allChecked = false;
  indeterminate = false;
  bool = { isEdit: false, isVisible: false }
  checkOptionsOne = [
    { label: '编辑', value: 1, checked: true },
    { label: '下载', value: 2, checked: false },
  ];

  constructor(private data: DataService, private message: NzMessageService) { }

  async ngOnInit(): Promise<void> {
    this.personnel_list = await this.data.show_personnel()
  }

  async add_people() {
    let people_list = await this.data.show_people(this.id_data)
    this.name_data = people_list[0].NAME
    this.mail_data = people_list[0].EMAIL_ADDRESS_A
  }

  /* NG-ZORRO */
  showModal(item): void {
    this.bool[item] = true;
    if (arguments[1]) {
      this.id_data=arguments[1].id
      this.name_data=arguments[1].username
      this.mail_data=arguments[1].mail
      this.permission_data=arguments[1].permission
      this.allChecked=false
      if (this.permission_data==1) {
        this.checkOptionsOne[0].checked=true
        this.checkOptionsOne[1].checked=false
      }else if (this.permission_data==2) {
        this.checkOptionsOne[0].checked=false
        this.checkOptionsOne[1].checked=true
      } else if (this.permission_data==3) {
        this.checkOptionsOne[0].checked=true
        this.checkOptionsOne[1].checked=true
      } else {
        this.checkOptionsOne[0].checked=true
        this.checkOptionsOne[1].checked=true
        this.allChecked = true
      }
    }else{
      this.id_data=null
      this.name_data=null
      this.mail_data=null
      this.checkOptionsOne[0].checked=true
      this.checkOptionsOne[1].checked=false
      this.allChecked=false
    }
  }


  handleCancel(item): void {
    this.bool[item] = false;
  }

  async handleEdit() {
    if (this.check_data==1) {
      this.bool.isVisible = true;
    }else{
      let list = [this.id_data, this.name_data, this.mail_data, this.permission_data]
      await this.data.change_personnel(list, false)
    }
    this.personnel_list = await this.data.show_personnel()
    this.bool.isEdit = false;
  }

  async handleOk(): Promise<void> {
    if (this.allChecked != false) {
      this.permission_data = 4
    } else {
      this.permission_data = 0
      this.checkOptionsOne.forEach(element => {
        if (element.checked) {
          this.permission_data += element.value
        }
      });
    }
    if (!this.permission_data) {
      this.message.create('error', '请选择权限！')
    } else if (!this.id_data) {
      this.message.create('error', '请输入工号！')
    } else {
      this.isConfirmLoading = true;
      let list = [this.id_data, this.name_data, this.mail_data, this.permission_data]
      await this.data.change_personnel(list, true)
      this.bool.isVisible = false;
      this.isConfirmLoading = false;
      this.permission_data = undefined
      this.personnel_list = await this.data.show_personnel()
    }
  }

  updateAllChecked(): void {
    // this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    }
  }

  updateSingleChecked(): void {
    if (!this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = false;
    }
  }

}
