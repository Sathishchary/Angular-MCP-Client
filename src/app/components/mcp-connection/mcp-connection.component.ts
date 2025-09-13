import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MCPService } from '../../services/mcp.service';
import { ConnectionState, TransportConfig } from '../../models/mcp.types';

@Component({
  selector: 'app-mcp-connection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="connection-panel">
      <h2>MCP Server Connection</h2>
      
      <div class="connection-form">
        <div class="form-group">
          <label for="serverUrl">Server URL:</label>
          <input 
            id="serverUrl"
            type="text" 
            [(ngModel)]="serverUrl" 
            placeholder="ws://localhost:8080/mcp"
            [disabled]="mcpService.connectionState() !== 'disconnected'"
          />
        </div>
        
        <div class="form-actions">
          @if (mcpService.connectionState() === 'disconnected') {
            <button 
              type="button"
              class="btn btn-primary"
              (click)="connect()"
              [disabled]="!serverUrl().trim()"
            >
              Connect
            </button>
          } @else if (mcpService.connectionState() === 'connecting') {
            <button type="button" class="btn btn-secondary" disabled>
              Connecting...
            </button>
          } @else if (mcpService.connectionState() === 'connected') {
            <button 
              type="button"
              class="btn btn-success"
              (click)="initialize()"
            >
              Initialize
            </button>
            <button 
              type="button"
              class="btn btn-danger"
              (click)="disconnect()"
            >
              Disconnect
            </button>
          } @else if (mcpService.connectionState() === 'initialized') {
            <button 
              type="button"
              class="btn btn-danger"
              (click)="disconnect()"
            >
              Disconnect
            </button>
          } @else if (mcpService.connectionState() === 'error') {
            <button 
              type="button"
              class="btn btn-primary"
              (click)="connect()"
            >
              Retry
            </button>
          }
        </div>
      </div>

      <div class="connection-status">
        <div class="status-item">
          <span class="label">Status:</span>
          <span class="status" [class]="'status-' + mcpService.connectionState()">
            {{ mcpService.connectionState() | titlecase }}
          </span>
        </div>
        
        @if (mcpService.serverInfo()) {
          <div class="status-item">
            <span class="label">Server:</span>
            <span>{{ mcpService.serverInfo().name }} v{{ mcpService.serverInfo().version }}</span>
          </div>
        }
        
        @if (mcpService.lastError()) {
          <div class="status-item error">
            <span class="label">Error:</span>
            <span>{{ mcpService.lastError() }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .connection-panel {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .connection-panel h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.5em;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #555;
    }

    .form-group input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group input:disabled {
      background-color: #f5f5f5;
      color: #999;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #1e7e34;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .connection-status {
      border-top: 1px solid #eee;
      padding-top: 15px;
    }

    .status-item {
      display: flex;
      margin-bottom: 8px;
    }

    .status-item .label {
      font-weight: 500;
      width: 80px;
      color: #555;
    }

    .status-disconnected {
      color: #6c757d;
    }

    .status-connecting {
      color: #ffc107;
    }

    .status-connected {
      color: #17a2b8;
    }

    .status-initialized {
      color: #28a745;
    }

    .status-error {
      color: #dc3545;
    }

    .status-item.error {
      color: #dc3545;
    }
  `]
})
export class MCPConnectionComponent {
  serverUrl = signal('ws://localhost:8080/mcp');

  constructor(public mcpService: MCPService) {}

  async connect(): Promise<void> {
    try {
      const config: TransportConfig = {
        type: 'websocket',
        url: this.serverUrl()
      };
      await this.mcpService.connect(config);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }

  async initialize(): Promise<void> {
    try {
      await this.mcpService.initialize();
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  }

  disconnect(): void {
    this.mcpService.disconnect();
  }
}