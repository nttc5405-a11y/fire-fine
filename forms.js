/* 依原始限改單、舉發單欄位重建之表格式參考預覽。 */
(()=>{
 const val=id=>document.getElementById(id).value.trim();
 const el=id=>document.getElementById(id);
 const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function context(){const c=CASES.find(c=>c.id===val('draftCase')),d=enforcementDecision(c,val('business'),val('stage'));let kind=val('formKind');if(kind==='auto')kind=c.group==='爆竹煙火'?'firework':d.kind==='review'?'pending':d.kind;return{c,d,kind};}
 function paperTitle(kind){return {improve:'臺東縣消防局消防安全檢（複）查不合規定限期改善通知單',direct:'臺東縣消防局舉發違反消防法案件通知單',both:'臺東縣政府舉發違反消防法案件及限期改善通知單',firework:'臺東縣政府舉發違反爆竹煙火案件及限期改善通知單',pending:'通知單（處理方式待確認）'}[kind]||'通知單（類型待確認）';}
 window.renderOfficialForm=function(){
 const {c,d,kind}=context(),blank=val('paperMode')==='blank',committee=val('personType')==='committee';
 const v=(id,fallback='')=>blank?'':safe(val(id)||fallback);
 for(const id of ['birthWrap','identityWrap','homeWrap'])el(id).hidden=committee;
 for(const id of ['partyBirth','partyIdentity','partyHome'])el(id).disabled=committee;
 el('repWrap').hidden=!committee;
 if(committee)for(const id of ['partyBirth','partyIdentity','partyHome'])el(id).value='';
 el('formKindHint').textContent=val('formKind')==='auto'?'依目前情境選擇表格；尚未確認處理方式時保留待確認標示。':'此選項只切換單據版型，不變更違規構成要件與罰則；請核對主旨是否與所選單據一致。';
 const isImprove=kind==='improve',hasDeadline=isImprove||kind==='both'||(kind==='firework'&&d.kind==='both');
 let subject=v('subjectText').replaceAll('【經核定之日期】',v('deadline')||'【經核定之日期】');
 if(blank)subject=isImprove?'□台　端　□貴委員會<br>自接到本單起○日內得向本縣消防局提出【依核定表單填寫之書面文件】。本縣消防局定於○年○月○日至貴場所複查，如屆期不改善或複查不合格者，將依消防法第○條第○項規定處罰。':kind==='pending'?'【確認處理方式後選擇正式通知單種類】':'本縣消防局於○年○月○日檢查發現【貴場所／台端】有違反規定事項，依【法規、條項款目】規定辦理。';
 const person=committee?[v('partyName','【管理委員會完整名稱】'),v('representative','【主任委員姓名、性別】')].filter(Boolean).join('<br>'):v('partyName');
 const personLabel=kind==='firework'?'被處分人':isImprove?'管理權人':'管理權人<br>姓　名';
 let facts=v('facts');if(!blank&&hasDeadline&&val('deadline'))facts+='<br><br>改善期限：'+v('deadline');
 let reason=v('legal');if(!blank&&val('attachments'))reason+='<br><br>附件：'+v('attachments');
 const violationRow=kind==='firework'?`<tr><th>違反法規</th><td colspan="9">${blank?'':safe(c.violation)}</td></tr>`:'';
 const deletedCell=span=>`<td colspan="${span}" class="void-field"><svg class="void-cross" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M 2 4 L 98 96 M 2 96 L 98 4"/></svg><span>╳ 不得填寫（已刪除）</span></td>`;
 const privateHeading=text=>committee?`<s>${text}</s>`:text;
 const table=`<table class="official-table" aria-label="${paperTitle(kind)}欄位"><colgroup><col style="width:13%"><col style="width:17%"><col style="width:5%"><col style="width:11%"><col style="width:10%"><col style="width:5%"><col style="width:13%"><col style="width:6%"><col style="width:12%"><col style="width:8%"></colgroup><tbody>
 <tr class="person-row"><th>${personLabel}</th><td colspan="2">${person}</td><th>性　別</th><td colspan="2">${v('partySex')}</td><th colspan="2" class="${committee?'void-heading':''}">${privateHeading('出生日期')}</th>${committee?deletedCell(2):`<td colspan="2">${v('partyBirth')}</td>`}</tr>
 <tr><th class="${committee?'void-heading':''}">${privateHeading('國民身分證<br>統一編號')}</th>${committee?deletedCell(2):`<td colspan="2">${v('partyIdentity')}</td>`}<th class="${committee?'void-heading':''}">${privateHeading('住　址')}</th>${committee?deletedCell(6):`<td colspan="6">${v('partyHome')}</td>`}</tr>
 <tr><th>場　所<br>名　稱</th><td colspan="2">${v('place')}</td><th>地　址</th><td colspan="6">${v('placeAddress')}</td></tr>
 <tr><th>檢查時間</th><td colspan="9">${v('checkTime')||'　　　　　年　　　　月　　　　日'}</td></tr>${violationRow}
 <tr class="subject-row"><th>主　旨</th><td colspan="9">${subject}</td></tr>
 <tr class="fact-row"><th>事　實</th><td colspan="9">${facts}</td></tr>
 <tr class="reason-row"><th>理由及<br>法令依據</th><td colspan="9">${reason}</td></tr>
 <tr class="stamp-row"><th>發　單<br>單　位</th><td>${v('issuingUnit')}</td><th colspan="2">主　管<br>職名章</th><td colspan="2">${v('supervisor')}</td><th colspan="2">填單人<br>職名章</th><td colspan="2">${v('officer')}</td></tr>
 <tr><td colspan="10" class="date-row">中　華　民　國　　${v('issueDate')||'　　　　年　　　　月　　　　日'}　填</td></tr>
 <tr class="receipt-row"><th colspan="3">收受通知單者簽章欄</th><td colspan="7">${v('receipt')}</td></tr></tbody></table>`;
 const customNote=v('rightsNote');
 el('officialPaper').innerHTML=`<div class="paper-status">參考樣板／未核發</div><div class="paper-number">編號：${v('noticeNumber')||'　　　　　　　　　'}</div><h2>${paperTitle(kind)}</h2>${table}<div class="paper-notes"><b>註：</b><ol><li>原通知單為四聯：第一聯交當事人，第二聯送執行單位，第三聯供行政執行使用，第四聯自存；本頁僅呈現單聯版面。</li><li>事實、理由及法令依據應詳盡填寫；不敷使用時，依正式表單規定黏貼並加蓋騎縫章。</li><li>非本人簽收時，應依送達規定及機關指引填寫關係、職稱等資料；拒簽應依法辦理送達。</li><li>管理權人為公寓大廈管理委員會時，加註代表人姓名、性別；不填其出生日期、身分證字號及住址。</li><li>${customNote||'陳述意見、改善計畫及救濟告知，應依個案處分性質與最新版核定表單分別確認後填寫。'}</li></ol><p class="paper-final-note">此表依原始單據欄位重建，附註已整併較新指引；非核定原件，不含機關印信、職名章或親簽。</p></div>`;
 const source=kind==='firework'?'https://drive.google.com/file/d/1kAacBKY63dNz0qO4_euRdsunw0jcKXez/view':kind==='direct'?'https://drive.google.com/file/d/127Bv3z5DWiHOFsA1ZAbZT1RTXwKCrqEc/view':kind==='improve'?'https://drive.google.com/file/d/1bKkA4t5i0jM5EjamWn3Mu_vXyCiGKG5P/view':'https://docs.google.com/document/d/1go_in9JSdZXe2g3r0jxz8iENCq1q1_cG/edit';
 el('formSource').href=source;
 {const additions=`\n\n【單據欄位】\n預覽種類：${paperTitle(kind)}\n編號：${val('noticeNumber')}\n管理權人／行為人：${val('partyName')}${committee?'\n主任委員姓名、性別：'+val('representative'):'\n性別：'+val('partySex')+'\n出生日期：'+val('partyBirth')+'\n國民身分證統一編號：'+val('partyIdentity')+'\n住址：'+val('partyHome')}\n場所地址：${val('placeAddress')}\n發單單位：${val('issuingUnit')}\n主管：${val('supervisor')}\n填單人：${val('officer')}\n填單日期：${val('issueDate')}\n簽收欄參考：${val('receipt')}\n權利告知及附註：${val('rightsNote')}`;const output=el('draftOutput');output.textContent=output.textContent.split('\n\n【單據欄位】')[0]+additions;}
 };
 el('regenerateSubject').onclick=()=>{el('subjectText').value='';updateDraft();toast('已依目前情境重帶主旨')};
 el('paperMode').onchange=()=>updateDraft();
 el('formKind').onchange=()=>updateDraft();
 const paperHost=document.querySelector('.paper-scroll');
 const fit=()=>{if(window.fitOfficialPaper){window.fitOfficialPaper();return;}if(paperHost.clientWidth>0)el('officialPaper').style.setProperty('--paper-zoom',innerWidth>780?Math.min(1,(paperHost.clientWidth-38)/794):1)};
 new ResizeObserver(fit).observe(paperHost);
 addEventListener('beforeprint',()=>el('officialPaper').style.setProperty('--paper-zoom',1));
 addEventListener('afterprint',fit);
 renderOfficialForm();fit();
})();
