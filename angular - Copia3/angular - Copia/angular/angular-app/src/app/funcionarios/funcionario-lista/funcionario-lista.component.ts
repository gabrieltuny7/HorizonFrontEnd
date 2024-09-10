import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { IndexComponent } from '../../index/index.component';
import{FormsModule}from '@angular/forms' 
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideHttpClient } from '@angular/common/http';
import { faBars, faTimes, IconDefinition, faHome, faUser, faBookmark,faFilter } from '@fortawesome/free-solid-svg-icons';
import e, { response } from 'express';
import { error } from 'console';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Funcionario } from '../funcionario';
import { FuncionariosService } from '../../funcionarios.service';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SpaceComponent } from '../../space/space.component';
@Component({
  selector: 'app-funcionario-lista',
  standalone: true,
  imports: [CommonModule,NavbarComponent,HttpClientModule,SpaceComponent, FooterComponent,RouterModule,IndexComponent,FontAwesomeModule, FormsModule],
  templateUrl: './funcionario-lista.component.html',
  styleUrl: './funcionario-lista.component.css'
})
export class FuncionarioListaComponent implements OnInit {
  faPlus = faPlus;
  faFilter = faFilter;
  success: boolean = false;
  errors: string[] = [];
  faPencil = faPencil;
  faTrash = faTrash;
  funcionarios: Funcionario[] = [];
  funcionarioSelecionado!: Funcionario;
  mensagemSucesso!: string;
  mensagemErro!: string;
  
  filtroNome: string = '';
  orderBy: keyof Funcionario = 'id';
  sortOrder: number = 1;
  funcionariosFiltrados: Funcionario[] = [];

  constructor(private service: FuncionariosService, private router: Router) {}

  ngOnInit(): void {
    this.service.getFuncionarios().subscribe(
      (resposta: Funcionario[]) => {
        this.funcionarios = resposta;
        this.filtrarFuncionarios();  // Chamando a função de filtro ao inicializar
      },
      erro => {
        console.error('Erro ao listar funcionários:', erro);
      }
    );
  }

  novoCadastro(): void {
    this.router.navigate(['/funcionarios']);
  }

  preparaDelecao(funcionario: Funcionario): void {
    this.funcionarioSelecionado = funcionario;
  }

  
  deletarFuncionario() {
    if (!this.funcionarioSelecionado) return;
    this.service.deletar(this.funcionarioSelecionado).subscribe(
      () => {
        this.mensagemSucesso = 'Funcionário deletado com sucesso!';
        this.funcionarios = this.funcionarios.filter(funcionario => funcionario.id !== this.funcionarioSelecionado.id);
        this.filtrarFuncionarios();
      },
      erro => {
        this.mensagemErro = 'Ocorreu um erro ao deletar o Funcionário, verifique se ele esta vinculado a algum Serviço!';
      }
    );
  }

  filtrarFuncionarios(): void {
    this.funcionariosFiltrados = this.funcionarios.filter(funcionario =>
      funcionario.nome.toLowerCase().includes(this.filtroNome.toLowerCase())
    );
  }
  dismissSuccessAlert() {
    this.success = false;  // Lógica para fechar o alerta de sucesso
  }

  dismissErrorAlert() {
    this.errors = [];      // Lógica para limpar os erros e fechar o alerta de erro
  }

  ordenar(column: keyof Funcionario): void {
    if (this.orderBy === column) {
      this.sortOrder *= -1;
    } else {
      this.sortOrder = 1;
    }
    this.orderBy = column;
    this.funcionariosFiltrados.sort((a, b) =>
      (a[column] < b[column] ? -1 : 1) * this.sortOrder
    );
  }
}