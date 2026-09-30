const Q=[
["Apa simbol unsur natrium?","Na",["N","K","Ni"]],
["Apa rumus kimia air?","H₂O",["HO₂","H₂O₂","OH"]],
["Berapa nomor atom karbon?","6",["8","12","4"]],
["Manakah yang termasuk gas mulia?","Neon",["Oksigen","Nitrogen","Klorin"]],
["Larutan dengan pH kurang dari 7 bersifat…","Asam",["Basa","Netral","Garam"]],
["Rumus kimia garam dapur adalah…","NaCl",["KCl","NaOH","HCl"]],
["Apa nama ion MnO₄⁻?","Permanganat",["Manganat","Manganit","Mangan oksida"]],
["Gas yang dilepas tumbuhan saat fotosintesis?","Oksigen",["Nitrogen","Hidrogen","Metana"]],
["Simbol unsur besi adalah…","Fe",["Fi","Ir","B"]],
["Gas apa yang paling ringan?","Hidrogen",["Helium","Oksigen","Neon"]]
];
const F=["H₂O","NaCl","MnO₄","H₂S","CO₂","Cl₂","NH₃","CH₄","O₂","HCl"];
const T={1:['H','std'],2:['Li','std'],3:['🪜','up',10],4:['Fr','bomb'],5:['Ne','shield'],6:['C','std'],7:['O','heal'],8:['N','std'],9:['🐍','down',2],10:['U','bomb'],11:['Ca','heal'],12:['Ar','shield'],13:['🪜','up',18],14:['Fe','std'],15:['Ra','bomb'],16:['🐍','down',8],17:['Cl','std'],18:['Kr','shield'],19:['Cs','bomb'],20:['🏁','goal']};
const LB={std:'Standar',bomb:'💥 Bom',shield:'🛡️ Perisai',heal:'💚 Pulih',goal:'Finish'};
const $=id=>document.getElementById(id);
let pos,hp,shield,shieldOn,over,pending,asked=[];
const board=$('board'),tok=document.createElement('div');tok.className='token';
const order=[];for(let r=3;r>=0;r--){const row=[];for(let c=0;c<5;c++)row.push(r*5+c+1);if(r%2===1)row.reverse();order.push(...row)}
order.forEach(n=>{const t=T[n],d=document.createElement('div');d.className='cell '+(t[1]==='up'?'up':t[1]==='down'?'down':t[1]);d.id='c'+n;
 d.innerHTML='<span>'+n+'</span><b>'+t[0]+'</b><small>'+(t[2]?'ke '+t[2]:LB[t[1]])+'</small>';board.appendChild(d)});
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const place=()=>$('c'+pos).appendChild(tok);
function draw(){$('hearts').textContent='❤️'.repeat(hp)+'🖤'.repeat(3-hp);$('hearts').setAttribute('aria-label',hp+' dari 3 nyawa');$('shield').hidden=!shield}
function reset(){pos=1;hp=3;shield=false;shieldOn=false;over=false;$('roll').textContent='Lempar dadu';$('roll').disabled=false;$('qbox').hidden=true;$('dice').textContent='🎲';$('msg').textContent='Tekan “Lempar dadu” untuk mulai.';draw();place()}
function end(m,btn){over=true;$('msg').textContent=m;$('roll').textContent='Main lagi';$('roll').disabled=false;$('qbox').hidden=true}
function next(m){$('msg').textContent=m;$('roll').disabled=false}
$('roll').onclick=()=>{
 if(over){reset();return}
 shieldOn=shield;shield=false;draw();$('roll').disabled=true;
 const n=1+Math.floor(Math.random()*6),die=$('dice');
 die.classList.remove('roll');void die.offsetWidth;die.classList.add('roll');
 die.textContent=F[Math.floor(Math.random()*F.length)]+' · '+n;
 pos=Math.min(20,pos+n);place();setTimeout(land,350);
};
function land(){
 const t=T[pos];
 if(t[1]==='goal')return end('🎉 Kamu sampai finish dengan '+hp+' nyawa tersisa!');
 if(t[1]==='bomb'){
  if(shieldOn)return next('💥 Bom! Tapi perisaimu menahan ledakan. Nyawa aman.');
  hp--;draw();if(hp<=0)return end('💀 Nyawa habis, kamu tereliminasi. Coba lagi!');
  return next('💥 Bom! Nyawamu berkurang 1.');}
 if(t[1]==='shield'){shield=true;draw();return next('🛡️ Perisai aktif untuk giliran berikutnya.')}
 if(t[1]==='heal'){if(hp<3){hp++;draw();return next('💚 Pemulih! Nyawamu bertambah 1.')}return next('💚 Pemulih, tapi nyawamu sudah penuh.')}
 if(!asked.length)asked=shuffle(Q.map((_,i)=>i));
 const q=Q[asked.pop()];$('qtext').textContent=(t[1]==='up'?'🪜 Tangga Reaksi: ':t[1]==='down'?'🐍 Ular Pelarutan: ':'')+q[0];
 const o=$('opts');o.innerHTML='';
 shuffle([q[1],...q[2]]).forEach(x=>{const b=document.createElement('button');b.className='opt';b.textContent=x;b.onclick=()=>answer(b,x===q[1],q[1],t);o.appendChild(b)});
 $('qbox').hidden=false;$('msg').textContent='Jawab tantangan kimia ini.';
}
function answer(btn,ok,right,t){
 document.querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(b.textContent===right)b.classList.add('ok')});
 if(!ok)btn.classList.add('no');
 let m;
 if(t[1]==='up'){if(ok){pos=t[2];m='Benar! Tangga membawamu naik ke petak '+pos+'.'}else m='Belum tepat, jawabannya '+right+'. Kamu tetap di petak '+pos+'.'}
 else if(t[1]==='down'){if(ok)m='Benar! Kamu lolos dari ular.';else{pos=t[2];m='Salah, jawabannya '+right+'. Ular menurunkanmu ke petak '+pos+'.'}}
 else{if(ok)m='Benar! Posisimu aman.';else{pos=Math.max(1,pos-1);m='Salah, jawabannya '+right+'. Kamu mundur 1 petak.'}}
 place();setTimeout(()=>{$('qbox').hidden=true},1500);next(m);
}
reset();
