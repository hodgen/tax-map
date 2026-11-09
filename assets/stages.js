// Shared by every page of the tax-map site.
// One canonical list of the nine stages. Each page sets <body data-stage="N"> (0 = home)
// and data-root ("" on the home page, "../" on a stage page).

const STAGES = [
 {n:1,slug:"1-engagement",name:"Engagement",start:"We email the client: do you want us to do your returns this year?",end:"Client signs the engagement agreement and pays.",input:"Last year's client list.",output:"All required engagement documents. A definite roster of who is on the bus. For each client, a Preparer CPA and a Reviewer CPA are designated.",owner:"Client",cls:"client",role:"Admin desk",mode:"Watches",note:"Subroutines for prompt yes, nudged yes, no, and silence. Our side is largely automatable."},
 {n:2,slug:"2-data-collection",name:"Data Collection",start:"We are officially hired and may ask for information.",end:"Every Lane A item is received and saved, or closed as “not obtained”; Lane B is closed: every Go Fish question answered, every new ticket resolved, summary acknowledged by the client.",input:"Output of stage 1.",output:"Immaculately organized original data files on the server, handed item by item to stage 3; the client-acknowledged Go Fish summary; a memo for every researched position.",owner:"Client",cls:"client",role:"Preparer CPA",mode:"Watches",note:"The Preparer CPA owns this stage and watches it. Lane A steps P0 to A13 and all of Lane B (Go Fish) belong here. The CPA owns the Go Fish call because the CPA can read hesitation. Research issues are solved here, in parallel, never at final review."},
 {n:3,slug:"3-workpapers",name:"Workpapers Complete",start:"Runs in parallel with stage 2: each item enters stage 3 as soon as it is cleaned and saved on the server.",end:"Every item is in the workpaper, checked by the Preparer and the Reviewer, and closed.",input:"Each cleaned and saved item from stage 2, one at a time.",output:"Well-organized workpapers, every number verified against its source document, ready for UltraTax entry.",owner:"Firm",cls:"firm",role:"Preparer",mode:"Does",note:"Lane A steps A14 to A18. The baton passes once per item, not once per return. A Preparer check can send an item back to stage 2 for a client reminder. The gap between the last item received and the last item closed is firm time: measure it."},
 {n:4,slug:"4-unreviewed-return",name:"Unreviewed Return",start:"Complete workpapers. UltraTax entry starts here.",end:"Draft return the preparer has checked for typos and sanity.",input:"Workpapers.",output:"An unreviewed tax return.",owner:"Firm",cls:"firm",role:"Preparer",mode:"Does",note:"A keypunch job from the workpapers into UltraTax, plus a preparer-side quality sweep."},
 {n:5,slug:"5-reviewed-return",name:"Reviewed Return",start:"Reviewer has workpapers and the unreviewed return.",end:"Reviewer agrees everything in the workpapers landed in the right place.",input:"Unreviewed return plus workpapers.",output:"A reviewed tax return.",owner:"Firm",cls:"firm",role:"Reviewer",mode:"Does",note:"Not the reviewer's job to question completeness or hunt unknown unknowns. That was stage 2. Not the reviewer's job to re-verify numbers against the source documents either: every workpaper number carries the tracking number of its source page and was checked in stage 3. The reviewer relies on the workpaper; no redundant review."},
 {n:6,slug:"6-signed-return",name:"Signed Return",start:"Reviewed return received.",end:"Client and preparer have signed, physically or digitally.",input:"Reviewed return.",output:"A signed tax return.",owner:"Client",cls:"client",role:"Admin desk",mode:"Watches",note:""},
 {n:7,slug:"7-filed-return",name:"Filed Return",start:"Signed return in hand.",end:"Filed electronically or on paper.",input:"Signed return.",output:"A filed tax return.",owner:"Firm",cls:"firm",role:"Admin desk",mode:"Does",note:""},
 {n:8,slug:"8-confirmed-filed",name:"Confirmed Filed",start:"We know the return was filed.",end:"E-file acceptance, or proof of mailing plus the signed certified-mail receipt.",input:"Filed return.",output:"Proof the IRS received it. Needed far more often than it should be.",owner:"Software or USPS",cls:"third",role:"Admin desk",mode:"Watches",note:""},
 {n:9,slug:"9-close-the-file",name:"Close the File",start:"Proof of filing in hand.",end:"File closed; next year's client follow-up loop started.",input:"Proof of filing.",output:"Four scheduled client conversations in the coming year, for maintenance and nurture.",owner:"Firm",cls:"firm",role:"Admin desk",mode:"Does",note:"Final review of the file, clean out drafts and messes."}
];

const PAGE = {
  stage: Number(document.body.dataset.stage || 0),
  root: document.body.dataset.root || ""
};
const stageHref = s => PAGE.root + s.slug + "/";

// "Last updated" comes from the file's Last-Modified time, shown in Pacific Time.
(function(){
  const el = document.getElementById('updated'); if(!el) return;
  const d = new Date(document.lastModified); if (isNaN(d)) return;
  const f = new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
  el.textContent = 'Last updated: ' + f.format(d);
})();

// The nine boxes across the top. Every box is a link; the current stage is marked.
(function(){
  const row = document.getElementById('chainRow'); if(!row) return;
  STAGES.forEach((s,i)=>{
    const link = document.createElement('div'); link.className='link';
    const a = document.createElement('a'); a.className='node '+s.cls; a.href=stageHref(s);
    if(s.n===PAGE.stage) a.setAttribute('aria-current','page');
    a.innerHTML = `<div class="n">Stage ${s.n}</div><div class="t">${s.name}</div><span class="o">${s.owner.split(' ')[0]}</span>`;
    link.appendChild(a);
    if(i<STAGES.length-1){ const ar=document.createElement('div'); ar.className='arrow'; ar.textContent='→'; link.appendChild(ar); }
    row.appendChild(link);
  });
})();

// Stage page: title, the stage summary card, and previous / next links.
(function(){
  if(!PAGE.stage) return;
  const s = STAGES[PAGE.stage-1];
  document.title = `Stage ${s.n}: ${s.name}`;
  const h = document.getElementById('stageTitle'); if(h) h.textContent = `Stage ${s.n}: ${s.name}`;
  const sum = document.getElementById('stageSummary');
  if(sum){
    sum.className = 'summary '+s.cls;
    sum.innerHTML = `<div><span class="pill">${s.owner} owns the delay</span><span class="pill">${s.role}</span><span class="mode ${s.mode.toLowerCase()}">${s.mode}</span></div>
      <dl><dt>Starts</dt><dd>${s.start}</dd><dt>Ends</dt><dd>${s.end}</dd><dt>Input</dt><dd>${s.input}</dd><dt>Output</dt><dd>${s.output}</dd>${s.note?`<dt>Note</dt><dd>${s.note}</dd>`:''}</dl>`;
  }
  const pg = document.getElementById('pager');
  if(pg){
    const prev = STAGES[s.n-2], next = STAGES[s.n];
    pg.innerHTML = `<span>${prev?`<a href="${stageHref(prev)}">← Stage ${prev.n}: ${prev.name}</a>`:''}</span>
      <span><a href="${PAGE.root}">Home</a></span>
      <span>${next?`<a href="${stageHref(next)}">Stage ${next.n}: ${next.name} →</a>`:''}</span>`;
  }
})();
