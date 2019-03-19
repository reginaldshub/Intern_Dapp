import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  account: string;

  constructor(private http: HttpClient) {
    this.account = sessionStorage.getItem('account')
  }

  add(sslc) {
    console.log(sslc);
    return this.http.post("http://localhost:3000/products/marks", sslc);
  }
  add1(puc) {
    console.log(puc);
    return this.http.post("http://localhost:3000/products/puc", puc);
  }
  add2(degree) {
    console.log(degree);
    return this.http.post("http://localhost:3000/products/degree", degree);
  }
  grantc(data) {
    console.log(data)
    // debugger;
    return this.http.put('http://localhost:3000/products/grant', data);
  }
  commit(data) {
    data._id = sessionStorage.getItem('_id');
    console.log(data);
    // debugger;
    return this.http.post('http://localhost:3000/products/commit', data);
  }

  upload(data, file) {
    console.log("ACcount SErvice"+this.account)
    console.log("file"+file)
    let uploadData = new FormData;
    uploadData.append('studentid', data.studentid);
    uploadData.append('level', data.level);
    uploadData.append('account', this.account);
    uploadData.append('class', data.class);
    // uploadData.append('files', file);
      for(let i =0; i < file.length; i++){
        console.log(file[i])
        uploadData.append("uploads[]", file[i], file[i].name);
    }

    return this.http.post("http://localhost:3000/products/upload", uploadData);
  }

  uploadsingle(data, file) {
    let uploadData = new FormData;
    uploadData.append('studentid', data.studentid);
    uploadData.append('level', data.level);
    uploadData.append('account', this.account);
    uploadData.append('class', data.class);
        uploadData.append("image", file, file.name);

    return this.http.post("http://localhost:3000/products/uploadsingle", uploadData);
  }

}
