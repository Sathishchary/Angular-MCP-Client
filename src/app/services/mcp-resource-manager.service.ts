import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class McpResourceManagerService {

  constructor() { }

  // Add your resource management logic here
  getResources() {
    // Logic to fetch resources
  }

  addResource(resource: any) {
    // Logic to add a resource
  }

  // Other resource methods can be added here
}