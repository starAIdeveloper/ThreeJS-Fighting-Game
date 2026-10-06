export const HEROES=[{name:'Arin',color:0x37afff,hp:140,damage:22,range:3.3,ability:54},{name:'Lyra',color:0xc095ff,hp:110,damage:15,range:11,ability:70},{name:'Bram',color:0xffb35b,hp:175,damage:27,range:3.5,ability:48}];
export function createGame(){return {phase:'ready',time:0,selected:0,potions:3,message:'Defeat the Ember Guardian',party:HEROES.map((h,i)=>({...h,maxHp:h.hp,mp:100,x:(i-1)*2,z:8+i,heading:Math.PI,cooldown:0,abilityCooldown:0,dodge:0,blocking:false,swing:0})),boss:{x:0,z:-7,hp:650,maxHp:650,state:'pursue',timer:2,target:null,flash:0},effects:[],hits:0};}
export function active(g){return g.party[g.selected];}
export function switchHero(g,index){if(g.phase!=='playing'||index<0||index>2||g.party[index].hp<=0)return false;g.selected=index;return true;}
export function distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
export function attack(g,ability=false){if(g.phase!=='playing')return false;const p=active(g);if(p.hp<=0||p.cooldown>0||p.dodge>0)return false;if(ability&&(p.mp<30||p.abilityCooldown>0))return false;
 p.cooldown=ability?1.1:.65;p.swing=.35;if(ability){p.mp-=30;p.abilityCooldown=3;}
 if(distance(p,g.boss)>(ability?14:p.range)){g.message='Out of range';return true;}
 const damage=ability?p.ability:p.damage;g.boss.hp=Math.max(0,g.boss.hp-damage);g.boss.flash=.25;g.hits++;g.effects.push({x:g.boss.x,z:g.boss.z,life:.5,color:ability?0x5de4ff:0xffd384});g.message=`${p.name}: ${ability?'Ember ability':'Attack'} · ${damage} damage`;if(g.boss.hp===0){g.phase='won';g.message='Guardian defeated';}return true;}
export function heal(g){if(g.phase!=='playing'||g.potions<=0||active(g).hp===active(g).maxHp)return false;const p=active(g);p.hp=Math.min(p.maxHp,p.hp+65);g.potions--;g.message='Healing potion used';return true;}
export function dodge(g){if(g.phase!=='playing')return false;const p=active(g);if(p.dodge>0||p.mp<15)return false;p.mp-=15;p.dodge=.45;return true;}
function harm(g,p,damage){if(p.hp<=0||p.dodge>0)return;const amount=p.blocking?damage*.25:damage;p.hp=Math.max(0,p.hp-amount);g.message=`${p.name} took ${Math.round(amount)} damage`;}
export function tick(g,input,dt){if(!Number.isFinite(dt)||dt<0)throw Error('Invalid timestep');dt=Math.min(dt,.05);if(g.phase!=='playing')return;g.time+=dt;
 for(const p of g.party){p.cooldown=Math.max(0,p.cooldown-dt);p.abilityCooldown=Math.max(0,p.abilityCooldown-dt);p.dodge=Math.max(0,p.dodge-dt);p.swing=Math.max(0,p.swing-dt);p.mp=Math.min(100,p.mp+5*dt);p.blocking=false;}
 const p=active(g);p.blocking=!!input.block&&p.dodge===0;let x=input.x||0,z=input.z||0,n=Math.hypot(x,z);if(n>1){x/=n;z/=n;}const speed=p.dodge>0?13:p.blocking?2:5.2;
 p.x=Math.max(-17,Math.min(17,p.x+x*speed*dt));p.z=Math.max(-17,Math.min(17,p.z+z*speed*dt));if(n>.1)p.heading=Math.atan2(x,z);
 // Companions follow a nearby formation; their attacks obey the same range/cooldown rules.
 g.party.forEach((a,i)=>{if(i===g.selected||a.hp<=0)return;const tx=p.x+(i-1)*2.5,tz=p.z+2,d=Math.hypot(tx-a.x,tz-a.z);if(d>2){a.x+=(tx-a.x)/d*3*dt;a.z+=(tz-a.z)/d*3*dt;a.heading=Math.atan2(tx-a.x,tz-a.z);}if(distance(a,g.boss)<a.range&&a.cooldown===0){g.boss.hp=Math.max(0,g.boss.hp-a.damage*.45);a.cooldown=1.8;a.swing=.3;g.boss.flash=.2;}});
 const b=g.boss;b.flash=Math.max(0,b.flash-dt);b.timer-=dt;
 if(b.state==='pursue'){const d=distance(p,b);if(d>4){b.x+=(p.x-b.x)/d*2.2*dt;b.z+=(p.z-b.z)/d*2.2*dt;}if(b.timer<=0){b.state='telegraph';b.timer=1.3;b.target={x:p.x,z:p.z};g.message='Guardian preparing slam. Leave the red circle!';}}
 else if(b.state==='telegraph'&&b.timer<=0){for(const a of g.party)if(distance(a,b.target)<4.2)harm(g,a,38);g.effects.push({...b.target,life:.7,color:0xff653d});b.state='recover';b.timer=1.4;}
 else if(b.state==='recover'&&b.timer<=0){b.state='pursue';b.timer=Math.max(.9,b.hp<250?1.3:2.2);}
 g.effects=g.effects.filter(e=>(e.life-=dt)>0);
 if(b.hp<=0){g.phase='won';g.message='Guardian defeated';}
 else if(g.party.every(a=>a.hp<=0)){g.phase='lost';g.message='Party defeated';}
 else if(p.hp<=0){g.selected=g.party.findIndex(a=>a.hp>0);g.message=`${active(g).name} takes command`;}
}
