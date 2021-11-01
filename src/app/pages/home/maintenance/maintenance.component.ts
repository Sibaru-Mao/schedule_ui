import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { DataService } from './../../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  delete_bool=false
  machine_type_bool=false
  all_bool=false
  arr
  arr_attached
  max_col
  permission
  constructor(private data: DataService,private router :Router) { }

  async ngOnInit(): Promise<void> {
    this.permission=JSON.parse(sessionStorage.getItem('permission'))
    this.all_bool=false
    this.capture()
    this.get_data()
  }

  capture() {
    if (this.permission != 4 && this.permission != 3 && this.permission != 1) {
      this.all_bool=true
    }
  }

  delete_edit(){
    this.arr_attached=JSON.parse(JSON.stringify(this.arr))
    this.delete_bool=!this.delete_bool
  }

  add_machine(){
    // console.log(document.querySelector('.bottom').childNodes[0].lastChild)
    // let t=document.querySelector('.bottom')
    this.arr_attached=JSON.parse(JSON.stringify(this.arr))
    this.arr.forEach((elem: any)=>{
      elem.push('');
    })
    this.machine_type_bool=true
    // setTimeout(() => {
    //   this.edit_machine_status(true)
    // });
  }

  add_machine_type(){
    // console.log(document.querySelector('.bottom').childNodes[0].lastChild)
    // let t=document.querySelector('.bottom')
    // var p=new Promise(resolve=>{
    this.arr_attached=JSON.parse(JSON.stringify(this.arr))
    this.arr.push([])
    for (let index = 0; index < this.arr[0].length; index++) {
      this.arr[this.arr.length-1].push('')
    }

    this.machine_type_bool=true
    //   resolve(this.arr)
    // })
    // p.then(()=>{
    // setTimeout(() => {
    //   this.edit_type_status(true)
    // });
    // })
  }

  //类型编辑模式状态-真为打开
  // edit_type_status(bool){
  //   //抓取div
  //   // let oPoint=document.elementFromPoint(event.clientX,event.clientY)
  //   // oPoint.contenteditable=true;
  //   // console.log(oPoint.innerText)
  //   this.machine_type_bool=bool
  //   let td_node=document.querySelectorAll('tr')[document.querySelectorAll('tr').length-1].childNodes
  //   td_node.forEach(element => {
  //     element['contentEditable']=this.machine_type_bool
  //   });

  // }

  // //机种或类型编辑模式状态-真为打开
  // edit_machine_status(bool){
  //   this.machine_type_bool=bool
  //   let td_node=document.querySelectorAll('tbody')[0].rows
  //   console.log(td_node,td_node.length)

  //   for (let index = 0; index < td_node.length; index++) {
  //     const element = td_node[index];
  //     console.log(element,element.childNodes,element.childNodes.length);

  //     element.childNodes[element.childNodes.length-2]['contentEditable']=this.machine_type_bool
  //   }
  // }

  delete_machine_type(id){
    this.arr.splice(id, 1)
  }

  delete_machine(id){
    this.arr.forEach((elem: any)=>{
      elem.splice(id, 1);
    })
  }
  //所以机种及类型编辑模式状态-真为打开
  // edit_status(bool){
  //   let machine_type_bool=bool
  //   let td_node=document.querySelectorAll('tr')[document.querySelectorAll('tr').length-1].childNodes

  //   td_node.forEach(element => {
  //     element.contentEditable=machine_type_bool
  //   });

  // }

  submit(){

  }

  focus_table(){

  }
  change(i,id,event){
    this.arr[id][i]=event.target.value
  }

  async edit_submit(bool: any) {
    this.delete_bool=false
    this.machine_type_bool = false
    // this.edit_machine_status(false)
    // this.edit_type_status(false)
    if (!bool) {
      this.arr = JSON.parse(JSON.stringify(this.arr_attached))
    }else{
      await this.data.change_maintenance(this.arr);
    }
  }

  async get_data(){
    this.arr=[]
    let res=await this.data.show_maintenance()
    Object.keys(res).forEach((element: any) => {
      res[element].unshift(element)
      this.arr.push(res[element])
    })
    this.max_col=this.arr.reduce(function(a,b){return a.length>=b.length?a:b})
    let max=this.max_col.length
    this.arr.forEach(element => {
      if(element.length<max){
        let end=max-element.length
        for (let index = 0; index < end; index++) {
          element.push('')
        }
      }
    });
  }

  go_to_personnel(){
    this.router.navigate(['/home/personnel'])
  }
}
