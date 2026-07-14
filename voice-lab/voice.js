const textEl=document.getElementById('voiceText');
const unlockBtn=document.getElementById('unlockBtn');
const autoBtn=document.getElementById('autoBtn');
const speakBtn=document.getElementById('speakBtn');
const mp3Btn=document.getElementById('mp3Btn');
const dinoBtn=document.getElementById('dinoBtn');
const audio=document.getElementById('fallbackAudio');
const logEl=document.getElementById('log');
let audioContext=null;
let unlocked=false;
let autoMode=false;
let lastPayloadId=localStorage.getItem('severin_voice_lab_last_id')||'';
let pollTimer=null;

function log(message){
  const stamp=new Date().toLocaleTimeString('ru-RU');
  logEl.textContent=`[${stamp}] ${message}\n`+logEl.textContent;
}

function getAudioContext(){
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx)return null;
  if(!audioContext)audioContext=new Ctx();
  return audioContext;
}

async function unlockAudio(){
  const ctx=getAudioContext();
  if(ctx&&ctx.state==='suspended')await ctx.resume();
  try{
    audio.muted=true;
    audio.currentTime=0;
    await audio.play();
    audio.pause();
    audio.currentTime=0;
    audio.muted=false;
  }catch(error){
    log(`MP3 unlock warning: ${error.message}`);
  }
  unlocked=true;
  log('Звук разбужен. ТВ больше не имеет права притворяться мебелью.');
}

function pickVoice(){
  const voices=window.speechSynthesis?.getVoices?.()||[];
  return voices.find(v=>v.lang?.toLowerCase().startsWith('ru'))||voices.find(v=>v.name?.toLowerCase().includes('google'))||voices[0]||null;
}

function speakNative(text){
  return new Promise((resolve,reject)=>{
    if(!('speechSynthesis'in window)||!window.SpeechSynthesisUtterance){
      reject(new Error('speechSynthesis is not available'));
      return;
    }
    const utterance=new SpeechSynthesisUtterance(text);
    const voice=pickVoice();
    if(voice)utterance.voice=voice;
    utterance.lang=voice?.lang||'ru-RU';
    utterance.rate=.92;
    utterance.pitch=.72;
    utterance.volume=1;
    let started=false;
    let finished=false;
    const failTimer=window.setTimeout(()=>{
      if(!started&&!finished){
        finished=true;
        window.speechSynthesis.cancel();
        reject(new Error('TTS timeout: browser accepted utterance but stayed silent'));
      }
    },1800);
    utterance.onstart=()=>{
      started=true;
      log('Native TTS стартовал. Если слышно — этот браузер сегодня не овощ.');
    };
    utterance.onend=()=>{
      if(finished)return;
      finished=true;
      window.clearTimeout(failTimer);
      resolve();
    };
    utterance.onerror=event=>{
      if(finished)return;
      finished=true;
      window.clearTimeout(failTimer);
      reject(new Error(event.error||'TTS error'));
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

async function playMp3(){
  audio.muted=false;
  audio.currentTime=0;
  await audio.play();
  log('MP3 fallback запущен. Динозавр вышел из юрского периода.');
}

async function playAudioUrl(url){
  if(!url)throw new Error('empty audio url');
  const cleanUrl=String(url);
  const cacheBuster=cleanUrl.includes('?')?'&ts=':'?ts=';
  audio.src=cleanUrl+cacheBuster+Date.now();
  audio.muted=false;
  audio.currentTime=0;
  await audio.play();
  log('Готовый аудиофайл запущен: '+cleanUrl);
}

function playDinoTone(){
  const ctx=getAudioContext();
  if(!ctx){
    log('WebAudio недоступен. Этот браузер даже динозавра не достоин.');
    return;
  }
  const now=ctx.currentTime;
  const master=ctx.createGain();
  master.gain.setValueAtTime(.0001,now);
  master.gain.exponentialRampToValueAtTime(.28,now+.04);
  master.gain.exponentialRampToValueAtTime(.0001,now+1.1);
  master.connect(ctx.destination);
  [62,78,93].forEach((freq,index)=>{
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type=index===0?'sawtooth':'square';
    osc.frequency.setValueAtTime(freq,now);
    osc.frequency.exponentialRampToValueAtTime(freq*.55,now+1);
    gain.gain.value=index===0?.8:.22;
    osc.connect(gain);
    gain.connect(master);
    osc.start(now+index*.035);
    osc.stop(now+1.12);
  });
  log('WebAudio динозавр: РРР. Не красиво, зато живой.');
}

async function speakText(text){
  if(!text||!text.trim()){
    log('Пустая фраза. Северин не будет озвучивать вакуум, он и так вокруг.');
    return;
  }
  if(!unlocked)await unlockAudio();
  try{
    await speakNative(text.trim());
    log('Готово через native TTS.');
    return;
  }catch(error){
    log(`Native TTS сорвался: ${error.message}`);
  }
  try{
    await playMp3();
    return;
  }catch(error){
    log(`MP3 fallback сорвался: ${error.message}`);
  }
  playDinoTone();
}

async function speakPayload(data){
  if(!unlocked)await unlockAudio();
  const audioUrl=data.audioUrl||data.audio_url||data.audio||'';
  if(audioUrl){
    try{
      await playAudioUrl(audioUrl);
      return;
    }catch(error){
      log(`Готовый audioUrl сорвался: ${error.message}`);
    }
  }
  await speakText(data.text||'');
}

async function speakWithFallback(){
  await speakText(textEl.value);
}

async function pollLatest(){
  try{
    const res=await fetch('./latest.json?ts='+Date.now(),{cache:'no-store'});
    if(!res.ok)throw new Error('HTTP '+res.status);
    const data=await res.json();
    if(data.text)textEl.value=data.text;
    if(autoMode&&data.speak&&data.id&&data.id!==lastPayloadId){
      lastPayloadId=data.id;
      localStorage.setItem('severin_voice_lab_last_id',lastPayloadId);
      log('Новый ответ получен: '+lastPayloadId);
      await speakPayload(data);
    }else if(autoMode){
      log('Жду новый ответ. Последний id: '+(lastPayloadId||'пока нет'));
    }
  }catch(error){
    log('Не могу прочитать latest.json: '+error.message);
  }
}

async function startAutoMode(){
  autoMode=true;
  await unlockAudio();
  log('Автоозвучка включена. Теперь жду новые ответы из latest.json.');
  await pollLatest();
  clearInterval(pollTimer);
  pollTimer=setInterval(pollLatest,2500);
}

unlockBtn.addEventListener('click',unlockAudio);
if(autoBtn)autoBtn.addEventListener('click',startAutoMode);
speakBtn.addEventListener('click',speakWithFallback);
mp3Btn.addEventListener('click',()=>playMp3().catch(error=>log(`MP3 error: ${error.message}`)));
dinoBtn.addEventListener('click',playDinoTone);

if('speechSynthesis'in window){
  window.speechSynthesis.onvoiceschanged=()=>{
    const voice=pickVoice();
    log(`Голоса обновлены: ${voice?`${voice.name} / ${voice.lang}`:'ничего подходящего'}`);
  };
}

log(`speechSynthesis: ${'speechSynthesis'in window?'есть':'нет'}`);
log(`AudioContext: ${getAudioContext()?'есть':'нет'}`);
pollLatest();
pollTimer=setInterval(pollLatest,2500);
