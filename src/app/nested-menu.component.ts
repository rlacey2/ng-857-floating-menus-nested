import { 
  Component, 
  ElementRef, 
  viewChild, 
  input, 
  signal, 
  computed, 
  effect,
  HostListener,
  OnDestroy,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from './menu.model';

@Component({
  selector: 'app-nested-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-container" #containerRef>
      @if (isRoot()) {
        <button class="menu-trigger" (click)="toggleMenu($event)">
          <span>{{ label() || 'Menu' }}</span>
          <svg class="icon chevron" [class.open]="isOpen()" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </button>
      } @else {
        <div 
          class="menu-item" 
          [class.active]="isOpen()"
          (mouseenter)="onMouseEnter()"
          (mouseleave)="onMouseLeave()"
          (click)="onItemClick($event)"
        >
          <span class="menu-item-text">{{ item().label }}</span>
          @if (hasChildren()) {
            <svg class="icon chevron-right" viewBox="0 0 24 24">
              <path d="M10 17l5-5-5-5v10z"/>
            </svg>
          }
        </div>
      }

      @if (hasChildren() && isOpen()) {
        <div 
          class="menu-dropdown" 
          [class.root-dropdown]="isRoot()"
          [style.top.px]="coords().top"
          [style.left.px]="coords().left"
          (mouseenter)="onDropdownMouseEnter()"
          (mouseleave)="onDropdownMouseLeave()"
          #dropdownRef
        >
          @for (child of item().children; track child.label) {
            <app-nested-menu 
              [item]="child" 
              [isRoot]="false"
              (menuSelected)="onChildSelected($event)"
            />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; position: relative; font-family: system-ui, sans-serif; }
    .menu-container { position: relative; }
    
    .menu-trigger {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 16px; background: #2563eb; color: white;
      border: none; border-radius: 6px; cursor: pointer;
      font-weight: 500; transition: background 0.2s;
    }
    .menu-trigger:hover { background: #1d4ed8; }

    .menu-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px; color: #1f2937; cursor: pointer;
      white-space: nowrap; min-width: 180px; transition: background 0.15s;
    }
    .menu-item:hover, .menu-item.active { background: #f3f4f6; color: #2563eb; }
    
    .menu-dropdown {
      position: fixed; z-index: 9999;
      background: white; border: 1px solid #e5e7eb;
      border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      padding: 4px 0; display: flex; flex-direction: column;
    }

    .menu-dropdown:not(.root-dropdown)::before {
      content: '';
      position: absolute;
      top: -10px;
      bottom: -10px;
      left: -20px;
      right: 0;
      z-index: -1;
    }

    .icon { width: 20px; height: 20px; fill: currentColor; transition: transform 0.2s; }
    .chevron.open { transform: rotate(180deg); }
    
    @media (max-width: 768px) {
      .menu-dropdown { position: static; box-shadow: none; border: none; padding-left: 12px; }
      .menu-item { min-width: 100%; }
    }
  `]
})
export class NestedMenuComponent implements OnDestroy {
  item = input<MenuItem>({ label: '', children: [] });
  isRoot = input<boolean>(true);
  label = input<string>('');

  menuSelected = output<string>();

  isOpen = signal<boolean>(false);
  coords = signal<{ top: number; left: number }>({ top: 0, left: 0 });

  containerRef = viewChild<ElementRef<HTMLDivElement>>('containerRef');
  dropdownRef = viewChild<ElementRef<HTMLDivElement>>('dropdownRef');

  hasChildren = computed(() => !!this.item().children?.length);
  
  private openTimeout: any = null;
  private closeTimeout: any = null;

  constructor() {
    effect(() => {
      if (this.isOpen() && this.dropdownRef()) {
        setTimeout(() => this.calculatePosition());
      }
    });
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen.update(v => !v);
  }

  onMouseEnter() {
    if (this.isRoot()) return;
    this.clearCloseTimeout();
    this.openTimeout = setTimeout(() => {
      this.isOpen.set(true);
    }, 150);
  }

  onMouseLeave() {
    if (this.isRoot()) return;
    this.clearOpenTimeout();
    this.closeTimeout = setTimeout(() => {
      this.isOpen.set(false);
    }, 250);
  }

  onDropdownMouseEnter() {
    this.clearCloseTimeout();
  }

  onDropdownMouseLeave() {
    if (this.isRoot()) return;
    this.closeTimeout = setTimeout(() => {
      this.isOpen.set(false);
    }, 250);
  }

  onItemClick(event: MouseEvent) {
    if (this.hasChildren()) {
      event.stopPropagation();
      return;
    }
    const action = this.item().actionId || this.item().label;
    this.menuSelected.emit(action);
  }

  onChildSelected(actionId: string) {
    this.menuSelected.emit(actionId);
    if (this.isRoot()) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  closeMenuOutside(event: MouseEvent) {
    if (this.isRoot() && !this.containerRef()?.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  private clearOpenTimeout() {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
  }

  private clearCloseTimeout() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  ngOnDestroy() {
    this.clearOpenTimeout();
    this.clearCloseTimeout();
  }

  private calculatePosition() {
    const triggerEl = this.containerRef()?.nativeElement;
    const dropdownEl = this.dropdownRef()?.nativeElement;
    if (!triggerEl || !dropdownEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const dropdownRect = dropdownEl.getBoundingClientRect();
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    if (this.isRoot()) {
      top = triggerRect.bottom + 4;
      left = triggerRect.left;
      if (left + dropdownRect.width > viewWidth) {
        left = triggerRect.right - dropdownRect.width;
      }
    } else {
      top = triggerRect.top;
      left = triggerRect.right + 2;
      if (left + dropdownRect.width > viewWidth) {
        left = triggerRect.left - dropdownRect.width - 2;
      }
    }

    if (top + dropdownRect.height > viewHeight) {
      top = Math.max(10, viewHeight - dropdownRect.height - 10);
    }

    if (left < 0) left = 10;
    if (top < 0) top = 10;

    this.coords.set({ top, left });
  }
}