import { Component, OnInit } from '@angular/core';
import { LocalIpService } from '../services/local-ip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'userIp';
  localIp: string | undefined;

  constructor(private localIpService: LocalIpService) { }

  ngOnInit() {
    this.localIpService.getLocalIp()
      .then((ip: string | undefined) => this.localIp = ip)
      .catch((error: any) => console.error('Error fetching local IP:', error));
  }
}
