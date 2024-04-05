import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  playAudio(soundPath: string) {
    this.audio.src = soundPath;
    this.audio.load();
    this.audio.play();
  }
}
