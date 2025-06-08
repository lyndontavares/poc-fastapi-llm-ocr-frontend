import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductData } from '../product-data.model';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent { 

  processing=false;
  formGroup: FormGroup;
  action: string = 'Ação';
  local_data: any;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ProductData) {
    this.local_data = { ...data };
    this.action = data.action;
    console.log(data);
    console.log(this.action);
  }

  ngOnInit(): void {

    this.formGroup = new FormGroup({
      cnpj: new FormControl({value: this.local_data.cnpj, disabled: false}, Validators.required),
      data_emissao: new FormControl({value: this.local_data.data_emissao, disabled: false}, Validators.required),
      valor_total: new FormControl({value: this.local_data.valor_total,disabled: false  }, Validators.required),
      id: new FormControl({value:this.local_data.id, disabled: true},),
      imagem_hash: new FormControl({value: this.local_data.imagem_hash, disabled: true}, Validators.required),
      status: new FormControl({value: this.local_data.status, disabled: true}, Validators.required),
    });

/*     this.formGroup = this.fb.group({
      cnpj: [''],
      data_emissao: [''],
      valor_total: [''],
      imagem_hash: [''],
      status: ['',{disabled: true}],
      id: ['',{disabled: true}],
    }); */
  }


  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }

    this.onUpload();
   
  }

  onUpload(): void {
    if (!this.selectedFile) return;
    this.processing=true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://127.0.0.1:8000/invoices/extract/check', formData)  //http://127.0.0.1:8000/docs#/
      .subscribe({
        next: (res) => {

          console.log(this.formGroup.value)
          
          this.formGroup.patchValue({
            id: res['id'], 
            cnpj:res['cnpj'], 
            data_emissao: res['data_emissao'], 
            valor_total:res['valor_total'],
            imagem_hash:res['imagem_hash'],
            status:res["status"],
          })

          this.processing=false;
          this.alertService.showMessage("Processado extração com sucesso",false)
          console.log('Upload com sucesso', res);
        },

        error: (err) => {
          this.processing=false;
          this.alertService.showMessage(err.error.detail, true);
          console.error('Erro no upload', err)
        }
      });
  }

}
