import { Component, OnInit } from '@angular/core';
import { AplicativoService } from '../../services/aplicativo.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  completado = 0;
  onProgress = false;
  urLanding = 'http://localhost:8080/mn-landing-page-services/landing/';
  sufix = '_e_xpenses_enterprise_v3';
  cliente: object = {
    p_clave_producto:  'MN-EXPENSES-ENTERPRISE-V30',
    connection_reference:  'cnnExpensesSemillaV10'
  };
  eventos: object [] = [
    {
      url: this.urLanding + 'validar',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'crearcliente',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'crearparametros',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'crearschema',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'crearartefacto',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'creararnotificacion',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'crearproperties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'copiarwar',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'usuario',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    },
    {
      url: this.urLanding + 'reset',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: {}
    }
  ];

  constructor( protected _aplicativoService: AplicativoService) {}

  ngOnInit() {}

  crearApp(): void {
    this.onProgress = true;

    this.cliente['p_apellidos'] = this.cliente['apellidop'] + ' ' + this.cliente['apellidom'];
    this.cliente['schema_name'] = 'mn_' + this.cliente['p_contexto'] + this.sufix;
    this.cliente['artifact_conn'] = 'cnn' + this.cliente['p_contexto'][0].toUpperCase() +
      this.cliente['p_contexto'].slice(1) + 'ExpensesSemillaV10';
    this.cliente['connections'] = {
      references: [
        {
          connection_reference: this.cliente['connection_reference'],
          connection_id: this.cliente['artifact_conn']
        }
      ]
    };

    for ( let event of this.eventos ) {
      event['body'] = this.cliente;
    }

    /*this._aplicativoService.consumir( this.eventos[0] )
      .subscribe( data => {
        console.log( data );
      });*/

    /*this._aplicativoService.consumirPromesa( this.eventos[0] )
      .then( data => {
        console.log(data);
      });*/

    this.delayedEventLoop( this.eventos, this._aplicativoService ).then(
      (val) => console.log(val),
      (err) => console.error(err)
    );
  }

  delayedEventLoop( array, serv ) {
    let promise = null;
    let lastResponse = {};
    function loop( cont ) {
      let item = array[cont];
      let continueLoop = true;
      promise = new Promise((resolve, reject) => {
        if ( continueLoop ) {
          serv.consumirPromesa( item )
            .then( data => {
              // console.log( data );
              lastResponse = data;
              if ( data && data.continue ) {
                console.log( data );
                this.completado = this.completado + 10;
              } else {
                resolve( lastResponse );
                continueLoop = false;
              }
            })
            .then(function () {
              if (continueLoop && cont !== array.length - 1) {
                loop( ++cont );
              } else {
                lastResponse['rootEvent'] = item;
                reject(lastResponse);
              }
            });
        } else {
          continueLoop = false;
        }
      });
    }

    loop(0);
    return promise;
  }
}
