import { Component, signal } from '@angular/core';
import { NestedMenuComponent } from './nested-menu.component';
import { MenuItem } from './menu.model';

// Define a strict type for the context context your actions receive
export interface ActionContext {
  actionId?: string;
  item?: MenuItem;   // use this if passing the full item object from the menu config
  timestamp: number;
}

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


  // 1. Define the action registry mapping IDs to method references
  /*

Why this approach is better

• O(1) Efficiency: Instead of evaluating case statements sequentially, JavaScript instantly grabs the key from memory.
• Open-Closed Principle: To add a new menu option in the future, you only need to add a single line to the actionRegistry object and write the method. You never have to touch your routing logic in handleMenuAction again.
• Strict Type Safety: By using Record<string, () => void>, TypeScript guarantees that every mapped action strictly adheres to a signature that accepts zero arguments and returns nothing.

  */
  // 1. Define the registry to accept the typed context parameter
  private readonly actionRegistry: Record<string, (context: ActionContext) => void> = {
    'CONFIG_ENV': (ctx) => this.loadEnvironmentVariables(ctx),
    'PERM_ADMIN': (ctx) => this.configureAdminRoles(ctx),
    'PERM_TOKEN': (ctx) => this.generateCollaboratorTokens(ctx),
    'SYS_STATUS': (ctx) => this.checkSystemStatus(ctx),
  };



  handleMenuAction(actionId: string) {
    // 1. Update the terminal UI
    this.terminalOutput.set(`Executed event action identifier: [${actionId}]`);

   let handlerApproach = 2 // 1 | 2

   if(handlerApproach === 1)  {
    // 2. Switch statement acting as your router
    switch (actionId) {
      case 'CONFIG_ENV':
        this.loadEnvironmentVariables(actionId);
        break;
      case 'PERM_ADMIN':
        this.configureAdminRoles(actionId);
        break;
      case 'PERM_TOKEN':
        this.generateCollaboratorTokens(actionId);
        break;
      case 'SYS_STATUS':
        this.checkSystemStatus(actionId);
        break;
      default:
        console.warn(`No action mapped for ID: ${actionId}`);
    }
  }
else
 if(handlerApproach === 2)  {
        // Update terminal output UI
    this.terminalOutput.set(`Executed event action identifier: [${actionId}]`);

    // 2. Build the contextual payload dynamically at runtime
    const context: ActionContext = {
     // item: item,
     actionId: actionId,
      timestamp: Date.now()
    };


    // 2. Look up and execute the action in a single line
    const action = this.actionRegistry[actionId];

    if (action) {
      action(context);
    } else {
      console.warn(`No registered method found for action identifier: [${actionId}]`);
    }
  }

}

  // Action Methods
  private loadEnvironmentVariables(context?:any) { /* Logic */  alert('implement: ' + context.actionId )}
  private configureAdminRoles(context?:any) { /* Logic */  alert('implement: ' + context.actionId)}
  private generateCollaboratorTokens(context?:any) { /* Logic */  alert('implement: ' + context.actionId)}
  private checkSystemStatus(context?:any) { /* Logic */  alert('implement: ' + context.actionId)}




  
}