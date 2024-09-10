import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPencil, faTrash,faFilter } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ProjetoService } from '../../projeto.service';
import { Projeto } from '../projeto';
import { ClientesService } from '../../clientes.service';
import { ServicoPrestadoService } from '../../servico-prestado.service';
import { Cliente } from '../../clientes/cliente';
import { ServicoPrestado } from '../../servico-prestado/servicoPrestado';
import { SpaceComponent } from '../../space/space.component';

@Component({
  selector: 'app-projeto-lista',
  standalone: true,
  imports: [CommonModule, NavbarComponent,SpaceComponent, HttpClientModule, FooterComponent, RouterModule, FontAwesomeModule, FormsModule],
  templateUrl: './projeto-lista.component.html',
  styleUrls: ['./projeto-lista.component.css'],
  providers: [ProjetoService, ClientesService, ServicoPrestadoService]
})
export class ProjetoListaComponent implements OnInit {
  faPlus = faPlus;
  faPencil = faPencil;
  faFilter = faFilter;
  faTrash = faTrash;
  projetosFiltrados: Projeto[] = [];
  projetos: Projeto[] = [];
  projetoSelecionado!: Projeto;
  servicos: ServicoPrestado[] = [];
  servicoSelecionado!: ServicoPrestado;
  clientes: Cliente[] = [];
  mensagemSucesso!: string;
  mensagemErro!: string;
  success: boolean = false;  // Adicionada a propriedade success
  errors: string[] = [];  // Adicionada a propriedade errors
  // Filtros
  descricaoFiltro: string = '';

  // Ordenação
  orderAscDataInicial: boolean = true;
  orderAscDataFinal: boolean = true;
  constructor(
    private projetoService: ProjetoService,
    private clienteService: ClientesService,
    private servicoService: ServicoPrestadoService,
    private router: Router
  ) {}

  ngOnInit(): void {


    this.clienteService.getClientes().subscribe(
      (resposta: Cliente[]) => {
        this.clientes = resposta;
      },
      (erro: any) => {
        console.error('Erro ao listar clientes:', erro);
      }
    );

    this.servicoService.listarServicos().subscribe(
      (resposta: ServicoPrestado[]) => {
        this.servicos = resposta;
      },
      (erro: any) => {
        console.error('Erro ao listar serviços:', erro);
      }
    );
    this.projetoService.listarProjetos().subscribe(
      (resposta: Projeto[]) => {
        this.projetos = resposta;
        this.projetosFiltrados = resposta;
      },
      (erro: any) => {
        console.error('Erro ao listar projetos:', erro);
      }
    );
  }

  getClienteNomeById(ids: number[]): string {
    return ids.map(id => {
      const cliente = this.clientes.find(c => c.id === id);
      return cliente ? cliente.nome : 'Desconhecido';
    }).join(', ');
  }

  getServicoDescricaoById(ids: number[]): string {
    return ids.map(id => {
      const servico = this.servicos.find(s => s.id === id);
      return servico ? servico.descricao : 'Desconhecido';
    }).join(', ');
  }

  novoCadastro() {
    this.router.navigate(['/projeto']);
  }

  preparaDelecao(projeto: Projeto) {
    this.projetoSelecionado = projeto;
  }
  
  deletarProjeto() {
    if (!this.projetoSelecionado) return;
    this.projetoService.deletar(this.projetoSelecionado).subscribe(
      () => {
        this.mensagemSucesso = 'Projeto deletado com sucesso!';
        this.projetos = this.projetos.filter(projeto => projeto.id !== this.projetoSelecionado.id);
        this.filtrarProjetos();
      },
      erro => {
        this.mensagemErro = 'Ocorreu um erro ao deletar o Projeto.';
      }
    );
  }


  getRowClass(projeto: Projeto): string {
    const dataInicial = new Date(projeto.data);
    const dataFinal = new Date(projeto.dataFinal);
    const diffInDays = Math.floor((dataFinal.getTime() - dataInicial.getTime()) / (1000 * 60 * 60 * 24));

    if (projeto.situacao === 'DESATIVADO') {
        return 'desativado'; // Cinza claro
    } else if (dataFinal > dataInicial) {
        return 'table-success'; // Verde
    } else if (dataInicial > dataFinal) {
        return 'table-danger'; // Vermelho
    } else if (diffInDays <= 7) {
        return 'table-warning'; // Amarelo
    } else {
        return ''; // Outra classe de estilo ou nenhuma classe, conforme necessário
    }
}



  filtrarProjetos() {
    this.projetosFiltrados = this.projetos.filter(projeto => {
      const descricaoMatch = projeto.descricao.toLowerCase().includes(this.descricaoFiltro.toLowerCase());
      return descricaoMatch;
    });
  }

  ordenarProjetos(coluna: string) {
    if (coluna === 'dataInicial') {
      this.projetosFiltrados.sort((a, b) => this.orderAscDataInicial
        ? new Date(a.data).getTime() - new Date(b.data).getTime()
        : new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      this.orderAscDataInicial = !this.orderAscDataInicial;
    } else if (coluna === 'dataFinal') {
      this.projetosFiltrados.sort((a, b) => this.orderAscDataFinal
        ? new Date(a.dataFinal).getTime() - new Date(b.dataFinal).getTime()
        : new Date(b.dataFinal).getTime() - new Date(a.dataFinal).getTime()
      );
      this.orderAscDataFinal = !this.orderAscDataFinal;
    }
  }

}