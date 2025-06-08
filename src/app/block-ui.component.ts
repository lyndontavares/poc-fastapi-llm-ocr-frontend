import {Input, Component, Renderer2, ElementRef, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-block-ui',
  template: `

  
    <div id="blocker" class="blocker" *ngIf="showIf">
 
     <div class="loader">
     </div> 
           <div class="spinner-text">Processando extração...</div>


    <!-- http://cfoucht.com/loadlab/ -->
    <!-- https://codepen.io/mrsahar/pen/pMxyrE -->
    <!-- https://webkul.github.io/csspin/ -->
      <!-- https://vineethtrv.github.io/loader/ -->
      <!-- <span class="loader"></span> -->
      <!-- <mat-spinner color="primary" [diameter]="diameter"></mat-spinner> -->
    </div>
    <ng-content class="content"></ng-content>

  `,
  styles: [`

.spinner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #4169e1; /* azul royal */
  font-size: 2rem; /* fonte grande */
  font-weight: bold;
  font-family: 'Segoe UI', Roboto, sans-serif;
  text-align: center;
  text-shadow: 0 0 8px #4169e1, 0 0 12px #1a237e;
  z-index: 3;
  pointer-events: none;
}
    
.loader {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
  border: 4px solid #0000;
  border-radius: 50%;
  border-color: #ccc #0000;
  animation: l16 1s infinite linear;
}
.loader::before,
.loader::after {    
  content: "";
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
}
.loader::before {
  border-color: #f03355 #0000;
  animation: inherit; 
  animation-duration: .5s;
  animation-direction: reverse;
}
.loader::after {
  margin: 8px;
}
@keyframes l16 { 
  100%{transform: rotate(1turn)}
}

/*     :host {
      position: relative;
      display: inline-block;
    } */
    .blocker {
      display:flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left:0px;
      top:0px;
      width: 100%;
      height: 100%;
      z-index: 999;
      /*background-color: #fff;*/
      /*background-color: #e3e3e3;*/
      background-color: rgba(255, 255, 255, 0.4);
      opacity: 0.6;
    }
  `],
})
export class BlockUIComponent {
  @Input('showIf') showIf: boolean;
  diameter: number = 60;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // spinner block
    let blocker: any = this.el.nativeElement.querySelector('.blocker');

    // user element
    let firstChild: any = Array.from(this.el.nativeElement.children)
      .find(el => el !== blocker);

    if (firstChild) { //if text, this is null
      let firstChildStyle = window.getComputedStyle(firstChild);
      // if user element is a block, change this element to block
      if (firstChildStyle.display === 'block') {
        this.el.nativeElement.style.display = 'block'
      };
      // if user element has borderRadius, make blocker the same
      if (blocker && firstChildStyle.borderRadius) {
        blocker.style.borderRadius = firstChildStyle.borderRadius;
      }
      // if the user element is big, change the spinner size bigger
      if (parseInt(firstChild.style.height,10) >= 200) {
        this.diameter = 40;
        this.changeDetector.detectChanges();
      }
    }
  }

}
