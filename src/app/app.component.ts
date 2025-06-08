import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from './product.service';
import { ProductData } from './product-data.model';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
//import { CheckboxRequiredValidator } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = "METAMIND - Extração Inteligente"
  products: MatTableDataSource<ProductData>;
  displayedColumns: string[] = ['id', 'cnpj', 'data_emissao', 'valor_total', 'imagem_hash', 'status', 'action'];
  products$: Subscription = null;
  totalProduts = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public productService: ProductService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.products$) {
      this.products$.unsubscribe();
      this.products$ = null
    }
  }

  fetchData() {
    this.products$ = this.productService.read().subscribe(( data ) => {
      this.products = new MatTableDataSource<ProductData>(data);
      this.products.paginator = this.paginator;
      this.products.sort = this.sort;
      this.productService.showMessage("Lista notas atuaizada!");
    });
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '960px', height: '710px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchData();
      if (result.event == 'Adicionar') {
        //this.addRowData(result.data);
      } else if (result.event == 'Editar') {
        //this.updateRowData(result.data);
      } else if (result.event == 'Excluir') {
       // this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj) {
    if (!this.isProdutoValido(row_obj)) return

    console.log("addRow",row_obj)
    const product = {
      id: row_obj.id, 
      cnpj: row_obj.cnpj,
      valor_total: row_obj.valor_total,
      data_emissao: row_obj.data_emissao,
      imagem_hash: row_obj.imagem_hash,
      status	: row_obj.status,
    }
    this.productService.create(product).subscribe(() => {
      this.productService.showMessage("Produto adicionado com sucesso!");
      this.fetchData();
    });
  }

  updateRowData(row_obj) {
    if (!this.isProdutoValido(row_obj)) return
    const product = {
      id: row_obj.id,
      cnpj: row_obj.cnpj,
      imagem_hash: row_obj.imagem_hash,
      status: row_obj.status,
      data_emissao: row_obj.data_emissao,
      valor_total: row_obj.valor_total
    }
    this.productService.update(product).subscribe(() => {
      this.productService.showMessage("Produto atualizado com sucesso!");
      this.fetchData();
    })
  }

  deleteRowData(product) {
    if (!product) return
    const id = `${product.id}`;
    this.productService.delete(id).subscribe(() => {
      this.productService.showMessage(`Produto com id ${id} excluido com sucesso!`);
      this.fetchData();
    });
  }


  isProdutoValido(produto): boolean {
    if (!produto) {
      this.productService.showMessage("Produto Inválido!", true)
      return false
    }

    if (!produto.cnpj) {
      this.productService.showMessage("Erro: cnpj não pode está vazio", true)
      return false
    }


    if (isNaN(produto.valor_total) || produto.valor_total <= 0) {
      this.productService.showMessage("Erro: Valor deve ser maior que zero", true)
      return false
    }
 
    return true
  }

}
