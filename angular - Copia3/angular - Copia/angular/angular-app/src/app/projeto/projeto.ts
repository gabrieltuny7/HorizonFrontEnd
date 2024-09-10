export enum Situacao {
    ATIVO = 'ATIVO',
    DESATIVADO = 'DESATIVADO'
  }


  export class Projeto {
    descricao: string = '';
    data: string = '';
    dataFinal: string = '';
    situacao: Situacao = Situacao.ATIVO;
    idClientes: number[] = [];  
    idServicos: number[] = [];  
    id!: number;
    valor!: number;
    constructor(init?: Partial<Projeto>) {
        Object.assign(this, init);
    }
}
  