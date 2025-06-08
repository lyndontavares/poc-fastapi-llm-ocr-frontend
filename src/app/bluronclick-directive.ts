import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  standalone: true,
  selector: '[appBlurOnClick]'
})
export class BlurOnClickDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click')
  onClick(): void {
    this.el.nativeElement.blur();
  }
}