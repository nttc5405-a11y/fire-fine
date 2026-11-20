/* 完整單據在瀏覽器內產生，不上傳欄位或影像。 */
(()=>{
 const button=document.getElementById('downloadSheet');
 const result=document.getElementById('downloadResult');
 let savedUrl=null;
 function renderSheet(element,width,height,scale){
  const canvas=document.createElement('canvas');canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);
  const context=canvas.getContext('2d');context.scale(scale,scale);context.fillStyle='#fff';context.fillRect(0,0,width,height);
  const origin=element.getBoundingClientRect();
  const box=node=>{const r=node.getBoundingClientRect();return{x:r.left-origin.left,y:r.top-origin.top,width:r.width,height:r.height};};
  // 依實際 DOM 排版座標畫格線，不受手機畫面縮小或捲動位置影響。
  context.strokeStyle='#111';context.lineWidth=1;
  element.querySelectorAll('.official-table th,.official-table td').forEach(cell=>{const r=box(cell);context.strokeRect(r.x,r.y,r.width,r.height);});
  const table=box(element.querySelector('table'));context.lineWidth=2;context.strokeRect(table.x,table.y,table.width,table.height);
  element.querySelectorAll('.void-field').forEach(cell=>{const r=box(cell);context.lineWidth=1.3;context.beginPath();context.moveTo(r.x+3,r.y+3);context.lineTo(r.x+r.width-3,r.y+r.height-3);context.moveTo(r.x+3,r.y+r.height-3);context.lineTo(r.x+r.width-3,r.y+3);context.stroke();const label=box(cell.querySelector('span'));context.fillStyle='#fff';context.fillRect(label.x-2,label.y,label.width+4,label.height);});
  const setFont=node=>{const style=getComputedStyle(node);context.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;context.fillStyle=style.color;return style;};
  const baseline=(rect,size)=>{const m=context.measureText('田Mg'),a=m.fontBoundingBoxAscent||size*.85,d=m.fontBoundingBoxDescent||size*.15;return rect.top-origin.top+(rect.height-a-d)/2+a;};
  const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
  for(let node=walker.nextNode();node;node=walker.nextNode()){
   if(!node.textContent.trim()||node.parentElement.closest('svg'))continue;
   const style=setFont(node.parentElement);if(style.display==='none'||style.visibility==='hidden')continue;
   const range=document.createRange();let offset=0;
   // 使用每個字在原表中的座標，完整保留中文換行、全形空白與標題字距。
   for(const char of node.textContent){const next=offset+char.length;range.setStart(node,offset);range.setEnd(node,next);offset=next;if(!char.trim())continue;const r=range.getBoundingClientRect();if(!r.width||!r.height)continue;context.fillText(char,r.left-origin.left,baseline(r,parseFloat(style.fontSize)));}
  }
  element.querySelectorAll('s').forEach(mark=>{context.strokeStyle=getComputedStyle(mark).color;context.lineWidth=1;[...mark.getClientRects()].forEach(r=>{context.beginPath();context.moveTo(r.left-origin.left,r.top-origin.top+r.height*.52);context.lineTo(r.right-origin.left,r.top-origin.top+r.height*.52);context.stroke();});});
  element.querySelectorAll('.paper-notes li').forEach((li,index)=>{const style=setFont(li),range=document.createRange();range.selectNodeContents(li);const r=range.getClientRects()[0];if(r)context.fillText(`${index+1}.`,r.left-origin.left-parseFloat(style.fontSize)*1.5,baseline(r,parseFloat(style.fontSize)));});
  return canvas;
 }
 button.onclick=async()=>{
  button.disabled=true;button.textContent='正在產生完整單據…';result.hidden=true;
  let staging;
  try{
   await document.fonts.ready;
   const source=document.getElementById('officialPaper');
   staging=document.createElement('div');staging.className='export-staging';
   const clone=source.cloneNode(true);clone.removeAttribute('id');clone.classList.add('export-paper');
   clone.style.setProperty('transform','none','important');clone.style.removeProperty('--paper-scale');
   staging.append(clone);document.body.append(staging);
   // 在不受手機縮放影響的固定寬度副本上輸出，包含表尾與完整附註。
   const width=794,height=Math.max(1123,clone.scrollHeight);
   const scale=Math.min(3,Math.sqrt(12000000/(width*height)));
   const canvas=renderSheet(clone,width,height,scale);
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('無法產生圖片')),'image/png'));
   if(savedUrl)URL.revokeObjectURL(savedUrl);savedUrl=URL.createObjectURL(blob);
   const title=source.querySelector('h2').textContent.replace(/[\\/:*?"<>|]/g,'').slice(0,65);
   const filename=title+'－完整單據.png';
   const link=document.createElement('a');link.href=savedUrl;link.download=filename;link.click();
   const open=document.getElementById('openSheetImage');open.href=savedUrl;
   const retry=document.getElementById('saveSheetImage');retry.href=savedUrl;retry.download=filename;
   result.hidden=false;
   toast('已產生完整單據圖片，可儲存後放大對照');
  }catch(error){toast('圖片產生失敗，請重試，或使用列印另存 PDF。');console.error('Sheet image export failed',error);}
  finally{staging?.remove();button.disabled=false;button.textContent='下載完整單據圖片';}
 };
 // 欄位修改後移除舊圖片入口，避免誤用前一版。
 document.getElementById('draftForm').addEventListener('input',()=>{result.hidden=true;});
 document.getElementById('paperMode').addEventListener('change',()=>{result.hidden=true;});
})();
