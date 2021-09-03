import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  arr
  constructor() { }

  ngOnInit(): void {
    this.add()
  }

  delete_edit(){

  }

  add_machine(){
    this.arr.forEach((elem: any) => {
      elem.push('');
    })

    setTimeout(() => {
      this.edit_machine_status(true)
    });
    // })   
    setTimeout(() => {
      this.edit_machine_status(false)
    },10000);
  }

  add_machine_type(){    
    // var p=new Promise(resolve=>{

    this.arr.push([])
    for (let index = 0; index < this.arr[0].length; index++) {
      this.arr[this.arr.length-1].push('')     
    }
    console.log(1);

      
    //   resolve(this.arr)
    // })
    // p.then(()=>{
    setTimeout(() => {
      this.edit_type_status(true)
    });
    // })   
    setTimeout(() => {
      this.edit_type_status(false)
    },10000);
  }

  //类型编辑模式状态-真为打开
  edit_type_status(bool){
    //抓取div
    // let oPoint=document.elementFromPoint(event.clientX,event.clientY)
    // oPoint.contenteditable=true;
    // console.log(oPoint.innerText)
    let machine_type_bool=bool
    let td_node=document.querySelectorAll('tr')[document.querySelectorAll('tr').length-1].childNodes      

    td_node.forEach(element => {
      element['contentEditable']=machine_type_bool
    });
    
  }

  //机种或类型编辑模式状态-真为打开
  edit_machine_status(bool){
    let machine_type_bool=bool
    let td_node=document.querySelectorAll('tbody')[0].rows
    console.log(td_node,td_node.length)

    for (let index = 0; index < td_node.length; index++) {
      const element = td_node[index];
      console.log(element,element.childNodes,element.childNodes.length);
      
      element.childNodes[element.childNodes.length-2]['contentEditable']=machine_type_bool
    }

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

  add(){
  
    this.arr = [];
//       const flowobj: any = await this.http.getflowsystem();
    let maxX = 10;
    let maxY =7;
//       const flowarr: Array<object> = [];
//       for (const key in flowobj) {
//         const element = flowobj[key];
//         if (pro == element.systemname) {
//           flowarr.push(flowobj[key])
//           if (element.y > maxX) {
//             maxX = element.y
//           }
//         }
//       }
      for (let index = 0; index < maxY; index++) {
        this.arr.push([])
      }
      this.arr.forEach((elem: any) => {
        for (let i = 0; i <= maxX; i++) {
          elem.push(i.toString());
        }
      }) 
    console.log(this.arr);

  }
}
