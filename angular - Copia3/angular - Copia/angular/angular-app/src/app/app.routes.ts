import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { EditarSenhaComponent } from './editar-senha/editar-senha.component';
import { IndexComponent } from './index/index.component';
import { AppComponent } from './app.component';
import { ClientesFormComponent } from './clientes/clientes-form/clientes-form.component';
import { ClientesListaComponent } from './clientes/clientes-lista/clientes-lista.component';
import { HometComponent } from './homet/homet.component';
import { ServicoPrestadoFormComponent } from './servico-prestado/servico-prestado-form/servico-prestado-form.component';
import { ServicoPrestadoListaComponent } from './servico-prestado/servico-prestado-lista/servico-prestado-lista.component';
import { RelatorioGastos } from './relatorio-gastos/relatorio-gastos.component';
import { FuncionariosFormComponent } from './funcionarios/funcionario-form/funcionario-form.component';
import { FuncionarioListaComponent } from './funcionarios/funcionario-lista/funcionario-lista.component';
import { ProjetoFormComponent } from './projeto/projeto-form/projeto-form.component';
import { ProjetoListaComponent } from './projeto/projeto-lista/projeto-lista.component';
import { KanbanComponent } from './kanban/kanban.component';
export const routes: Routes = [
    {
        path: "",
        component: HometComponent
    },
    {
        path: "Login",
        component: LoginComponent
    },
    {
        path: "Cadastro",
        component: CadastroComponent
    },
    {
        path: "EditarSenha",
        component: EditarSenhaComponent
    },

    {
        path: "index",
        component: IndexComponent
    },

    {
        path: "clientes",
        component: ClientesFormComponent
    },
    {
        path: "clientes/:id",
        component: ClientesFormComponent
    },    

    {
        path: "clientesList",
        component: ClientesListaComponent
    },
    {
        path: "servico",
        component: ServicoPrestadoFormComponent
    },    
    {
        path: "servico/:id",
        component: ServicoPrestadoFormComponent
    },  
    {
        path: "servicoList",
        component: ServicoPrestadoListaComponent
    },
    {
        path: "gastos",
        component: RelatorioGastos
    },
    {
        path: "funcionarios",
        component: FuncionariosFormComponent
    },
    {
        path: "funcionariosList",
        component: FuncionarioListaComponent
    },
    {
        path: "funcionarios/:id",
        component: FuncionariosFormComponent
    },         {
        path: "projeto/:id",
        component: ProjetoFormComponent
    },      {
        path: "projetoList",
        component: ProjetoListaComponent
    },
    {
        path: "projeto",
        component: ProjetoFormComponent
    },
    {
        path: "kanban",
        component: KanbanComponent
    },

];

