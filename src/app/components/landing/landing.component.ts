import {Component, OnInit} from '@angular/core';
import {AplicativoService} from '../../services/aplicativo.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../modal/modal.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  completado: number;
  onProgress: boolean;
  message: string;
  url: string;
  urlEngine: string;
  extractor: string;

  urLanding: string;
  sufix: string;
  cliente: any;
  eventos: object [];
  modulos: object [];

  constructor(
    protected aplicativoService: AplicativoService,
    private ngbModal: NgbModal) {}

  ngOnInit() {
    this.cliente = {};

    this.aplicativoService.properties()
      .then((prop) => {
        this.url = prop['url'];
        this.urlEngine = prop['urlEngine'];
        this.urLanding = prop['urLanding'];
        this.extractor = prop['ext_acl_v20'];
        this.sufix = prop['sufix'];
        this.cliente = {
          p_clave_usuario: '',
          p_clave_producto: prop['clave_producto'],
          connection_reference: prop['connection_reference'],
          p_package: 1
        };
        this.eventos = [
          {
            url: this.urLanding + 'validar',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Verificando existencia.'}
          },
          {
            url: this.urLanding + 'crearcliente',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Creando cliente.'}
          },
          {
            url: this.urLanding + 'crearparametros',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Creando parametros de aplicativo.'}
          },
          {
            url: this.urLanding + 'crearschema',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Creando BD, esto puede tardar un poco.'}
          },
          {
            url: this.urLanding + 'crearartefacto',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Creando artefacto.'}
          },
          {
            url: this.urLanding + 'crearnotificacion',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Creando parametros para notificaciones.'}
          },
          {
            url: this.urLanding + 'crearproperties',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Creando archivo properties.'}
          },
          {
            url: this.urLanding + 'copiarwar',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Copiando archivo WAR.'}
          },
          {
            url: this.urLanding + 'usuario',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Creando usuario administrador.'}
          },
          {
            url: this.urLanding + 'reset',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Actualizando datos del administrador.'}
          },
          {
            url: this.urLanding + 'distribuir',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: {message: 'Aplicativo creado exitosamente.'}
          }
        ];
      })
      .then(() => {
        this.aplicativoService.consumirPromesa({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          url: this.urlEngine,
          body: {
            id_extractor: this.extractor,
            connections: {
              references: [
                {
                  connection_reference: "cnnACLSemillaV20",
                  connection_id: "cnnACLSemillaV20"
                }
              ]
            }
          }
        }).then( (ext) => {
          this.modulos = ext['data'];
        })
      });

    this.completado = 0;
    this.onProgress = false;
  }

  public crearApp(): void {
    this.onProgress = true;

    this.cliente['p_password'] = this.cliente['p_clave_usuario'];
    this.cliente['p_apellidos'] = this.cliente['apellidop'] + ' ' + this.cliente['apellidom'];
    this.cliente['schema_name'] = 'mn_' + this.cliente['p_contexto'] + this.sufix;
    this.cliente['artifact_conn'] = 'cnn' + this.cliente['p_contexto'][0].toUpperCase() + this.cliente['p_contexto'].slice(1) + 'ExpensesSemillaV10';
    this.cliente['connections'] = {
      references: [
        {
          connection_reference: this.cliente['connection_reference'],
          connection_id: this.cliente['artifact_conn']
        },
        {
          connection_reference: "cnnACLSemillaV10",
          connection_id: "cnnACLSemillaV10"
        },
        {
          connection_reference: "cnnNotificacionesSemillaV10",
          connection_id: "cnnNotificacionesSemillaV10"
        }
      ]
    };

    switch (this.cliente['p_package']) {
      case 1:
        this.cliente['p_package'] = 'SMART';
        break;
      case 2:
        this.cliente['p_package'] = 'SMARTPLUS';
        break;
      case 3:
        this.cliente['p_package'] = 'ENTERPRISE';
        break;
      default:
        this.cliente['p_package'] = 'SMART';
    }

    this.loopEvents()
      .then((res) => {
        this.open(res);
      });
  }

  public open(response: any): void {
    const modalRef = this.ngbModal.open(ModalComponent, {size: 'lg', backdrop: 'static', centered: true});

    if (response['continue']) {
      this.completado = 100;
      modalRef.componentInstance.inputs = {
        title: '¡Felicidaces! Se ha creado tu aplicativo.',
        typeClass: 'modal-header bg-success text-white',
        textContent: 'En breve el administrador que definiste para el sistema recibirá un correo con sus accesos ' +
          'para que pueda iniciar la configuración. <br><br> ' +
          'En caso contrario contáctanos a <a href="mailto:soportecloud@masnegocio.com" target="_blank">soportecloud@masnegocio.com</a>'
      };
    } else {
      modalRef.componentInstance.inputs = {
        title: 'Error al crear aplicativo.',
        typeClass: 'modal-header bg-danger text-white',
        textContent: response['message']
      };
    }

    modalRef.result.then((reason) => {
      location.reload();
    });
  }

  private loopEvents = () => {
    this.completado = 0;
    let lastResponse = {};
    return new Promise((resolve, reject) => {
      let loop = (cont) => {
        let item = this.eventos[cont];
        let continueLoop = true;

        if (continueLoop) {
          this.message = item['body']['message'];
          item['body'] = this.cliente;
          this.aplicativoService.consumirPromesa(item)
            .then((data) => {
              lastResponse = data;
              this.message = data['message'];
              if (data && data['continue']) {
                this.completado += Math.round(100 / this.eventos.length);
              } else {
                continueLoop = false;
              }
            })
            .then(() => {
              if (continueLoop && cont !== this.eventos.length - 1) {
                loop(++cont);
              } else {
                lastResponse['rootEvent'] = item;
                resolve(lastResponse);
              }
            })
            .catch(err => {
              continueLoop = false;
              reject(err);
            });
        }
      };

      loop(0);
    });
  }
}
