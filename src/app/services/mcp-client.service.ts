import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MCPClientService {
  private apiUrl = 'https://api.example.com/mcp'; // Base URL for MCP API

  constructor(private http: HttpClient) { }

  // Method to get data from the MCP API
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Method to send data to the MCP API
  sendData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/data`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Additional MCP methods can be added here
}