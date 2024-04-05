import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import screenfull from 'screenfull';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @HostBinding('class') class = 'matero-header';
  @Input() showToggle = true;
  @Input() showBranding = false;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();
  msgToolTipMenu: string = "Abrir menu";
  isSidenavOpen: boolean = false;

  constructor() {
    this.updateTooltipMessage();
  }

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  onToggleSidenav() {
    this.toggleSidenav.emit();
    this.isSidenavOpen = !this.isSidenavOpen;
    this.updateTooltipMessage();
  }

  private updateTooltipMessage() {
    this.msgToolTipMenu = this.isSidenavOpen ? "Abrir menu" : "Ocultar menu";
  }
}
