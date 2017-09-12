import { Component, OnInit } from '@angular/core';
import { AplicativoService } from '../../services/aplicativo.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  public completado: number;
  public onProgress: boolean;
  public message: string;
  public url: string;

  public urLanding: string;
  public sufix: string;
  public cliente: any;
  public eventos: object [];

  constructor( protected _aplicativoService: AplicativoService ) {}

  ngOnInit() {
    this.url = 'http://des.face7.masnegocio.com/';
    // this.urLanding = 'http://des.face7.masnegocio.com/mn-landing-page-services/landing/';
    this.urLanding = 'http://localhost:8080/mn-landing-page-services/landing/';
    this.completado = 0;
    this.onProgress = false;
    this.sufix = '_e_xpenses_enterprise_v3';
    this.cliente = {
      p_clave_producto:  'MN-EXPENSES-ENTERPRISE-V30',
      connection_reference:  'cnnExpensesSemillaV10'
    };

    this.eventos = [
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
  }

  crearApp(): void {
    this.onProgress = true;

    this.cliente['p_password'] = this.cliente['p_clave_usuario'];
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

    let loopEvents = () => {
      let lastResponse = {};

      let loop = ( cont ) => {
        let item = this.eventos[cont];
        let continueLoop = true;

        if ( continueLoop ) {
          this._aplicativoService.consumirPromesa( item )
            .then( ( data ) => {
              lastResponse = data;
              this.message = data['message'];
              if ( data && data['continue'] ) {
                this.completado += 10;
              } else {
                continueLoop = false;
              }
            })
            .then( () => {
              if ( continueLoop && cont !== this.eventos.length - 1 ) {
                loop( ++cont );
              } else {
                lastResponse['rootEvent'] = item;
              }
            });
        } else {
          continueLoop = false;
        }
      };

      loop( 0 );
    };

    loopEvents();
  }

  claveUsuarioToUpper(): void {
    this.cliente['p_clave_usuario'] = this.cliente['p_clave_usuario'].toUpperCase();
  }
}
