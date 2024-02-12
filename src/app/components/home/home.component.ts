import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { PanelComponent } from '../panel/panel.component';
import { NgIf } from '@angular/common';
import { serveis, panelServeis, client } from '../../interfaces/formularis.interface';
import { ListPptosComponent } from '../list-pptos/list-pptos.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PanelComponent,
    ListPptosComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  public serveis = this.BudgetService.getServeis();
  pptoForm: FormGroup;



  constructor(
    private fb: FormBuilder,
    private BudgetService: BudgetService
    ){
      // Inicializar el formulario
      this.pptoForm = this.fb.group({
        seo: false,
        ads: false,
        web: false,
        numPagines: new FormControl(1),
        numIdiomes: new FormControl(1),
        totPpto: 0,
        nom: ['', this.nombreValido],
        tel: ['', this.telefonoValido],
        email: ['', this.emailValido],
      });
    }

// Calcular total del ppto
  calcularTotalPpto() {
  let totPpto: number = 0;

  if (this.pptoForm.get('seo')!.value) {
    totPpto += 300;
  }
  if (this.pptoForm.get('ads')!.value) {
    totPpto += 400;
  }
  if (this.pptoForm.get('web')!.value) {
    totPpto += this.BudgetService.calcularPreuWeb(
      this.pptoForm.get('numPagines')!.value,
      this.pptoForm.get('numIdiomes')!.value
    );
  }
  this.pptoForm.get('totPpto')!.setValue(totPpto);
  }


  onPaginesCanvi(nouPagines: number) {
    this.pptoForm.get('numPagines')!.setValue(nouPagines);
    this.calcularTotalPpto();
  }

  onIdiomesCanvi(nouIdiomes: number){
    this.pptoForm.get('numIdiomes')!.setValue(nouIdiomes);
    this.calcularTotalPpto();
  }

  demanarPpto() {
  //if (this.pptoForm.get('nom')!.valid && this.pptoForm.get('tel')!.valid && this.pptoForm.get('email')!.valid) {
    const nouPressupost = this.pptoForm.value;
    console.log("Ptpo capturado: ",nouPressupost);
    this.BudgetService.guardarPpto(nouPressupost);
    this.pptoForm.reset();
    this.pptoForm.get('totPpto')?.reset(0);
    this.pptoForm.get('numPagines')?.reset(1);
    this.pptoForm.get('numIdiomes')?.reset(1);
  //} else {
   //Mostrar un mensaje al usuario indicando que hay errores en el formulario
   //console.log("Formulario no válido");
  //}
}

  // Validaciones
    nombreValido(control: FormControl): ValidationErrors | null {
    const regex = new RegExp(/^[a-zA-Záéíóúñ ]+$/);
    if (!regex.test(control.value)) {
      return { nombreInvalido: true };
    }
    return null;
  }

    telefonoValido(control: FormControl): ValidationErrors | null {
    const regex = new RegExp(/^[0-9]{9}$/);
    if (!regex.test(control.value)) {
      return { telefonoInvalido: true };
    }
    return null;
  }

    emailValido(control: FormControl): ValidationErrors | null {
    const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!regex.test(control.value)) {
      return { emailInvalido: true };
    }
    return null;
  }




}



