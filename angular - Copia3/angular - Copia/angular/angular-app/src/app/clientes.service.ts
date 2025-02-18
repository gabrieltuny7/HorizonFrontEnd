import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from './clientes/cliente';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor( private http: HttpClient) {
  
   }

   salvar(cliente : Cliente) : Observable<Cliente>{
    return this.http.post<Cliente>('http://localhost:8082/api/clientes', cliente);
    
   }
  atualizar(cliente: Cliente): Observable<any> {
    return this.http.put<Cliente>(`http://localhost:8082/api/clientes/${cliente.id}`, cliente);
  }

   getClientes(): Observable<Cliente[]> {
     return this.http.get<Cliente[]>('http://localhost:8082/api/clientes'); 
 }



  getNomeClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`http://localhost:8082/api/clientes/${id}`); 
  }
  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`http://localhost:8082/api/clientes/${id}`); 
  }

  deletar(cliente : Cliente) : Observable<Cliente>{
    return this.http.delete<Cliente>(`http://localhost:8082/api/clientes/${cliente.id}`); 
    
  }

  verificarCPFCadastrado(cpf: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:8082/api/clientes/verificar-cpf/${cpf}`);
  }

}
