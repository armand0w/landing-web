import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AplicativoService {

  constructor( private http: Http ) { }

  /*consumir( event: object ) {
    return this.http.request('', event)
      .map(res => {
        return res.json();
      });
  }*/

  consumirPromesa( event: object ) {
    return new Promise((resolve, reject) => {
      this.http.request('', event)
        .toPromise()
        .then(
          res => { // Success
            resolve(res.json());
          },
          msg => { // Error
            reject(msg);
          });
    });
  }

  properties() {
    let headers = new Headers( { 'Content-Type': 'application/json' } );
    let options = new RequestOptions( { headers: headers } );

    return new Promise( (resolve, reject) => {
      this.http.post('properties', {}, options )
      // this.http.get('http://localhost:4200/assets/properties.json', options )
        .toPromise()
        .then(
          (res) => {
            resolve( res.json() );
          },
          (msg) => {
            reject( msg );
          });
    });
  }

}
