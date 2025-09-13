import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MCPService } from '../../services/mcp.service';
import { Tool, ToolCallResponse } from '../../models/mcp.types';

@Component({
  selector: 'app-mcp-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tools-panel">
      <h2>Available Tools</h2>
      
      @if (mcpService.connectionState() !== 'initialized') {
        <div class="not-connected">
          <p>Connect and initialize MCP server to see available tools.</p>
        </div>
      } @else {
        @if (mcpService.tools().length === 0) {
          <div class="no-tools">
            <p>No tools available from the connected server.</p>
          </div>
        } @else {
          <div class="tools-list">
            @for (tool of mcpService.tools(); track tool.name) {
              <div class="tool-card">
                <div class="tool-header">
                  <h3>{{ tool.name }}</h3>
                  @if (tool.description) {
                    <p class="tool-description">{{ tool.description }}</p>
                  }
                </div>
                
                <div class="tool-schema">
                  <h4>Input Schema:</h4>
                  <pre>{{ formatSchema(tool.inputSchema) }}</pre>
                </div>
                
                <div class="tool-form">
                  <div class="form-group">
                    <label>Arguments (JSON):</label>
                    <textarea 
                      [(ngModel)]="toolArguments()[tool.name]"
                      placeholder='{"arg1": "value1", "arg2": "value2"}'
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div class="form-actions">
                    <button 
                      type="button"
                      class="btn btn-primary"
                      (click)="callTool(tool)"
                      [disabled]="isToolExecuting()"
                    >
                      @if (executingTool() === tool.name) {
                        Executing...
                      } @else {
                        Execute Tool
                      }
                    </button>
                  </div>
                </div>
                
                @if (toolResults()[tool.name]) {
                  <div class="tool-result">
                    <h4>Result:</h4>
                    <div class="result-content" [class.error]="toolResults()[tool.name].isError">
                      @for (content of toolResults()[tool.name].content; track $index) {
                        <div class="content-item" [class]="'content-' + content.type">
                          @if (content.type === 'text') {
                            <pre>{{ content.text }}</pre>
                          } @else if (content.type === 'image') {
                            <img [src]="'data:' + content.mimeType + ';base64,' + content.data" [alt]="'Tool result image'" />
                          } @else {
                            <div class="resource-content">
                              <strong>{{ content.type }}:</strong> {{ content.mimeType }}
                              @if (content.text) {
                                <pre>{{ content.text }}</pre>
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .tools-panel {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .tools-panel h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.5em;
    }

    .not-connected, .no-tools {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .tools-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .tool-card {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 16px;
      background: #fafafa;
    }

    .tool-header h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.2em;
    }

    .tool-description {
      margin: 0 0 12px 0;
      color: #666;
      font-style: italic;
    }

    .tool-schema {
      margin-bottom: 16px;
    }

    .tool-schema h4 {
      margin: 0 0 8px 0;
      color: #555;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tool-schema pre {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 8px;
      font-size: 12px;
      max-height: 150px;
      overflow-y: auto;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #555;
      font-size: 14px;
    }

    .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      resize: vertical;
    }

    .form-actions {
      margin-bottom: 16px;
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

    .tool-result {
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
    }

    .tool-result h4 {
      margin: 0 0 8px 0;
      color: #555;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .result-content {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 12px;
    }

    .result-content.error {
      background: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    .content-item {
      margin-bottom: 8px;
    }

    .content-item:last-child {
      margin-bottom: 0;
    }

    .content-text pre {
      margin: 0;
      font-size: 13px;
      white-space: pre-wrap;
    }

    .content-image img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    .resource-content {
      font-size: 13px;
    }

    .resource-content pre {
      margin: 8px 0 0 0;
      font-size: 12px;
      background: white;
      border: 1px solid #dee2e6;
      padding: 8px;
      border-radius: 3px;
    }
  `]
})
export class MCPToolsComponent {
  toolArguments = signal<{ [key: string]: string }>({});
  toolResults = signal<{ [key: string]: ToolCallResponse }>({});
  executingTool = signal<string | null>(null);

  constructor(public mcpService: MCPService) {}

  formatSchema(schema: any): string {
    return JSON.stringify(schema, null, 2);
  }

  isToolExecuting(): boolean {
    return this.executingTool() !== null;
  }

  async callTool(tool: Tool): Promise<void> {
    try {
      this.executingTool.set(tool.name);
      
      let args: any = undefined;
      const argString = this.toolArguments()[tool.name];
      
      if (argString && argString.trim()) {
        try {
          args = JSON.parse(argString);
        } catch (error) {
          throw new Error('Invalid JSON in arguments field');
        }
      }

      const result = await this.mcpService.callTool(tool.name, args);
      
      this.toolResults.update(results => ({
        ...results,
        [tool.name]: result
      }));
      
    } catch (error) {
      const errorResult: ToolCallResponse = {
        content: [{
          type: 'text',
          text: error instanceof Error ? error.message : 'Unknown error occurred'
        }],
        isError: true
      };
      
      this.toolResults.update(results => ({
        ...results,
        [tool.name]: errorResult
      }));
    } finally {
      this.executingTool.set(null);
    }
  }
}