'use strict';
/* BARRE : progressive, local-only calisthenics tracker. No external services. */
const KEY='barre-calisthenics-v1';
const APP_VERSION='4.0';
const CHECKPOINT_KEY=KEY+'-checkpoint';
const PREVIOUS_KEY=KEY+'-previous';
const WEEKS=[
  {label:'Adaptation',slots:['A','B'],tier:0,volume:0,tip:'Commence doucement. Garde 2 répétitions en réserve sur chaque série.'},
  {label:'Consolider',slots:['B','A'],tier:0,volume:0,tip:'Privilégie la qualité du mouvement. Ajoute 1 répétition seulement si tout est facile.'},
  {label:'Développer',slots:['A','B','A'],tier:1,volume:1,tip:'Troisième séance possible uniquement si la récupération et les symptômes le permettent.'},
  {label:'Alléger',slots:['B','A'],tier:0,volume:-1,tip:'Semaine de récupération. Moins de séries, technique propre, jamais d’échec.'},
  {label:'Force',slots:['B','A','B'],tier:1,volume:1,tip:'Conserve une amplitude contrôlée. Deux répétitions en réserve.'},
  {label:'Progresser',slots:['A','B','A'],tier:1,volume:1,tip:'Augmente les répétitions uniquement après plusieurs séances bien tolérées.'},
  {label:'Consolider',slots:['B','A','B'],tier:2,volume:1,tip:'Stabilise les progrès. Pas de variante explosive ou lestée dans ce cycle.'},
  {label:'Bilan',slots:['A','B'],tier:0,volume:-1,tip:'Volume réduit. Bilan sans test maximal obligatoire.'}
];
const EXERCISES={
 pullP:{name:'Tractions pronation',short:'Dos · Biceps',icon:'↑',unit:'rép.',baseSets:3,base:3,kind:'pull',details:'Prise pronation, épaules contrôlées et mouvement strict. Évite les à-coups et ne cherche pas à tenir une suspension prolongée. Barre parfaitement fixée.'},
 dipAssist:{name:'Dips assistés',short:'Pectoraux · Triceps',icon:'⇵',unit:'rép.',baseSets:2,base:5,kind:'dip',details:'Utilise uniquement des barres à dips solides et stables. Garde un appui stable des pieds si possible, épaules abaissées, coudes contrôlés, amplitude confortable et tronc gainé. Ne descends pas très bas, ne balance pas les jambes. Si impossible de t’aider avec les pieds ou si douleur à l’épaule, choisis les pompes dans les réglages.'},
 dipStrict:{name:'Dips stricts',short:'Pectoraux · Triceps',icon:'⇵',unit:'rép.',baseSets:2,base:3,kind:'dip',details:'Seulement si tu maîtrises déjà plusieurs dips propres sur des barres stables. Épaules contrôlées, légère inclinaison confortable, pas de rebond ni de descente excessive ; évite de cambrer ou balancer les jambes. Arrête si douleur à l’épaule, au sternum, au dos ou irradiation dans la jambe.'},
 push:{name:'Pompes classiques',short:'Pectoraux · Triceps',icon:'↗',unit:'rép.',baseSets:2,base:8,details:'Mains légèrement plus larges que les épaules, tronc stable. Variante genoux au sol si nécessaire. Stoppe en cas de douleur irradiant dans la jambe.'},
 squat:{name:'Squats contrôlés',short:'Cuisses · Fessiers',icon:'↧',unit:'rép.',baseSets:2,base:12,details:'Descends dans une amplitude confortable, sans arrondir de force le dos. Remonte sans à-coups. Réduis l’amplitude si besoin.'},
 bird:{name:'Bird-dog',short:'Stabilité du tronc',icon:'✳',unit:'rép./côté',baseSets:2,base:6,details:'À quatre pattes, étends doucement un bras et la jambe opposée sans rotation du bassin. Reste dans une amplitude indolore.'},
 calves:{name:'Élévations de mollets',short:'Mollets · Chevilles',icon:'↥',unit:'rép.',baseSets:2,base:15,details:'Debout près d’un mur pour l’équilibre, monte puis redescends lentement sur la pointe des pieds.'},
 pullS:{name:'Tractions supination',short:'Biceps · Grand dorsal',icon:'↑',unit:'rép.',baseSets:3,base:3,kind:'pull',details:'Paumes vers toi, poignets confortables, coude contrôlé. Si cette prise gêne, remplace par des tractions pronation faciles.'},
 rowIncline:{name:'Tractions australiennes inclinées',short:'Milieu du dos · Arrière des épaules',icon:'↔',unit:'rép.',baseSets:2,base:8,kind:'row',details:'Barre basse solidement ancrée et conçue pour supporter une traction horizontale : jamais une barre de porte non prévue pour cet usage. Pieds fermement au sol, genoux fléchis si cela aide à garder un tronc confortable, corps aligné, tire la poitrine vers la barre sans à-coup. Plus le corps est vertical, plus le mouvement est facile. Interromps en cas de gêne lombaire, de douleur dans la jambe ou de fourmillements.'},
 rowHorizontal:{name:'Tractions australiennes horizontales',short:'Milieu du dos · Biceps · Omoplates',icon:'↔',unit:'rép.',baseSets:2,base:6,kind:'row',details:'Variante plus exigeante, seulement avec un support très stable adapté au tirage horizontal. Pieds en appui sûr, tronc aligné sans cambrure forcée, coudes contrôlés, omoplates mobiles, aucun balancement. N’augmente pas l’inclinaison si cela provoque douleur lombaire ou irradiation dans la jambe.'},
 pike:{name:'Pompes en V',short:'Épaules · Triceps',icon:'◆',unit:'rép.',baseSets:2,base:6,details:'Bassin relevé, descends les épaules progressivement. Remplace par des pompes classiques si la position gêne le dos.'},
 lunge:{name:'Fentes arrière',short:'Cuisses · Équilibre',icon:'↙',unit:'rép./jambe',baseSets:2,base:8,details:'Recule un pied, descends verticalement à ton amplitude confortable. Utilise un appui stable si nécessaire.'},
 bridge:{name:'Pont fessier',short:'Fessiers · Hanches',icon:'⌒',unit:'rép.',baseSets:2,base:12,details:'Allongé sur le dos, genoux fléchis, relève doucement le bassin avec les fessiers. Ne cambre pas le bas du dos.'},
 side:{name:'Gainage latéral',short:'Stabilité latérale',icon:'▰',unit:'s/côté',baseSets:2,base:20,details:'En appui sur le coude, garde le corps aligné. Variante genoux fléchis. Arrête si la douleur descend dans la jambe.'}
};
EXERCISES.squatTempo={name:'Squats tempo (3 secondes)',short:'Cuisses · Contrôle',icon:'↧',unit:'rép.',baseSets:2,base:8,kind:'leg',details:'Descends pendant environ 3 secondes, sans aller au-delà de ton amplitude confortable. Remonte normalement sans à-coup. Ne force pas si une douleur descend dans la jambe.'};
EXERCISES.bridgeSingle={name:'Pont fessier unilatéral',short:'Fessiers · Stabilité',icon:'⌒',unit:'rép./côté',baseSets:2,base:6,kind:'leg',details:'En appui sur un pied, relève doucement le bassin sans tourner ni cambrer. Réduis le mouvement ou reviens au pont bilatéral si la position gêne ton dos ou déclenche des symptômes.'};
const TYPES={A:['pullP','push','squat','bird','calves'],B:['pullS','pike','lunge','bridge','side']};
// Les dips remplacent les pompes de la séance A : pas de volume de poussée supplémentaire non prévu.
function exerciseList(type){
 const squat=store.settings.legVariant==='control'?'squatTempo':'squat';
 const bridge=store.settings.legVariant==='control'?'bridgeSingle':'bridge';
 if(type==='A')return [ 'pullP', store.settings.dipsEnabled!==false?(store.settings.dipsMode==='strict'?'dipStrict':'dipAssist'):'push',squat,'bird','calves'];
 if(type==='B')return [ 'pullS', ...(store.settings.rowsEnabled!==false?[store.settings.rowsMode==='horizontal'?'rowHorizontal':'rowIncline']:[]),'pike','lunge',bridge,'side'];
 return TYPES[type]||[];
}
const TODAY=()=>{let d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const fresh=()=>({version:1,createdAt:new Date().toISOString(),settings:{startDate:TODAY(),baselinePullups:6,baselineDips:0,baselineRows:0,baselinePushups:0,baselineSquats:0,frequency:2,legVariant:'standard',onboarded:false,homeShowRecovery:true,homeShowGoals:true,homeShowOverview:true,medicalClearance:false,dipsEnabled:true,dipsMode:'assist',rowsEnabled:true,rowsMode:'incline',cycle:1,goalPullups:10,goalDips:8,goalRows:12,guided:true},sessions:[],checkins:[],weeklyReviews:{},recovery:[],postponed:{},restEnd:0,draft:null});
function dataShape(x){return x&&x.version===1&&x.settings&&Array.isArray(x.sessions)&&Array.isArray(x.checkins)&&x.weeklyReviews&&typeof x.weeklyReviews==='object'&&!Array.isArray(x.weeklyReviews)}
function normalized(x){const base=fresh();return {...base,...x,settings:{...base.settings,...x.settings},recovery:Array.isArray(x.recovery)?x.recovery:[],postponed:x.postponed&&typeof x.postponed==='object'&&!Array.isArray(x.postponed)?x.postponed:{}}}
function load(){
 for(const key of [KEY,CHECKPOINT_KEY,PREVIOUS_KEY]){
  try{const raw=localStorage.getItem(key);if(!raw)continue;const x=JSON.parse(raw);if(dataShape(x)&&validImport(x)){
    if(key!==KEY){window.__barreRecoveredFrom=key;try{localStorage.setItem(KEY,raw)}catch(e){/* espace indisponible */}}
    return normalized(x);
  }}catch(e){console.warn('Stockage non lisible',key,e)}
 }
 return fresh();
}
let store=load();let ui={tab:'home',statsExercise:'pullP',statsScope:'cycle',assessmentDraft:null,week:currentWeek(),modal:null,safety:null,finish:{effort:3,after:null,note:''},timerEnd:Number(store.restEnd)||0,tip:null,focus:0,muscle:'dos',reviewWeek:1,postpone:null,recoveryDraft:{sleep:3,fatigue:3,soreness:2,pain:'none',tingling:'none'}};
let toastTimer=0;
let lastSaved=JSON.stringify(store);
let lastStorageRaw=(()=>{try{return localStorage.getItem(KEY)}catch{return null}})();
let storageError=false;
let storageWarning='';
let modalPreviousFocus=null;
let lastModalWasOpen=false;
let interruptedDraft=false;
let focusBeforeModal=null;
const $=sel=>document.querySelector(sel);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function clamp(n,min,max){return Math.min(max,Math.max(min,n))}
const num=n=>Number.isFinite(+n)?+n:0;
function persist(){
 const serialized=JSON.stringify(store);
 try{
  const before=localStorage.getItem(KEY);
  if(before!==lastStorageRaw){store=normalized(JSON.parse(lastSaved));storageError=true;notify('Données modifiées dans un autre onglet. Recharge avant de continuer.');return false;}
  localStorage.setItem(KEY,serialized);
  if(localStorage.getItem(KEY)!==serialized)throw new Error('Vérification écriture échouée');
  lastSaved=serialized;lastStorageRaw=serialized;storageError=false;storageWarning='';
  try{if(before&&before!==serialized)localStorage.setItem(PREVIOUS_KEY,before);localStorage.setItem(CHECKPOINT_KEY,serialized)}catch(e){storageWarning='Copie locale secondaire indisponible : exporte régulièrement.'}
  queueIdbBackup(serialized);
  return true;
 }catch(error){
  storageError=true;
  try{store=normalized(JSON.parse(lastSaved))}catch(e){store=fresh()}
  const msg='Enregistrement impossible : la modification a été annulée. Exporte ta sauvegarde et vérifie le stockage.';
  notify(msg);if(typeof alert==='function')alert(msg);
  return false;
 }
}
// IndexedDB est une copie de secours opportuniste : localStorage demeure la source canonique.
function queueIdbBackup(serialized){
 if(typeof indexedDB==='undefined')return;
 try {
  const req=indexedDB.open('barre-backup',1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('snapshots'))req.result.createObjectStore('snapshots')};
  req.onsuccess=()=>{const db=req.result;try{const tx=db.transaction('snapshots','readwrite');tx.objectStore('snapshots').put({savedAt:new Date().toISOString(),data:serialized},'latest');tx.oncomplete=()=>db.close();tx.onerror=()=>db.close()}catch(e){db.close()}};
 }catch(e){console.warn('Sauvegarde secondaire non disponible',e)}
}
function offerBackupRecovery(){
 if(typeof indexedDB==='undefined')return;
 try{
  const req=indexedDB.open('barre-backup',1);
  req.onsuccess=()=>{const db=req.result; if(!db.objectStoreNames.contains('snapshots')){db.close();return}
   const tx=db.transaction('snapshots','readonly');const read=tx.objectStore('snapshots').get('latest');
   read.onsuccess=()=>{const item=read.result;db.close();if(!item||!item.data)return;
    const current=localStorage.getItem(KEY);if(current){try{if(validImport(JSON.parse(current)))return}catch(e){/* Données corrompues : proposer le dernier miroir valide. */}}
    try{const recovered=JSON.parse(item.data);if(validImport(recovered)&&confirm('Une sauvegarde locale précédente a été retrouvée. La restaurer ?')){
     store={...fresh(),...recovered,settings:{...fresh().settings,...recovered.settings,medicalClearance:false},draft:validDraft(recovered.draft)?recovered.draft:null};
     if(!persist())return;ui.week=currentWeek();render(false);notify('Historique récupéré — avis médical à reconfirmer');
    }}catch(e){console.warn('Sauvegarde secondaire illisible',e)}
   };
  };
 }catch(e){console.warn('IndexedDB non disponible',e)}
}
function notify(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2900)}
function calendarWeek(){
 const start=new Date(store.settings.startDate+'T12:00:00');
 const now=new Date(TODAY()+'T12:00:00');
 return isNaN(start.getTime())?1:clamp(Math.floor((now-start)/(7*86400000))+1,1,8);
}
function currentWeek(){
 // Semaine d'exécution : ne supprime aucune séance en retard.
 for(let w=1;w<=8;w++)if(WEEKS[w-1].slots.some((_,i)=>!(store.sessions||[]).some(x=>(x.cycle||1)===(store.settings.cycle||1)&&x.week===w&&x.slot===i&&x.status==='complete')))return w;
 return 8;
}
function dateLabel(d){try{return new Date(d).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}catch{return '-'}}
const countDone=week=>WEEKS[week-1].slots.reduce((n,_,i)=>n+(getDone(week,i)?1:0),0);
const cycleNo=()=>Math.max(1,num(store.settings.cycle)||1);
const slotKey=(week,slot)=>`${cycleNo()}-${week}-${slot}`;
const reviewKey=week=>cycleNo()===1?String(week):`${cycleNo()}-${week}`;
const getDone=(week,slot)=>store.sessions.find(s=>(s.cycle||1)===cycleNo()&&s.week===week&&s.slot===slot&&s.status==='complete');
const totalSessions=()=>store.sessions.length;
const pullsSession=s=>(s.exercises||[]).filter(x=>x.id==='pullP'||x.id==='pullS').reduce((total,x)=>total+x.sets.filter(t=>t.done).reduce((v,t)=>v+num(t.actual),0),0);
const allPulls=()=>store.sessions.reduce((sum,s)=>sum+pullsSession(s),0);
const bestPull=()=>Math.max(0,...store.sessions.flatMap(s=>(s.exercises||[]).filter(e=>e.id==='pullP'||e.id==='pullS').flatMap(e=>e.sets.filter(t=>t.done).map(t=>num(t.actual)))));
const dipsSession=s=>(s.exercises||[]).filter(e=>e.id==='dipAssist'||e.id==='dipStrict').reduce((total,e)=>total+e.sets.filter(t=>t.done).reduce((n,t)=>n+num(t.actual),0),0);
const allDips=()=>store.sessions.reduce((n,s)=>n+dipsSession(s),0);
const rowsSession=s=>(s.exercises||[]).filter(e=>e.id==='rowIncline'||e.id==='rowHorizontal').reduce((total,e)=>total+e.sets.filter(t=>t.done).reduce((n,t)=>n+num(t.actual),0),0);
const allRows=()=>store.sessions.reduce((sum,s)=>sum+rowsSession(s),0);
const bestRows=()=>Math.max(0,...store.sessions.flatMap(s=>(s.exercises||[]).filter(e=>e.id==='rowIncline'||e.id==='rowHorizontal').flatMap(e=>e.sets.filter(t=>t.done).map(t=>num(t.actual)))));
const bestHorizontalRow=()=>Math.max(0,...store.sessions.flatMap(s=>(s.exercises||[]).filter(e=>e.id==='rowHorizontal').flatMap(e=>e.sets.filter(t=>t.done).map(t=>num(t.actual)))));
const bestStrictDip=()=>Math.max(0,...store.sessions.flatMap(s=>(s.exercises||[]).filter(e=>e.id==='dipStrict').flatMap(e=>e.sets.filter(t=>t.done).map(t=>num(t.actual)))));
const completedSets=()=>store.sessions.reduce((n,s)=>n+s.exercises.reduce((k,e)=>k+e.sets.filter(t=>t.done).length,0),0);
const totalSlots=()=>WEEKS.reduce((n,w)=>n+w.slots.length,0);
function nextSlot(week){const slots=WEEKS[week-1].slots;const i=slots.findIndex((_,j)=>!getDone(week,j)&&(!store.postponed[slotKey(week,j)]||store.postponed[slotKey(week,j)]<=TODAY()||(store.postponed[slotKey(week,j)]==='medical'&&store.settings.medicalClearance&&!latestUnsafeToday())));return i<0?null:i}
function nextPending(week){return WEEKS[week-1].slots.findIndex((_,j)=>!getDone(week,j))}
function postponedLabel(week,slot){const day=store.postponed[slotKey(week,slot)];return day==='medical'?(store.settings.medicalClearance&&!latestUnsafeToday()?'Reprise à vérifier — contrôle requis':'En pause — avis médical requis'):day&&day>TODAY()?`Reportée au ${dateLabel(day+'T12:00:00')}`:''}
function latestRecovery(){const r=store.recovery?.at(-1);return r&&Date.now()-Date.parse(r.at)<48*3600*1000?r:null}
function readiness(r=latestRecovery()){if(!r)return {name:'Non renseignée',level:'neutral',detail:'Un mini-bilan permet de suivre la fatigue, mais ne remplace jamais le contrôle médical.'};if(r.pain!=='none'||r.tingling!=='none')return {name:'Symptômes signalés',level:'danger',detail:'Ne commence pas de renforcement. Demande conseil à un professionnel de santé.'};if(num(r.fatigue)>=4||num(r.sleep)<=2||num(r.soreness)>=4)return {name:'Récupération difficile',level:'warning',detail:'Allège ou reporte la séance selon ton état, même après avis médical.'};if(num(r.fatigue)===3||num(r.sleep)===3||num(r.soreness)===3)return {name:'Récupération moyenne',level:'neutral',detail:'Conserve une séance prudente, sans progression forcée.'};return {name:'Récupération favorable',level:'good',detail:'Indice de confort déclaré, jamais un feu vert médical.'}}
function adaptiveTarget(id,initial,week){
 const isPull=EXERCISES[id].kind==='pull';
 const ceiling=isPull?Math.max(3,num(store.settings.baselinePullups)+2):EXERCISES[id].base+(id==='side'?25:(id==='dipStrict'?Math.max(3,num(store.settings.baselineDips)):6));
 const recent=store.sessions.filter(s=>s.status==='complete'&&(s.exercises||[]).some(e=>e.id===id)).slice(-2);
 if(!recent.length)return initial;
 const last=recent.at(-1).exercises.find(e=>e.id===id);
 const lastTarget=clamp(num(last.sets?.[0]?.target)||initial,1,ceiling);
 let target=lastTarget;
 const recovery=latestRecovery();
 const harsh=recovery&&(readiness(recovery).level==='warning'||readiness(recovery).level==='danger');
 const failed=recent.length===2&&recent.every(s=>s.exercises.find(e=>e.id===id).sets.some(t=>!t.done||num(t.actual)<num(t.target))||num(s.effort)>=5);
 if(failed||harsh)target=Math.max(1,target-(id==='side'?5:1));
 else if(recent.length===2&&store.settings.medicalClearance){
   const stable=recent.every(s=>s.after==='none'&&num(s.effort)<=3&&s.exercises.find(e=>e.id===id).sets.every(t=>t.done&&num(t.actual)>=num(t.target)&&t.rir!==null&&t.rir!==undefined&&num(t.rir)>=2&&t.quality==='ok'));
   const since=Date.parse(recent[0].endedAt);
   const noSymptoms=store.checkins.every(c=>Date.parse(c.at)<since||c.result==='allowed') && (store.recovery||[]).every(r=>Date.parse(r.at)<since||(r.pain==='none'&&r.tingling==='none'));
   const noWorsening=store.sessions.every(s=>Date.parse(s.endedAt)<since||s.after!=='worse');
   if(stable&&noSymptoms&&noWorsening&&Object.values(store.weeklyReviews).every(r=>Date.parse(r.at||0)<since||!['aggravés','fréquents'].includes(r.symptoms))&&(!recovery||readiness(recovery).level==='good'))target=Math.min(ceiling,lastTarget+(id==='side'?5:1));
 }
 if(week===4||week===8)target=Math.max(1,target-(id==='side'?5:1));
 return target;
}
function planExercise(id,week){
 const ex=EXERCISES[id];const p=WEEKS[week-1];const baseline=clamp(num(store.settings.baselinePullups)||6,1,30);
 let target=ex.kind==='pull'?(clamp(baseline-2,2,7)-(id==='pullS'?1:0)):ex.base;
 if(ex.kind==='dip'&&num(store.settings.baselineDips)>0)target=clamp(num(store.settings.baselineDips)-2,2,7);
 if(ex.kind==='row'&&num(store.settings.baselineRows)>0)target=clamp(num(store.settings.baselineRows)-2,4,12);
 if(id==='push'&&num(store.settings.baselinePushups)>0)target=clamp(num(store.settings.baselinePushups)-2,4,16);
 if(id==='squat'&&num(store.settings.baselineSquats)>0)target=clamp(num(store.settings.baselineSquats)-2,8,18);
 target=adaptiveTarget(id,Math.max(1,target),week);
 let sets=ex.baseSets;
 if(p.volume===-1)sets=Math.max(1,sets-1);
 if(p.volume===1&&ex.baseSets===2&&ex.kind!=='row')sets=3;
 // Le tirage horizontal remplace une série de supination : +1 seule série de tirage en B.
 if(id==='pullS'&&store.settings.rowsEnabled!==false)sets=Math.max(1,sets-1);
 return {id,name:ex.name,unit:ex.unit,details:ex.details,sets:Array.from({length:sets},()=>({target,actual:target,done:false,rir:null,quality:null}))};
}
function makeDraft(week,slot){const type=WEEKS[week-1].slots[slot];return {id:'s'+Date.now(),cycle:cycleNo(),week,slot,type,startedAt:new Date().toISOString(),exercises:exerciseList(type).map(id=>planExercise(id,week))}}
function getSafety(){const s=ui.safety;if(!s||s.pain===null||s.tingling===null||s.weakness===null||s.emergency===null)return {kind:'missing',message:'Réponds aux quatre questions pour poursuivre.'};
 if(s.emergency==='yes')return {kind:'emergency',message:'Troubles urinaires/intestinaux nouveaux ou perte de sensibilité du périnée : appelle immédiatement le 15 ou le 112.'};
 if(s.weakness==='yes')return {kind:'urgent',message:'Nouvelle faiblesse de la jambe : ne t’entraîne pas. Fais-toi examiner en urgence.'};
 if(s.tingling!=='none'||s.pain!=='none')return {kind:'pause',message:'Douleur ou fourmillements aujourd’hui : séance de force reportée. Marche douce seulement si confortable ; contacte un professionnel de santé.'};
 const recent=latestRecovery();if(recent&&localDay(recent.at)===TODAY()&&(recent.pain!=='none'||recent.tingling!=='none'))return {kind:'pause',message:'Tu as déclaré des douleurs ou des fourmillements aujourd’hui dans le bilan de récupération : séance reportée.'};
 if(latestUnsafeToday())return {kind:'pause',message:'Des symptômes ont été consignés aujourd’hui : ne reprends pas une séance de force le même jour.'};
 if(!store.settings.medicalClearance)return {kind:'medical',message:'Avec tes symptômes irradiant jusqu’à la cheville, un avis médical est nécessaire avant ce programme de force.'};
 return {kind:'allowed',message:'Tu déclares n’avoir aucun symptôme actuellement et avoir reçu un avis médical favorable. Cela ne garantit pas l’absence de risque : arrête dès qu’un symptôme apparaît.'};
}
function topBar(){return `<header class="topbar"><div class="logo"><div class="logo-mark" aria-hidden="true">B</div><div><strong>BARRE <em class="version-pill">4.0</em></strong><span>PERFORMANCE JOURNAL</span></div></div><button class="iconbtn" aria-label="Ouvrir les réglages" data-action="tab" data-tab="settings">⚙</button></header>`}
function nav(){return `<nav class="nav" aria-label="Navigation principale">${[['home','⌂','Accueil'],['plan','▦','Programme'],['evolution','◎','Objectifs'],['stats','▥','Progrès']].map(([id,i,l])=>`<button class="navbtn ${ui.tab===id?'active':''}" data-action="tab" data-tab="${id}" aria-current="${ui.tab===id?'page':'false'}"><span class="navicon" aria-hidden="true">${i}</span>${l}</button>`).join('')}</nav>`}
function safeBanner(){return `<div class="safety"><span style="font-size:18px">⚠</span><div><b>Dos et fourmillements :</b> cette application ne pose aucun diagnostic. Les symptômes récurrents dans la jambe nécessitent un avis médical avant la progression de force. En cas de faiblesse nouvelle, troubles urinaires/intestinaux ou anesthésie du périnée : <b>urgence 15 / 112</b>.</div></div>`}
function home(){
 const w=currentWeek(),slot=nextSlot(w),pending=nextPending(w),type=slot===null?null:WEEKS[w-1].slots[slot],totalDone=WEEKS.reduce((n,_,i)=>n+countDone(i+1),0),percent=Math.round(totalDone/totalSlots()*100),r=readiness();
 const starter=store.draft?`<button class="btn btn-primary btn-full" data-action="resume">Reprendre la séance →</button>`:slot===null?`<button class="btn btn-secondary btn-full" data-action="tab" data-tab="plan">${pending<0?'Consulter le cycle':'Gérer la séance reportée'} →</button>`:`<button class="btn btn-primary btn-full" data-action="checkin" data-week="${w}" data-slot="${slot}">Préparer la séance ${type} →</button>`;
 return `<section class="section hero"><div class="hero-inner"><div class="hero-heading"><div class="eyebrow">CYCLE ${cycleNo()} · SEMAINE DE TRAVAIL ${w}/8</div><span class="hero-symbol" aria-hidden="true">B.</span></div><h1>La force, <span class="accent">mesurée.</span></h1><p>Ton prochain entraînement, sans distractions. Tractions, dips, australiennes et physique athlétique.</p><div class="hero-details"><span class="pill">${totalDone}/${totalSlots()} séances</span><span class="pill">Semaine calendaire ${calendarWeek()}/8</span><span class="pill">30–45 min</span></div>${starter}<div class="hero-tail"><button class="text-button" data-action="assessment">Bilan de départ</button><button class="text-button" data-action="homePrefs">Personnaliser l’accueil</button></div></div></section>
 ${store.settings.homeShowOverview!==false?`<section class="section"><div class="section-head"><h2>Essentiel</h2><span class="tag">${percent}% du cycle</span></div><div class="stat-grid"><div class="stat"><div class="stat-val">${bestPull()}</div><div class="stat-label">Meilleure série de tractions</div></div><div class="stat"><div class="stat-val">${bestStrictDip()}</div><div class="stat-label">Dips stricts</div></div><div class="stat"><div class="stat-val">${bestHorizontalRow()}</div><div class="stat-label">Australiennes horizontales</div></div></div></section>`:''}
 ${store.settings.homeShowRecovery!==false?`<section class="section"><div class="section-head"><h2>État du jour</h2><button class="text-button" data-action="recovery">Renseigner →</button></div><div class="card ${r.level==='danger'?'warning':''}"><div class="recovery-row"><div class="readiness-dot ${r.level}"></div><div class="grow"><strong>${esc(r.name)}</strong><p class="notice">${esc(r.detail)}</p></div></div><button class="btn btn-outline btn-full mt12" data-action="recovery">Sommeil · Fatigue · Symptômes</button></div></section>`:''}
 ${!store.settings.onboarded?`<section class="section"><div class="card intro-card"><div class="eyebrow">CONFIGURATION · 2 MINUTES</div><h3 class="mt8">Personnalise ton point de départ.</h3><p class="notice mt8">Indique les performances que tu connais déjà, sans réaliser de test maximal pour remplir le formulaire.</p><button class="btn btn-secondary btn-full mt12" data-action="assessment">Compléter le bilan initial →</button></div></section>`:''}
 <section class="section"><div class="section-head"><h2>Programme</h2><button class="text-button" data-action="tab" data-tab="plan">Tout voir →</button></div>${store.draft?`<div class="card"><span class="tag amber">EN COURS</span><h3 class="mt12">Séance ${esc(store.draft.type)} · Semaine ${store.draft.week}</h3><button class="btn btn-primary btn-full mt12" data-action="resume">Reprendre →</button></div>`:slot===null?`<div class="card"><h3>${pending<0?'Cycle terminé ou à vérifier':'Séance reportée'}</h3><p class="lead">Consulte ton planning. Aucune séance de rattrapage forcée.</p><button class="btn btn-secondary btn-full mt12" data-action="tab" data-tab="plan">Ouvrir le programme</button></div>`:slotCard(w,slot,true)}</section>
 ${store.settings.homeShowGoals!==false?`<section class="section"><div class="card"><div class="card-header"><h3>Objectifs de force</h3><button class="text-button" data-action="tab" data-tab="evolution">Détails →</button></div><div class="goal-mini"><span>Tractions</span><strong>${bestPull()} / ${num(store.settings.goalPullups)}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${clamp(bestPull()/Math.max(1,num(store.settings.goalPullups))*100,0,100)}%"></div></div><div class="goal-mini mt12"><span>Dips stricts</span><strong>${bestStrictDip()} / ${num(store.settings.goalDips)}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${clamp(bestStrictDip()/Math.max(1,num(store.settings.goalDips))*100,0,100)}%"></div></div><p class="small muted mt12">Records de séries consignées, pas tests maximaux standardisés.</p></div></section>`:''}
 <section class="section">${safeBanner()}</section><div class="footer-note">Sans compte · Données locales · Export JSON · Version 4.0</div>`;
}
function slotCard(week,slot,showExercises=false){
 const type=WEEKS[week-1].slots[slot],exercises=exerciseList(type),done=getDone(week,slot),postponed=postponedLabel(week,slot);
 return `<div class="card"><div class="card-header"><span class="tag ${done?'green':postponed?'amber':''}">Séance ${slot+1} · ${type}</span><span class="small muted">${done?'Terminée':postponed||'30–45 min'}</span></div><h3 class="mt12">${type==='A'?'Tractions, poussée & jambes':'Tirage horizontal, épaules & stabilité'}</h3>${showExercises?exercises.map(id=>`<div class="exercise-line"><div class="exercise-icon">${EXERCISES[id].icon}</div><div class="exercise-main"><strong>${EXERCISES[id].name}</strong><small>${EXERCISES[id].short}</small></div><div class="exercise-count">${planExercise(id,week).sets.length} séries</div></div>`).join(''):''}<button class="btn ${done||postponed?'btn-secondary':'btn-primary'} btn-full mt18" ${done||postponed?'disabled':''} data-action="checkin" data-week="${week}" data-slot="${slot}">${done?'✓ Séance enregistrée':postponed?'Séance reportée':'Vérification puis démarrer →'}</button>${!done?`<button class="btn btn-outline btn-full mt8" data-action="postpone" data-week="${week}" data-slot="${slot}">${postponed?'Modifier le report':'Reporter sans pénalité'} →</button>`:''}</div>`;
}
function plan(){
 const week=ui.week,p=WEEKS[week-1],done=countDone(week),review=store.weeklyReviews[reviewKey(week)];
 const canClose=Date.now()-Date.parse(store.settings.startDate+'T12:00:00')>=56*86400000||WEEKS.every((w,i)=>w.slots.every((_,j)=>!!getDone(i+1,j)));
 return `<section class="section"><div class="eyebrow">Calendrier flexible · Cycle ${cycleNo()}</div><h1 class="mt8">Ton chemin<br><span class="accent">sur 8 semaines.</span></h1><p class="lead">Une séance manquée n’est jamais perdue : tu peux la reporter. Aucune séance supplémentaire n’est imposée pour rattraper du retard.</p></section>
 <section class="section"><div class="section-head"><h2>Choisis ta semaine</h2><span class="tag">${totalSlots()} séances</span></div><div class="week-cells">${WEEKS.map((v,i)=>`<button class="week-cell ${ui.week===i+1?'current':''} ${countDone(i+1)===v.slots.length?'complete':''}" data-action="week" data-week="${i+1}" aria-label="Semaine ${i+1}">${i+1}${countDone(i+1)===v.slots.length?'<span>✓</span>':''}</button>`).join('')}</div></section>
 <section class="section"><div class="card soft"><div class="card-header"><div><div class="eyebrow">Semaine ${week}</div><h2 class="mt8">${p.label}</h2></div><span class="tag ${done===p.slots.length?'green':''}">${done}/${p.slots.length}</span></div><p class="lead">${p.tip}</p><div class="divider"></div>${p.slots.map((type,i)=>`<div class="slot ${getDone(week,i)?'done':''}"><div class="round">${getDone(week,i)?'✓':type}</div><div class="slot-info"><div class="slot-title">Séance ${i+1} · ${type}</div><div class="slot-sub">${getDone(week,i)?'Terminée':postponedLabel(week,i)||`${type==='A'?'Tractions · Dips/Pompes':'Australiennes · Épaules'} · Stabilité`}</div></div><div class="slot-buttons"><button class="btn btn-sm ${getDone(week,i)?'btn-outline':'btn-secondary'}" ${getDone(week,i)||postponedLabel(week,i)?'disabled':''} data-action="checkin" data-week="${week}" data-slot="${i}">${getDone(week,i)?'Fait':postponedLabel(week,i)?'Reporté':'Ouvrir'}</button>${!getDone(week,i)?`<button class="text-button" data-action="postpone" data-week="${week}" data-slot="${i}">Reporter</button>`:''}</div></div>`).join('')}<button class="btn btn-secondary btn-full mt18" data-action="review" data-week="${week}">${review?'Modifier':'Rédiger'} le bilan de semaine →</button></div></section>
 <section class="section"><div class="section-head"><h2>Contenu des séances</h2><button class="text-button" data-action="library">Bibliothèque technique →</button></div>${['A','B'].map(t=>`<div class="card mt12"><div class="card-header"><strong>Séance ${t}</strong><span class="tag">${exerciseList(t).length} exercices</span></div>${exerciseList(t).map(id=>{const e=planExercise(id,week);return `<div class="exercise-line"><div class="exercise-icon">${EXERCISES[id].icon}</div><div class="exercise-main"><strong>${esc(e.name)}</strong><small>${esc(EXERCISES[id].short)}</small></div><button class="text-button" data-action="exerciseInfo" data-ex="${id}">${e.sets.length} × ${e.sets[0].target} · ?</button></div>`}).join('')}</div>`).join('')}</section>
 <section class="section"><div class="card"><div class="card-header"><h3>Après les 8 semaines</h3><span class="tag">Cycle suivant</span></div><p class="notice mt8">Tes anciennes séances, records et bilans restent conservés. Un nouveau cycle n’est pas automatiquement plus difficile. La date de début du nouveau cycle est réinitialisée.</p><button class="btn btn-outline btn-full mt12" data-action="newCycle" ${!canClose||store.draft?'disabled':''}>Démarrer un nouveau cycle →</button>${!canClose?'<p class="small muted mt8">Accessible après la huitième semaine ou lorsque les 20 séances sont réalisées.</p>':''}</div></section><section class="section">${safeBanner()}</section>`;
}
const MUSCLES={dos:'Dos',pectoraux:'Pectoraux',epaules:'Épaules',bras:'Bras',jambes:'Cuisses',fessiers:'Fessiers',tronc:'Tronc',mollets:'Mollets'};
const MUSCLE_MAP={squatTempo:['jambes','fessiers'],bridgeSingle:['fessiers','tronc'],pullP:['dos','bras'],pullS:['dos','bras'],rowIncline:['dos','bras','epaules'],rowHorizontal:['dos','bras','epaules'],dipAssist:['pectoraux','bras','epaules'],dipStrict:['pectoraux','bras','epaules'],push:['pectoraux','bras'],pike:['epaules','bras'],squat:['jambes','fessiers'],lunge:['jambes','fessiers'],bird:['tronc','fessiers'],side:['tronc'],bridge:['fessiers'],calves:['mollets']};
function groupVolume(){const out=Object.fromEntries(Object.keys(MUSCLES).map(k=>[k,0]));for(const session of store.sessions)for(const e of session.exercises||[]){const count=e.sets.filter(t=>t.done).length;for(const key of MUSCLE_MAP[e.id]||[])out[key]+=count;}return out}
function totalCompleted(){return store.sessions.filter(s=>s.status==='complete').length}
function muscleFigure(group){const active=k=>k===group?'#D1A17B':'#484341';return `<svg class="body-map" viewBox="0 0 220 260" role="img" aria-label="Schéma des zones musculaires, sélection : ${esc(MUSCLES[group])}">
 <text x="55" y="17" text-anchor="middle">FACE</text><text x="164" y="17" text-anchor="middle">DOS</text>
 ${[55,164].map((cx,i)=>`<g transform="translate(${cx} 27)" stroke="#121213" stroke-width="2" stroke-linejoin="round"><circle cx="0" cy="13" r="12" fill="#587783"/><path d="M-17 29 Q0 22 17 29 L23 99 L11 111 L-11 111 L-23 99Z" fill="${active(i?'dos':'pectoraux')}"/><path d="M-17 32 L-28 41 L-40 95 L-29 100 L-13 63Z" fill="${active('bras')}"/><path d="M17 32 L28 41 L40 95 L29 100 L13 63Z" fill="${active('bras')}"/><path d="M-12 102 L-6 162 L-15 209 L-29 208 L-29 164 L-26 109Z" fill="${active('jambes')}"/><path d="M12 102 L6 162 L15 209 L29 208 L29 164 L26 109Z" fill="${active('jambes')}"/><path d="M-23 33 Q-18 25 -12 32 L-15 52 L-25 57Z M23 33 Q18 25 12 32 L15 52 L25 57Z" fill="${active('epaules')}"/><path d="M-14 67 L14 67 L17 96 L-17 96Z" fill="${active('tronc')}"/><path d="M-22 100 Q0 90 22 100 L20 119 L-20 119Z" fill="${active('fessiers')}"/><path d="M-25 170 L-13 174 L-15 210 L-29 208Z M25 170 L13 174 L15 210 L29 208Z" fill="${active('mollets')}"/></g>`).join('')}</svg>`}
function evolution(){
 const volume=groupVolume(),total=Object.values(volume).reduce((a,b)=>a+b,0),r=readiness();
 const goals=[{name:'Tractions strictes',current:bestPull(),goal:num(store.settings.goalPullups),note:'Meilleure série enregistrée en pronation ou supination'},{name:'Dips stricts',current:bestStrictDip(),goal:num(store.settings.goalDips),note:'Les répétitions assistées ne comptent pas'},{name:'Australiennes horizontales',current:bestHorizontalRow(),goal:num(store.settings.goalRows),note:'Variante difficile uniquement, séries horizontales'}];
 return `<section class="section"><div class="eyebrow">Force et maîtrise</div><h1 class="mt8">Des objectifs <span class="accent">concrets.</span></h1><p class="lead">Aucun niveau artificiel. Tu progresses grâce à tes performances, à ta technique et à ta récupération.</p></section>
 <section class="section"><div class="section-head"><h2>Mes objectifs</h2><button class="text-button" data-action="tab" data-tab="settings">Modifier →</button></div>${goals.map(g=>`<div class="card mt12"><div class="card-header"><strong>${g.name}</strong><div class="goal-number">${g.current} <small>/ ${g.goal}</small></div></div><div class="progress-track mt12"><div class="progress-fill" style="width:${clamp(g.current/Math.max(1,g.goal)*100,0,100)}%"></div></div><p class="notice mt8">${g.note}</p></div>`).join('')}<p class="small muted mt12">Un objectif ne remplace pas une vérification de la qualité technique.</p></section>
 <section class="section"><div class="section-head"><h2>Répartition musculaire</h2><span class="tag">${total} séries · zones estimées</span></div><div class="card"><p class="notice">Indication des zones sollicitées à partir des séries validées ; ce n'est ni une mesure de croissance ni un diagnostic de déséquilibre.</p>${muscleFigure(ui.muscle)}<div class="muscle-focus"><strong>${MUSCLES[ui.muscle]}</strong><span>${volume[ui.muscle]} séries enregistrées</span></div><div class="muscle-options">${Object.entries(MUSCLES).map(([key,label])=>`<button class="muscle-chip ${ui.muscle===key?'active':''}" data-action="muscle" data-muscle="${key}">${label} · ${volume[key]}</button>`).join('')}</div></div></section>
 <section class="section"><div class="card soft"><h3>Récupération et technique</h3><p class="notice mt8">${esc(r.name)} — ${esc(r.detail)}</p><button class="btn btn-secondary btn-full mt12" data-action="recovery">Mettre à jour mon état</button></div></section>`;
}
function exercisePerformance(){
 const ids=['pullP','pullS','dipStrict','dipAssist','rowHorizontal','rowIncline','squat','lunge','bridge'];
 const rows=ids.map(id=>{const e=EXERCISES[id],sets=store.sessions.flatMap(s=>(s.exercises||[]).filter(x=>x.id===id).flatMap(x=>x.sets.filter(t=>t.done)));return {name:e.name,sets:sets.length,best:Math.max(0,...sets.map(t=>num(t.actual))),sum:sets.reduce((n,t)=>n+num(t.actual),0)}});
 return `<section class="section"><div class="section-head"><h2>Détail par exercice</h2><span class="tag">Tous les cycles</span></div><div class="card"><div class="performance-table" role="table" aria-label="Statistiques par variante"><div class="performance-row performance-head" role="row"><span>Exercice</span><span>Séries</span><span>Meilleure</span></div>${rows.map(r=>`<div class="performance-row" role="row"><strong>${esc(r.name)}</strong><span>${r.sets}</span><span>${r.best||'—'}</span></div>`).join('')}</div><p class="notice mt12">Variantes distinguées : ne compare pas dips assistés, dips stricts, ni les deux inclinaisons australiennes.</p></div></section>`;
}
function stats(){
 const cycle=cycleNo(),my=store.sessions.filter(s=>(s.cycle||1)===cycle),perWeek=WEEKS.map((w,i)=>({week:i+1,pull:my.filter(s=>s.week===i+1).reduce((n,s)=>n+pullsSession(s),0),dip:my.filter(s=>s.week===i+1).reduce((n,s)=>n+dipsSession(s),0)}));const max=Math.max(1,...perWeek.flatMap(x=>[x.pull,x.dip]));
 const history=[...store.sessions].sort((a,b)=>Date.parse(b.endedAt)-Date.parse(a.endedAt));
 const months=new Map();for(const sess of store.sessions){const key=(sess.endedAt||'').slice(0,7);if(!/^\d{4}-\d{2}$/.test(key))continue;if(!months.has(key))months.set(key,[]);months.get(key).push(sess)}
 const monthly=[...months].sort((a,b)=>b[0].localeCompare(a[0]));
 const rec=readiness(),symptoms=store.checkins.filter(c=>c.result!=='allowed').slice(-5).reverse();
 const monthName=k=>new Date(k+'-15T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
 const advice=rec.level==='danger'?'Symptômes consignés : pas de progression de force ; contacte un professionnel de santé.':rec.level==='warning'?'Récupération difficile : conserve des objectifs faciles ou reporte la séance.':history.length===0?'Commence par des séries propres, sans aller jusqu’à l’échec.':history[0].after==='worse'?'Symptômes aggravés après la dernière séance : une réévaluation est nécessaire.':'Tu peux progresser après plusieurs séances faciles et bien tolérées, jamais automatiquement sur un record.';
 return `<section class="section"><div class="eyebrow">Journal & données réelles</div><h1 class="mt8">Ta progression<br><span class="accent">en chiffres.</span></h1><p class="lead">Records, volumes, historique et récupération, uniquement à partir des séries validées.</p></section>
 <section class="section"><div class="card"><div class="card-header"><h3>Charge d’entraînement · 7 jours</h3><span class="tag">Séries validées</span></div><div class="monthly-grid mt12"><div><strong>${loadPulse().current}</strong><span>7 derniers jours</span></div><div><strong>${loadPulse().prior}</strong><span>7 jours précédents</span></div></div><p class="notice mt12">${esc(loadPulse().advice)}</p></div></section><section class="section metric-grid"><div class="metric"><strong>${totalSessions()}</strong><span>Séances enregistrées</span></div><div class="metric"><strong>${completedSets()}</strong><span>Séries validées</span></div><div class="metric"><strong>${allPulls()}</strong><span>Tractions cumulées</span></div><div class="metric"><strong>${bestPull()}</strong><span>Record traction / série</span></div><div class="metric"><strong>${allDips()}</strong><span>Dips cumulés (assistés et stricts)</span></div><div class="metric"><strong>${bestStrictDip()}</strong><span>Record dips stricts</span></div><div class="metric"><strong>${allRows()}</strong><span>Tractions australiennes cumulées</span></div><div class="metric"><strong>${bestRows()}</strong><span>Record australiennes / série</span></div></section>
 <section class="section"><div class="card"><div class="card-header"><h3>Volume hebdomadaire · tractions et dips</h3><span class="tag">Cycle ${cycle}</span></div><div class="dual-chart" role="img" aria-label="Volumes de séries : ${perWeek.map(v=>`Semaine ${v.week} ${v.pull} tractions et ${v.dip} dips`).join(', ')}">${perWeek.map(x=>`<div class="dual-week"><div class="dual-barset"><div class="dual-bar pull" style="height:${(x.pull?x.pull/max*100:0)}%" title="${x.pull} tractions"></div><div class="dual-bar dip" style="height:${(x.dip?x.dip/max*100:0)}%" title="${x.dip} dips"></div></div><span>S${x.week}</span></div>`).join('')}</div><div class="chart-legend"><span><i class="legend-pull"></i> Tractions</span><span><i class="legend-dip"></i> Dips</span></div></div></section>
 ${trendChart()}${monthlyComparison()}${exercisePerformance()}<section class="section"><div class="card soft"><h3>Conseil d’ajustement</h3><p class="notice mt8">${esc(advice)}</p><button class="btn btn-secondary btn-full mt12" data-action="recovery">Actualiser ma récupération →</button></div></section>
 <section class="section"><div class="section-head"><h2>Bilans mensuels</h2><span class="tag">Historique conservé</span></div>${monthly.length?monthly.map(([key,list])=>`<div class="card mt12"><div class="card-header"><strong>${esc(monthName(key))}</strong><span class="tag green">${list.filter(s=>s.status==='complete').length} complètes</span></div><div class="monthly-grid"><div><strong>${list.reduce((n,s)=>n+pullsSession(s),0)}</strong><span>Tractions</span></div><div><strong>${list.reduce((n,s)=>n+dipsSession(s),0)}</strong><span>Dips</span></div><div><strong>${list.reduce((n,s)=>n+rowsSession(s),0)}</strong><span>Australiennes</span></div><div><strong>${list.reduce((n,s)=>n+(s.exercises||[]).reduce((t,e)=>t+e.sets.filter(x=>x.done).length,0),0)}</strong><span>Séries</span></div></div></div>`).join(''):'<div class="empty">Un bilan apparaît après ta première séance enregistrée.</div>'}</section>
 <section class="section"><div class="section-head"><h2>Historique des séances</h2><span class="tag">${history.length} séances</span></div>${history.length?`<div class="card">${history.slice(0,60).map(s=>`<div class="history-item"><div class="card-header"><strong>Cycle ${esc(s.cycle||1)} · S${esc(s.week)} · ${esc(s.type)}</strong><span class="tag ${s.status==='partial'?'amber':'green'}">${s.status==='partial'?'Partielle':'Complète'}</span></div><div class="muted small mt8">${dateLabel(s.endedAt)} · ${pullsSession(s)} tractions · ${dipsSession(s)} dips · ${rowsSession(s)} australiennes · ${s.exercises.reduce((n,e)=>n+e.sets.filter(t=>t.done).length,0)} séries</div>${s.note?`<p class="small mt8">${esc(s.note)}</p>`:''}${s.after==='worse'?'<p class="small mt8" style="color:var(--warning)">Symptômes aggravés : progression suspendue sans avis médical.</p>':''}</div>`).join('')}</div>`:'<div class="empty">Ton historique apparaîtra après ta première séance.</div>'}</section>
 <section class="section"><div class="section-head"><h2>Suivi des symptômes</h2></div>${symptoms.length?`<div class="card">${symptoms.map(c=>`<div class="history-item"><strong>${dateLabel(c.at)}</strong><p class="small muted mt8">Séance reportée / interrompue · Dos : ${esc(c.pain)} · Fourmillements : ${esc(c.tingling)} · Faiblesse : ${esc(c.weakness)}</p></div>`).join('')}</div>`:'<div class="empty">Aucun contrôle défavorable enregistré.</div>'}</section>
 <section class="section"><div class="section-head"><h2>Bilans hebdomadaires</h2></div>${Object.entries(store.weeklyReviews).sort((a,b)=>Date.parse(b[1].at||0)-Date.parse(a[1].at||0)).map(([key,r])=>{const match=key.match(/^(?:(\d+)-)?(\d+)$/);const c=match?num(match[1])||1:1,w=match?num(match[2]):1;return `<div class="card mt12"><div class="card-header"><strong>Cycle ${c} · semaine ${w}</strong>${c===cycle?`<button class="text-button" data-action="review" data-week="${w}">Modifier</button>`:'<span class="tag">Archive</span>'}</div><p class="small muted mt8">Énergie : ${esc(r.energy)}/5 · Symptômes : ${esc(r.symptoms)}</p><p class="small mt8"><b>Réussites :</b> ${esc(r.wins||'—')}</p><p class="small mt8"><b>À ajuster :</b> ${esc(r.challenges||'—')}</p></div>`}).join('')||'<div class="empty">Ton premier bilan sera accessible depuis le calendrier.</div>'}</section>`;
}
function settings(){const s=store.settings;return `<section class="section" style="margin-top:12px"><div class="eyebrow">Personnalisation</div><h1 class="mt8">Tes réglages.</h1><p class="small muted mt8">BARRE v4.0 · Cycle ${cycleNo()}</p><p class="lead">Tes données restent sur cet appareil. Aucun compte, aucune connexion à un serveur.</p></section><section class="section"><div class="card"><h3>Mon point de départ</h3><div class="field"><label for="startDate">Date de début des 8 semaines</label><input id="startDate" type="date" value="${esc(s.startDate)}" data-field="startDate"></div><div class="field"><label for="baseline">Tractions strictes maximales actuellement</label><select id="baseline" data-field="baselinePullups">${Array.from({length:16},(_,i)=>i+1).map(n=>`<option ${num(s.baselinePullups)===n?'selected':''} value="${n}">${n} traction${n>1?'s':''}</option>`).join('')}</select></div><div class="two-col"><div class="field"><label for="goalPullups">Objectif tractions / série</label><select id="goalPullups" data-field="goalPullups">${[5,6,8,10,12,15,20].map(n=>`<option value="${n}" ${num(s.goalPullups)===n?'selected':''}>${n}</option>`).join('')}</select></div><div class="field"><label for="goalDips">Objectif dips stricts / série</label><select id="goalDips" data-field="goalDips">${[3,5,6,8,10,12,15].map(n=>`<option value="${n}" ${num(s.goalDips)===n?'selected':''}>${n}</option>`).join('')}</select></div></div><p class="small muted">Ce maximum sert à proposer des répétitions prudentes. Tu peux modifier chaque série pendant l'entraînement.</p><button class="btn btn-secondary btn-full mt12" data-action="assessment">Modifier mon bilan sportif →</button></div></section><section class="section"><div class="card"><h3>Accueil et préférences</h3><p class="notice mt8">Choisis uniquement les indicateurs que tu souhaites voir en ouvrant BARRE.</p>${[['homeShowOverview','Afficher les records'],['homeShowRecovery','Afficher la récupération'],['homeShowGoals','Afficher les objectifs']].map(([id,label])=>`<label class="check mt12"><input type="checkbox" data-field="${id}" ${s[id]!==false?'checked':''}><span>${label}</span></label>`).join('')}<div class="field"><label for="legVariant">Progression des jambes</label><select data-field="legVariant" id="legVariant"><option value="standard" ${s.legVariant!=='control'?'selected':''}>Standard · Squats et pont bilatéral</option><option value="control" ${s.legVariant==='control'?'selected':''}>Contrôle · Squats tempo et pont unilatéral</option></select></div><p class="small muted">La variante contrôle ne sera proposée qu'aux prochaines séances, après évaluation médicale et maîtrise technique. Aucune augmentation automatique de difficulté.</p></div></section><section class="section"><div class="card"><h3>Mon matériel de poussée</h3><label class="check mt18"><input type="checkbox" ${s.dipsEnabled!==false?'checked':''} data-field="dipsEnabled"><span>J’ai des barres à dips stables : remplacer les pompes de la séance A par des dips</span></label><div class="field"><label for="dipsMode">Niveau actuel aux dips</label><select id="dipsMode" data-field="dipsMode" ${s.dipsEnabled===false?'disabled':''}><option value="assist" ${s.dipsMode!=='strict'?'selected':''}>Début / incertain : dips assistés (5 répétitions visées)</option><option value="strict" ${s.dipsMode==='strict'?'selected':''}>Je maîtrise les dips stricts (3 répétitions visées)</option></select></div><p class="small muted">Les dips remplacent les pompes : ils ne s’ajoutent pas en plus. Pour débuter, prends un appui stable avec les pieds si tes barres le permettent. En cas de gêne à l’épaule ou au sternum, repasse aux pompes. Les séances déjà enregistrées et une séance commencée ne sont pas modifiées.</p></div></section><section class="section"><div class="card"><h3>Mon matériel de tirage horizontal</h3><label class="check mt18"><input type="checkbox" ${s.rowsEnabled!==false?'checked':''} data-field="rowsEnabled"><span>Je dispose d’une barre basse / station réellement adaptée aux tractions australiennes</span></label><div class="field"><label for="rowsMode">Inclinaison actuelle</label><select id="rowsMode" data-field="rowsMode" ${s.rowsEnabled===false?'disabled':''}><option value="incline" ${s.rowsMode!=='horizontal'?'selected':''}>Inclinée, plus facile — 2 × 8</option><option value="horizontal" ${s.rowsMode==='horizontal'?'selected':''}>Presque horizontale, plus difficile — 2 × 6</option></select></div><div class="field"><label for="goalRows">Objectif australiennes par série</label><select id="goalRows" data-field="goalRows">${[6,8,10,12,15,20].map(n=>`<option value="${n}" ${num(s.goalRows)===n?'selected':''}>${n}</option>`).join('')}</select></div><p class="small muted">Séance B : deux séries d’australiennes remplacent une série de tractions supination et ajoutent une série nette de tirage. Les changements concernent uniquement les nouvelles séances. Ne te suspends jamais horizontalement à une barre de porte non conçue pour cet usage. Stoppe si le dos ou la jambe réagissent.</p></div></section><section class="section"><div class="card warning"><h3>Suivi médical et entraînement</h3><p class="notice mt8">Comme tu as signalé des fourmillements intermittents dans la jambe jusqu'à la cheville, l'application demande une évaluation médicale avant de lancer les séances de renforcement. Elle ne peut pas évaluer tes réflexes ou ta force neurologique.</p><label class="check mt18"><input type="checkbox" ${s.medicalClearance?'checked':''} data-field="medicalClearance"><span>Je confirme avoir été examiné et avoir reçu un avis médical favorable à ces exercices de renforcement, avec des adaptations si nécessaires.</span></label><p class="small muted mt12">Cette déclaration ne remplace pas un examen et n'autorise pas à s'entraîner en présence de symptômes nouveaux ou aggravés.</p></div></section><section class="section"><div class="card"><h3>Sauvegarde et confidentialité</h3><p class="notice mt8">Les données sont stockées sur cet appareil et sauvegardées à chaque série. Une copie locale de secours est conservée lorsque le navigateur le permet. Elles peuvent disparaître si tu effaces les données du site ou changes de navigateur. Exporte régulièrement une sauvegarde.</p><div class="storage-indicator" role="status">${storageError?'Dernière sauvegarde échouée':'Enregistrement local actif'}${storageWarning?' · '+esc(storageWarning):''}</div><div class="btn-row mt18"><button class="btn btn-secondary" data-action="export">↓ Exporter JSON</button><button class="btn btn-outline" data-action="import">↑ Importer</button></div><button class="btn btn-secondary btn-full mt12" data-action="exportEncrypted">Exporter une sauvegarde chiffrée (mot de passe)</button><button class="btn btn-outline btn-full mt12" data-action="restorePrevious">Récupérer la copie locale précédente</button><p class="tiny muted mt8">La copie précédente peut ne pas exister et ne remplace pas un export JSON conservé ailleurs.</p><div class="divider"></div><button class="btn btn-danger btn-full" data-action="reset">Effacer toutes mes données</button></div></section><section class="section"><div class="card"><h3>Installer sur Android</h3><p class="notice mt8">Une fois l'application hébergée en HTTPS (GitHub Pages, par exemple), ouvre-la dans Chrome, puis choisis « Installer l'application » ou « Ajouter à l'écran d'accueil » dans le menu ⋮.</p><p class="notice mt12">La mise en cache permet ensuite l'utilisation hors connexion. L'ouverture du fichier HTML seul permet le suivi local, mais pas l'installation PWA ni le mode hors ligne complet.</p></div></section><section class="section">${safeBanner()}<p class="notice mt12">Référence santé : <a href="https://www.ameli.fr/assure/sante/themes/sciatique/que-faire-quand-consulter" target="_blank" rel="noopener noreferrer">Assurance Maladie — Sciatique, quand consulter ?</a></p></section>`}

function exerciseSketch(id){
 const isPull=EXERCISES[id]?.kind==='pull',isDip=EXERCISES[id]?.kind==='dip',isRow=EXERCISES[id]?.kind==='row';
 const bar=isPull?'<path d="M18 24H222" stroke="#D1A17B" stroke-width="7" stroke-linecap="round"/>':isRow?'<path d="M22 71H218" stroke="#D1A17B" stroke-width="7" stroke-linecap="round"/><path d="M36 71v90m168-90v90" stroke="#587783" stroke-width="6"/>':isDip?'<path d="M28 54h45v102M167 54h45v102" stroke="#D1A17B" stroke-width="7" stroke-linecap="round"/>':'<path d="M15 160H225" stroke="#5b7780" stroke-width="4"/>';
 const person=isPull?'<circle cx="120" cy="67" r="18"/><path d="M120 85v62m0-47l-37-53m37 53l37-53m-37 99l-25 48m25-48l25 48"/>':isRow?'<circle cx="92" cy="104" r="13"/><path d="M105 110l47 19 30 20m-53-29l18-46m-39 37 6-40"/>':isDip?'<circle cx="120" cy="63" r="18"/><path d="M120 81v62m-2-43l-35-44m35 44l35-44m-35 87l-27 34m27-34l25 34"/>':id==='squat'||id==='squatTempo'||id==='lunge'?'<circle cx="120" cy="47" r="18"/><path d="M120 66l-10 47m10-36l-29 34m29-34l23 34m-33 2l-36 19 9 28m27-47l39 23 26 0"/>':id==='bridge'||id==='bridgeSingle'||id==='bird'||id==='side'?'<circle cx="66" cy="98" r="17"/><path d="M80 105l65 5m-58 0l-10 50m65-50l35 50m-40-50l35 34"/>':'<circle cx="65" cy="115" r="17"/><path d="M81 120l59 20m-48-10l-18 30m65-20l42 20m-28-15l-12 15"/>';
 return `<svg class="exercise-sketch" viewBox="0 0 240 185" role="img" aria-label="Schéma simplifié du mouvement ${esc(EXERCISES[id]?.name||'exercice')}; lire les consignes pour la technique"><rect width="240" height="185" rx="18" fill="#202121"/>${bar}<g fill="none" stroke="#F5F2ED" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">${person}</g><path d="M211 86v40m-9-9 9 9 9-9" fill="none" stroke="#D1A17B" stroke-width="3" stroke-linecap="round"/></svg>`;
}
function exerciseInfoModal(){const id=ui.exerciseId,e=EXERCISES[id];if(!e)return '';return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="exerciseTitle"><div class="modal-head"><div class="eyebrow">Fiche technique</div><button class="iconbtn" aria-label="Fermer" data-action="closeModal">✕</button></div><h2 id="exerciseTitle">${esc(e.name)}</h2>${exerciseSketch(id)}<p class="notice mt12">${esc(e.details)}</p><div class="card warning mt18"><p class="small">Ces schémas sont simplifiés. Arrête si la douleur augmente, si des fourmillements apparaissent ou si une faiblesse survient.</p></div><button class="btn btn-primary btn-full mt18" data-action="closeModal">Compris</button></div></div>`;}

function workout(){
 const d=store.draft;if(!d)return home();
 const total=d.exercises.reduce((n,e)=>n+e.sets.length,0),done=d.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0),guided=store.settings.guided!==false,focus=clamp(ui.focus,0,d.exercises.length-1);
 const cards=(guided?d.exercises.map((e,i)=>[e,i]).filter(([e,i])=>i===focus):d.exercises.map((e,i)=>[e,i])).map(([e,i])=>{
  const unit=esc(e.unit);const next=e.sets.findIndex(set=>!set.done);
  return `<article class="card exercise-card workout-card"><div class="card-header"><span class="eyebrow">EXERCICE ${i+1} / ${d.exercises.length}</span><span class="tag">${e.sets.filter(t=>t.done).length} / ${e.sets.length} séries</span></div><h2 class="mt12">${esc(e.name)}</h2><p class="small muted mt8">${esc(EXERCISES[e.id]?.short||'')}</p><div class="exercise-visual compact-sketch">${exerciseSketch(e.id)}<button class="text-button" data-action="exerciseInfo" data-ex="${e.id}">Consignes et sécurité ↗</button></div>
 <div class="set-list">${e.sets.map((set,j)=>`<div class="set-row ${set.done?'done':''} ${j===next?'next-set':''}"><div class="set-meta"><strong>Série ${j+1}</strong><span class="tiny muted">Cible : ${set.target} ${unit}</span></div><div class="rep-control"><button class="roundbtn" data-action="reps" data-e="${i}" data-s="${j}" data-n="-1" aria-label="Enlever une répétition à la série ${j+1}">−</button><div class="rep-count"><div class="rep-number">${num(set.actual)}</div><div class="tiny muted right">${unit}</div></div><button class="roundbtn" data-action="reps" data-e="${i}" data-s="${j}" data-n="1" aria-label="Ajouter une répétition à la série ${j+1}">+</button></div><button class="done-btn ${set.done?'checked':''}" data-action="setDone" data-e="${i}" data-s="${j}" aria-pressed="${!!set.done}">${set.done?'✓ Fait':'Valider'}</button><div class="set-feedback"><span class="tiny muted">Répétitions en réserve</span>${[0,1,2,3].map(v=>`<button class="feedback-chip ${(set.rir!==null&&num(set.rir)===v)?'active':''}" data-action="setRir" data-e="${i}" data-s="${j}" data-value="${v}" aria-pressed="${(set.rir!==null&&num(set.rir)===v)}">${v===3?'3+':v}</button>`).join('')}<button class="feedback-chip ${set.quality==='adjust'?'flagged':''}" data-action="setQuality" data-e="${i}" data-s="${j}" aria-pressed="${set.quality==='adjust'}">${set.quality==='adjust'?'Technique à corriger':set.quality==='ok'?'Technique OK':'Technique ?'}</button></div></div>`).join('')}</div></article>`}).join('');
 return `<section class="section workout-heading"><div class="session-header"><div><div class="eyebrow">CYCLE ${d.cycle||1} · S${d.week} · SÉANCE ${d.type}</div><h1 class="mt8">Entraînement</h1><p class="small muted mt8">${done}/${total} séries · <span id="timerTop">Repos : —</span></p></div><button class="btn btn-sm btn-outline" data-action="leaveWorkout">Quitter</button></div><div class="progress-track mt12"><div class="progress-fill" style="width:${Math.round(done/total*100)}%"></div></div></section>
 <section class="section workout-mini"><button class="text-button" data-action="guideToggle">${guided?'Afficher tous les exercices':'Revenir au mode guidé'}</button><button class="text-button symptom-action" data-action="interrupt">Signaler un symptôme</button></section>
 ${guided?`<section class="section"><div class="focus-pager"><button class="btn btn-outline btn-sm" data-action="focusMove" data-n="-1" ${focus===0?'disabled':''}>← Précédent</button><strong>${focus+1} / ${d.exercises.length}</strong><button class="btn btn-secondary btn-sm" data-action="focusMove" data-n="1" ${focus>=d.exercises.length-1?'disabled':''}>Suivant →</button></div></section>`:''}<section class="section">${cards}</section>
 <section class="section"><div class="timer"><div><div class="timer-caption">Temps de récupération</div><div class="timer-val" id="timerValue">02:00</div></div><div class="btn-row" style="flex:0"><button class="btn btn-sm btn-secondary" data-action="timer" data-seconds="90">1:30</button><button class="btn btn-sm btn-secondary" data-action="timer" data-seconds="150">2:30</button><button class="btn btn-sm btn-outline" data-action="timerStop">Stop</button></div></div></section>
 <section class="section session-actions"><button class="btn btn-primary btn-full" data-action="finish">Terminer et enregistrer →</button></section><section class="section workout-more"><button class="btn btn-outline btn-full" data-action="savePartial">Enregistrer une séance partielle</button><button class="text-button danger-text btn-full mt12" data-action="abandon">Supprimer cette séance non terminée</button></section><section class="section">${safeBanner()}</section>`;
}
function safetyModal(){let s=ui.safety||{pain:null,tingling:null,weakness:null,emergency:null},x=getSafety();const opts=(field,arr)=>`<div class="choice-grid">${arr.map(([value,label,cls])=>`<button class="choice ${cls||''} ${s[field]===value?'selected':''}" data-action="safetyChoice" data-field="${field}" data-value="${value}">${label}</button>`).join('')}</div>`;return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="safetyTitle"><div class="modal-head"><div class="eyebrow">Vérification avant effort</div><button class="iconbtn" aria-label="Fermer" data-action="closeModal">✕</button></div><h2 id="safetyTitle">Comment va ton dos aujourd'hui ?</h2><p class="notice mt8">Tes fourmillements jusqu’à la cheville imposent de vérifier la situation avant chaque séance. Ce formulaire ne constitue pas un examen médical.</p><div class="field"><div class="label">Douleur lombaire maintenant</div>${opts('pain',[['none','Aucune'],['mild','Présente','warning-choice'],['strong','Forte','danger-choice']])}</div><div class="field"><div class="label">Fourmillements / douleur irradiant dans la jambe</div>${opts('tingling',[['none','Aucun'],['present','Présents','warning-choice'],['worse','Aggravés','danger-choice']])}</div><div class="field"><div class="label">Nouvelle faiblesse de la jambe ou du pied</div>${opts('weakness',[['no','Non'],['yes','Oui','danger-choice']])}</div><div class="field"><div class="label">Troubles urinaires/intestinaux nouveaux ou perte de sensibilité au périnée</div>${opts('emergency',[['no','Non'],['yes','Oui','danger-choice']])}</div><div class="card ${x.kind==='allowed'?'success':x.kind==='emergency'||x.kind==='urgent'?'danger':'warning'} mt18"><p class="small">${esc(x.message)}</p></div><button class="btn ${x.kind==='allowed'?'btn-primary':'btn-secondary'} btn-full mt18" data-action="safetySubmit" ${x.kind==='missing'?'disabled':''}>${x.kind==='allowed'?'Commencer la séance →':'Enregistrer la situation et suspendre'}</button>${x.kind==='emergency'?'<a class="btn btn-danger btn-full mt8" href="tel:15">Appeler le 15</a>':''}${x.kind==='medical'?'<button class="btn btn-outline btn-full mt8" data-action="goSettings">Voir les réglages médicaux</button>':''}</div></div>`}
function finishModal(){const d=store.draft;let f=ui.finish;if(!d)return '';const selected=(field,val)=>f[field]===val?'selected':'';return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="finishTitle"><div class="modal-head"><div class="eyebrow">Bilan immédiat</div><button class="iconbtn" aria-label="Retour à la séance" data-action="closeModal">✕</button></div><h2 id="finishTitle">Séance terminée ?</h2><p class="notice mt8">${d.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0)} séries cochées. Seules ces séries compteront dans tes statistiques.</p><div class="field"><div class="label">Effort perçu</div><div class="choice-grid">${[[1,'Facile'],[3,'Modéré'],[5,'Difficile']].map(([v,l])=>`<button class="choice ${selected('effort',v)}" data-action="finishChoice" data-field="effort" data-value="${v}">${l}</button>`).join('')}</div></div><div class="field"><div class="label">État des symptômes pendant / après la séance</div><div class="choice-grid">${[['none','Aucun'],['same','Stables','warning-choice'],['worse','Aggravés','danger-choice']].map(([v,l,c])=>`<button class="choice ${c||''} ${selected('after',v)}" data-action="finishChoice" data-field="after" data-value="${v}">${l}</button>`).join('')}</div></div><div class="field"><label for="sessionNote">Commentaire (facultatif)</label><textarea id="sessionNote" data-input="finishNote" placeholder="Difficulté, technique, fatigue...">${esc(f.note)}</textarea></div>${f.after==='worse'?'<div class="card danger"><p class="small">Nouveaux symptômes ou aggravation : interrompt la progression et sollicite un avis médical avant de reprendre.</p></div>':''}<button class="btn btn-primary btn-full mt18" data-action="finishConfirm" ${f.after===null?'disabled':''}>Enregistrer ma séance</button></div></div>`}
function weeklyReviewModal(){const week=ui.reviewWeek;const r=store.weeklyReviews[reviewKey(week)]||{energy:'3',symptoms:'aucun',wins:'',challenges:''};const n=countDone(week);const suggestion=n===0?'Aucune séance enregistrée : prévois une reprise facile plutôt que de rattraper d’un coup.':`Tu as enregistré ${n} séance${n>1?'s':''} cette semaine et ${store.sessions.filter(s=>s.week===week).reduce((t,s)=>t+pullsSession(s),0)} tractions. Avance seulement si les symptômes et la récupération le permettent.`;return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="reviewTitle"><div class="modal-head"><div class="eyebrow">Ton bilan</div><button class="iconbtn" data-action="closeModal" aria-label="Fermer">✕</button></div><h2 id="reviewTitle">Semaine ${week}</h2><p class="notice mt8">${esc(suggestion)}</p><div class="field"><label for="energy">Énergie générale</label><select id="energy" data-review="energy">${[1,2,3,4,5].map(n=>`<option value="${n}" ${num(r.energy)===n?'selected':''}>${n}/5</option>`).join('')}</select></div><div class="field"><label for="symptoms">Symptômes cette semaine</label><select id="symptoms" data-review="symptoms">${[['aucun','Aucun'],['occasionnels','Occasionnels'],['fréquents','Fréquents'],['aggravés','Aggravés']].map(([val,label])=>`<option value="${val}" ${r.symptoms===val?'selected':''}>${label}</option>`).join('')}</select></div><div class="field"><label for="wins">Ce qui a bien fonctionné</label><textarea id="wins" data-review="wins" placeholder="Technique, énergie, récupération...">${esc(r.wins)}</textarea></div><div class="field"><label for="challenges">Ce qui a été difficile / à ajuster</label><textarea id="challenges" data-review="challenges" placeholder="Fatigue, exercices, symptômes...">${esc(r.challenges)}</textarea></div><button class="btn btn-primary btn-full" data-action="saveReview">Enregistrer le bilan</button></div></div>`}

function recoveryModal(){const r=ui.recoveryDraft;const sel=(field,n)=>`<button class="choice ${num(r[field])===n?'selected':''}" data-action="recoveryChoice" data-field="${field}" data-value="${n}">${n}</button>`;
 return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="recoveryTitle"><div class="modal-head"><div class="eyebrow">Récupération</div><button class="iconbtn" aria-label="Fermer" data-action="closeModal">✕</button></div><h2 id="recoveryTitle">Comment tu te sens ?</h2><p class="notice mt8">Ce carnet de bien-être n’est pas un diagnostic et ne remplace pas le contrôle des symptômes avant chaque séance.</p>${[['sleep','Qualité du sommeil (1 = mauvaise, 5 = bonne)'],['fatigue','Fatigue ressentie (1 = faible, 5 = forte)'],['soreness','Courbatures (1 = faibles, 5 = fortes)']].map(([field,label])=>`<div class="field"><span class="label">${label}</span><div class="choice-grid five">${[1,2,3,4,5].map(n=>sel(field,n)).join('')}</div></div>`).join('')}<div class="field"><span class="label">Douleur lombaire maintenant</span><div class="choice-grid two">${[['none','Absente'],['present','Présente']].map(([v,l])=>`<button class="choice ${r.pain===v?'selected':''}" data-action="recoveryChoice" data-field="pain" data-value="${v}">${l}</button>`).join('')}</div></div><div class="field"><span class="label">Fourmillements / irradiation dans la jambe</span><div class="choice-grid two">${[['none','Absents'],['present','Présents']].map(([v,l])=>`<button class="choice ${r.tingling===v?'selected':''}" data-action="recoveryChoice" data-field="tingling" data-value="${v}">${l}</button>`).join('')}</div></div><button class="btn btn-primary btn-full mt18" data-action="saveRecovery">Enregistrer mon état</button></div></div>`;}
function postponeModal(){const x=ui.postpone,old=postponedLabel(x.week,x.slot);return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="postponeTitle"><div class="modal-head"><div class="eyebrow">Planning souple</div><button class="iconbtn" aria-label="Fermer" data-action="closeModal">✕</button></div><h2 id="postponeTitle">Reporter la séance</h2><p class="notice mt8">${old?esc(old)+'. ':''}Choisis une nouvelle date. Une séance reportée n’est pas perdue et le programme n’ajoute pas de séance de rattrapage.</p><div class="field"><label for="customPostponeDate">Choisir une date (jusqu’à 90 jours)</label><input id="customPostponeDate" type="date" min="${addDays(TODAY(),1)}" max="${addDays(TODAY(),90)}" value="${addDays(TODAY(),1)}"></div><button class="btn btn-primary btn-full mt8" data-action="postponeDate">Reporter à cette date</button><div class="postpone-grid">${[1,2,3,7].map(n=>`<button class="btn btn-secondary" data-action="postponeSave" data-days="${n}">+ ${n} jour${n>1?'s':''}</button>`).join('')}</div>${old?'<button class="btn btn-outline btn-full mt12" data-action="postponeCancel">Annuler le report</button>':''}</div></div>`;}
function interruptModal(){return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="interruptTitle"><div class="modal-head"><div class="eyebrow">Sécurité avant tout</div><button class="iconbtn" aria-label="Fermer" data-action="closeModal">✕</button></div><h2 id="interruptTitle">Arrêter la séance</h2><p class="notice mt8">Si une douleur irradiant dans la jambe, des fourmillements ou une faiblesse apparaissent, n’insiste pas. Ta progression sera suspendue.</p><div class="field"><span class="label">Qu’as-tu ressenti ?</span><div class="choice-grid">${[['symptoms','Douleur / fourmillements'],['weakness','Nouvelle faiblesse'],['emergency','Troubles urinaires / périnée']].map(([value,label])=>`<button class="choice ${ui.interruptReason===value?'selected':''}" data-action="interruptChoice" data-value="${value}">${label}</button>`).join('')}</div></div>${ui.interruptReason==='emergency'?'<div class="card danger"><p>Urgence neurologique possible : appelle immédiatement le 15 ou le 112.</p><a class="btn btn-danger btn-full mt8" href="tel:15">Appeler le 15</a></div>':ui.interruptReason==='weakness'?'<div class="card warning">Nouvelle faiblesse : demande une évaluation médicale urgente.</div>':''}<button class="btn btn-danger btn-full mt18" data-action="interruptSave" ${!ui.interruptReason?'disabled':''}>Arrêter et enregistrer</button></div></div>`;}
function saveRecovery(){
 const r=ui.recoveryDraft,unsafe=r.pain!=='none'||r.tingling!=='none';
 if(unsafe){
  store.settings.medicalClearance=false;
  if(store.draft){const d=store.draft;store.postponed[slotKey(d.week,d.slot)]='medical';const n=d.exercises.reduce((sum,e)=>sum+e.sets.filter(t=>t.done).length,0);
   if(n)store.sessions.push({...d,endedAt:new Date().toISOString(),effort:3,after:'worse',status:'partial',note:'Interrompue après déclaration de symptômes pendant la récupération'});
   store.draft=null;store.restEnd=0;ui.timerEnd=0;ui.tab='home';
  }
 }
 store.recovery.push({...r,at:new Date().toISOString()});if(store.recovery.length>3000)store.recovery=store.recovery.slice(-3000);
 if(!persist()){render();return}ui.modal=null;render();notify(unsafe?'Symptômes consignés : renforcement suspendu et avis médical recommandé':'Récupération enregistrée. Contrôle avant chaque séance requis');
}
function savePostpone(days){const x=ui.postpone;if(!x)return;const d=new Date(TODAY()+'T12:00:00');d.setDate(d.getDate()+days);store.postponed[slotKey(x.week,x.slot)]=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(!persist())return;ui.modal=null;render();notify('Séance reportée sans pénalité')}
function saveInterrupt(){if(!store.draft||!ui.interruptReason)return;const d=store.draft,reason=ui.interruptReason,done=d.exercises.reduce((n,e)=>n+e.sets.filter(t=>t.done).length,0);if(done){store.sessions.push({...d,endedAt:new Date().toISOString(),effort:5,after:'worse',status:'partial',note:'Séance interrompue pour symptômes : '+reason});}store.checkins.push({at:new Date().toISOString(),week:d.week,slot:d.slot,pain:reason==='symptoms'?'present':'none',tingling:reason==='symptoms'?'worse':'none',weakness:reason==='weakness'?'yes':'no',emergency:reason==='emergency'?'yes':'no',result:reason==='emergency'?'emergency':'urgent'});store.settings.medicalClearance=false;store.postponed[slotKey(d.week,d.slot)]='medical';store.draft=null;store.restEnd=0;ui.timerEnd=0;ui.interruptReason=null;ui.modal=null;if(!persist()){render();return}go('home');notify(reason==='emergency'?'Urgence : appelle le 15 ou le 112':'Séance interrompue. Avis médical nécessaire avant la reprise')}
function startNewCycle(){const enough=Date.now()-Date.parse(store.settings.startDate+'T12:00:00')>=56*86400000||WEEKS.every((w,i)=>w.slots.every((_,j)=>!!getDone(i+1,j)));if(!enough||store.draft)return;if(!confirm('Démarrer un nouveau cycle de 8 semaines ? Les anciennes séances restent enregistrées.'))return;store.settings.cycle=cycleNo()+1;store.settings.startDate=TODAY();ui.week=1;if(!persist())return;go('home');notify('Nouveau cycle créé, ancien historique conservé')}

function assessmentModal(){
 const s=ui.assessmentDraft||{...store.settings};
 const field=(key,label,max,helper='')=>`<div class="field"><label for="assess-${key}">${label}</label><input type="number" id="assess-${key}" data-assessment="${key}" inputmode="numeric" min="0" max="${max}" value="${clamp(num(s[key]),0,max)}">${helper?`<span class="tiny muted">${helper}</span>`:''}</div>`;
 return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="assessmentTitle"><div class="modal-head"><div class="eyebrow">Personnalisation sans test maximal imposé</div><button class="iconbtn" data-action="closeModal" aria-label="Fermer">✕</button></div><h2 id="assessmentTitle">Mon bilan de départ</h2><p class="notice mt8">Renseigne uniquement des performances déjà connues. Les symptômes neurologiques doivent être examinés avant tout test ou effort de force.</p>
 ${field('baselinePullups','Tractions strictes consécutives connues',30)}
 ${field('baselineDips','Dips stricts connus (0 si inconnus)',30,'0 signifie inconnu, pas forcément incapable.')}
 ${field('baselineRows','Tractions australiennes connues',40,'Toujours garder la même inclinaison pour comparer.')}
 ${field('baselinePushups','Pompes classiques connues',60)}
 ${field('baselineSquats','Squats confortables connus',60)}
 <div class="field"><label for="assess-frequency">Fréquence souhaitée</label><select id="assess-frequency" data-assessment="frequency"><option value="2" ${num(s.frequency)===2?'selected':''}>2 séances / semaine</option><option value="3" ${num(s.frequency)===3?'selected':''}>Jusqu’à 3 séances / semaine (seulement si adaptées)</option></select></div>
 <p class="small muted">Ce choix sert au suivi. Le cycle comporte des semaines à 2 et à 3 séances ; aucune troisième séance n'est imposée automatiquement.</p>
 <button class="btn btn-primary btn-full mt18" data-action="saveAssessment">Enregistrer mes références</button></div></div>`;
}
function libraryModal(){return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="libraryTitle"><div class="modal-head"><div class="eyebrow">Bibliothèque des mouvements</div><button class="iconbtn" data-action="closeModal" aria-label="Fermer">✕</button></div><h2 id="libraryTitle">Technique et variantes</h2><p class="notice mt8">Illustrations schématiques, non photographies. Consulte les consignes et adapte les exercices uniquement lorsque ton évaluation médicale le permet.</p>${Object.entries(EXERCISES).map(([id,e])=>`<button class="library-item" data-action="exerciseInfo" data-ex="${id}"><span class="exercise-icon">${e.icon}</span><span><strong>${esc(e.name)}</strong><small>${esc(e.short)}</small></span><span aria-hidden="true">›</span></button>`).join('')}</div></div>`}
function homePreferencesModal(){return `<div class="modal-mask"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="prefsTitle"><div class="modal-head"><div class="eyebrow">Affichage personnel</div><button class="iconbtn" data-action="closeModal" aria-label="Fermer">✕</button></div><h2 id="prefsTitle">Mon accueil</h2><p class="notice mt8">Ces préférences n’affectent jamais les données ni les contrôles de sécurité.</p>${[['homeShowOverview','Afficher les statistiques essentielles'],['homeShowRecovery','Afficher le bilan de récupération'],['homeShowGoals','Afficher les objectifs']].map(([k,l])=>`<label class="check mt18"><input type="checkbox" data-field="${k}" ${store.settings[k]!==false?'checked':''}><span>${l}</span></label>`).join('')}<button class="btn btn-primary btn-full mt18" data-action="closeModal">Terminer</button></div></div>`}
function loadPulse(){
 const now=Date.now(),s=store.sessions.filter(s=>s.endedAt&&Number.isFinite(Date.parse(s.endedAt)));
 const count=(a,b)=>s.filter(x=>{const d=(now-Date.parse(x.endedAt))/86400000;return d>=a&&d<b}).reduce((n,x)=>n+(x.exercises||[]).reduce((k,e)=>k+(e.sets||[]).filter(t=>t.done).length,0),0);
 const current=count(0,7),prior=count(7,14);const delta=current-prior;
 const r=readiness();return {current,prior,delta,advice:r.level==='danger'?'Symptômes signalés : suspendre les efforts et demander un avis médical.':r.level==='warning'?'Récupération difficile : conserver ou diminuer le volume ; éviter une hausse.':current>prior*1.35&&prior>0?'Le volume a nettement augmenté. Privilégie la récupération et évite toute hausse supplémentaire.':current===0?'Aucune série enregistrée cette semaine. Aucune séance de rattrapage n’est imposée.':'Volume suivi. N’augmente qu’après des séances bien tolérées et avec une technique propre.'};
}
function chartSeries(id,scope){
 const list=store.sessions.filter(s=>scope==='all'||(s.cycle||1)===cycleNo()).slice().sort((a,b)=>Date.parse(a.endedAt)-Date.parse(b.endedAt));
 return list.flatMap(s=>(s.exercises||[]).filter(e=>e.id===id).map(e=>({when:s.endedAt,best:Math.max(0,...e.sets.filter(t=>t.done).map(t=>num(t.actual))),sets:e.sets.filter(t=>t.done).length}))).filter(x=>x.best>0).slice(-16);
}
function trendChart(){
 const id=EXERCISES[ui.statsExercise]?ui.statsExercise:'pullP',scope=ui.statsScope,series=chartSeries(id,scope),max=Math.max(1,...series.map(x=>x.best));
 const points=series.map((x,i)=>({x:series.length===1?160:35+(270*i/(series.length-1)),y:140-100*x.best/max,...x}));
 const path=points.map((p,i)=>(i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1)).join(' ');
 return `<section class="section"><div class="card"><div class="card-header"><h3>Évolution par mouvement</h3><span class="tag">${series.length} séances</span></div>
 <div class="field"><label for="statsExercise">Exercice / variante</label><select id="statsExercise" data-stats="exercise">${Object.entries(EXERCISES).map(([k,e])=>`<option value="${k}" ${k===id?'selected':''}>${esc(e.name)}</option>`).join('')}</select></div>
 <div class="choice-grid"><button class="choice ${scope==='cycle'?'selected':''}" data-action="statsScope" data-value="cycle" aria-pressed="${scope==='cycle'}">Ce cycle</button><button class="choice ${scope==='all'?'selected':''}" data-action="statsScope" data-value="all" aria-pressed="${scope==='all'}">Tous cycles</button></div>
 ${points.length?`<svg class="trend-svg" viewBox="0 0 330 182" role="img" aria-label="Progression de ${esc(EXERCISES[id].name)} : ${points.map(p=>p.best+' répétitions').join(', ')}"><path d="M35 40H305 M35 90H305 M35 140H305" fill="none" stroke="#56483E" stroke-width="1" stroke-dasharray="3 5"/><path d="${path}" fill="none" stroke="#D1A17B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${points.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4" fill="#F4C9A7"/>`).join('')}<text x="5" y="44" fill="#BFB1A5" font-size="11">${max}</text><text x="5" y="144" fill="#BFB1A5" font-size="11">0</text><text x="35" y="167" fill="#BFB1A5" font-size="11">Ancien</text><text x="265" y="167" fill="#BFB1A5" font-size="11">Récent</text></svg><p class="notice">Meilleure série validée par séance. La qualité d'exécution et l'inclinaison doivent rester comparables.</p><details class="chart-details"><summary>Afficher les valeurs exactes</summary><ol>${points.map(p=>`<li>${esc(dateLabel(p.when))} : ${p.best} répétitions (${p.sets} séries)</li>`).join('')}</ol></details>`:'<p class="empty">Aucune donnée pour cette variante et cette période.</p>'}</div></section>`;
}
function monthlyComparison(){
 const today=TODAY().slice(0,7),prev=new Date(TODAY()+'T12:00:00');prev.setMonth(prev.getMonth()-1);const prior=prev.getFullYear()+'-'+String(prev.getMonth()+1).padStart(2,'0');
 const summary=month=>{const sessions=store.sessions.filter(s=>localDay(s.endedAt).slice(0,7)===month);return {sessions:sessions.length,sets:sessions.reduce((n,s)=>n+s.exercises.reduce((m,e)=>m+e.sets.filter(t=>t.done).length,0),0),pulls:sessions.reduce((n,s)=>n+pullsSession(s),0)}};
 const a=summary(today),b=summary(prior);return `<section class="section"><div class="card"><h3>Comparatif mensuel</h3><p class="notice mt8">Mois en cours (${today}) contre mois précédent (${prior}), à dates non équivalentes. Les nombres ne corrigent pas la durée différente des périodes.</p><div class="compare-grid"><span>Indicateur</span><strong>Ce mois</strong><strong>Précédent</strong>${[['Séances','sessions'],['Séries','sets'],['Tractions','pulls']].map(([name,key])=>`<span>${name}</span><strong>${a[key]}</strong><strong>${b[key]}</strong>`).join('')}</div></div></section>`;
}
function restorePrevious(){
 let data;try{data=JSON.parse(localStorage.getItem(PREVIOUS_KEY)||'null')}catch(e){}
 if(!validImport(data)){notify('Aucune copie antérieure exploitable');return}
 if(!confirm('Restaurer la copie locale précédente ? Les changements les plus récents pourraient être perdus. Exporte le journal actuel au préalable.'))return;
 const previous=store;store=normalized(data);store.settings.medicalClearance=false;
 if(!persist()){store=previous;render();return}ui.week=currentWeek();go('home');notify('Copie antérieure restaurée. Avis médical à reconfirmer.');
}
function modal(){if(ui.modal==='assessment')return assessmentModal();if(ui.modal==='library')return libraryModal();if(ui.modal==='homePrefs')return homePreferencesModal();if(ui.modal==='safety')return safetyModal();if(ui.modal==='finish')return finishModal();if(ui.modal==='review')return weeklyReviewModal();if(ui.modal==='recovery')return recoveryModal();if(ui.modal==='postpone')return postponeModal();if(ui.modal==='interrupt')return interruptModal();if(ui.modal==='exerciseInfo')return exerciseInfoModal();return ''}
function render(keepScroll=true){
 const y=window.scrollY;
 const active=typeof document!=='undefined'?document.activeElement:null;
 const a=active?.dataset?.action, e=active?.dataset?.e, si=active?.dataset?.s, field=active?.dataset?.field;
 const output=store.draft&&ui.tab==='workout'?workout():({home,plan,evolution,stats,settings}[ui.tab]||home)();
 const inWorkout=store.draft&&ui.tab==='workout';
 $('#app').innerHTML=(inWorkout?'':topBar())+`<main class="${inWorkout?'workout-main':''}">${output}</main>`+(inWorkout?'':nav())+modal();
 if(keepScroll)window.scrollTo(0,y);else window.scrollTo(0,0);
 let withinModal=false;if(a){const selector='[data-action="'+a+'"]'+(e!==undefined?'[data-e="'+e+'"]':'')+(si!==undefined?'[data-s="'+si+'"]':'')+(field!==undefined?'[data-field="'+field+'"]':'');const el=document.querySelector(selector);if(el&&el.focus){el.focus({preventScroll:true});withinModal=!!el.closest?.('.modal')}}
 if(ui.modal&&!lastModalWasOpen){if(active&&!active.closest?.('.modal'))modalPreviousFocus={action:active.dataset?.action||'',field:active.dataset?.field||''};}
 if(ui.modal&&!withinModal){const box=document.querySelector('.modal');if(box&&typeof box.hasAttribute==='function'&&!box.hasAttribute('tabindex'))box.setAttribute('tabindex','-1');if(box&&box.focus)box.focus({preventScroll:true})}
 if(!ui.modal&&lastModalWasOpen){const target=modalPreviousFocus?.action?document.querySelector('[data-action="'+modalPreviousFocus.action+'"]'):null;if(target?.focus)target.focus({preventScroll:true});else document.querySelector('.topbar button, .navbtn')?.focus?.({preventScroll:true});modalPreviousFocus=null}
 lastModalWasOpen=!!ui.modal;
 tickTimer();
}
function go(tab){ui.tab=tab;ui.modal=tab==='workout'&&store.draft&&(!store.settings.medicalClearance||latestUnsafeToday())?'interrupt':null;render(false)}
function startCheckin(week,slot){if(postponedLabel(week,slot)&&!(store.postponed[slotKey(week,slot)]==='medical'&&store.settings.medicalClearance&&!latestUnsafeToday())){notify('Séance reportée : modifie la date depuis le calendrier');return}if(store.draft){notify('Termine ou abandonne d’abord la séance en cours');go('workout');return}if(getDone(week,slot)){notify('Cette séance est déjà terminée');return}ui.safety={pain:null,tingling:null,weakness:null,emergency:null,week,slot};ui.modal='safety';render()}
function checkinSubmit(){
 const x=getSafety(),s=ui.safety;if(x.kind==='missing')return;
 store.checkins.push({at:new Date().toISOString(),week:s.week,slot:s.slot,pain:s.pain,tingling:s.tingling,weakness:s.weakness,emergency:s.emergency,result:x.kind});
 if(x.kind!=='allowed')store.settings.medicalClearance=false;
 if(x.kind==='allowed'){
  delete store.postponed[slotKey(s.week,s.slot)];store.draft=makeDraft(s.week,s.slot);ui.tab='workout';ui.modal=null;ui.timerEnd=0;store.restEnd=0;
  if(!persist()){ui.tab='home';render(false);return}render(false);notify('Séance démarrée — technique avant performance');return;
 }
 // Suspension sans date arbitraire : un nouveau feu vert clinique est nécessaire.
 store.postponed[slotKey(s.week,s.slot)]='medical';
 if(!persist())return;ui.modal=null;render();notify(x.kind==='emergency'?'Urgence : appelle le 15 ou le 112':'Séance en pause — avis médical requis');
}
function addDays(date,days){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+days);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function writeSet(e,s,change,mode){
 if(!store.draft)return;
 if(!store.settings.medicalClearance||latestUnsafeToday()){ui.modal='interrupt';render();notify('Séance bloquée : fais réévaluer tes symptômes');return}
 const ex=store.draft.exercises?.[e];const t=ex?.sets?.[s];if(!t)return;
 if(mode==='reps')t.actual=clamp(num(t.actual)+change,0,1000);
 else {t.done=!t.done;if(t.done){ui.timerEnd=Date.now()+((['pull','row','dip'].includes(EXERCISES[ex.id]?.kind))?150:90)*1000;store.restEnd=ui.timerEnd;}}
 if(!persist())return;
 const advanced=mode==='done'&&t.done&&store.settings.guided!==false&&ex.sets.every(set=>set.done)&&ui.focus<store.draft.exercises.length-1;
 if(advanced)ui.focus++;
 render(!advanced);
}
function localDay(timestamp){const d=new Date(timestamp);return Number.isFinite(d.getTime())?d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'):''}
function latestUnsafeToday(){
 return store.checkins.some(c=>localDay(c.at)===TODAY()&&['pause','urgent','emergency'].includes(c.result))||
 (store.recovery||[]).some(r=>localDay(r.at)===TODAY()&&(r.pain!=='none'||r.tingling!=='none'));
}
function savePartial(reason='Séance partielle enregistrée'){
 const d=store.draft;if(!d)return;const count=d.exercises.reduce((n,e)=>n+e.sets.filter(t=>t.done).length,0);
 if(!count){notify('Valide au moins une série pour conserver une séance partielle');return}
 store.sessions.push({...d,endedAt:new Date().toISOString(),effort:3,after:latestUnsafeToday()?'worse':'none',status:'partial',note:reason});
 store.draft=null;store.restEnd=0;ui.timerEnd=0;ui.modal=null;ui.focus=0;
 if(!persist())return;go('stats');notify('Séance partielle enregistrée et conservée');
}
function confirmFinish(){
 if(!store.draft||!ui.finish.after)return;
 if(!store.settings.medicalClearance||latestUnsafeToday()){ui.modal='interrupt';render();notify('Validation normale bloquée : symptômes signalés');return}
 const done=store.draft.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0);
 if(done===0){notify('Valide au moins une série avant d’enregistrer');return}
 const worse=ui.finish.after!=='none';const all=store.draft.exercises.reduce((n,e)=>n+e.sets.length,0);
 store.sessions.push({...store.draft,endedAt:new Date().toISOString(),effort:num(ui.finish.effort),after:ui.finish.after,status:(done===all&&!worse?'complete':'partial'),note:String(ui.finish.note||'').slice(0,2000)});
 if(worse)store.settings.medicalClearance=false;
 store.draft=null;ui.focus=0;ui.finish={effort:3,after:null,note:''};ui.modal=null;ui.timerEnd=0;store.restEnd=0;
 if(!persist())return;go('stats');notify(worse?'Séance partielle : nouveaux symptômes. Avis médical nécessaire.':'Séance enregistrée');
}
function saveReview(){const week=ui.reviewWeek;const r={energy:$('#energy').value,symptoms:$('#symptoms').value,wins:$('#wins').value.slice(0,1200),challenges:$('#challenges').value.slice(0,1200),at:new Date().toISOString()};store.weeklyReviews[reviewKey(week)]=r;if(r.symptoms!=='aucun')store.settings.medicalClearance=false;if(!persist())return;ui.modal=null;render();notify('Bilan de semaine enregistré')}
async function encryptBackup(){
 if(typeof crypto==='undefined'||!crypto.subtle){notify('Chiffrement non disponible dans ce navigateur : utilise BARRE en HTTPS.');return}
 const pass=window.prompt('Mot de passe de la sauvegarde chiffrée (12 caractères minimum). Il ne sera pas conservé.');
 if(pass===null)return;if(pass.length<12){notify('Mot de passe trop court : 12 caractères minimum');return}
 const confirmation=window.prompt('Confirme ce mot de passe :');if(confirmation!==pass){notify('Les mots de passe ne correspondent pas');return}
 try{
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const encoder=new TextEncoder();
  const material=await crypto.subtle.importKey('raw',encoder.encode(pass),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt']);
  const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,encoder.encode(JSON.stringify(store)));
  const b64=buf=>{const bytes=new Uint8Array(buf);let chars='';for(let i=0;i<bytes.length;i+=32768)chars+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(chars)};
  const envelope={format:'barre-encrypted-v1',kdf:'PBKDF2-SHA256',iterations:210000,salt:b64(salt),iv:b64(iv),payload:b64(encrypted),createdAt:new Date().toISOString()};
  downloadBackup(JSON.stringify(envelope,null,2),'barre-protegee-'+TODAY()+'.json');notify('Sauvegarde protégée créée. Conserve ton mot de passe.');
 }catch(e){console.error(e);notify('Impossible de chiffrer cette sauvegarde')}
}
async function decryptBackup(envelope){
 if(!crypto?.subtle||envelope.format!=='barre-encrypted-v1'||envelope.kdf!=='PBKDF2-SHA256'||envelope.iterations!==210000)throw new Error('Format chiffré incompatible');
 const password=window.prompt('Mot de passe de la sauvegarde protégée :');if(password===null)throw new Error('Import annulé');
 const un64=s=>Uint8Array.from(atob(s),x=>x.charCodeAt(0));
 if([envelope.salt,envelope.iv,envelope.payload].some(x=>typeof x!=='string'||x.length>3000000))throw new Error('Fichier incorrect');
 const salt=un64(envelope.salt),iv=un64(envelope.iv);if(salt.length!==16||iv.length!==12)throw new Error('Métadonnées incorrectes');
 const encoder=new TextEncoder(),material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
 const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,un64(envelope.payload));return JSON.parse(new TextDecoder().decode(bytes));
}
function downloadBackup(content,name){const blob=new Blob([content],{type:'application/json'}),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
function exportData(){downloadBackup(JSON.stringify(store,null,2),`barre-sauvegarde-${TODAY()}.json`);notify('Sauvegarde téléchargée — fichier non chiffré')}
function validDraft(d){return d==null||!!(d&&Number.isInteger(+d.week)&&+d.week>=1&&+d.week<=8&&['A','B'].includes(d.type)&&Array.isArray(d.exercises)&&d.exercises.length<=16&&d.exercises.every(e=>e&&EXERCISES[e.id]&&Array.isArray(e.sets)&&e.sets.length<=20&&e.sets.every(t=>t&&Number.isFinite(+t.actual)&&+t.actual>=0&&+t.actual<=1000)))}
function validImport(x){return x&&x.version===1&&x.settings&&typeof x.settings.startDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.settings.startDate)&&Number.isFinite(+x.settings.baselinePullups)&&+x.settings.baselinePullups>=1&&+x.settings.baselinePullups<=30&&Array.isArray(x.sessions)&&Array.isArray(x.checkins)&&x.weeklyReviews&&typeof x.weeklyReviews==='object'&&!Array.isArray(x.weeklyReviews)&&x.sessions.length<10000&&x.checkins.length<50000&&(!x.recovery||(Array.isArray(x.recovery)&&x.recovery.length<3000))&&(!x.postponed||(typeof x.postponed==='object'&&!Array.isArray(x.postponed)))&&validDraft(x.draft)&&x.sessions.every(s=>s&&Number.isInteger(+s.week)&&+s.week>=1&&+s.week<=8&&(s.cycle==null||(Number.isInteger(+s.cycle)&&+s.cycle>=1&&+s.cycle<=100))&&(!s.status||['complete','partial'].includes(s.status))&&Array.isArray(s.exercises)&&s.exercises.length<=25&&s.exercises.every(e=>e&&typeof e.id==='string'&&EXERCISES[e.id]&&Array.isArray(e.sets)&&e.sets.length<=30&&e.sets.every(t=>Number.isFinite(+t.actual)&&+t.actual>=0&&+t.actual<=1000)))}
function tickTimer(){let target=$('#timerValue');if(!target)return;let top=$('#timerTop');if(!ui.timerEnd){target.textContent='02:00';if(top)top.textContent='Repos : —';return}const rem=Math.max(0,Math.ceil((ui.timerEnd-Date.now())/1000));let formatted=String(Math.floor(rem/60)).padStart(2,'0')+':'+String(rem%60).padStart(2,'0');target.textContent=formatted;if(top)top.textContent='Repos : '+formatted;if(rem===0){ui.timerEnd=0;store.restEnd=0;persist();notify('Récupération terminée')}}
setInterval(tickTimer,350);
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-action]');if(!b||b.disabled)return;const a=b.dataset.action;let w=num(b.dataset.week),slot=num(b.dataset.slot);
 switch(a){
 case 'tab':go(b.dataset.tab);break;
 case 'assessment':ui.assessmentDraft={...store.settings};ui.modal='assessment';render();break;
 case 'saveAssessment':{
  const next=ui.assessmentDraft||{};
  for(const k of ['baselinePullups','baselineDips','baselineRows','baselinePushups','baselineSquats'])store.settings[k]=clamp(num(next[k]),k==='baselinePullups'?1:0,k==='baselineSquats'||k==='baselinePushups'?60:40);
  store.settings.frequency=[2,3].includes(num(next.frequency))?num(next.frequency):2;store.settings.onboarded=true;
  if(!persist())break;ui.modal=null;render();notify('Bilan enregistré : aucune épreuve maximale exigée');break;
 }
 case 'homePrefs':ui.modal='homePrefs';render();break;
 case 'library':ui.modal='library';render();break;
 case 'statsScope':ui.statsScope=b.dataset.value==='all'?'all':'cycle';render();break;
 case 'restorePrevious':restorePrevious();break;
 case 'week':ui.week=clamp(w,1,8);render();break;
 case 'checkin':startCheckin(w,slot);break;
 case 'resume':go('workout');break;
 case 'leaveWorkout':go('home');break;
 case 'closeModal':if(ui.modal==='interrupt'&&(!store.settings.medicalClearance||latestUnsafeToday())){ui.modal=null;go('home');notify('Séance suspendue : fais évaluer les symptômes');break}ui.modal=null;render();break;
 case 'safetyChoice':ui.safety[b.dataset.field]=b.dataset.value;render();break;
 case 'safetySubmit':checkinSubmit();break;
 case 'goSettings':go('settings');break;
 case 'reps':writeSet(num(b.dataset.e),num(b.dataset.s),num(b.dataset.n),'reps');break;
 case 'setDone':writeSet(num(b.dataset.e),num(b.dataset.s),0,'done');break;
 case 'setRir':{const t=store.draft?.exercises?.[num(b.dataset.e)]?.sets?.[num(b.dataset.s)];if(t){t.rir=clamp(num(b.dataset.value),0,3);if(persist())render()}break;}
 case 'setQuality':{const t=store.draft?.exercises?.[num(b.dataset.e)]?.sets?.[num(b.dataset.s)];if(t){t.quality=t.quality==='ok'?'adjust':'ok';if(persist())render()}break;}
 case 'savePartial':savePartial();break;
 case 'timer':ui.timerEnd=Date.now()+num(b.dataset.seconds)*1000;store.restEnd=ui.timerEnd;persist();tickTimer();break;
 case 'timerStop':ui.timerEnd=0;store.restEnd=0;persist();tickTimer();notify('Chronomètre arrêté');break;
 case 'finish':ui.modal='finish';render();break;
 case 'finishChoice':ui.finish[b.dataset.field]=b.dataset.field==='effort'?num(b.dataset.value):b.dataset.value;render();break;
 case 'finishConfirm':confirmFinish();break;
 case 'abandon':if(confirm('Supprimer le brouillon ? Les séries cochées non encore enregistrées seront perdues.')){store.draft=null;store.restEnd=0;ui.timerEnd=0;persist();go('home');notify('Séance abandonnée')}break;

 case 'recovery':ui.recoveryDraft={sleep:3,fatigue:3,soreness:2,pain:'none',tingling:'none'};ui.modal='recovery';render();break;
 case 'recoveryChoice':ui.recoveryDraft[b.dataset.field]=['sleep','fatigue','soreness'].includes(b.dataset.field)?clamp(num(b.dataset.value),1,5):b.dataset.value;render();break;
 case 'saveRecovery':saveRecovery();break;
 case 'postpone':ui.postpone={week:w,slot};ui.modal='postpone';render();break;
 case 'postponeSave':savePostpone(clamp(num(b.dataset.days),1,30));break;
 case 'postponeDate':{const v=$('#customPostponeDate')?.value;if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||v<addDays(TODAY(),1)||v>addDays(TODAY(),90)){notify('Choisis une date entre demain et 90 jours');break;}store.postponed[slotKey(ui.postpone.week,ui.postpone.slot)]=v;if(!persist())break;ui.modal=null;render();notify('Séance reportée au '+dateLabel(v+'T12:00:00'));break;} 
 case 'postponeCancel':if(ui.postpone){delete store.postponed[slotKey(ui.postpone.week,ui.postpone.slot)];persist();ui.modal=null;render();notify('Report annulé')}break;
 case 'focusMove':ui.focus=clamp(ui.focus+num(b.dataset.n),0,store.draft?.exercises.length-1||0);render(false);break;
 case 'guideToggle':store.settings.guided=store.settings.guided===false;persist();render(false);break;
 case 'interrupt':ui.interruptReason=null;ui.modal='interrupt';render();break;
 case 'interruptChoice':ui.interruptReason=b.dataset.value;render();break;
 case 'interruptSave':saveInterrupt();break;
 case 'exerciseInfo':ui.exerciseId=b.dataset.ex;ui.modal='exerciseInfo';render();break;
 case 'muscle':ui.muscle=b.dataset.muscle;render();break;
 case 'newCycle':startNewCycle();break;
 case 'review':ui.reviewWeek=w;ui.modal='review';render();break;
 case 'saveReview':saveReview();break;
 case 'export':exportData();break;
 case 'exportEncrypted':encryptBackup();break;
 case 'import':$('#importFile').click();break;
 case 'reset':if(confirm('Effacer DÉFINITIVEMENT toutes tes séances et données locales ? Exporte d’abord une sauvegarde si besoin.')){store=fresh();persist();ui.week=1;go('home');notify('Données locales effacées')}break;
 }
});
document.addEventListener('change',ev=>{const t=ev.target;
 if(t.dataset.assessment){if(ui.assessmentDraft){ui.assessmentDraft[t.dataset.assessment]=t.value}return}
 if(t.dataset.stats==='exercise'){ui.statsExercise=EXERCISES[t.value]?t.value:'pullP';render();return}
 const k=t.dataset.field;if(!k)return;switch(k){
 case 'legVariant':store.settings.legVariant=t.value==='control'?'control':'standard';if(persist())render();break;
 case 'homeShowGoals':case 'homeShowRecovery':case 'homeShowOverview':store.settings[k]=!!t.checked;if(persist())render();break;case 'startDate':if(/^\d{4}-\d{2}-\d{2}$/.test(t.value)){store.settings.startDate=t.value;persist();ui.week=currentWeek();render();}break;case 'baselinePullups':store.settings.baselinePullups=clamp(num(t.value),1,16);persist();notify('Référence mise à jour');break;case 'goalPullups':store.settings.goalPullups=clamp(num(t.value),1,30);persist();render();break;case 'goalDips':store.settings.goalDips=clamp(num(t.value),1,30);persist();render();break;case 'dipsEnabled':store.settings.dipsEnabled=!!t.checked;persist();render();notify(t.checked?'Dips activés pour les prochaines séances A':'Pompes réactivées pour les prochaines séances A');break;case 'dipsMode':if(['assist','strict'].includes(t.value)){store.settings.dipsMode=t.value;persist();render();notify('Niveau de dips mis à jour')}break;case 'rowsEnabled':store.settings.rowsEnabled=!!t.checked;persist();render();notify(t.checked?'Tractions australiennes ajoutées aux prochaines séances B':'Tractions australiennes désactivées pour les prochaines séances B');break;case 'rowsMode':if(['incline','horizontal'].includes(t.value)){store.settings.rowsMode=t.value;persist();render();notify('Variante australiennes mise à jour')}break;case 'goalRows':store.settings.goalRows=clamp(num(t.value),1,30);persist();render();break;case 'medicalClearance':store.settings.medicalClearance=!!t.checked;persist();notify(t.checked?'Avis médical déclaré — vérification toujours nécessaire':'Déclaration retirée');break;}});
document.addEventListener('input',ev=>{const t=ev.target;if(t.dataset.input==='finishNote')ui.finish.note=t.value});
$('#importFile').addEventListener('change',async ev=>{const file=ev.target.files[0];ev.target.value='';if(!file)return;if(file.size>6000000){notify('Fichier trop volumineux (max 6 Mo)');return}try{let data=JSON.parse(await file.text());if(data?.format==='barre-encrypted-v1')data=await decryptBackup(data);if(!validImport(data)){notify('Sauvegarde non valide');return}if(!confirm('Remplacer toutes les données actuelles par cette sauvegarde ?'))return;const next=fresh();next.settings={...next.settings,...data.settings,medicalClearance:false,cycle:clamp(num(data.settings.cycle)||1,1,100),dipsEnabled:data.settings.dipsEnabled!==false,dipsMode:data.settings.dipsMode==='strict'?'strict':'assist',rowsEnabled:data.settings.rowsEnabled!==false,rowsMode:data.settings.rowsMode==='horizontal'?'horizontal':'incline',goalRows:clamp(num(data.settings.goalRows)||12,1,30)};next.sessions=data.sessions.map(s=>({...s,exercises:s.exercises.map(e=>({...e,sets:e.sets.map(t=>({...t,rir:t.rir===null||t.rir===undefined?null:clamp(num(t.rir),0,3),quality:['ok','adjust'].includes(t.quality)?t.quality:null}))}))}));next.checkins=data.checkins;next.weeklyReviews=data.weeklyReviews;next.recovery=Array.isArray(data.recovery)?data.recovery.slice(-2000):[];next.postponed=data.postponed&&typeof data.postponed==='object'?data.postponed:{};next.draft=validDraft(data.draft)?data.draft:null;store=next;if(!persist())return;ui.week=currentWeek();go('home');notify('Sauvegarde importée. Avis médical à reconfirmer.')}catch(e){notify('Impossible de lire ce fichier JSON')}});
window.addEventListener('error',e=>console.error('BARRE',e.message));
document.addEventListener('keydown',e=>{
 if(!ui.modal)return;
 const dialog=document.querySelector('.modal');if(!dialog)return;
 if(e.key==='Escape'){
  if(ui.modal==='interrupt'&&(!store.settings.medicalClearance||latestUnsafeToday())){ui.modal=null;go('home');return}
  ui.modal=null;render();return;
 }
 if(e.key!=='Tab')return;
 const els=[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);
 if(!els.length){e.preventDefault();dialog.focus();return}
 const first=els[0],last=els.at(-1);
 if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue!==lastStorageRaw){storageWarning='Données modifiées dans un autre onglet : recharge cette page avant d’écrire.';notify(storageWarning)}});
if('serviceWorker' in navigator&&location.protocol!=='file:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Service worker non enregistré',e)))}
render(false);
if(typeof indexedDB!=='undefined')window.addEventListener('load',offerBackupRecovery);
