import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { WindowService } from 'app/core';
import { FileItem, FileLikeObject, ParsedResponseHeaders, FileUploader } from 'ng2-file-upload';

@Component({
    selector: 'iq-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class IqFileUploadComponent implements OnInit {
  @Input('text') buttonText: string;
  @Input() url: string;
  @Input() method: string = 'POST';//默认post方法
  @Input() allowedFileType: string[];//可上传文件类型
  @Input() maxFileSize: number = Infinity;//默认最大文件大小
  @Input() upType: number;//组件类型 0: 按钮上传，弹出框形式 1:附件上传，DOM节点形式
  @Input() maxFileNum: number = Infinity;//最大可上传数量

  @Output() onSuccess = new EventEmitter();//上传成功触发

  uploader: FileUploader;
  modalShow: boolean;
  fileError: boolean[] = [false];//错误文件
  fileErrorMsg: string[] = [];//错误信息
  speed: any[] = [];//上传速度

  constructor(
    private ref: ChangeDetectorRef,
    private windowService: WindowService) {}

  ngOnInit(){
    this.uploader = new FileUploader({
      url: this.url, 
      method: this.method, 
      allowedFileType: this.allowedFileType,
      maxFileSize: this.maxFileSize
    })
    
    //文件添加成功事件
    this.uploader.onAfterAddingAll = (data => {
      this.modalShow = true;
      if(this.uploader.queue.length > this.maxFileNum){
        this.uploader.queue.length = this.maxFileNum;
        this.windowService.alert({message: `最大上传文件数量为${this.maxFileNum}个`, type: 'fail'})
        return;
      }
      data.forEach(item => this.uploadFile(item));
    });

    //文件添加失败事件
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      if(item.size > options.maxFileSize){
        this.windowService.alert({message: '文件大小超出限制', type: 'fail'});
      }else{
        this.windowService.alert({message: '文件类型错误', type: 'fail'})
      }
    }

    //触发进度条
    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
      this.ref.detectChanges();
    }
  }

  //上传指定文件
  uploadFile(item: FileItem){
    let i = this.uploader.queue.indexOf(item),
        _progress = 0,
        _speed = 0,
        _time:any = new Date();
    const ITEM_SIZE = item.file.size/1024;
    this.speed[i] = '0kb/s';//初始速度

    item.upload();
    
    item.onSuccess = (response, status, headers) => {
      this.speed[i] = 0;
      let data = response ? JSON.parse(response) : '';
      
      this.onSuccess.emit(data);

      if(typeof data !== 'string' && data.success === false){
        this.fileError[i] = true;
        this.fileErrorMsg[i] = data.message;
      }
    }

    item.onProgress = progress => {
      let time:any = new Date();

      if(time - _time >= 1000){//每秒刷新一次上传速度
        let tmpSpeed:any = (progress - _progress)/100*ITEM_SIZE;//这一秒内文件上传的大小
        let speed = (tmpSpeed + _speed)/2;
        this.speed[i] = speed > 1024 ? (speed/1024).toFixed(2) + 'MB/s' : (speed*1).toFixed(2) + 'Kb/s';
        
        _progress = progress;
        _time = time;
        _speed = speed;
      }
    }
  }

  //取消指定文件的上传
  cancelUploadFile(item: FileItem){
    item.cancel();
  }

  //删除队列中的文件
  removeFile(item: FileItem,i: number){
    item.remove();
    this.fileError.splice(i, 1);
    this.fileErrorMsg.splice(i, 1);
  }

  //关闭上传框
  hide(){
    this.modalShow = false;
  }

}
