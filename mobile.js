/* 不儲存案件資料；版面切換保留同頁記憶體中的填寫內容。 */
(()=>{
 const byId=id=>document.getElementById(id);
 const media=matchMedia('(max-width:780px)');
 const switcher=byId('draftSwitch');
 function workspace(preview,scroll=true){document.body.classList.toggle('draft-previewing',preview);switcher.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',String((b.dataset.workspace==='preview')===preview)));if(scroll&&media.matches)switcher.scrollIntoView({block:'start',behavior:'instant'});fitPaper();}
 switcher.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>workspace(b.dataset.workspace==='preview')));
 switcher.addEventListener('keydown',e=>{const tabs=[...switcher.querySelectorAll('button')];let index=tabs.indexOf(document.activeElement);if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[index].focus();workspace(tabs[index].dataset.workspace==='preview',false);});
 byId('showPreview').onclick=()=>workspace(true);
 const paperHost=document.querySelector('.paper-scroll');
 const paper=byId('officialPaper');
 const stage=document.createElement('div');stage.className='paper-stage';
 paper.before(stage);stage.append(paper);
 const readable=byId('mobilePaper');
 const mode=byId('previewStyle');
 mode.value='fit';
 function fitPaper(){
  const read=mode.value==='readable';paperHost.hidden=read;readable.hidden=!read;
  paperHost.classList.toggle('original-size',mode.value==='actual');paperHost.classList.toggle('fit-sheet',mode.value==='fit');
  if(!paperHost.clientWidth)return;
  const style=getComputedStyle(paperHost);
  const available=Math.max(1,paperHost.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-2);
  // 先以固定 A4 寬度排版，再縮放整張。縮放比例只取決於容器寬度，避免高度觀察互相回饋。
  const scale=mode.value==='actual'?1:Math.min(1,available/794);
  const height=Math.max(1123,paper.scrollHeight,paper.offsetHeight);
  paper.style.setProperty('--paper-scale',String(scale));
  stage.style.width=`${794*scale}px`;stage.style.height=`${height*scale}px`;
 }
 window.updateMobilePreview=()=>{
  readable.replaceChildren();
  const status=document.createElement('p');status.className='readable-status';status.textContent='參考樣板／未核發 · 手機易讀內容';readable.append(status);
  const title=document.createElement('h3');title.textContent=paper.querySelector('h2')?.textContent||'通知單預覽';readable.append(title);
  const dl=document.createElement('dl');
  paper.querySelectorAll('tbody tr').forEach(row=>{const cells=[...row.children];if(cells.length===1){const dt=document.createElement('dt');dt.textContent='填單日期';const dd=document.createElement('dd');dd.textContent=cells[0].innerText;dl.append(dt,dd);return;}for(let i=0;i<cells.length-1;i+=2){const dt=document.createElement('dt');dt.textContent=cells[i].innerText.replace(/\s+/g,'').trim();if(cells[i].classList.contains('void-heading'))dt.className='void-heading';const dd=document.createElement('dd');dd.textContent=cells[i+1].innerText.trim()||'尚未填寫';dl.append(dt,dd);}});
  readable.append(dl);
  const notes=document.createElement('details');const noteTitle=document.createElement('summary');noteTitle.textContent='單據附註與權利告知';const noteText=document.createElement('p');noteText.textContent=paper.querySelector('.paper-notes')?.innerText||'';notes.append(noteTitle,noteText);readable.append(notes);fitPaper();
 };
 window.fitOfficialPaper=fitPaper;
 mode.onchange=fitPaper;byId('fitSheet').onclick=()=>{mode.value='fit';fitPaper();};byId('actualSheet').onclick=()=>{mode.value='actual';fitPaper();};
 let lastWidth=0;
 new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width!==lastWidth){lastWidth=width;fitPaper();}}).observe(paperHost);
 new ResizeObserver(fitPaper).observe(paper);
 new MutationObserver(()=>window.updateMobilePreview()).observe(paper,{childList:true});
 window.openCaseDetail=()=>{if(media.matches){document.body.classList.add('case-detail-open');byId('caseDetail').scrollIntoView({block:'start',behavior:'smooth'});}};
 document.addEventListener('click',event=>{if(event.target.closest('.back-to-list')){document.body.classList.remove('case-detail-open');byId('caseList').scrollIntoView({block:'start',behavior:'smooth'});}if(event.target.closest('#groupFilters,#clearSearch'))document.body.classList.remove('case-detail-open');if(event.target.closest('#useCase'))workspace(false,false);});
 byId('search').addEventListener('input',()=>document.body.classList.remove('case-detail-open'));
 byId('routeFilter').addEventListener('change',()=>document.body.classList.remove('case-detail-open'));
 addEventListener('hashchange',()=>{if(media.matches)window.scrollTo({top:0,behavior:'instant'});});
 media.addEventListener('change',()=>{mode.value='fit';fitPaper();});
 addEventListener('resize',fitPaper);
 document.fonts.ready.then(fitPaper);
 addEventListener('afterprint',fitPaper);
 window.updateMobilePreview();workspace(false,false);
})();
