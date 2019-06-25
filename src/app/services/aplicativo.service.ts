import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable()
export class AplicativoService
{
  constructor( private http: HttpClient ) { }

  consumirPromesa( event: object )
  {
    let httpReq = new HttpRequest( event['method'], event['url'], event['body'], { headers: new HttpHeaders( event['headers'] )} );

    return new Promise((resolve, reject) => {
      this.http.request( httpReq )
        .toPromise()
        .then(
          res => {
            resolve(res['body']);
          },
          msg => {
            reject(msg);
          });
    });
  }

  properties()
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json;charset=UTF8'
      })
    };

    return new Promise( (resolve, reject) => {
      // this.http.post('properties', {}, httpOptions )
      this.http.get('http://localhost:4200/assets/properties.json', httpOptions )
        .toPromise()
        .then(
          res => {
            resolve( res );
          },
          msg => {
            reject( msg );
          });
    });
  }

}
