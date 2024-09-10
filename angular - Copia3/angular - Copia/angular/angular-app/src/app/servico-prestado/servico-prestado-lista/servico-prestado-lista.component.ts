import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { IndexComponent } from '../../index/index.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes, IconDefinition, faHome, faUser, faBookmark, faPlus, faPencil, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ServicoPrestadoService } from '../../servico-prestado.service';
import { ServicoPrestado } from '../servicoPrestado';
import { Cliente } from '../../clientes/cliente';
import { ClientesService } from '../../clientes.service';
import { Funcionario } from '../../funcionarios/funcionario';
import { FuncionariosService } from '../../funcionarios.service';
import { SpaceComponent } from '../../space/space.component';
@Component({
  selector: 'app-servico-prestado-lista',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule,SpaceComponent, FooterComponent, RouterModule, FontAwesomeModule, FormsModule],
  templateUrl: './servico-prestado-lista.component.html',
  styleUrls: ['./servico-prestado-lista.component.css'],
  providers: [ServicoPrestadoService, ClientesService, FuncionariosService]
})
export class ServicoPrestadoListaComponent implements OnInit {
  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;
  faFilter=faFilter;
  success: boolean = false;
  errors: string[] = [];
  servicosFiltrados: ServicoPrestado[] = [];
  servicos: ServicoPrestado[] = [];
  servicoSelecionado!: ServicoPrestado;
  funcionarios: Funcionario[] = [];
  funcionarioSelecionado!: Funcionario;
  mensagemSucesso!: string;
  mensagemErro!: string;
  // Filtros
  descricaoFiltro: string = '';

  // Ordenação
  orderAscDataInicial: boolean = true;
  orderAscDataFinal: boolean = true;

  constructor(
    private servicoService: ServicoPrestadoService,
    private clienteService: ClientesService,
    private funcionarioService: FuncionariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.funcionarioService.getFuncionarios().subscribe(
      (resposta: Funcionario[]) => {
        this.funcionarios = resposta;
      },
      (erro: any) => {
        console.error('Erro ao listar funcionarios:', erro);
      }
    );

    this.servicoService.listarServicos().subscribe(
      (resposta: ServicoPrestado[]) => {
        this.servicos = resposta;
        this.servicosFiltrados = resposta;
      },
      (erro: any) => {
        console.error('Erro ao listar serviços:', erro);
      }
    );
  }

  getFuncionarioNomes(ids: number[]): string {
    return ids.map(id => {
      const funcionario = this.funcionarios.find(f => f.id === id);
      return funcionario ? funcionario.nome : 'Desconhecido';
    }).join(', ');
  }

  novoCadastro() {
    this.router.navigate(['/servico']);
  }

  preparaDelecao(servico: ServicoPrestado) {
    this.servicoSelecionado = servico;
  }

  deletarServico() {
    if (!this.servicoSelecionado) return;
    this.servicoService.deletar(this.servicoSelecionado).subscribe(
      () => {
        this.mensagemSucesso = 'Serviço deletado com sucesso!';
        this.servicos = this.servicos.filter(servico => servico.id !== this.servicoSelecionado.id);
        this.filtrarServicos();
      },
      erro => {
        this.mensagemErro = 'Ocorreu um erro ao deletar o serviço, verifique se ele esta vinculado a algum Projeto!';
      }
    );
  }

  getRowClass(servico: ServicoPrestado): string {
    const dataInicial = new Date(servico.data);
    const dataFinal = new Date(servico.dataFinal);
    const diffInDays = Math.floor((dataFinal.getTime() - dataInicial.getTime()) / (1000 * 60 * 60 * 24));

    if (dataFinal > dataInicial) {
      return 'table-success'; // Verde
    } else if (dataInicial > dataFinal) {
      return 'table-danger'; // Vermelho
    } else if (diffInDays <= 7) {
      return 'table-warning'; // Amarelo
    } else {
      return ''; // Outra classe de estilo ou nenhuma classe, conforme necessário
    }
}


  filtrarServicos() {
    this.servicosFiltrados = this.servicos.filter(servico => {
      const descricaoMatch = servico.descricao.toLowerCase().includes(this.descricaoFiltro.toLowerCase());
      return descricaoMatch;
    });
  }

  ordenarServicos(coluna: string) {
    if (coluna === 'dataInicial') {
      this.servicosFiltrados.sort((a, b) => this.orderAscDataInicial
        ? new Date(a.data).getTime() - new Date(b.data).getTime()
        : new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      this.orderAscDataInicial = !this.orderAscDataInicial;
    } else if (coluna === 'dataFinal') {
      this.servicosFiltrados.sort((a, b) => this.orderAscDataFinal
        ? new Date(a.dataFinal).getTime() - new Date(b.dataFinal).getTime()
        : new Date(b.dataFinal).getTime() - new Date(a.dataFinal).getTime()
      );
      this.orderAscDataFinal = !this.orderAscDataFinal;
    }
  }
}