import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { IndexComponent } from '../index/index.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes, IconDefinition, faHome, faUser, faBookmark, faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ServicoPrestadoService } from '../servico-prestado.service';
import { ServicoPrestado } from '../servico-prestado/servicoPrestado';
import { Cliente } from '../clientes/cliente';
import { ClientesService } from '../clientes.service';
import { Funcionario } from '../funcionarios/funcionario';
import { FuncionariosService } from '../funcionarios.service';
@Component({
  selector: 'app-relatorio-gastos',
  standalone: true,
  imports:  [CommonModule, NavbarComponent, HttpClientModule, FooterComponent, RouterModule, FontAwesomeModule, FormsModule],
  templateUrl: './relatorio-gastos.component.html',
  styleUrl: './relatorio-gastos.component.css',
  providers: [ServicoPrestadoService, ClientesService, FuncionariosService]
})
export class RelatorioGastos implements OnInit {
  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;

  servicos: ServicoPrestado[] = [];
  servicoSelecionado!: ServicoPrestado;
  clientes: Cliente[] = [];
  clienteSelecionado!: Cliente;
  funcionarios: Funcionario[] = [];
  FuncionarioSelecionado!: Funcionario;
  mensagemSucesso!: string;
  mensagemErro!: string;
  servicosFiltrados: ServicoPrestado[] = [];
  pesquisaCliente: string = '';

  ordemData: string = 'asc';
  mostrarApenasAtivos: boolean = false;

  constructor(
    private servicoService: ServicoPrestadoService,
    private clienteService: ClientesService,
    private funcionarioService: FuncionariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
   

  }

  novoCadastro() {
    this.router.navigate(['/servico']);
  }




  ordenarPorData(): void {
    const ordem = this.ordemData === 'asc' ? 'desc' : 'asc';
    this.servicosFiltrados.sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();

      if (isNaN(dataA) || isNaN(dataB)) {
        return 0;
      }

      return ordem === 'asc' ? dataA - dataB : dataB - dataA;
    });
    this.ordemData = ordem;
  }



  getClass(servico: ServicoPrestado): string {
    const agora = new Date().getTime();
    const dataFinal = new Date(servico.dataFinal).getTime();
    const umaSemana = 7 * 24 * 60 * 60 * 1000;

    

    if (dataFinal < agora) {
      return 'bg-vermelho-fraco';
    } else if (dataFinal < agora + umaSemana) {
      return 'bg-amarelo-fraco';
    } else {
      return 'bg-verde';
    }
  }
}