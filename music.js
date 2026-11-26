// Snowlight: an original, quietly looping Christmas-style instrumental.
// All instruments are synthesized locally; no recording or external service is loaded.
const beat=60/72;
const notes={G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,Fs4:369.99,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25};
const bars=[
 {chord:['G3','B3','D4'],melody:[['G4',1],['B4',1],['D5',1]]},
 {chord:['G3','B3','D4'],melody:[['B4',1.5],['A4',.5],['G4',1]]},
 {chord:['C4','E4','G4'],melody:[['E5',1],['D5',1],['B4',1]]},
 {chord:['D4','Fs4','A4'],melody:[['A4',2],['D5',1]]},
 {chord:['G3','B3','D4'],melody:[['B4',1],['D5',1],['E5',1]]},
 {chord:['C4','E4','G4'],melody:[['D5',1.5],['B4',.5],['G4',1]]},
 {chord:['A3','C4','E4'],melody:[['A4',1],['C5',1],['B4',1]]},
 {chord:['D4','Fs4','A4'],melody:[['A4',2.5],[null,.5]]},
 {chord:['C4','E4','G4'],melody:[['G4',1],['C5',1],['E5',1]]},
 {chord:['G3','B3','D4'],melody:[['D5',1.5],['B4',.5],['A4',1]]},
 {chord:['A3','C4','E4'],melody:[['C5',1],['B4',1],['G4',1]]},
 {chord:['D4','Fs4','A4'],melody:[['A4',2],['Fs4',1]]},
 {chord:['G3','B3','D4'],melody:[['G4',1],['B4',1],['D5',1]]},
 {chord:['C4','E4','G4'],melody:[['E5',1],['D5',1],['B4',1]]},
 {chord:['D4','Fs4','A4'],melody:[['A4',1],['Fs4',1],['A4',1]]},
 {chord:['G3','B3','D4'],melody:[['G4',2.5],[null,.5]]}
];
const score=[];
bars.forEach((bar,index)=>{const start=index*3;let offset=0;for(const [note,length] of bar.melody){if(note)score.push({time:(start+offset)*beat,frequency:notes[note],duration:length*beat,level:.14,bell:true});offset+=length;}bar.chord.forEach((note,i)=>score.push({time:(start+i)*beat,frequency:notes[note],duration:2.6*beat,level:.075,bell:false}));});
score.sort((a,b)=>a.time-b.time);
const loopDuration=bars.length*3*beat;
export function createChristmasMusic({onStateChange=()=>{},onUnavailable=()=>{}}={}){
 let context=null,master=null,timer=null,playing=false,initialized=false,volume=.2,cursor=0,loopStart=0,version=0;
 function notify(){onStateChange(playing);}
 function stopScheduler(){if(timer!==null){clearInterval(timer);timer=null;}}
 function note(event,time){
  const oscillator=context.createOscillator(),envelope=context.createGain();
  oscillator.type='sine';oscillator.frequency.value=event.frequency;
  const duration=Math.max(.2,event.duration),end=time+duration+.45;
  envelope.gain.setValueAtTime(.0001,time);envelope.gain.exponentialRampToValueAtTime(event.level,time+.035);envelope.gain.exponentialRampToValueAtTime(event.level*.35,time+duration*.4);envelope.gain.exponentialRampToValueAtTime(.0001,end);
  oscillator.connect(envelope);envelope.connect(master);oscillator.start(time);oscillator.stop(end+.02);
  oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();};
  if(event.bell){const overtone=context.createOscillator(),shimmer=context.createGain();overtone.type='sine';overtone.frequency.value=event.frequency*2;shimmer.gain.setValueAtTime(.0001,time);shimmer.gain.exponentialRampToValueAtTime(.025,time+.015);shimmer.gain.exponentialRampToValueAtTime(.0001,time+.7);overtone.connect(shimmer);shimmer.connect(master);overtone.start(time);overtone.stop(time+.72);overtone.onended=()=>{overtone.disconnect();shimmer.disconnect();};}
 }
 function schedule(){
  if(!playing||!context||context.state!=='running')return;
  try{const horizon=context.currentTime+.3;while(loopStart+score[cursor].time<horizon){const event=score[cursor];const time=loopStart+event.time;if(time>=context.currentTime-.05)note(event,Math.max(context.currentTime+.005,time));cursor++;if(cursor===score.length){cursor=0;loopStart+=loopDuration;}}}
  catch{playing=false;stopScheduler();if(context?.state==='running')context.suspend().catch(()=>{});notify();onUnavailable();}
 }
 async function play(){
  const request=++version;
  try{
   if(!context||context.state==='closed'){
    const Engine=window.AudioContext||window.webkitAudioContext;if(!Engine)throw new Error('Audio unavailable');
    context=new Engine();master=context.createGain();master.gain.value=volume*.35;master.connect(context.destination);initialized=false;
    context.addEventListener('statechange',()=>{if(playing&&context.state!=='running'){playing=false;version++;stopScheduler();notify();}});
   }
   await context.resume();
   if(request!==version||document.hidden){if(context.state==='running'&&!playing)await context.suspend();return;}
   if(context.state!=='running')throw new Error('Audio unavailable');
   if(!initialized){loopStart=context.currentTime+.08;cursor=0;initialized=true;}
   playing=true;schedule();if(playing){stopScheduler();timer=setInterval(schedule,100);}notify();
  }catch{if(request===version){playing=false;stopScheduler();notify();onUnavailable();}}
 }
 async function pause(){version++;playing=false;stopScheduler();notify();if(context?.state==='running'){try{await context.suspend();}catch{}}}
 function setVolume(value){const parsed=Number(value);if(!Number.isFinite(parsed))return;volume=Math.max(0,Math.min(1,parsed));if(master&&context.state!=='closed')master.gain.setTargetAtTime(volume*.35,context.currentTime,.05);}
 return {play,pause,setVolume,get playing(){return playing;}};
}
