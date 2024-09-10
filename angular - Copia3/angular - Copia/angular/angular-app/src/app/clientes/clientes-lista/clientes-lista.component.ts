import { Cliente } from '../cliente';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { IndexComponent } from '../../index/index.component';
import{FormsModule}from '@angular/forms' 
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideHttpClient } from '@angular/common/http';
import { faBars, faTimes, IconDefinition, faHome, faUser, faBookmark, faFilter } from '@fortawesome/free-solid-svg-icons';
import e, { response } from 'express';
import { error } from 'console';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../clientes.service';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SpaceComponent } from '../../space/space.component';

@Component({
  selector: 'app-clientes-lista',
  standalone: true,
  imports: [CommonModule,NavbarComponent,HttpClientModule,SpaceComponent, FooterComponent,RouterModule,IndexComponent,FontAwesomeModule, FormsModule],
  templateUrl: './clientes-lista.component.html',
  styleUrl: './clientes-lista.component.css',
  providers: [ClientesService] 
})
export class ClientesListaComponent implements OnInit {
faPlus = faPlus;
faFilter = faFilter;
faPencil = faPencil;
faTrash = faTrash;
clientes: Cliente[] = [];
clienteSelecionado!: Cliente;
mensagemSucesso!: string;
mensagemErro!: string;
filtroNome: string = '';
orderBy: keyof Cliente = 'id'; // Definindo tipo explícito para orderBy
sortOrder: number = 1;
clientesFiltrados: Cliente[] = [];

  constructor(private service: ClientesService, private router : Router) {}

  ngOnInit(): void {
    this.service.getClientes().subscribe(resposta => {
      this.clientes = resposta;
      this.clientesFiltrados = resposta;
    });
  }

  novoCadastro() {
    this.router.navigate(['/clientes']);
  }

  preparaDelecao(cliente: Cliente) {
    this.clienteSelecionado = cliente;
  }

  dismissSuccessAlert() {
    this.mensagemSucesso = '';  // Limpa a mensagem de sucesso
  }


  deletarCliente() {
    if (!this.clienteSelecionado) return;
    this.service.deletar(this.clienteSelecionado).subscribe(
      () => {
        this.mensagemSucesso = 'Funcionário deletado com sucesso!';
        this.clientes = this.clientes.filter(cliente => cliente.id !== this.clienteSelecionado.id);
        this.filtrarClientes();
      },
      erro => {
        this.mensagemErro = 'Ocorreu um erro ao deletar o Cliente, verifique se ele esta vinculado a algum Projeto!';
      }
    );
  }

  filtrarClientes() {
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(this.filtroNome.toLowerCase())
    );
  }

  ordenar(column: keyof Cliente) { // Definindo tipo explícito para column
    if (this.orderBy === column) {
      this.sortOrder *= -1;
    } else {
      this.sortOrder = 1;
    }
    this.orderBy = column;
    this.clientesFiltrados.sort((a, b) =>
      (a[column] < b[column] ? -1 : 1) * this.sortOrder
    );
  }
}