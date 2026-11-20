/* iframe 的 fixed 底端可能落在 Google Sites 可見區域外，內嵌改用上方導覽。 */
(()=>{
 const embedded=window.self!==window.top||new URLSearchParams(location.search).get('embed')==='1';
 if(!embedded)return;
 document.documentElement.classList.add('embedded');
 const sidebar=document.querySelector('.sidebar'),nav=sidebar.querySelector('nav');
 const host=document.createElement('div');host.id='embedNavigation';
 sidebar.after(host);host.append(nav);
 const open=document.createElement('a');open.className='embed-open';
 const url=new URL(location.href);url.searchParams.delete('embed');
 open.href=url.href;open.target='_blank';open.rel='noopener noreferrer';
 open.textContent='另開完整頁面';sidebar.append(open);
})();
