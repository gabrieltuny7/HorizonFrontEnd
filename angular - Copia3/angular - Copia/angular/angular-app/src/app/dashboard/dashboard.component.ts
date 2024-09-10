import { Component, OnInit } from '@angular/core';
import { faTrash, faAngleRight, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClientesService } from '../clientes.service';
import { Observable } from 'rxjs'; // Importe Observable se necessário
import { ServicoPrestadoService } from '../servico-prestado.service';
import { ServicoCount } from './ServicoCount';
import { ServicoPrestado } from '../servico-prestado/servicoPrestado';
import { ProjetoService } from '../projeto.service';
import { FuncionariosService } from '../funcionarios.service';
import { Projeto } from '../projeto/projeto';
import { SpaceComponent } from '../space/space.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule,SpaceComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers:[FuncionariosService, ClientesService, ServicoPrestadoService, ProjetoService]
})
export class DashboardComponent implements OnInit {
  faTrash = faTrash;
  faAngleRight = faAngleRight;
  faMagnifyingGlass = faMagnifyingGlass;
  quantidadeClientes: number = 0;
  quantidadeServicos: number = 0;
  quantidadeProjetos: number = 0;
  quantidadeFuncionarios: number = 0;
  valorTotalProjetos: number = 0;
  servicosPorTipo: ServicoCount[] = [];

  constructor(
    private clienteService: ClientesService,
    private servicoPrestadoService: ServicoPrestadoService,
    private projetoService: ProjetoService,
    private funcionariosService: FuncionariosService
  ) {}

  ngOnInit(): void {
    this.carregarQuantidadeProjetos();
    this.carregarQuantidadeClientes();
    this.carregarQuantidadeServicos();
    this.carregarServicosPorTipo();
    this.carregarQuantidadeFuncionarios();
  }

  private carregarQuantidadeProjetos(): void {
    this.projetoService.listarProjetos().subscribe(
      (projetos: Projeto[]) => {
        this.quantidadeProjetos = projetos.length;
        this.valorTotalProjetos = this.calcularValorTotalProjetos(projetos);
      },
      (error) => {
        console.error('Erro ao carregar projetos:', error);
      }
    );
  }
  private carregarQuantidadeFuncionarios(): void {
    this.funcionariosService.getFuncionarios().subscribe(
      (funcionarios: any[]) => {
        this.quantidadeFuncionarios = funcionarios.length;
      },
      (error) => {
        console.error('Erro ao carregar funcionários:', error);
      }
    );
  }

  private calcularValorTotalProjetos(projetos: Projeto[]): number {
    return projetos.reduce((total, projeto) => total + projeto.valor, 0);
  }

  private carregarQuantidadeClientes(): void {
    this.clienteService.getClientes().subscribe(
      (clientes: any[]) => {
        this.quantidadeClientes = clientes.length;
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  private carregarQuantidadeServicos(): void {
    this.servicoPrestadoService.contarServicos().subscribe(
      (quantidadeServicos: number) => {
        this.quantidadeServicos = quantidadeServicos;
      },
      (error) => {
        console.error('Erro ao carregar serviços:', error);
      }
    );
  }

  private carregarServicosPorTipo(): void {
    this.servicoPrestadoService.contarServicosPorTipo().subscribe(
      (data: ServicoCount[]) => {
        this.servicosPorTipo = data;
      },
      (error) => {
        console.error('Erro ao carregar serviços por tipo:', error);
      }
    );



    this.servicoPrestadoService.contarServicosPorTipo().subscribe((data: ServicoCount[]) => {
      this.servicosPorTipo = data;
      this.updateServicoCounts();
    });

    // Função para atualizar os contadores nos elementos da página
    this.updateServicoCounts();
  }

  updateServicoCounts(): void {
    const tipos = ['Web Designing', 'Testing', 'Software Maintenance', 'Data Analysis', 'Outros', 'Web Development'];

    tipos.forEach(tipo => {
      const servico = this.servicosPorTipo.find(s => s.tipoServico === tipo);
      const countElement = document.querySelector(`.project-box-footer .days-left[data-tipo="${tipo}"]`);
      if (countElement) {
        countElement.textContent = servico ? servico.count.toString() : '0';
      }
    });
  

    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('en-US', { month: 'long', day: 'numeric' });
      currentDateElement.textContent = formattedDate;
    }

    const modeSwitch = document.querySelector('.mode-switch');
    const listView = document.querySelector('.list-view');
    const gridView = document.querySelector('.grid-view');
    const projectsList = document.querySelector('.project-boxes');
    const messagesBtn = document.querySelector('.messages-btn');
    const messagesClose = document.querySelector('.messages-close');

    if (listView) {
      listView.addEventListener('click', () => {
        gridView?.classList.remove('active');
        listView?.classList.add('active');
        projectsList?.classList.remove('jsGridView');
        projectsList?.classList.add('jsListView');
      });
    }

    if (gridView) {
      gridView.addEventListener('click', () => {
        gridView?.classList.add('active');
        listView?.classList.remove('active');
        projectsList?.classList.remove('jsListView');
        projectsList?.classList.add('jsGridView');
      });
    }

    if (messagesBtn) {
      messagesBtn.addEventListener('click', () => {
        const messagesSection = document.querySelector('.messages-section');
        messagesSection?.classList.add('show');
      });
    }

    if (messagesClose) {
      messagesClose.addEventListener('click', () => {
        const messagesSection = document.querySelector('.messages-section');
        messagesSection?.classList.remove('show');
      });
    }
  }
}