import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalIpService {

  constructor() { }
  public getLocalIp(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const RTCPeerConnection = window.RTCPeerConnection || (window as any).mozRTCPeerConnection || (window as any).webkitRTCPeerConnection;

      if (!RTCPeerConnection) {
        reject('WebRTC is not supported by this browser.');
        return;
      }

      const pc = new RTCPeerConnection({
        iceServers: []
      });

      pc.createDataChannel('');

      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(error => reject(error));

      pc.onicecandidate = (event) => {
        if (event && event.candidate && event.candidate.candidate) {
          const candidate = event.candidate.candidate;
          const ipMatch = candidate.match(/(\d{1,3}\.){3}\d{1,3}/);
          if (ipMatch) {
            resolve(ipMatch[0]);
            pc.onicecandidate = null;
            pc.close();
          }
        }
      };
    });
  }
}
