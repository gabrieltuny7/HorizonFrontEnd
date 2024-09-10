import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HometComponent } from './homet/homet.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { EditarSenhaComponent } from './editar-senha/editar-senha.component';
import { IndexComponent } from './index/index.component';
import { Cliente } from './clientes/cliente';
import{FormsModule}from '@angular/forms' 
import { ClientesService } from './clientes.service'; 
import { HttpClientModule } from '@angular/common/http';
import { ServicoPrestadoModule } from './servico-prestado/servico-prestado.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ServicoPrestadoService } from './servico-prestado.service';
import { RelatorioGastos } from './relatorio-gastos/relatorio-gastos.component';
import { FuncionariosService } from './funcionarios.service';
import { TagsInput } from '@mantine/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuillModule } from 'ngx-quill';
import { KanbanComponent } from './kanban/kanban.component';
import { FilterBySituacaoPipe } from './kanban/FilterBySituacaoPipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,RouterOutlet, QuillModule, KanbanComponent, ServicoPrestadoModule, RelatorioGastos, HometComponent, CommonModule, LoginComponent, CadastroComponent, EditarSenhaComponent, IndexComponent, MatFormFieldModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ClientesService, ServicoPrestadoService, RelatorioGastos, FuncionariosService] // Providers for services
})
export class AppComponent {
  title = 'Horizon';
  servicoPrestado = {
    descricao: ''
  };

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],    
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],     
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      
      [{ 'indent': '-1'}, { 'indent': '+1' }],          
      [{ 'direction': 'rtl' }],                         

      [{ 'size': ['small', false, 'large', 'huge'] }],  
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],         
      [{ 'align': [] }],
      ['clean']                                         
    ]
  };
}
