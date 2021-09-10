import { Component, OnInit } from '@angular/core';
import getISOWeek from 'date-fns/getISOWeek';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {
  start_date = null;
  end_date=null;
  line_list=[]
  constructor() { }

  ngOnInit(): void {
    this.line_list=JSON.parse(sessionStorage.getItem('line_list'))
  }
  line(){}
  model(){}
  shift(){}

  mo(){}
  edit(){}
  upload(){}
  excel(){}

  calendar(){

  }
  //ng-zorro
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

 go(){
   if (this.start_date == null || this.end_date == null) {
      alert("日期不能为空")
    } else if (this.start_date > this.end_date) {
      alert("结束日期要大于开始日期")
    } else {
      // let list = [this.line_param, this.model_param, this.shift_param]
      // console.log(JSON.stringify(list));

      // this.get_date(this.start_date, this.end_date)
      // console.log("时间区间：", this.show_calendar_list, this.calendar_list);
      // console.log("返回数据：", this.machine_data_list)
      // this.go_bool = true
      // this.get_machine_date(list, this.calendar_list)
      // this.getDataValue()
    }
 }
}
