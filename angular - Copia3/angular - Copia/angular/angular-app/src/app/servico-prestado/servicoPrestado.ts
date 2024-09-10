export enum SituacaoServico {
  FAZER = 'FAZER',
  FAZENDO = 'FAZENDO',
  FEITO = 'FEITO'
}

export enum TipoServico {
  WEB_DESIGNING = 'Web Designing',
  TESTING = 'Testing',
  SOFTWARE_MAINTENANCE = 'Software Maintenance',
  DATA_ANALYSIS = 'Data Analysis',
  WEB_DEVELOPMENT = 'Web Development',
  OUTROS = 'Outros'
}
export class ServicoPrestado {
  descricao: string = '';
  data: string = '';
  dataFinal: string = '';
  tipoServico: TipoServico = TipoServico.WEB_DESIGNING;
  situacao: SituacaoServico = SituacaoServico.FAZER;
  idFuncionarios: number[] = [];  // Alterado para um array
  id!: number;

  constructor(init?: Partial<ServicoPrestado>) {
      Object.assign(this, init);
  }
}
