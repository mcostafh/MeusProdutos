import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity } from '../_models/Entity';
import { environment } from '../environments/environment';
import { FiltroDeletar } from '../_models/DeRelatorios/FiltroDeletar';


export class BaseService <TEntity extends Entity > {

  tokenHeader: HttpHeaders;
  
  protected get url(): string {return `${environment.BASE_URL + environment.API}/${this.controllerUrl}`; }

  constructor( protected Http: HttpClient, protected controllerUrl: string ){  }

  get(action: string): Observable<TEntity[]>{
    return this.Http.get<TEntity[]>(`${this.url}/${action}` );
  }

  getAll(): Observable<TEntity[]>{
    return this.Http.get<TEntity[]>(this.url );
  }

  getById(Id: number): Observable<TEntity>{
    return this.Http.get<TEntity>(`${this.url}/getById/${Id}`);
  }

  post(entity: TEntity){
    return this.Http.post( this.url, entity);
  }

  put(entity: TEntity){
    return this.Http.post( `${this.url}/Change`, entity );
  }                                        

  delete(id: number){
    let filtro = new FiltroDeletar();
    filtro.id = id;
    return this.Http.post( `${this.url}/Deletar`, filtro );
  }  

}
