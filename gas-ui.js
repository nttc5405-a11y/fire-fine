/* 液化案件原編號、現場流程與談話查證重點。 */
window.gasDetail=c=>c.exampleNo?`<section class="gas-processing"><h3>原範例的處理作法</h3><p>${esc(c.sourceAction)}</p><h3>現場處理步驟</h3><ol>${c.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><details class="gas-interview" open><summary>談話查證重點</summary><p class="hint">${esc(c.interviewNote||'依液化談話紀錄整理；依實際回答記錄，不預填承認違規。')}</p><ol>${c.interview.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details></section>`:'';
window.renderGasGuide=function(){
 const box=document.getElementById('gasGuide');if(!box)return;
 box.hidden=group!=='液化石油氣';
};
window.addEventListener('DOMContentLoaded',()=>{
 const g=GAS_GUIDE,box=document.getElementById('gasGuide');
 const list=a=>`<ul>${a.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
 box.innerHTML=`<summary>液化石油氣作業包｜出勤準備、清冊與教材差異</summary><div class="gas-guide-body"><p>依提供的 12 份文件整理；第 1～10 類案件請由下方清單選取。每類都有處理步驟、事實寫法、蒐證與談話查證重點。</p><h3>出勤準備與分工</h3><p>${esc(g.crew)}</p>${list(g.tools)}<h3>容器清冊欄位</h3>${list(g.inventory)}<h3>原教材與適用條件，需分開核對</h3>${g.disputes.map(d=>`<div class="difference"><b>${esc(d.title)}</b><p>${esc(d.text)}</p>${link(d.url,'核對原文及依據')}</div>`).join('')}<h3>總覽與共同附件</h3><div class="source-links">${link(g.index,'第 0 號：案件編號與分工總覽')}${link(g.talk,'各式各樣談話紀錄（液化）')}${link(g.scenario,'第 10 號：非法灌裝或儲存處理簡報')}</div><p class="hint">查閱：${esc(g.checked)}。原範例未分列第 2、8 類談話表，該兩類問題依其查核要素整理並另有標示；待核函釋未當作自動裁罰或免罰條件。</p></div>`;
 renderGasGuide();
});
