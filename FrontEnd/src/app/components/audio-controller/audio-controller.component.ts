import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-controller',
  templateUrl: './audio-controller.component.html',
  styleUrls: ['./audio-controller.component.scss']
})
export class AudioControllerComponent implements OnInit {

  //https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
  //https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBiquadFilter#examples
  constructor() { }

  ngOnInit(): void {

    const audioCtx = new AudioContext();
    var oscillateur  = audioCtx.createOscillator();

//set up the different audio nodes we will use for the app
const analyser = audioCtx.createAnalyser();
const distortion = audioCtx.createWaveShaper();
const gainNode = audioCtx.createGain();
const biquadFilter = audioCtx.createBiquadFilter();
const convolver = audioCtx.createConvolver();

    
oscillateur .connect(analyser);
analyser.connect(distortion);
distortion.connect(biquadFilter);
biquadFilter.connect(convolver);
convolver.connect(gainNode);
gainNode.connect(audioCtx.destination);

oscillateur.type = "sine"; // onde sinusoïdale — les autres valeurs possible sont : 'square', 'sawtooth', 'triangle' et 'custom'
oscillateur.frequency.value = 500; // valeur en hertz
gainNode.gain.value = 0.1;
biquadFilter.type = "lowshelf";
biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
oscillateur.start();
console.log(oscillateur);

  }

}
