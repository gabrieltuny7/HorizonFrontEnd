import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from './funcionarios/funcionario';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {

  private baseUrl = 'http://localhost:8082/api/funcionarios';

  constructor(private http: HttpClient) { }

  salvar(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.baseUrl, funcionario);
  }

  atualizar(funcionario: Funcionario): Observable<any> {
    return this.http.put<Funcionario>(`${this.baseUrl}/${funcionario.id}`, funcionario);
  }

  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl);
  }

  getFuncionarioById(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`);
  }

  deletar(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.delete<Funcionario>(`${this.baseUrl}/${funcionario.id}`);
  }

  verificarCPFCadastrado(cpf: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verificar-cpf/${cpf}`);
  }
}