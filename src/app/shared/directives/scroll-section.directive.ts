import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

@Directive({
  selector: '[appScrollSection]',
})
export class ScrollSectionDirective {
  @Input('appScrollSection') id!: string | number;
  @Output()
  active = new EventEmitter();
  configs = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.active.emit(this.id);
      }
    });
  }, this.configs);
  constructor(
    public host: ElementRef<HTMLDivElement>,
    private manager: ScrollManagerDirective
  ) {}

  ngOnInit() {
    this.manager.register(this);
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.manager.remove(this);
    this.observer.disconnect();
  }

  scroll() {
    this.host.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
