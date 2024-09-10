import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { IndexComponent } from '../../index/index.component';
import { Cliente } from '../cliente';
import{FormsModule}from '@angular/forms' 
import { ClientesService } from '../../clientes.service';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideHttpClient } from '@angular/common/http';
import { faBars, faTimes, IconDefinition, faHome, faUser, faBookmark, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { response } from 'express';
import { error } from 'console';
import { ClientesListaComponent } from '../clientes-lista/clientes-lista.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SpaceComponent } from '../../space/space.component';
@Component({
   selector: 'app-clientes-form',
   standalone: true,
   imports: [ClientesListaComponent, NavbarComponent,SpaceComponent, CommonModule,HttpClientModule, FooterComponent, IndexComponent, FontAwesomeModule, FormsModule],
   templateUrl: './clientes-form.component.html',
   styleUrl: './clientes-form.component.css',
   providers: [ClientesService] 
 })

 export class ClientesFormComponent implements OnInit {
   faBookmark = faBookmark;
   faLeftLong = faLeftLong; 
   faSync = faSync;
   cliente: Cliente; 
   success: boolean = false;
   errors: string[] = [];
   id: any; 


   
   constructor(
     private service: ClientesService,
     private router: Router,
     private activatedRoute: ActivatedRoute
   ) {
     this.cliente = new Cliente();
   }


   ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params && params['id']) {
        this.id = params['id'];
        this.getClienteById(this.id);
      }
    });
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
  getClienteById(id: number) {
    this.service.getClienteById(id)
      .subscribe(
        response => {
          if (response instanceof ProgressEvent) {
            console.error('Erro ao receber resposta do servidor:', response);
            return;
          }
          this.cliente = response;
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
  
  applyCpfMask(value: string) {
    this.cliente.cpf = value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/^(\d{3})(\d)/, '$1.$2') // Insere o primeiro ponto
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') // Insere o segundo ponto
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4') // Insere o traço
      .substr(0, 14); // Limita o tamanho do CPF
  }

  onSubmit() {
    // Verificação dos campos vazios
    if (!this.cliente.nome || !this.cliente.cpf || !this.cliente.telefone || !this.cliente.email) {
      this.success = false;
      this.errors = ["Todos os campos são obrigatórios."];
      return; // Impede o envio do formulário
    }
  
    const telefoneNumerico = this.cliente.telefone.replace(/[^\d()-]/g, '');
  
    // Verifica se o telefone contém apenas números e caracteres da máscara
    if (telefoneNumerico !== this.cliente.telefone) {
      this.success = false;
      this.errors = ["O telefone deve conter apenas números."];
      return; // Impede o envio do formulário
    }
  
    // Verifica se o número de dígitos do telefone é válido (considerando DDD)
    if (telefoneNumerico.length < 11) { // Assumindo que 12 é o número mínimo de dígitos para um telefone válido (incluindo DDD e separadores)
      this.success = false;
      this.errors = ["O telefone deve ter pelo menos 11 dígitos, incluindo o DDD."];
      return; // Impede o envio do formulário
    }
  
    if (!this.validarEmail(this.cliente.email)) {
      this.success = false;
      this.errors = ["O e-mail é inválido."];
      return; // Impede o envio do formulário
    }
  
    if (!this.validarNome(this.cliente.nome)) {
      this.success = false;
      this.errors = ["O nome deve conter apenas letras."];
      return; // Impede o envio do formulário
    }
  
    // Verifica se o DDD é válido (dois dígitos e existe na lista de DDDs válidos)
    const ddd = telefoneNumerico.substring(0, 2);
    const dddsValidos = ['11', '12', '13', '14', '15', '16', '17', '18', '19', // DDDs válidos no Brasil
                         '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38',
                         '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54',
                         '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73',
                         '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88',
                         '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
    if (!/^\d{2}$/.test(ddd) || !dddsValidos.includes(ddd)) {
      this.success = false;
      this.errors = ["O DDD do telefone é inválido."];
      return; // Impede o envio do formulário
    }
  
    // Verifica se o CPF é válido
    if (!this.validarCPF(this.cliente.cpf)) {
      this.success = false;
      this.errors = ["O CPF é inválido."];
      return; // Impede o envio do formulário
    }
  
    // Verifica se é uma edição ou cadastro
    if (this.id) {
      // Se for uma edição, atualiza o cliente
      this.service.atualizar(this.cliente)
        .subscribe(response => {
          this.success = true;
          this.errors = [];
        }, errorResponse => {
          this.errors = ['Erro ao atualizar o cliente.'];
        });
    } else {
      // Se for um cadastro, verifica se o CPF já está cadastrado
      this.service.verificarCPFCadastrado(this.cliente.cpf)
        .subscribe(
          cpfCadastrado => {
            if (cpfCadastrado) {
              this.success = false;
              this.errors = ["Este CPF já está cadastrado."];
            } else {
              // Se o CPF não estiver cadastrado, continua com o processo de salvar o cliente
              this.service.salvar(this.cliente)
                .subscribe(
                  response => {
                    this.success = true;
                    this.errors = [];
                    this.cliente = response;
                  },
                  errorResponse => {
                    this.success = false;
                    this.errors = errorResponse.error.errors;
                  }
                );
            }
          },
          errorResponse => {
            console.error('Erro ao verificar CPF:', errorResponse);
            this.success = false;
            this.errors = ['Erro ao verificar CPF.'];
          }
        );
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

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

    // Verifica o primeiro dígito verificador
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

    // Verifica o segundo dígito verificador
    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
        return false;
    }

    // CPF válido
    return true;
  }
  navegarParaCliente(id: number) {
    this.router.navigate(['/clientes', id]);
  }
  voltarParaListagem() {
    this.router.navigate(['/clientesList']);
  }
}