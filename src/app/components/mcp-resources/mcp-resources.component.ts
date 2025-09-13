import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MCPService } from '../../services/mcp.service';
import { Resource, ResourceContent } from '../../models/mcp.types';

@Component({
  selector: 'app-mcp-resources',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resources-panel">
      <h2>Available Resources</h2>
      
      @if (mcpService.connectionState() !== 'initialized') {
        <div class="not-connected">
          <p>Connect and initialize MCP server to see available resources.</p>
        </div>
      } @else {
        @if (mcpService.resources().length === 0) {
          <div class="no-resources">
            <p>No resources available from the connected server.</p>
          </div>
        } @else {
          <div class="resources-list">
            @for (resource of mcpService.resources(); track resource.uri) {
              <div class="resource-card">
                <div class="resource-header">
                  <h3>{{ resource.name }}</h3>
                  <span class="resource-uri">{{ resource.uri }}</span>
                  @if (resource.description) {
                    <p class="resource-description">{{ resource.description }}</p>
                  }
                  @if (resource.mimeType) {
                    <span class="resource-mime">{{ resource.mimeType }}</span>
                  }
                </div>
                
                <div class="resource-actions">
                  <button 
                    type="button"
                    class="btn btn-primary"
                    (click)="readResource(resource)"
                    [disabled]="loadingResource() === resource.uri"
                  >
                    @if (loadingResource() === resource.uri) {
                      Loading...
                    } @else {
                      Read Resource
                    }
                  </button>
                </div>
                
                @if (resourceContents()[resource.uri]) {
                  <div class="resource-content">
                    <h4>Content:</h4>
                    <div class="content-display">
                      @if (resourceContents()[resource.uri].text) {
                        <pre class="text-content">{{ resourceContents()[resource.uri].text }}</pre>
                      } @else if (resourceContents()[resource.uri].blob) {
                        @if (isImage(resourceContents()[resource.uri].mimeType)) {
                          <img 
                            [src]="'data:' + resourceContents()[resource.uri].mimeType + ';base64,' + resourceContents()[resource.uri].blob" 
                            [alt]="resource.name"
                            class="blob-image"
                          />
                        } @else {
                          <div class="blob-content">
                            <p><strong>Binary content ({{ resourceContents()[resource.uri].mimeType }})</strong></p>
                            <p>Size: {{ getBlobSize(resourceContents()[resource.uri].blob!) }} bytes</p>
                          </div>
                        }
                      }
                    </div>
                  </div>
                }
                
                @if (resourceErrors()[resource.uri]) {
                  <div class="resource-error">
                    <h4>Error:</h4>
                    <p>{{ resourceErrors()[resource.uri] }}</p>
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
    .resources-panel {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .resources-panel h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.5em;
    }

    .not-connected, .no-resources {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .resources-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .resource-card {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 16px;
      background: #fafafa;
    }

    .resource-header h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.2em;
    }

    .resource-uri {
      display: inline-block;
      background: #e9ecef;
      color: #495057;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      margin-bottom: 8px;
    }

    .resource-description {
      margin: 8px 0;
      color: #666;
      font-style: italic;
    }

    .resource-mime {
      display: inline-block;
      background: #d1ecf1;
      color: #0c5460;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 500;
    }

    .resource-actions {
      margin: 16px 0;
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

    .resource-content {
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
      margin-top: 16px;
    }

    .resource-content h4 {
      margin: 0 0 8px 0;
      color: #555;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .content-display {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 12px;
      max-height: 400px;
      overflow: auto;
    }

    .text-content {
      margin: 0;
      font-size: 13px;
      white-space: pre-wrap;
      font-family: 'Courier New', monospace;
    }

    .blob-image {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    .blob-content {
      text-align: center;
      color: #666;
    }

    .blob-content p {
      margin: 8px 0;
    }

    .resource-error {
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
      margin-top: 16px;
    }

    .resource-error h4 {
      margin: 0 0 8px 0;
      color: #dc3545;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .resource-error p {
      margin: 0;
      color: #dc3545;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 8px;
    }
  `]
})
export class MCPResourcesComponent {
  resourceContents = signal<{ [key: string]: ResourceContent }>({});
  resourceErrors = signal<{ [key: string]: string }>({});
  loadingResource = signal<string | null>(null);

  constructor(public mcpService: MCPService) {}

  async readResource(resource: Resource): Promise<void> {
    try {
      this.loadingResource.set(resource.uri);
      this.resourceErrors.update(errors => {
        const newErrors = { ...errors };
        delete newErrors[resource.uri];
        return newErrors;
      });

      const content = await this.mcpService.readResource(resource.uri);
      
      this.resourceContents.update(contents => ({
        ...contents,
        [resource.uri]: content
      }));
      
    } catch (error) {
      this.resourceErrors.update(errors => ({
        ...errors,
        [resource.uri]: error instanceof Error ? error.message : 'Failed to read resource'
      }));
    } finally {
      this.loadingResource.set(null);
    }
  }

  isImage(mimeType?: string): boolean {
    return mimeType ? mimeType.startsWith('image/') : false;
  }

  getBlobSize(blob: string): number {
    // Estimate size from base64 string
    return Math.floor(blob.length * 0.75);
  }
}