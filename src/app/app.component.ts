// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   localIP: string | undefined;

//   ngOnInit() {
//     this.getLocalIP().then(ip => {
//       this.localIP = ip;
//       console.log('Local IP:', ip);
//     }).catch(error => {
//       console.error('Failed to get local IP:', error);
//     });
//   }

//   private async getLocalIP(): Promise<string | undefined> {
//     return new Promise((resolve, reject) => {
//       const RTCPeerConnection = window.RTCPeerConnection || (window as any).mozRTCPeerConnection || (window as any).webkitRTCPeerConnection;
//       if (!RTCPeerConnection) {
//         reject('WebRTC not supported');
//         return;
//       }

//       const rtc = new RTCPeerConnection({ iceServers: [] });
//       rtc.createDataChannel(''); // Create a dummy data channel

//       rtc.onicecandidate = (event) => {
//         if (event.candidate) {
//           const ip = this.extractIP(event.candidate.candidate);
//           if (ip) {
//             resolve(ip);
//             rtc.close(); // Close the connection once the IP is found
//           }
//         }
//       };

//       rtc.createOffer().then(offerDesc => {
//         rtc.setLocalDescription(offerDesc);
//       }).catch(reject);

//       setTimeout(() => {
//         const sdp = rtc.localDescription?.sdp || '';
//         const lines = sdp.split('\n');
//         for (const line of lines) {
//           const ip = this.extractIP(line);
//           if (ip) {
//             resolve(ip);
//             rtc.close(); // Close the connection once the IP is found
//             break;
//           }
//         }
//         reject('IP address not found');
//       }, 1000);
//     });
//   }

//   private extractIP(candidate: string): string | null {
//     const parts = candidate.split(' ');
//     if (parts.length > 4 && parts[7] === 'host') {
//       return parts[4];
//     }
//     return null;
//   }
// }






// app.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  localIP: string | undefined;
  resolvedIP: string | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getLocalIP().then(ip => {
      this.localIP = ip;
      console.log('Local IP:', ip);
    }).catch(error => {
      console.error('Failed to get local IP:', error);
    });

    this.getResolvedIP().subscribe(
      data => {
        this.resolvedIP = data.ip;
        console.log('Resolved IP:', this.resolvedIP);
      },
      error => {
        console.error('Failed to get IP from proxy:', error);
      }
    );
  }

  private async getLocalIP(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const RTCPeerConnection = window.RTCPeerConnection || (window as any).mozRTCPeerConnection || (window as any).webkitRTCPeerConnection;
      if (!RTCPeerConnection) {
        reject('WebRTC not supported');
        return;
      }

      const rtc = new RTCPeerConnection({ iceServers: [] });
      rtc.createDataChannel(''); // Create a dummy data channel

      rtc.onicecandidate = (event) => {
        if (event.candidate) {
          const ip = this.extractIP(event.candidate.candidate);
          if (ip) {
            resolve(ip);
            rtc.close(); // Close the connection once the IP is found
          }
        }
      };

      rtc.createOffer().then(offerDesc => {
        rtc.setLocalDescription(offerDesc);
      }).catch(reject);

      setTimeout(() => {
        const sdp = rtc.localDescription?.sdp || '';
        const lines = sdp.split('\n');
        for (const line of lines) {
          const ip = this.extractIP(line);
          if (ip) {
            resolve(ip);
            rtc.close(); // Close the connection once the IP is found
            break;
          }
        }
        reject('IP address not found');
      }, 1000);
    });
  }

  private extractIP(candidate: string): string | null {
    const parts = candidate.split(' ');
    if (parts.length > 4 && parts[7] === 'host') {
      return parts[4];
    }
    return null;
  }

  private getResolvedIP() {
    const url = 'https://www.google.com'; // Your proxy server URL
    return this.http.get<{ ip: string }>(url);
  }
}
