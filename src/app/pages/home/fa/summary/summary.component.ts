import { DataService } from './../../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  start_date = null;
  end_date=null;
  now = new Date()
  now_year = this.now.getFullYear()
  now_month = this.now.getMonth()
  now_day = this.now.getDate()
  now_week_day = this.now.getDay()-1

  capacity_list=[]
  calendar_list=[]
  show_calendar_list=[]
  show_calendar=this.show_calendar_list
  machine_data_list=[]
  machine_attached_list: any[]
  show_machine_list=this.machine_data_list
  type_modle_list=[{'modeltype':'','model':''}]
  page_number_list=[]

  now_page_number=1
  max_calendar_length=5
  sysname: any
  

  modify_bool=false
  go_bool=false
  constructor(
    private dataservice: DataService,
  ) { }

  ngOnInit(): void {
    this.get_machine_capacity()
    this.get_machine_types()
    this.get_week_date() 

    this.get_machine_data(this.calendar_list)
    // this.make_data()
  }

  async get_machine_types(){
    let list=await this.dataservice.get_machine_types()
    list.forEach((element: { modeltype: string; model: string; }) => {
      this.type_modle_list.push(element)
    });   
  }

  async get_machine_capacity(){
    let list=await this.dataservice.get_machine_capacity()
    list.forEach((element: any) => {
      this.capacity_list.push(element)
    });
  }

  //获取请求范围內线体的机种数量
  async get_machine_data(date: any[]){
    this.machine_data_list=await this.dataservice.get_machine_data(date)
    this.machine_data_list.forEach((element: any,index:any) => {
      element.push([])
      this.machine_summation(element)
    })
  }

  load_data(){
    console.log("hello");
  }

//格式化日期：yyyy-MM-dd
  format_date(date: Date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();
    let my_month
    let my_day
    if (mymonth < 10) {
      my_month= "0" + mymonth;
    }else{
      my_month=my_month
    }
    if (myweekday < 10) {
      my_day = "0" + myweekday;
    }else{
      my_day=myweekday
    }
    return ([myyear, my_month , my_day]);
  }

  get_date(start,end){
    this.calendar_list=[]
    this.show_calendar_list=[]
    while((end.getTime()-start.getTime())>=0){
      let tem_date=this.format_date(start)
      this.calendar_list.push(tem_date[0]+tem_date[1]+tem_date[2]);
      this.show_calendar_list.push(tem_date[1]+'/'+tem_date[2])
      start.setDate(start.getDate()+1);   
    }
  }

  //获得本周的工作日期
  get_week_date() {
    console.log(this.now_year, this.now_month, this.now_day , this.now_week_day);
    
    for (let index = 0; index < 5; index++) {
      let week_date = new Date(this.now_year, this.now_month, this.now_day + (index - this.now_week_day));
      let tem_date=this.format_date(week_date)
      this.calendar_list.push(tem_date[0]+tem_date[1]+tem_date[2]);
      this.show_calendar_list.push(tem_date[1]+'/'+tem_date[2]) 
    }
  }

  //机种数目求和
 machine_summation(list: any[][]){
    let tem_list=[]
    list.pop()
    for (let i = 0; i <this.calendar_list.length*2; i++) {
      tem_list.push(0)
    }
    list.forEach((elem: any[],id: number) => {   
      if(id!=0){
        elem.forEach((e: any,i: string | number)=> {
          tem_list[i]+=Number(elem[i]['number']) 
      });
        
      }
    });
    list.push(tem_list)      
  }

  line(){

  }

  model(){}

  shift(){}

  color(){}

  excel(){}

  edit(){
    this.machine_attached_list=this.deep_clone(this.machine_data_list)
    this.modify_bool=!this.modify_bool
  }

  edit_list(event: { target: { value: any; }; },item: { number: number; }){
      item.number=Number(event.target.value)  
      console.log(this.machine_data_list,111111111);     
  }

  editTable(event: { target: { value: any; }; },item: { model: any; }){
    item.model=event.target.value
    console.log(this.machine_attached_list);
  }

  clear_model(list: any[]){
    list.forEach((element: { model: string; number: string; }) => {
      element.model=''
      element.number=''
    });
    
  }

  delete_model(list: any[],id: any){
    list.splice(id,1)
    console.log(list);
  }

  //添加机种
  increase_model(list: any[][]){
    console.log(list);
    list.pop()
    list.push([])
    for (let i = 0; i <this.calendar_list.length*2; i++) {
      list[list.length-1].push({
        "model":'',
        "number":''
      });
    }
    list.push([])
  }

  //添加线体
  increase_type(){
    this.machine_data_list.push([])
    let element=this.machine_data_list[this.machine_data_list.length-1]
    element.unshift('') 
    element.push([])
    this.increase_model(element)
  }

  // 修改的数据是否提交到表格数组
  edit_submit(bool: any){
    this.modify_bool=!this.modify_bool
    if (!bool) {
      this.machine_data_list=this.machine_attached_list.slice(0)
    }else{
      this.machine_data_list.forEach(element => {       
        this.machine_summation(element)
      });
      this.dataservice.change_machine_data(this.machine_data_list,this.calendar_list)
    }
  }

  calendar(){

  }

  go(){
    if(this.start_date==null || this.end_date==null){
      alert("日期不能为空")
    }else if(this.start_date>this.end_date){
      alert("结束日期要大于开始日期")
    }else{
      this.get_date(this.start_date,this.end_date)
      console.log("时间区间：",this.show_calendar_list,this.calendar_list);
      console.log("返回数据：",this.machine_data_list)
      this.go_bool=true
      this.getDataValue()
    }
  }

  async check_number(number: number) {
    this.now_page_number= number
    await this.getDataValue()
  }

  /**
   * @function 数据值数据
   * @param item {string} 项目名
   * @return {void}
   */

//假资料查询
  async getDataValue() {
    this.page_number_list=[]
    
    for (let i = 1; i <= Math.ceil(this.show_calendar_list.length / this.max_calendar_length); i++) {
      this.page_number_list.push({ number: i, status: false })
    }
    this.show_calendar= this.show_calendar_list.filter((e, i) => {
      return i >= (this.now_page_number-1)*this.max_calendar_length && i < this.now_page_number*this.max_calendar_length
    })
    this.page_number_list[this.now_page_number- 1].status = true
  } 

  
  deep_clone(list: any[]){
    return JSON.parse(JSON.stringify(list))
  }

//ng-zorro
  onChange(result: Date): void {   
    console.log('onChange: ',result);
  }
}

