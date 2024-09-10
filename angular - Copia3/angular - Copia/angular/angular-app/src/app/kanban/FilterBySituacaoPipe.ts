import { Pipe, PipeTransform } from '@angular/core';
import { ServicoPrestado, SituacaoServico } from '../servico-prestado/servicoPrestado';

@Pipe({
  name: 'filterBySituacao'
})
export class FilterBySituacaoPipe implements PipeTransform {
  transform(servicos: ServicoPrestado[], situacao: SituacaoServico): ServicoPrestado[] {
    return servicos.filter(servico => servico.situacao === situacao);
  }
}
