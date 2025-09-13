import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MCPConnectionComponent } from './components/mcp-connection/mcp-connection.component';
import { MCPToolsComponent } from './components/mcp-tools/mcp-tools.component';
import { MCPResourcesComponent } from './components/mcp-resources/mcp-resources.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MCPConnectionComponent, MCPToolsComponent, MCPResourcesComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Angular MCP Client');
}
