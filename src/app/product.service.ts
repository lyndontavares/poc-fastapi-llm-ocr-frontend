import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, catchError } from 'rxjs/operators';
import { ProductData } from './product-data.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = "http://127.0.0.1:8000/invoices";

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, isError?'Erro ':'Info ', {
      duration: 3000,
      //horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: (isError) ? ['msg-error'] : ['msg-success']
    })
  }

  errorHandler(e: any): Observable<any> {
    this.showMessage(e.error.detail.substring(0, 256), true);
    //this.showMessage('Erro!', true);
    return EMPTY;
  }

  read(): Observable<ProductData[]> {
    return this.http.get<ProductData[]>(this.baseUrl).pipe(
      map((obj) => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  readById(id: string): Observable<ProductData> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<ProductData>(url).pipe(
      map((obj) => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  create(product: ProductData): Observable<ProductData> {
    product.id=0;
    //console.log("Novo: ");
    //console.log(product);
    return this.http.post<ProductData>(this.baseUrl+"/add", product).pipe(
      map((obj) => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  update(product: ProductData): Observable<ProductData> {
    const url = `${this.baseUrl}/${product.id}`;
    return this.http.put<ProductData>(url, product).pipe(
      map((obj) => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  delete(id: string): Observable<ProductData> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<ProductData>(url).pipe(
      map((obj) => obj),
      catchError(e => this.errorHandler(e))
    )
  }
}
