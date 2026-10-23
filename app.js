(() => {
  "use strict";
  const STORAGE_KEY = "toronto-hoodman-save-v1";
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const districts = [
    {id:"downtown",name:"Downtown Core",emoji:"🌆",desc:"Clubs, promoters, studios, office towers, and expensive mistakes.",tags:["Nightlife","Networking","Music"],risk:"Medium",colour:"#ff8a58"},
    {id:"blocks",name:"The Blocks",emoji:"🏀",desc:"Community events, local legends, basketball courts, and neighbourhood drama.",tags:["Community","Sports","Favors"],risk:"Low"},
    {id:"market",name:"Market Row",emoji:"🥡",desc:"Independent shops, oddball vendors, food challenges, and suspicious rumours.",tags:["Trading","Shopping","Clues"],risk:"Low"},
    {id:"industrial",name:"Industrial Mile",emoji:"🏭",desc:"Garages, warehouses, mechanics, and mysterious deliveries.",tags:["Repairs","Mystery","Risk"],risk:"High"},
    {id:"plaza",name:"Plaza District",emoji:"🛒",desc:"Takeout spots, car meets, parking-lot arguments, and local gossip.",tags:["Side hustles","Cars","Gossip"],risk:"Medium"},
    {id:"waterfront",name:"The Waterfront",emoji:"🌊",desc:"Event venues, waterfront parties, expensive apartments, and rare encounters.",tags:["Events","Status","Rare jobs"],risk:"Medium"}
  ];
  const classes = {
    hustler:{label:"The Hustler",desc:"Business, negotiation, and money-making.",skill:"Talk Your Way Out",emoji:"💼"},
    rapper:{label:"The Rapper",desc:"Performance, fame, and social influence.",skill:"Crowd Control",emoji:"🎤"},
    brains:{label:"The Brains",desc:"Investigation, planning, and technical challenges.",skill:"Connect the Dots",emoji:"🧠"},
    enforcer:{label:"The Enforcer",desc:"Defence, physical challenges, and protecting allies.",skill:"Hold the Line",emoji:"🥊"},
    influencer:{label:"The Influencer",desc:"Publicity, networking, and information gathering.",skill:"Make It Go Viral",emoji:"📱"}
  };
  const missions = [
    {id:"whip",title:"Who Took the Whip?",type:"INVESTIGATION",district:"Plaza District",districtId:"plaza",desc:"A friend's prized car has vanished before a car meet. Interview witnesses, compare stories, and figure out who is lying.",stat:"streetSmarts",dc:12,reward:250,xp:40,emoji:"🚘",flavour:"Three witnesses, four stories, and one guy who keeps saying 'I wasn't even there.'"},
    {id:"rap",title:"The Rap Battle Disaster",type:"SOCIAL CHAOS",district:"Downtown Core",districtId:"downtown",desc:"An open-mic host needs someone to stop a rap battle from turning into a public roast of the entire venue.",stat:"clout",dc:12,reward:180,xp:30,emoji:"🎤",flavour:"The DJ has unplugged the aux. The crowd is somehow angrier now."},
    {id:"meter",title:"The Parking Meter Incident",type:"ODD JOB",district:"Market Row",districtId:"market",desc:"A local says a parking meter stole their money and demands a full investigation. The meter refuses to comment.",stat:"brains",dc:8,reward:120,xp:20,emoji:"🅿️",flavour:"The main suspect is a machine. Your client is very confident."},
    {id:"snow",title:"Snow Day Logistics",type:"COMMUNITY",district:"The Blocks",districtId:"blocks",desc:"A snowstorm has trapped a community event's supplies on the wrong side of town. Get the right people talking.",stat:"talk",dc:12,reward:160,xp:25,emoji:"❄️",flavour:"Everyone owns a shovel. Nobody owns a plan."},
    {id:"mystery",title:"The Suspicious Delivery",type:"MYSTERY",district:"Industrial Mile",districtId:"industrial",desc:"A mechanic received a crate addressed to 'Definitely Not A Mystery'. Find the sender and uncover what's inside.",stat:"brains",dc:16,reward:340,xp:45,emoji:"📦",flavour:"The label has three question marks and a smiley face. Normal."},
    {id:"influencer",title:"Main Character Energy",type:"PUBLICITY",district:"The Waterfront",districtId:"waterfront",desc:"A local event is one bad post away from going viral for the wrong reasons. Save the launch and your new contact's reputation.",stat:"clout",dc:16,reward:300,xp:40,emoji:"📸",flavour:"The event's mascot has gone missing. The mascot is a grown adult in a foam beaver suit."},
    {id:"food",title:"The Great Poutine Debate",type:"COMPETITION",district:"Market Row",districtId:"market",desc:"Two food stalls have started a citywide argument about the best poutine. Settle it in a blind taste test.",stat:"talk",dc:8,reward:100,xp:15,emoji:"🍟",flavour:"The cheese curds have become political."},
    {id:"garage",title:"Garage Band Emergency",type:"MUSIC",district:"Industrial Mile",districtId:"industrial",desc:"A rehearsal space has lost its only working amp hours before a showcase. Find a solution before the drummer starts a podcast.",stat:"brains",dc:12,reward:220,xp:30,emoji:"🎸",flavour:"The drummer has already started recording an episode."}
  ];
  const shopItems = [
    {id:"coffee",name:"Emergency Coffee",emoji:"☕",price:15,desc:"Restore 5 HP. Questionable freshness." ,kind:"heal",value:5},
    {id:"pizza",name:"Late-Night Pizza",emoji:"🍕",price:25,desc:"Restore 10 HP. Somehow still warm.",kind:"heal",value:10},
    {id:"hoodie",name:"Limited Drop Hoodie",emoji:"🧥",price:90,desc:"A clean fit. +1 Clout while owned.",kind:"gear",stat:"clout",value:1},
    {id:"sneakers",name:"Fresh Sneakers",emoji:"👟",price:140,desc:"Walk like you have somewhere to be.",kind:"gear",stat:"streetSmarts",value:1},
    {id:"notebook",name:"Investigation Notebook",emoji:"📓",price:60,desc:"A suspiciously professional notebook.",kind:"gear",stat:"brains",value:1},
    {id:"speaker",name:"Portable Speaker",emoji:"🔊",price:110,desc:"Bring the vibe. Annoy the neighbours.",kind:"gear",stat:"clout",value:1}
  ];
  const quotes = [
    "In Toronto, the only thing moving faster than the gossip is the rent.",
    "A plan is just a bad idea wearing a clean jacket.",
    "The streetcar is late, your cousin is later, and somehow it's your fault.",
    "Never underestimate a person who says 'I know a guy' three times in one sentence.",
    "Your reputation arrived five minutes before you. It was also late."
  ];
  const events = [
    ["CITY ALERT","Snow is coming.","The streetcar is late. Naturally.","-2°C · Snow"],
    ["CITY ALERT","The city is awake.","Somebody's filming a music video in a loading zone.","4°C · Cloudy"],
    ["CITY ALERT","Weekend energy.","Parking is now a competitive sport.","7°C · Overcast"],
    ["CITY ALERT","A suspiciously calm day.","Somebody, somewhere, is about to start drama.","3°C · Windy"]
  ];
  let state = loadState();
  let activeMission = null;
  let missionFilter = "all";
  let toastTimer;

  function defaultState() {
    return {version:1,character:null,cash:500,xp:0,level:1,hp:20,maxHp:20,inventory:[],completedMissions:[],rep:0,districtRep:{},district:"Plaza District",crewName:"The Unemployed Legends",crewRep:0,log:[],createdAt:new Date().toISOString()};
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return {...defaultState(),...parsed, districtRep:parsed.districtRep||{}, inventory:parsed.inventory||[], completedMissions:parsed.completedMissions||[], log:parsed.log||[]};
    } catch { return defaultState(); }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { toast("Save failed. Export your save and check browser storage settings.", true); }
  }
  function modifier(stat) { return Math.floor((Number(stat)-10)/2); }
  function roll(sides=20) { return Math.floor(Math.random()*sides)+1; }
  function fmtMoney(n) { return "$"+Number(n).toLocaleString("en-CA"); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function log(message, type="event") {
    state.log.unshift({message,type,time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})});
    state.log = state.log.slice(0,30); saveState(); renderLog();
  }
  function toast(message, error=false) {
    const el=$("#toast"); el.textContent=message; el.classList.toggle("error",error); el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2800);
  }
  function go(page) {
    $$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
    $$(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
    $("#page-breadcrumb").textContent=page.replace(/-/g," ").toUpperCase();
    window.scrollTo({top:0,behavior:"smooth"});
    if(page==="character") renderCharacter();
    if(page==="city") renderCity();
    if(page==="missions") renderMissions();
    if(page==="inventory") renderInventory();
    if(page==="crew") renderCrew();
    if(page==="settings") {}
  }
  function openModal(id) { const d=$("#"+id); if(d.showModal) d.showModal(); else d.setAttribute("open",""); }
  function closeModal(id) { const d=$("#"+id); if(d.close) d.close(); else d.removeAttribute("open"); }
  function statValue(key) {
    const base=state.character?.stats?.[key] ?? 10;
    const gear=state.inventory.filter(item=>item.kind==="gear"&&item.stat===key).reduce((sum,item)=>sum+item.value,0);
    return Math.min(20,base+gear);
  }
  function xpToNext() { return state.level*100; }
  function levelFromXp(xp) { return Math.min(20,Math.floor(xp/100)+1); }
  function repLabel(rep) { return rep>=300?"CITY LEGEND":rep>=150?"KNOWN FACE":rep>=60?"GETTING NOTICED":rep>=20?"LOCAL REGULAR":"UNKNOWN"; }
  function addRep(district, amount) {
    state.rep += amount;
    state.districtRep[district]=(state.districtRep[district]||0)+amount;
    state.crewRep += Math.max(1,Math.floor(amount/2));
  }
  function renderAll() {
    const char=state.character;
    $("#welcome-name").textContent=char?char.name:"New Face?";
    $("#welcome-subtitle").textContent=char?`${classes[char.class].label} · ${char.backgroundLabel} · currently in ${state.district}`:"Build your character and get into the city.";
    $("#welcome-avatar").textContent=char?char.name.charAt(0).toUpperCase():"?";
    $("#avatar-mini").textContent=char?char.name.charAt(0).toUpperCase():"?";
    $("#create-character-cta").textContent=char?"Edit character ＋":"Create character ＋";
    $("#dash-cash").textContent=fmtMoney(state.cash);
    $("#dash-level").textContent="LVL "+state.level;
    $("#dash-rep").textContent=repLabel(state.rep);
    $("#dash-hp").textContent=`${state.hp} / ${state.maxHp}`;
    $("#xp-progress").style.width=Math.min(100,(state.xp%100))+"%";
    $("#xp-foot").textContent=`${state.xp%100} / 100 XP to next level`;
    $("#hp-progress").style.width=Math.max(0,state.hp/state.maxHp*100)+"%";
    $("#cash-foot").textContent=state.cash>=500?"Don't let it burn a hole in your pocket.":"Every dollar has a backstory.";
    $("#rep-foot").textContent=state.rep?`${state.rep} reputation earned.`:"Your name means nothing. Yet.";
    $("#mission-count").textContent=missions.filter(m=>!state.completedMissions.includes(m.id)).length;
    $("#crew-name").textContent=state.crewName;
    renderHomeMissions(); renderHomeDistricts(); renderLog();
    $("#shop-cash").textContent=fmtMoney(state.cash);
  }
  function renderHomeMissions() {
    const list=$("#home-missions");
    list.innerHTML=missions.filter(m=>!state.completedMissions.includes(m.id)).slice(0,3).map(m=>`<div class="mission-row"><div class="mission-symbol">${m.emoji}</div><div class="mission-row-main"><strong>${escapeHtml(m.title)}</strong><small>${escapeHtml(m.district)} · ${m.type}</small></div><span class="reward">${fmtMoney(m.reward)}</span></div>`).join("") || `<div class="empty-state">You cleared the board. Go touch grass or check back later.</div>`;
  }
  function renderHomeDistricts() {
    $("#home-districts").innerHTML=districts.slice(0,4).map(d=>`<button class="mini-district" data-travel="${d.name}"><span class="district-symbol">${d.emoji}</span><strong>${d.name}</strong><small>${d.name===state.district?"You're here":d.tags[0]}</small></button>`).join("");
  }
  function renderCharacter() {
    const el=$("#character-content"), c=state.character;
    if(!c) { el.innerHTML=`<div class="panel empty-state"><h3>No character yet.</h3><p>Every Toronto legend started somewhere. Make your character to begin.</p><button class="btn btn-primary" id="empty-create">Create character</button></div>`; return; }
    const cls=classes[c.class];
    const stats=[["Brains","brains"],["Talk","talk"],["Muscle","muscle"],["Street Smarts","streetSmarts"],["Clout","clout"]];
    el.innerHTML=`<div class="character-layout"><div><div class="character-card"><div class="character-banner"><div class="character-portrait">${cls.emoji}</div><div><h2>${escapeHtml(c.name)}</h2><p>${escapeHtml(c.backgroundLabel)} · The 6ix</p><span class="class-pill">${cls.label.toUpperCase()}</span></div></div><div class="character-overview"><div class="overview-box"><span>LEVEL</span><strong>${state.level}</strong></div><div class="overview-box"><span>CASH</span><strong>${fmtMoney(state.cash)}</strong></div><div class="overview-box"><span>XP</span><strong>${state.xp}</strong></div><div class="overview-box"><span>HP</span><strong>${state.hp}/${state.maxHp}</strong></div><div class="overview-box"><span>REP</span><strong>${state.rep}</strong></div><div class="overview-box"><span>DISTRICT</span><strong style="font-size:11px">${escapeHtml(state.district)}</strong></div></div><div class="detail-panel"><span class="muted-label">SIGNATURE SKILL</span><h3>${cls.skill}</h3><p class="muted">${cls.desc}</p></div></div><div class="panel"><span class="muted-label">ABILITY SCORES</span><h3>Know your strengths.</h3><div class="stat-list">${stats.map(([label,key])=>`<div class="stat-line"><strong>${label}</strong><div class="track"><span style="width:${Math.min(100,statValue(key)*5)}%"></span></div><span class="stat-number">${statValue(key)} (${modifier(statValue(key))>=0?"+":""}${modifier(statValue(key))})</span></div>`).join("")}</div><div class="note-box">Modifiers are calculated using floor((stat − 10) / 2). Gear bonuses are included in the displayed stat.</div></div></div>`;
  }
  function renderCity() {
    $("#map-grid").innerHTML=districts.map((d,i)=>`<button class="map-node ${d.name===state.district?"current":""}" data-travel="${d.name}" style="grid-column:${i%3+1};grid-row:${Math.floor(i/3)+1}"><strong>${d.emoji} ${d.name}</strong><small>${d.name===state.district?"YOU ARE HERE":"CLICK TO VISIT"}</small></button>`).join("");
    $("#district-cards").innerHTML=districts.map(d=>`<article class="district-card"><div class="district-card-top"><span class="district-emoji">${d.emoji}</span>${d.name===state.district?'<span class="current-label">● CURRENT</span>':`<span class="tiny-tag">${d.risk.toUpperCase()} RISK</span>`}</div><h3>${d.name}</h3><p>${d.desc}</p><div class="district-tags">${d.tags.map(t=>`<span>${t}</span>`).join("")}</div><button class="btn ${d.name===state.district?"btn-ghost":"btn-primary"}" data-travel="${d.name}" ${d.name===state.district?"disabled":""}>${d.name===state.district?"You're here":"Travel here ↗"}</button></article>`).join("");
  }
  function renderMissions() {
    let filtered=missions.filter(m=>missionFilter==="all"||(missionFilter==="completed"?state.completedMissions.includes(m.id):!state.completedMissions.includes(m.id)));
    $("#mission-board").innerHTML=filtered.map(m=>{const done=state.completedMissions.includes(m.id);return `<article class="mission-card ${done?"completed":""}"><div class="mission-card-top"><span class="mission-type">${m.type}</span><span class="mission-status">${done?"✓ COMPLETED":"● AVAILABLE"}</span></div><h3>${m.emoji} ${m.title}</h3><p>${m.desc}</p><div class="mission-meta"><span>⌖ ${m.district}</span><span>🎲 DC ${m.dc}</span><span>Reward <b>${fmtMoney(m.reward)}</b></span><span>✦ ${m.xp} XP</span></div><button class="btn ${done?"btn-ghost":"btn-primary"}" data-mission="${m.id}" ${done?"disabled":""}>${done?"Mission completed":"View briefing ↗"}</button></article>`;}).join("")||`<div class="panel empty-state">No missions in this filter.</div>`;
  }
  function renderInventory() {
    $("#shop-cash").textContent=fmtMoney(state.cash);
    $("#inventory-list").innerHTML=state.inventory.length?state.inventory.map((item,idx)=>`<div class="inventory-item"><div class="item-icon">${item.emoji}</div><div class="item-main"><strong>${escapeHtml(item.name)}</strong><small>${item.kind==="gear"?`+${item.value} ${item.stat}`:`Consumable · Restore ${item.value} HP`}</small></div>${item.kind==="heal"?`<button class="btn-small" data-use="${idx}">Use</button>`:`<span class="item-price">OWNED</span>`}</div>`).join(""):`<div class="empty-state">Your pockets are looking philosophical. Buy something from the shop.</div>`;
    $("#shop-list").innerHTML=shopItems.map(item=>{const owned=state.inventory.some(x=>x.id===item.id);return `<div class="shop-item"><div class="item-icon">${item.emoji}</div><div class="item-main"><strong>${item.name}</strong><small>${item.desc}</small></div><span class="item-price">${fmtMoney(item.price)}</span><button class="btn-small" data-buy="${item.id}" ${owned?"disabled":""}>${owned?"Owned":"Buy"}</button></div>`;}).join("");
  }
  function renderCrew() {
    $("#crew-name").textContent=state.crewName;
    $("#crew-rep").textContent=state.crewRep;
    $("#crew-missions").textContent=state.completedMissions.length;
    const repData=districts.map(d=>({name:d.name,value:state.districtRep[d.name]||0})).sort((a,b)=>b.value-a.value);
    $("#rep-list").innerHTML=repData.map(d=>`<div class="rep-row"><div class="rep-row-top"><strong>${d.name}</strong><span>${d.value} REP</span></div><div class="rep-bar"><span style="width:${Math.min(100,d.value/3)}%"></span></div></div>`).join("");
  }
  function renderLog() {
    $("#activity-log").innerHTML=state.log.length?state.log.slice(0,12).map(item=>`<div class="log-entry"><span class="log-dot"></span><div><p>${escapeHtml(item.message)}</p><small>${item.time||""}</small></div></div>`).join(""):`<div class="empty-state">No activity yet. Roll a die or start a mission to make history.</div>`;
  }
  function travel(name) {
    if(!state.character) { toast("Create your character before exploring.",true); openModal("character-modal"); return; }
    if(state.district===name){toast(`You're already in ${name}.`);return;}
    state.district=name; addRep(name,1); saveState(); renderAll(); renderCity(); renderCrew();
    const quips=[`You roll into ${name}. Someone is already having an argument about parking.`,`Welcome to ${name}. Your phone has three bars and one new problem.`,`You made it to ${name}. A guy nearby says he knows a guy. Of course he does.`];
    log(`Travelled to ${name}. ${quips[roll(quips.length)-1]}`);
    toast(`Arrived in ${name}.`);
  }
  function showMission(id) {
    if(!state.character){toast("Create a character first.",true);openModal("character-modal");return;}
    const m=missions.find(x=>x.id===id);if(!m)return;
    if(state.completedMissions.includes(id)){toast("You've already completed this mission.");return;}
    activeMission=m;
    $("#mission-modal-title").textContent=m.title+".";
    $("#mission-modal-description").textContent=m.desc+" "+m.flavour;
    $("#mission-modal-details").innerHTML=[`⌖ ${m.district}`,`🎲 ${m.stat==="streetSmarts"?"Street Smarts":m.stat[0].toUpperCase()+m.stat.slice(1)} DC ${m.dc}`,`＄ ${fmtMoney(m.reward)}`,`✦ ${m.xp} XP`].map(x=>`<span>${x}</span>`).join("");
    openModal("mission-modal");
  }
  function resolveMission() {
    const m=activeMission;if(!m)return;
    closeModal("mission-modal");
    if(!state.character){toast("Create a character first.",true);return;}
    const current=statValue(m.stat), d=roll(20), mod=modifier(current), total=d+mod, success=total>=m.dc, crit=d===20, fumble=d===1;
    const reward=success?m.reward:Math.floor(m.reward/2), xp=success?m.xp:Math.floor(m.xp/2);
    const oldLevel=state.level;
    state.cash+=reward;state.xp+=xp;state.level=levelFromXp(state.xp);state.completedMissions.push(m.id);
    state.hp=Math.min(state.maxHp,state.hp+(success?2:0));
    addRep(m.district,success?15:7);
    if(fumble)state.hp=Math.max(1,state.hp-2);
    const quip=success?["Clean work. Almost suspiciously clean.","You pulled it off. Your group chat will hear about this for weeks.","Success! Somebody owes you a favour now."][roll(3)-1]:["Not your finest hour, but you got something out of it.","The plan went sideways. At least you got paid a little.","A partial win. Let's call it 'strategic confusion'."][roll(3)-1];
    log(`${m.title}: ${success?"SUCCESS":"PARTIAL FAILURE"} (${total} vs DC ${m.dc}). Earned ${fmtMoney(reward)} and ${xp} XP.`);
    saveState();renderAll();renderMissions();renderCharacter();renderCrew();
    $("#roll-result").className="roll-result "+(success?"success":"fail");
    $("#roll-result").innerHTML=`<div class="die-face">${d}</div><strong>${success?"Mission success!":"Partial failure."} ${total} vs DC ${m.dc}</strong><p>${m.stat==="streetSmarts"?"Street Smarts":m.stat[0].toUpperCase()+m.stat.slice(1)} check: ${d} ${mod>=0?"+":""}${mod} = ${total}. ${crit?"Natural 20!":fumble?"Natural 1!":""}</p>`;
    if(state.level>oldLevel)toast(`LEVEL UP! You're now level ${state.level}.`);
    else toast(`${success?"Mission cleared":"Mission complete"} · +${fmtMoney(reward)} · +${xp} XP`);
    go("missions");
  }
  function makeCharacter(formData) {
    const name=String(formData.get("name")||"").trim().slice(0,32);
    const cls=String(formData.get("class")||"hustler");
    const bg=String(formData.get("background")||"newcomer");
    const backgrounds={newcomer:"New to the city",local:"Born and raised",hustler:"Self-made grinder",wildcard:"Professional wildcard"};
    if(!name){toast("Give your character a name first.",true);return;}
    if(state.character && !confirm("Replace your current character? Your cash, XP, inventory and campaign progress will remain."))return;
    state.character={name,class:classes[cls]?cls:"hustler",background:bg,backgroundLabel:backgrounds[bg]||backgrounds.newcomer,stats:{brains:10,talk:10,muscle:10,streetSmarts:10,clout:10}};
    saveState();closeModal("character-modal");renderAll();renderCharacter();
    log(`${name} entered The 6ix as ${classes[cls].label}.`);
    toast(`Welcome to The 6ix, ${name}.`);
  }
  function buyItem(id) {
    const item=shopItems.find(x=>x.id===id);if(!item)return;
    if(state.inventory.some(x=>x.id===id)){toast("You already own that item.",true);return;}
    if(state.cash<item.price){toast("Not enough cash. Time to find a mission.",true);return;}
    state.cash-=item.price;state.inventory.push({...item});
    saveState();renderAll();renderInventory();renderCharacter();
    log(`Bought ${item.name} for ${fmtMoney(item.price)}.`);
    toast(`${item.name} added to your inventory.`);
  }
  function useItem(idx) {
    const item=state.inventory[idx];if(!item||item.kind!=="heal")return;
    if(state.hp>=state.maxHp){toast("You're already at full HP.",true);return;}
    const before=state.hp;state.hp=Math.min(state.maxHp,state.hp+item.value);state.inventory.splice(idx,1);
    saveState();renderAll();renderInventory();log(`Used ${item.name}, restored ${state.hp-before} HP.`);toast(`Restored ${state.hp-before} HP.`);
  }
  function doSkillCheck() {
    if(!state.character){toast("Create a character before rolling a skill check.",true);openModal("character-modal");return;}
    const stat=$("#roll-stat").value,dc=Number($("#roll-dc").value),value=statValue(stat),d=roll(20),mod=modifier(value),total=d+mod,success=total>=dc,crit=d===20,fumble=d===1;
    const names={brains:"Brains",talk:"Talk",muscle:"Muscle",streetSmarts:"Street Smarts",clout:"Clout"};
    const quip=crit?"NATURAL 20. Somebody check the cameras.":fumble?"NATURAL 1. This is going in the group chat.":success?"You made it look easy. Don't get cocky.":"Not quite. The city remains unimpressed.";
    $("#roll-result").className="roll-result "+(success?"success":"fail");
    $("#roll-result").innerHTML=`<div class="die-face">${d}</div><strong>${success?"SUCCESS":"FAILURE"} · ${total} vs DC ${dc}</strong><p>${names[stat]}: ${d} ${mod>=0?"+":""}${mod} = ${total}. ${quip}</p>`;
    log(`${names[stat]} check: ${d} ${mod>=0?"+":""}${mod} = ${total} vs DC ${dc} — ${success?"success":"failure"}.`);
    if(fumble){state.hp=Math.max(1,state.hp-1);saveState();renderAll();toast("Critical fumble: lost 1 HP.",true);}
  }
  function quickRoll() {
    const d=roll(20);log(`Quick roll: d20 = ${d}${d===20?" — NATURAL 20!":d===1?" — NATURAL 1!":""}.`);
    toast(`🎲 You rolled ${d}${d===20?" — NATURAL 20!":d===1?" — oof, natural 1.":"."}`);
  }
  function exportSave() {
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="toronto-hoodman-save.json";a.click();URL.revokeObjectURL(url);toast("Save exported.");
  }
  function importSave(file) {
    const reader=new FileReader();
    reader.onload=()=>{try{const data=JSON.parse(String(reader.result));if(!data||typeof data!=="object"||!Array.isArray(data.inventory)||!Array.isArray(data.completedMissions))throw new Error("Invalid save");state={...defaultState(),...data};saveState();renderAll();renderCharacter();renderCity();renderMissions();renderInventory();renderCrew();toast("Save imported successfully.");}catch{toast("That file doesn't look like a valid Hoodman save.",true);}};
    reader.readAsText(file);
  }

  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-page]");if(nav){go(nav.dataset.page);return;}
    const goBtn=e.target.closest("[data-go]");if(goBtn){go(goBtn.dataset.go);return;}
    const travelBtn=e.target.closest("[data-travel]");if(travelBtn){travel(travelBtn.dataset.travel);return;}
    const missionBtn=e.target.closest("[data-mission]");if(missionBtn){showMission(missionBtn.dataset.mission);return;}
    const buyBtn=e.target.closest("[data-buy]");if(buyBtn){buyItem(buyBtn.dataset.buy);return;}
    const useBtn=e.target.closest("[data-use]");if(useBtn){useItem(Number(useBtn.dataset.use));return;}
    const closeBtn=e.target.closest("[data-close]");if(closeBtn){closeModal(closeBtn.dataset.close);return;}
    const filter=e.target.closest("[data-filter]");if(filter){missionFilter=filter.dataset.filter;$$("[data-filter]").forEach(b=>b.classList.toggle("active",b===filter));renderMissions();return;}
    if(e.target.closest("#create-character-cta")){if(state.character){go("character");openModal("character-modal");$("#char-name").value=state.character.name;$("#char-class").value=state.character.class;$("#char-background").value=state.character.background;}else openModal("character-modal");}
    if(e.target.closest("#empty-create"))openModal("character-modal");
  });
  $("#character-form").addEventListener("submit",e=>{e.preventDefault();makeCharacter(new FormData(e.currentTarget));});
  $("#mission-form").addEventListener("submit",e=>{e.preventDefault();resolveMission();});
  $("#roll-check").addEventListener("click",doSkillCheck);
  $("#quick-roll").addEventListener("click",quickRoll);
  $("#edit-character").addEventListener("click",()=>{if(!state.character){openModal("character-modal");return;}$("#char-name").value=state.character.name;$("#char-class").value=state.character.class;$("#char-background").value=state.character.background;openModal("character-modal");});
  $("#rename-crew").addEventListener("click",()=>{const name=prompt("What is your crew called?",state.crewName);if(name&&name.trim()){state.crewName=name.trim().slice(0,40);saveState();renderCrew();renderAll();log(`Crew renamed to "${state.crewName}".`);toast("Crew name updated.");}});
  $("#clear-log").addEventListener("click",()=>{state.log=[];saveState();renderLog();toast("Activity log cleared.");});
  $("#export-save").addEventListener("click",exportSave);
  $("#import-save").addEventListener("change",e=>{const file=e.target.files?.[0];if(file)importSave(file);e.target.value="";});
  $("#reset-game").addEventListener("click",()=>{if(confirm("Reset the entire local campaign? Export your save first if you want a backup.")){state=defaultState();saveState();renderAll();go("home");toast("Campaign reset.");}});
  $("#daily-quote").textContent=quotes[new Date().getDate()%quotes.length];
  const event=events[new Date().getDate()%events.length];
  $("#city-status").textContent=event[1];$("#city-flavour").textContent=event[2];$("#weather-label").textContent=event[3];$("#city-weather").textContent=event[3];
  renderAll();renderCharacter();renderCity();renderMissions();renderInventory();renderCrew();
})();