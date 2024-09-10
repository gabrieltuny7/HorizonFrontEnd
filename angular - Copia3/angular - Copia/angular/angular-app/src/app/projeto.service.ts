import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Projeto } from './projeto/projeto';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
    private apiURL = 'http://localhost:8082/api/projeto';
  
    constructor(private http: HttpClient) {}
  
    // Listar todos os projetos
    listarProjetos(): Observable<Projeto[]> {
      return this.http.get<Projeto[]>(this.apiURL);
    }
  
    // Deletar um projeto
    deletar(projeto: Projeto): Observable<Projeto> {
      return this.http.delete<Projeto>(`${this.apiURL}/${projeto.id}`);
    
    }

  // Buscar um projeto pelo ID
  getProjeto(id: number): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.apiURL}/${id}`);
  }
    // Salvar um novo projeto
    salvar(projeto: Projeto): Observable<Projeto> {
      return this.http.post<Projeto>(this.apiURL, projeto);
    }
 
  // Atualizar um projeto existente
  atualizar(projeto: Projeto): Observable<Projeto> {
    const url = `${this.apiURL}/${projeto.id}`;
    return this.http.put<Projeto>(url, projeto);
  }
  
  somarValoresProjetos(): Observable<number> {
    return this.http.get<Projeto[]>(this.apiURL).pipe(
      map((projetos: Projeto[]) => {
        return projetos.reduce((total, projeto) => total + projeto.valor, 0);
      })
    );
  }
  
    // Contar o total de projetos
    contarProjetos(): Observable<number> {
      return this.http.get<number>(`${this.apiURL}/count`);
    }
  }