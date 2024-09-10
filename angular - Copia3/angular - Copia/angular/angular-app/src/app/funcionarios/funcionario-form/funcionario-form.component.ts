import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { IndexComponent } from '../../index/index.component';
import { Funcionario } from '../funcionario';
import{FormsModule}from '@angular/forms' 
import { ClientesService } from '../../clientes.service';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideHttpClient } from '@angular/common/http';
import { faBars, faTimes, IconDefinition, faHome, faUser, faBookmark, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { response } from 'express';
import { error } from 'console';
import { FuncionarioListaComponent } from '../funcionario-lista/funcionario-lista.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FuncionariosService } from '../../funcionarios.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SpaceComponent } from '../../space/space.component';
@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [FuncionarioListaComponent, NavbarComponent,SpaceComponent, CommonModule,HttpClientModule, FooterComponent, IndexComponent, FontAwesomeModule, FormsModule],
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css'
})

export class FuncionariosFormComponent implements OnInit {
  faBookmark = faBookmark;
  faLeftLong = faLeftLong;
  faSync = faSync;
  success: boolean = false;
  errors: string[] = [];
  id: any;
  cpfDisabled: boolean = false; 
  funcionario: Funcionario = new Funcionario();


  constructor(
    private service: FuncionariosService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params && params['id']) {
        this.id = params['id'];
        this.getFuncionarioById(this.id);
      }
    });
  }

  getFuncionarioById(id: number) {
    this.service.getFuncionarioById(id)
      .subscribe(
        response => {
          if (response instanceof ProgressEvent) {
            console.error('Erro ao receber resposta do servidor:', response);
            return;
          }
          this.funcionario = response;
        },
        (error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            console.error('Erro ocorreu:', error.error.message);
          } else {
            console.error(
              `Erro no código ${error.status}, ` +
              `mensagem: ${error.error}`);
          }
        }
      );
  }
  dismissSuccessAlert() {
    this.success = false;  // Lógica para fechar o alerta de sucesso
  }

  dismissErrorAlert(erro: string) {
    // Lógica para remover o erro específico da lista de erros
    const index = this.errors.indexOf(erro);
    if (index !== -1) {
      this.errors.splice(index, 1);
    }
  }

  applyCpfMask(value: string) {
    this.funcionario.cpf = value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/^(\d{3})(\d)/, '$1.$2') // Insere o primeiro ponto
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') // Insere o segundo ponto
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4') // Insere o traço
      .substr(0, 14); // Limita o tamanho do CPF
  }

  onSubmit() {
    this.errors = []; // Limpa os erros antes de fazer novas validações

    // Verificação dos campos obrigatórios
    if (!this.funcionario.nome) {
      this.errors.push("O nome é obrigatório.");
    }

    // Limpa o array de erros antes de realizar as validações
    this.errors = [];

    // Verificação dos campos vazios
    if (!this.funcionario.nome || !this.funcionario.cpf || !this.funcionario.telefone || !this.funcionario.email) {
      this.errors.push("Todos os campos são obrigatórios.");
      return; // Impede o envio do formulário
    }

    // Verificação do CPF
    if (!this.validarCPF(this.funcionario.cpf)) {
      this.errors.push("O CPF é inválido.");
      return; // Impede o envio do formulário
    }
 

    // Verificação do email
    if (!this.validarEmail(this.funcionario.email)) {
      this.errors.push("O e-mail é inválido.");
      return; // Impede o envio do formulário
    }
    if (!this.validarNome(this.funcionario.nome)) {
      this.errors.push("O nome é inválido.");
      return; // Impede o envio do formulário
    }
    if (!this.validarTelefone(this.funcionario.telefone)) {
      this.errors.push("O telefone é inválido.");
      return; // Impede o envio do formulário
    }

    // Verificação do DDD
    if (!this.funcionario.cargo || this.funcionario.cargo.length === 0) {
      this.errors.push("É necessário selecionar ao menos um cargo.");
    }

    if (!this.funcionario.habilidades || this.funcionario.habilidades.length === 0) {
      this.errors.push("É necessário informar ao menos uma habilidade.");
    }

    if (this.errors.length === 0) {
      if (this.id) {
        // Atualiza o funcionário
        this.service.atualizar(this.funcionario)
          .subscribe(response => {
            this.success = true;
          }, errorResponse => {
            this.errors.push('Erro ao atualizar o funcionário.');
          });
      } else {
        // Verifica se o CPF já está cadastrado
        this.service.verificarCPFCadastrado(this.funcionario.cpf)
          .pipe(
            mergeMap(cpfCadastrado => {
              if (cpfCadastrado) {
                this.errors.push("Este CPF já está cadastrado.");
                return of(null); // Retorna um observable nulo para parar o fluxo
              } else {
                // Continua com o processo de salvar o funcionário
                return this.service.salvar(this.funcionario);
              }
            }),
            catchError(errorResponse => {
              console.error('Erro ao verificar CPF ou salvar funcionário:', errorResponse);
              this.errors.push("Erro ao verificar CPF ou salvar funcionário.");
              return of(null); // Retorna um observable nulo em caso de erro
            })
          )
          .subscribe(response => {
            if (response) {
              this.success = true;
              this.funcionario = response;
            }
          });
      }
    }
  }

  validarNome(nome: string): boolean {
    // Verifica se o nome contém apenas letras
    return /^[a-zA-ZÀ-ú\s]+$/.test(nome);
  }

  validarEmail(email: string): boolean {
    // Verifica se o e-mail tem o formato válido
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }

    // Verificação do CPF
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10, 11))) {
      return false;
    }

    return true; // CPF válido
  }

  validarTelefone(telefone: string): boolean {
    // Verifica se o telefone contém apenas números
    if (!/^[0-9]+$/.test(telefone)) {
      return false;
    }

    // Lista de DDDs válidos no Brasil
    const dddsValidos = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '21', '22', '24', '27', '28',
      '31', '32', '33', '34', '35', '37', '38',
      '41', '42', '43', '44', '45', '46', '47', '48', '49',
      '51', '53', '54', '55',
      '61', '62', '63', '64', '65', '66', '67', '68', '69',
      '71', '73', '74', '75', '77', '79',
      '81', '82', '83', '84', '85', '86', '87', '88', '89',
      '91', '92', '93', '94', '95', '96', '97', '98', '99'
    ];

    // Verifica se os dois primeiros números são um DDD válido
    const ddd = telefone.substring(0, 2);
    if (!dddsValidos.includes(ddd)) {
      return false;
    }

    return true;
  }

  navegarParaFuncionario(id: number) {
    this.router.navigate(['/funcionarios', id]);
  }

  voltarParaListagem() {
    this.router.navigate(['/funcionariosList']);
  }
}