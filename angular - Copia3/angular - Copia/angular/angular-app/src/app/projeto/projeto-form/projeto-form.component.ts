import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importação do CommonModule
import { Cliente } from '../../clientes/cliente';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Projeto } from '../projeto';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookmark, faLeftLong, faSync } from '@fortawesome/free-solid-svg-icons';
import { ProjetoService } from '../../projeto.service';
import { ServicoPrestado } from '../../servico-prestado/servicoPrestado'; // Importação correta do ServicoPrestado
import { ServicoPrestadoService } from '../../servico-prestado.service';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../clientes.service';
import { SpaceComponent } from '../../space/space.component';

@Component({
  selector: 'app-projeto-form',
  standalone: true,
  imports: [CommonModule, FormsModule,SpaceComponent, RouterModule, NavbarComponent, FontAwesomeModule], // Adição do CommonModule
  templateUrl: './projeto-form.component.html',
  styleUrls: ['./projeto-form.component.css'],
  providers: [ProjetoService]
})
export class ProjetoFormComponent implements OnInit {
  servicos: ServicoPrestado[] = [];
  clientes: Cliente[] = [];
  success: boolean = false;
  errors: string[] = [];
  faSync = faSync;
  faBookmark = faBookmark;
  faLeftLong = faLeftLong;
  projeto: Projeto = new Projeto();
  idServicosSelecionados: number[] = [];
  idClientesSelecionados: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicoService: ServicoPrestadoService,
    private clienteService: ClientesService,
    private service: ProjetoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projetoId = +params['id'];
      if (projetoId) {
        this.service.getProjeto(projetoId).subscribe(
          (projeto: Projeto) => {
            this.projeto = projeto;
            this.idServicosSelecionados = projeto.idServicos || [];
            this.idClientesSelecionados = projeto.idClientes || [];
          },
          error => {
            this.errors = ['Projeto não encontrado'];
          }
        );
      }
    });

    this.servicoService.listarServicos().subscribe(
      response => this.servicos = response,
      error => this.errors.push('Erro ao carregar serviços')
    );

    this.clienteService.getClientes().subscribe(
      response => this.clientes = response,
      error => this.errors.push('Erro ao carregar clientes')
    );
  }

  onSubmit(): void {
    if (!this.isValid()) {
      return;
    }

    console.log('Dados enviados:', this.projeto); // Log dos dados enviados

    if (this.projeto.id) {
      this.atualizarProjeto();
    } else {
      this.salvarProjeto();
    }
  }

  dismissSuccessAlert() {
    this.success = false;  // Limpa a variável de sucesso para fechar o alerta
  }

  dismissErrorAlert() {
    this.errors = [];  // Limpa o array de erros para fechar o alerta de erro
  }
  isValid(): boolean {
    this.errors = [];
    if (!this.projeto.descricao) {
      this.errors.push('A descrição é obrigatória.');
    }
    if (!this.projeto.data) {
      this.errors.push('A data é obrigatória.');
    }
    if (!this.projeto.dataFinal) {
      this.errors.push('A data final é obrigatória.');
    }
    if (!this.projeto.valor) {
      this.errors.push('O valor é obrigatório, e só pode número.');
    }
    if (!this.projeto.situacao) {
      this.errors.push('A situação é obrigatória.');
    }
    if (!this.projeto.idServicos || this.projeto.idServicos.length === 0) {
      this.errors.push('Pelo menos um serviço é obrigatório.');
    }
    if (!this.projeto.idClientes || this.projeto.idClientes.length === 0) {
      this.errors.push('Pelo menos um cliente é obrigatório.');
    }

    return this.errors.length === 0;
  }

  salvarProjeto(): void {
    this.service.salvar(this.projeto).subscribe(
      response => {
        this.success = true;
        this.errors = [];
        this.projeto = response;
      },
      errorResponse => {
        console.error('Erro ao salvar:', errorResponse); // Adicione este log
        this.errors = errorResponse.error.errors || ['Erro ao salvar o projeto'];
      }
    );
  }

  atualizarProjeto(): void {
    this.service.atualizar(this.projeto).subscribe(
      response => {
        this.success = true;
        this.errors = [];
        this.projeto = response;
      },
      errorResponse => {
        console.error('Erro ao atualizar:', errorResponse); // Adicione este log
        this.errors = errorResponse.error.errors || ['Erro ao atualizar o projeto'];
      }
    );
  }

  voltarParaListagem(): void {
    this.router.navigate(['/projetoList']);
  }

  getServicoDescricaoById(id: number): string {
    const servico = this.servicos.find(s => s.id === id);
    return servico ? servico.descricao : 'Serviço não encontrado';
  }

  getClienteNomeById(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  }
}