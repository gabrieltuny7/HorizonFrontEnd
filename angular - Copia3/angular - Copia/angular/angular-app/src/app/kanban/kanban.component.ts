import { Component, OnInit,  AfterViewInit } from '@angular/core';
import { ServicoPrestado, SituacaoServico, TipoServico} from '../servico-prestado/servicoPrestado';
import Sortable from 'sortablejs';
import { SpaceComponent } from '../space/space.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ServicoPrestadoService } from '../servico-prestado.service';
import { CommonModule } from '@angular/common';
import { FilterBySituacaoPipe } from './FilterBySituacaoPipe';
import { AppComponent } from '../app.component';
import { RouterModule } from '@angular/router';
import { FuncionariosService } from '../funcionarios.service';
import { Funcionario } from '../funcionarios/funcionario';
@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, AppComponent, NavbarComponent, SpaceComponent],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css',
  providers: [ServicoPrestadoService, FuncionariosService]
})
export class KanbanComponent implements OnInit {
  // Declaração das listas de serviços para cada coluna do Kanban
  fazerServicos: ServicoPrestado[] = [];
  fazendoServicos: ServicoPrestado[] = [];
  feitoServicos: ServicoPrestado[] = [];
  funcionarios: Funcionario[] = [];
  // Injeção de dependência do serviço que lida com os serviços prestados
  constructor(private servicoService: ServicoPrestadoService,  private funcionarioService: FuncionariosService) {}

  // Método chamado quando o componente é inicializado
  ngOnInit() {
    this.carregarServicos();
  }

  // Carrega os serviços a partir do serviço prestado
  carregarServicos() {
    this.servicoService.listarServicos().subscribe(servicos => {
      // Filtra os serviços por sua situação e os distribui nas listas correspondentes
      this.fazerServicos = servicos.filter(servico => servico.situacao === SituacaoServico.FAZER);
      this.fazendoServicos = servicos.filter(servico => servico.situacao === SituacaoServico.FAZENDO);
      this.feitoServicos = servicos.filter(servico => servico.situacao === SituacaoServico.FEITO);
    });
  }

  // Evento disparado ao iniciar o arrasto de um cartão
  onDragStart(event: any, servico: ServicoPrestado) {
    event.dataTransfer.setData('servicoId', servico.id.toString());
  }

  // Permite que um elemento seja solto em um alvo de drop
  allowDrop(event: any) {
    event.preventDefault();
  }

  // Evento disparado ao soltar um cartão em uma coluna
  onDrop(event: any, column: 'fazer' | 'fazendo' | 'feito') {
    event.preventDefault();
    // Obtém o ID do serviço arrastado
    const servicoId = event.dataTransfer.getData('servicoId');
    const servico = this.findServicoById(+servicoId);

          if (servico) {
          // Remove o serviço da lista atual
          this.removeServicoById(servico.id);
          // Atualiza a situação do serviço com base na coluna de destino
          servico.situacao = column === 'fazer' ? SituacaoServico.FAZER :
                         column === 'fazendo' ? SituacaoServico.FAZENDO : SituacaoServico.FEITO;

          // Chama o serviço para atualizar o serviço no backend
          this.servicoService.atualizar(servico.id, servico).subscribe(
          (servicoAtualizado) => {
          console.log('Serviço atualizado:', servicoAtualizado);
          // Adiciona o serviço atualizado à lista correta
          if (column === 'fazer') {
            this.fazerServicos.push(servicoAtualizado);
          } else if (column === 'fazendo') {
            this.fazendoServicos.push(servicoAtualizado);
          } else if (column === 'feito') {
            this.feitoServicos.push(servicoAtualizado);
          }
        },
        (error) => {
          console.error('Erro ao atualizar serviço:', error);
        }
      );
    }
  }

  // Encontra um serviço pelo seu ID nas listas de serviços
  findServicoById(id: number): ServicoPrestado | undefined {
    const servicos = [...this.fazerServicos, ...this.fazendoServicos, ...this.feitoServicos];
    return servicos.find(servico => servico.id === id);
  }

  // Remove um serviço pelo seu ID das listas de serviços
  removeServicoById(id: number) {
    this.fazerServicos = this.fazerServicos.filter(servico => servico.id !== id);
    this.fazendoServicos = this.fazendoServicos.filter(servico => servico.id !== id);
    this.feitoServicos = this.feitoServicos.filter(servico => servico.id !== id);
  }

  
  getFuncionarioNomes(ids: number[]): string {
    return ids.map(id => {
      const funcionario = this.funcionarios.find(f => f.id === id);
      return funcionario ? funcionario.nome : 'Desconhecido';
    }).join(', ');
  }
}