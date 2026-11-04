import { Component, signal } from '@angular/core';
import { NestedMenuComponent } from './nested-menu.component';
import { MenuItem } from './menu.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NestedMenuComponent],
  template: `
    <header class="navbar">
      <div class="logo">SignalsApp</div>
      
      <nav class="nav-links">
        <a href="#">Dashboard</a>
        <a href="#">Analytics</a>
      </nav>

      <div class="navbar-right">
        <app-nested-menu 
          label="Workspace" 
          [item]="menuData()" 
          [isRoot]="true"
          (menuSelected)="handleMenuAction($event)"
        />
      </div>
    </header>

    <main class="content-frame">
      <h1>Hello World!</h1>
      <p>Angular Signals-driven recursive layout engine initialized.</p>
      <div class="alert-box">
        Active System State: <strong>{{ terminalOutput() }}</strong>
      </div>
    </main>
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px; height: 64px; background: white;
      border-bottom: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .logo { font-weight: 700; font-size: 1.25rem; color: #1e293b; }
    .nav-links { display: flex; gap: 20px; margin-left: 40px; margin-right: auto; }
    .nav-links a { text-decoration: none; color: #475569; font-weight: 500; }
    .nav-links a:hover { color: #1e293b; }
    .navbar-right { display: flex; align-items: center; }

    .content-frame { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
    h1 { color: #0f172a; font-size: 2.25rem; margin-bottom: 8px; }
    p { color: #64748b; font-size: 1.1rem; }
    
    .alert-box { padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; color: #166534; font-family: monospace; margin-top: 16px; }

    @media (max-width: 768px) {
      .nav-links { display: none; }
    }
  `]
})
export class AppComponent {
  terminalOutput = signal<string>('Awaiting user input selection...');

  menuData = signal<MenuItem>({
    label: 'Root',
    children: [
      { 
        label: 'Project Settings',
        children: [
          { label: 'Environment Variables', actionId: 'CONFIG_ENV' },
          { 
            label: 'Access Control',
            children: [
              { label: 'Admin Roles', actionId: 'PERM_ADMIN' },
              { label: 'Collaborator Tokens', actionId: 'PERM_TOKEN' }
            ]
          }
        ]
      },
      { label: 'System Status', actionId: 'SYS_STATUS' }
    ]
  });

  handleMenuAction(actionId: string) {
    this.terminalOutput.set(`Executed event action identifier: [${actionId}]`);
  }
}