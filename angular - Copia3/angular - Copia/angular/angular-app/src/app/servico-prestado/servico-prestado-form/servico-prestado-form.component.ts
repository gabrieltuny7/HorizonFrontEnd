import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importação do CommonModule
import { Cliente } from '../../clientes/cliente';
import { ClientesService } from '../../clientes.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ServicoPrestado, SituacaoServico } from '../servicoPrestado';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookmark,faLeftLong,faSync} from '@fortawesome/free-solid-svg-icons';
import { ServicoPrestadoService } from '../../servico-prestado.service';
import { TipoServico } from '../servicoPrestado';
import { ActivatedRoute } from '@angular/router';
import { Funcionario } from '../../funcionarios/funcionario';
import { FuncionariosService } from '../../funcionarios.service';
import { AppComponent } from '../../app.component';
import { SpaceComponent } from '../../space/space.component';

@Component({
  selector: 'app-servico-prestado-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,SpaceComponent, NavbarComponent, FontAwesomeModule, AppComponent], // Adição do CommonModule
  templateUrl: './servico-prestado-form.component.html',
  styleUrls: ['./servico-prestado-form.component.css'],
  providers: [ServicoPrestadoService]
})
export class ServicoPrestadoFormComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  success: boolean = false;
  TipoServico = TipoServico;
  errors: string[] = [];
  faSync = faSync;
  faBookmark = faBookmark;
  faLeftLong = faLeftLong;
  errorMessage: string = '';
  servicoPrestado: ServicoPrestado = new ServicoPrestado();
  idFuncionariosSelecionados: number[] = [];
  funcionario?: Funcionario;
  id!: number;
  novoFuncionario: string = ''; // Declarei novoFuncionario aqui
  constructor(
    private route: ActivatedRoute,
    private funcionarioService: FuncionariosService,
    private service: ServicoPrestadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const servicoId = +params['id'];
      if (servicoId) {
        this.service.getServicoPrestado(servicoId).subscribe(
          (servico: ServicoPrestado) => {
            this.servicoPrestado = servico;
            this.idFuncionariosSelecionados = servico.idFuncionarios || [];
          },
          error => {
            this.errors = ['Serviço não encontrado'];
          }
        );
      }
    });

    this.funcionarioService.getFuncionarios().subscribe(
      response => this.funcionarios = response,
      error => this.errors.push('Erro ao carregar funcionários')
    );
  }

  onSubmit(): void {
    if (!this.isValid()) {
      return;
    }
  

    //this.servicoPrestado.idFuncionarios = this.idFuncionariosSelecionados;
  
    console.log('Dados enviados:', this.servicoPrestado); // Log dos dados enviados
  
    if (this.servicoPrestado.id) {
      this.atualizarServico();
    } else {
      this.salvarServico();
    }
  }
  
  dismissSuccessAlert() {
    this.success = false;  // Lógica para fechar o alerta de sucesso
  }

  dismissErrorAlert() {
    this.errors = [];      // Lógica para limpar os erros e fechar o alerta de erro
  }

  isValid(): boolean {
    this.errors = [];
    if (!this.servicoPrestado.descricao) {
      this.errors.push('A descrição é obrigatória.');
    }
    if (!this.servicoPrestado.data) {
      this.errors.push('A data é obrigatória.');
    }
    if (!this.servicoPrestado.dataFinal) {
      this.errors.push('A data final é obrigatória.');
    }
    if (!this.servicoPrestado.tipoServico) {
      this.errors.push('O tipo de serviço é obrigatório.');
    }
    if (!this.servicoPrestado.situacao) {
      this.errors.push('A situação é obrigatória.');
    }
    if (!this.servicoPrestado.idFuncionarios || this.servicoPrestado.idFuncionarios.length === 0) {
      this.errors.push('Pelo menos um funcionário é obrigatório.');
    }

    return this.errors.length === 0;
  }

  salvarServico(): void {
    this.service.salvar(this.servicoPrestado).subscribe(
      response => {
        this.success = true;
        this.errors = [];
        this.servicoPrestado = response;
      },
      errorResponse => {
        console.error('Erro ao salvar:', errorResponse); // Adicione este log
        this.errors = errorResponse.error.errors || ['Erro ao salvar o serviço'];
      }
    );
  }
  
  atualizarServico(): void {
    this.service.atualizar(this.servicoPrestado.id, this.servicoPrestado).subscribe(
      response => {
        this.success = true;
        this.errors = [];
        this.servicoPrestado = response;
      },
      errorResponse => {
        console.error('Erro ao atualizar:', errorResponse); // Adicione este log
        this.errors = errorResponse.error.errors || ['Erro ao atualizar o serviço'];
      }
    );
  }

  voltarParaListagem(): void {
    this.router.navigate(['/servicoList']);
  }

  getFuncionarioNomeById(id: number): string {
    const funcionario = this.funcionarios.find(c => c.id === id);
    return funcionario ? funcionario.nome : 'Funcionário não encontrado';
  }
}