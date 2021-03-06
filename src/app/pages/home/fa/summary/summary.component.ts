// import { ModalServiceService } from './../../../../services/modal-service.service';
import { DataService } from './../../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  line_param = "ALL"
  model_param = "ALL"
  shift_param = "ALL"
  color_param = null
  to_excel
  excel_name
  permission

  start_date = null;
  end_date = null;
  now = new Date()
  now_year = this.now.getFullYear()
  now_month = this.now.getMonth()
  now_day = this.now.getDate()
  now_week_day = this.now.getDay() - 1

  // color_list = ['CR', 'PR', 'BF']
  color_list = ['CR', 'PR', 'BF', '']
  shift_list = ['ALL', 'D', 'N']
  line_list = []
  calendar_list = []
  show_calendar_list = []
  show_calendar = this.show_calendar_list
  machine_data_list = []
  machine_attached_list: any[]
  show_machine_list = []
  type_model_list = [{ 'modeltype': '', 'model': '' }]
  type_name_list: any = [['TTL Shift', []]]
  show_type_list = []
  page_number_list = []

  now_page_number = 1
  max_calendar_length = 5
  capacity_obj = {}
  capacity_sum_obj = {}

  sysname: any


  modify_bool = false
  go_bool = false
  edit_bool
  download_bool
  constructor(
    private dataservice: DataService,
    // private modals: ModalServiceService
  ) { }

  async ngOnInit(): Promise<void> {

    this.permission = sessionStorage.getItem('permission')
    this.edit_bool = false
    this.download_bool = false
    this.capture()
    this.get_machine_types()
    this.get_machine_lines()
    this.get_week_date()

    this.get_machine_data(this.calendar_list)

    // this.make_data()
  }

  //监测权限
  capture() {
    if (this.permission != 4) {
      if (this.permission != 3) {
        if (this.permission != 2) {
          this.download_bool = true
        }
        if (this.permission != 1) {
          this.edit_bool = true
        }
      }
    }
  }

  //获取机种类型
  async get_machine_types() {
    let list = await this.dataservice.get_machine_types()
    let obj = {}
    list.forEach((element: { modeltype: string; model: string; }) => {
      this.type_model_list.push(element)
      if (!(element.modeltype in obj)) {
        obj[element.modeltype] = ''
      }
    });
    Object.keys(obj).forEach((element: any, index: any) => {
      if (element != 'Other') {
        this.type_name_list.push([element, []])
      }
    })
    sessionStorage.setItem('model_list', JSON.stringify(this.type_model_list))
  }

  //获取所有线体名称
  async get_machine_lines() {
    this.line_list = await this.dataservice.get_machine_lines()
    sessionStorage.setItem('line_list', JSON.stringify(this.line_list))
  }

  async get_machine_capacity(date) {
    this.capacity_obj = await this.dataservice.get_machine_capacity(date)
    this.capacity_sum_obj = {}
    Object.keys(this.capacity_obj).forEach((element: any) => {
      this.capacity_obj[element].forEach(elem => {
        if (!this.capacity_sum_obj[element]) {
          this.capacity_sum_obj[element] = elem.output
        } else {
          this.capacity_sum_obj[element] += elem.output
        }
      });
    });
  }

  //获取本月线体的机种数量
  async get_machine_data(date: any[]) {
    await this.get_machine_capacity([this.format_date(new Date())[0].toString() + this.format_date(new Date())[1] + this.format_date(new Date())[2]])
    this.machine_data_list = await this.dataservice.get_machine_data(date)
    this.format_type_name(date)
    this.machine_data_list.forEach((element: any, index: any) => {
      element.push([])
      this.machine_summation(element)
    })
    this.getDataValue()
  }

  //获取请求范围內线体的机种数量
  async get_machine_date(data: any, date: any[]) {
    await this.get_machine_capacity(date)
    this.machine_data_list = await this.dataservice.get_machine_date(data, date)
    this.format_type_name(date)
    this.machine_data_list.forEach((element: any, index: any) => {
      element.push([])
      this.machine_summation(element)
    })
    console.log(this.machine_data_list);
  }

  load_data() {
    console.log("hello");
  }

  //格式化日期：yyyyMMdd
  format_date(date: Date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();
    let my_month
    let my_day
    if (mymonth < 10) {
      my_month = "0" + mymonth;
    } else {
      my_month = mymonth
    }
    if (myweekday < 10) {
      my_day = "0" + myweekday;
    } else {
      my_day = myweekday
    }
    return ([myyear, my_month, my_day]);
  }

  get_date(start, end) {
    this.calendar_list = []
    this.show_calendar_list = []
    while ((end.getTime() - start.getTime()) >= 0) {
      let tem_date = this.format_date(start)
      this.calendar_list.push(tem_date[0].toString() + tem_date[1].toString() + tem_date[2]);
      this.show_calendar_list.push(tem_date[1] + '/' + tem_date[2])
      start.setDate(start.getDate() + 1);
    }
    let i = this.show_calendar_list.length % 5
    while (i) {
      this.show_calendar_list.push('/')
      i = (i + 1) % 5
    }
  }

  // 格式化type_name_list
  format_type_name(date) {
    this.type_name_list.forEach(element => {
      element[1] = []
      for (let index = 0; index < date.length * 2; index++) {
        element[1].push(0)
      }
    });
    this.machine_data_list.forEach(element => {
      element.forEach((elem, id) => {
        if (id != 0) {
          elem.forEach((e, i) => {
            this.insert_list(e, i)
          });
        }
      });
    });
    // this.show_type_list = this.type_name_list
  }

  //机种和班别数量进行加总
  insert_list(e, i) {
    if (e.model && e.number) {
      let model = ""
      for (let index = 0; index < this.type_model_list.length; index++) {
        if (this.type_model_list[index].model == e.model) {
          model = this.type_model_list[index].modeltype
          if (model != 'Other') {
            this.type_name_list[0][1][i] += 1
          }
        }
      }
      this.type_name_list.forEach(element => {
        if (model == element[0]) {
          element[1][i] += e.number
        }
      });
    }
  }

  //获得本周的工作日期
  get_week_date() {
    this.calendar_list = []
    this.show_calendar_list = []
    for (let index = 0; index < 30; index++) {
      let week_date = new Date(this.now_year, this.now_month, this.now_day + index);
      let tem_date = this.format_date(week_date)
      this.calendar_list.push(tem_date[0].toString() + tem_date[1].toString() + tem_date[2]);
      this.show_calendar_list.push(tem_date[1] + '/' + tem_date[2])
    }
  }

  //机种数目求和
  machine_summation(list: any[][]) {
    let tem_list = []
    list.pop()
    for (let i = 0; i < this.calendar_list.length * 2; i++) {
      tem_list.push(0)
    }
    list.forEach((elem: any[], id: number) => {
      if (id != 0) {
        elem.forEach((e: any, i: string | number) => {
          tem_list[i] += Number(elem[i]['number'])
        });
      }
    });
    list.push(tem_list)

    this.type_name_list[0][1]
  }

  downExcel() {
    this.getData()
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset='UTF-8'><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${this.excel_name}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${this.to_excel}</table></body></html>`;
    //下载模板
    window.location.href = uri + this.base64(template)
  }
  //输出base64编码
  base64(s) { return window.btoa(unescape(encodeURIComponent(s))) }

  getData() {
    this.to_excel = '';
    this.to_excel += '<tr><th rowspan="2">綫別</th>'
    for (let i = 0; i < this.show_calendar_list.length; i++) {
      if (this.show_calendar_list[i] != '/') {

        this.to_excel += '<th colspan="4">' + this.show_calendar_list[i] + '</th>'
      }
    }
    this.to_excel += '<th colspan="2">當班產能</th></tr><tr>'
    for (let i = 0; i < this.show_calendar_list.length; i++) {
      if (this.show_calendar_list[i] != '/') {

        this.to_excel += '<th colspan="2">Day</th><th colspan="2">Night</th>'
      }
    }
    this.to_excel += '<th>幾種</th><th>產能</th></tr>'
    this.machine_data_list.forEach((element, index) => {
      element.forEach((elem, id) => {
        if (id == 0) {
          this.to_excel += '<tr><td rowspan=' + (element.length - 2) + '>' + elem + '</td>'
        } else if (id == element.length - 1) {
          this.to_excel += '<tr><td>TTL ' + element[0] + '</td>'
          elem.forEach(e => {
            this.to_excel += '<td colspan=2>' + e + '</td>'
          });
          this.to_excel += '<td colspan=2>' + this.capacity_sum_obj[element[0]] + '</td></tr>'
        } else {
          if (id != 1) {
            this.to_excel += '<tr>'
          }
          elem.forEach(e => {
            this.to_excel += '<td>' + e.model + '</td><td>' + e.number + '</td>'
          });
          if (id == 1) {
            this.to_excel += '<td rowspan=' + (element.length - 2) + ' colspan="2">'
            if (this.capacity_obj[element[0]]) {
              this.capacity_obj[element[0]].forEach(e => {
                this.to_excel += e.model + ':' + e.output + ';'
              })
              this.to_excel += '</td></tr>'
            }
          } else {
            this.to_excel += '</tr>'
          }
        }
      });
    });
    this.type_name_list.forEach(element => {
      this.to_excel += '<tr>'
      this.to_excel += '<td>' + element[0] + '</td>'
      for (let i = 0; i < element[1].length; i++) {
        this.to_excel += '<td colspan="2">' + element[1][i] + '</td>'
      }
      this.to_excel += '</tr>'
    });
  }

  edit() {
    this.go_bool = false
    this.get_week_date()
    this.get_machine_data(this.calendar_list)
    this.machine_attached_list = this.deep_clone(this.machine_data_list)
    this.modify_bool = !this.modify_bool
  }

  edit_list(event: { target: { value: any; }; }, item: { number: number; }) {
    item.number = Number(event.target.value)
    console.log(this.machine_data_list, 111111111);
  }

  editTable(event: { target: { value: any; }; }, item: { model: any; }) {
    item.model = event.target.value
  }

  clear_model(list: any[]) {
    list.forEach((element: { model: string; number: string; }) => {
      element.model = ''
      element.number = ''
      element.number = null
    });

  }

  delete_model(list: any[], id: any) {
    list.splice(id, 1)
    console.log(list);
  }

  //添加机种
  increase_model(i) {
    let list = this.machine_data_list[i]
    list.pop()
    list.push([])
    for (let i = 0; i < this.calendar_list.length * 2; i++) {
      list[list.length - 1].push({
        "model": '',
        "number": '',
        "status": null
      });
    }
    list.push([])
    this.getDataValue()
  }

  //添加线体
  increase_type() {
    this.machine_data_list.push([])
    let element = this.machine_data_list[this.machine_data_list.length - 1]
    element.unshift('')
    element.push([])
    this.increase_model(this.machine_data_list.length - 1)
  }

  // 修改的数据是否提交到表格数组
  async edit_submit(bool: any) {
    this.modify_bool = !this.modify_bool
    if (!bool) {
      this.machine_data_list = this.machine_attached_list.slice(0)
    } else {
      this.machine_data_list.forEach(element => {
        this.machine_summation(element)
      });
      await this.dataservice.change_machine_data(this.machine_data_list, this.calendar_list)
      this.get_machine_data(this.calendar_list)
    }
  }

  async go() {
    if (this.start_date == null || this.end_date == null) {
      alert("日期不能为空")
    } else if (this.start_date > this.end_date) {
      alert("结束日期要大于开始日期")
    } else {
      let time = new Date(this.start_date.valueOf())
      let list = [this.line_param, this.model_param, this.shift_param]
      console.log(JSON.stringify(list));
      this.get_date(this.start_date, this.end_date)
      console.log("时间区间：", this.show_calendar_list, this.calendar_list);
      console.log("返回数据：", this.machine_data_list)
      this.go_bool = true
      await this.get_machine_date(list, this.calendar_list)
      this.getDataValue()
      this.start_date = time
    }
    console.log(this.start_date, this.end_date);
  }

  async check_number(number: number) {
    this.now_page_number = number
    await this.getDataValue()
  }

  //资料分页
  async getDataValue() {
    this.page_number_list = []

    for (let i = 1; i <= Math.ceil(this.show_calendar_list.length / this.max_calendar_length); i++) {
      this.page_number_list.push({ number: i, status: false })
    }
    this.show_calendar = this.show_calendar_list.filter((e, i) => {
      return i >= (this.now_page_number - 1) * this.max_calendar_length && i < this.now_page_number * this.max_calendar_length
    })
    this.show_machine_list = []
    this.machine_data_list.forEach((element, index) => {
      element.forEach((elem, id) => {
        if (id == 0) {
          this.show_machine_list.push([elem])
        } else {
          let list_tem = elem.filter((e, i) => {
            return i >= (this.now_page_number - 1) * this.max_calendar_length * 2 && i < this.now_page_number * this.max_calendar_length * 2
          })
          let i = list_tem.length % 10
          while (i) {
            if (id == element.length - 1) {
              list_tem.push('')
            } else {
              list_tem.push({
                "model": '',
                "number": ''
              })
            }
            i = (i + 1) % 10
          }
          this.show_machine_list[index].push(list_tem)
        }
      });
    });
    this.show_type_list = []
    this.type_name_list.forEach((element, index) => {
      element.forEach((elem, id) => {
        if (id == 0) {
          this.show_type_list.push([elem])
        } else {
          let list_tem = elem.filter((e, i) => {
            return i >= (this.now_page_number - 1) * this.max_calendar_length * 2 && i < this.now_page_number * this.max_calendar_length * 2
          })
          let i = list_tem.length % 10
          while (i) {
            list_tem.push('')
            i = (i + 1) % 10
          }
          this.show_type_list[index].push(list_tem)
        }
      });
    });
    this.page_number_list[this.now_page_number - 1].status = true
  }


  deep_clone(list: any[]) {
    return JSON.parse(JSON.stringify(list))
  }

  //ng-zorro
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  // 'CR', 'PR', 'BF'
  changeColor(item) {
    switch (this.color_param) {
      case 'CR':
        item.status = 3
        this.dataservice.change_machine_data(this.machine_data_list, this.calendar_list)
        break;

      case 'PR':
        item.status = 2
        this.dataservice.change_machine_data(this.machine_data_list, this.calendar_list)
        break;

      case 'BF':
        item.status = 1
        this.dataservice.change_machine_data(this.machine_data_list, this.calendar_list)
        break;

      case '':
        item.status = null
        this.dataservice.change_machine_data(this.machine_data_list, this.calendar_list)
        break;
    }
    this.color_param = null
  }
}

