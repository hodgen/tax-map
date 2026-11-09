// Lane A and Lane B steps, shared by the Stage 2 and Stage 3 pages.
const LANE_A = [
 {id:"P0",st:2,t:"Build “Baseline of Truth” SKILL.md",d:"Create a SKILL.md that reads a prior-year return file and writes the Baseline of Truth report in a fixed format.",who:"Preparer CPA + Project Leader",r:"cpa",to:"Admin desk",qc:"Tested on clients the CPA knows well. Approved when it misses nothing. Every later change records who changed it and why."},
 {id:"A1",st:2,t:"Baseline Report (“Baseline of Truth”)",d:"Admin downloads last year's NetDocs matter as a zip (return, workpapers, data files) and gives it to the bot. The bot lists every item on last year's return and FBAR, including items with no income (FBAR accounts, dormant entities, PFICs, trusts): last year's amount, the return line, the source document. It carries forward every memo on an unusual position, for consistency. One Baseline item per account, entity or source.",who:"Bot + Admin desk",r:"bot",to:"Admin desk or Bot"},
 {id:"A2",st:2,t:"Baseline of Truth Report: Quality Control",d:"Review the Baseline of Truth report for completeness. Purpose: eliminate “I should have asked about this, but I didn't.”",who:"Admin desk or Bot",r:"admin",gate:true,to:"Preparer CPA",qc:"Method to be decided."},
 {id:"A3",st:2,t:"Generate Request List",d:"CPA looks at the Baseline of Truth Report and decides what NOT to ask the client to deliver for the current tax return. Purpose: eliminate questions that we know for a fact are no longer applicable. Asking for something that doesn't apply makes the client think the CPA isn't paying attention.",who:"Preparer CPA",r:"cpa",to:"Admin desk or Bot"},
 {id:"A4",st:2,t:"Quality Control Request List (Admin/Bot)",d:"Every difference between the Baseline of Truth Report and the Request List is identified and there is a written reason for why something was listed on the Baseline of Truth Report and was not included in the Request List.",who:"Admin desk or Bot",r:"admin",to:"Preparer CPA"},
 {id:"A5",st:2,t:"Request List: Quality Control Review (CPA)",d:"The CPA reviews what the Admin or Bot did, and signs off. Now we know exactly what we are going to ask the client to provide.",who:"Preparer CPA",r:"cpa",gate:true,to:"Bot + Admin desk"},
 {id:"A6",st:2,t:"Create the Drop Zone",d:"One drop zone per Request List item, with the questionnaire and a progress meter that climbs to 100%. A watcher checks every drop zone and sends each new file to A8 at once. Then the client is told to start uploading. Until another tool is selected, use ShareFile.",who:"Bot + Admin desk",r:"bot",to:"Client",qc:"Number of drop zones = number of Request List items. One test upload reaches A8."},
 {id:"A7",st:2,t:"Client Delivers Data Items to Drop Zone",d:"One item at a time, to its drop zone. Email, text and calls also count. Each item shows last year's figure and accepts only three answers: the new document; closed (get a date from the client and accept the client's assurance unless otherwise indicated; see later stages); open with no income (e.g., an account still sends its statement, for the FBAR balances). Third parties send the items they hold, with the client's permission.",who:"Client",r:"client",to:"Bot",loop:"Follow-up loops exist, with standard escalation cycle: email, text message, phone call. Methods exist for capturing data from phone calls, emails, text messages from client (e.g., CPA makes a note about something learned in a call with the client in a text file and uploads it to ShareFile)."},
 {id:"A8",st:2,t:"Tracking Number Assigned to Document",d:"Every file that arrives, from any channel, gets a tracking number first. The original is kept unchanged.",who:"Bot",r:"bot",to:"Bot"},
 {id:"A9",st:2,t:"Document Cleanup",d:"Orient the pages. Split a file that holds several separate documents.",who:"Bot",r:"bot",to:"Bot"},
 {id:"A10",st:2,t:"Document Readability Check",d:"Readable and complete, or rejected and a cleaner copy is requested (A13).",who:"Bot; Admin decides",r:"bot",to:"Bot"},
 {id:"A11",st:2,t:"Match Document Contents to Request List Item",d:"Check off the Request List item the document answers. A document we did not ask for is flagged to the CPA.",who:"Bot; Admin confirms",r:"bot",to:"Bot"},
 {id:"A12",st:2,t:"Save Document to Server",d:"Stamp each page with the tracking number, name the file, save it to the client's folder.",who:"Bot",r:"bot",to:"Bot"},
 {id:"A13",st:2,t:"Confirmation Email to Client",d:"What we have, what we still need. A request for a cleaner copy when a document failed the readability check.",who:"Bot",r:"bot",to:"Bot + Admin desk"},
 {id:"A14",st:3,t:"Extract Individual Data Item to the Workpaper",d:"Find relevant data items in the data file and input to the correct workpaper. The workpaper shows the tracking number for the source of the input value.",who:"Bot + Admin desk",r:"bot",to:"Preparer CPA"},
 {id:"A15",st:3,t:"Preparer Check Relevant Data in Workpapers",d:"Preparer CPA checks that relevant data transfer from source document to workpaper is correct.",who:"Preparer CPA",r:"cpa",to:"Preparer CPA"},
 {id:"A16",st:3,t:"Mark Irrelevant Data in Data File",d:"For every data item in a particular data file received from the client, eyeball it and mark it as not needed for income tax return preparation.",who:"Preparer CPA",r:"cpa",to:"Reviewer CPA"},
 {id:"A17",st:3,t:"Reviewer Check",d:"Reviewer CPA confirms data inclusions are accurate (A14) and data exclusions are accurate (A16).",who:"Reviewer CPA",r:"cpa",to:"Preparer CPA"},
 {id:"A18",st:3,t:"Close the Item",d:"Received, complete, in the workpaper and checked by both CPAs.",who:"Preparer CPA",r:"cpa",gate:true,next:{st:4,done:"Once per return, when every item is closed and the workpapers are complete.",to:"Preparer",start:"UltraTax entry starts."}}
];
const LANE_B = [
 {id:"B1",t:"Build the Go Fish Checklist",d:"The script for the call. Questions are asked whether or not the item was reported before.",who:"Preparer CPA",r:"cpa",to:"Admin desk"},
 {id:"B2",t:"Get Consent to Record",d:"In writing before the call, confirmed at the start of the call. The transcription vendor must be named in the §7216 Consent.",who:"Admin desk",r:"admin",to:"Preparer CPA"},
 {id:"B3",t:"Go Fish Call, in January",d:"Early, because every finding starts a new chase in Lane A. The CPA annotates the checklist on screen in front of the client; the bot takes notes.",who:"Preparer CPA",r:"cpa",to:"Preparer CPA"},
 {id:"B4",t:"Write an Answer for Every Question",d:"The CPA writes the answers. “No” is an answer. “Not sure” stays open until it is resolved.",who:"Preparer CPA",r:"cpa",to:"Preparer CPA"},
 {id:"B5",t:"Route Each Answer",who:"Preparer CPA",r:"cpa",to:"Preparer CPA",outcomes:[
   ["Does not exist in the client's life","Recorded",false],
   ["Exists","New item in Lane A",true],
   ["Not sure: more data is needed","New item in Lane A",true],
   ["Not sure: research is needed","Research queue, memo to file",false],
   ["Problem in prior years","Separate cleanup matter, own engagement and price",false],
   ["New filing, e.g. Form 709 or 3520","Price Change Notice",false]
 ]},
 {id:"B6",t:"Send the Go Fish Summary",d:"“We asked you all of these questions; here are your answers; here is what we decided, with your participation and consent.”",who:"Preparer CPA",r:"cpa",to:"Client"},
 {id:"B7",t:"Client Acknowledges the Summary",d:"In writing. This is the evidence for every “do nothing” decision.",who:"Client",r:"client",to:"Preparer CPA"},
 {id:"B8",t:"Close Lane B",d:"Every question answered, every new ticket resolved: folded into this year's return, or a memo in the workpapers that records the decision to do nothing.",who:"Preparer CPA",r:"cpa",gate:true}
];

// Draw a list of steps. opts.head / opts.tail: extra HTML before the first and after the last step.
function renderLane(el, steps, opts){
  opts = opts || {};
  el.innerHTML = (opts.head||'') + steps.map((s,i)=>{
    const out = s.outcomes ? '<ul class="outcomes">'+s.outcomes.map(o=>`<li><span>${o[0]}</span><span class="go${o[2]?' toA':''}">→ ${o[1]}</span></li>`).join('')+'</ul>' : '';
    const box = `<li><div class="step r-${s.r}${s.gate?' gate':''}"><div class="id">${s.id}${s.st?' · stage '+s.st:''}</div><div class="t">${s.t}</div>${s.d?`<div class="d">${s.d}</div>`:''}${out}<span class="who">${s.who}</span>${s.qc?`<div class="qc">${s.qc}</div>`:''}${s.loop?`<div class="loop">${s.loop}</div>`:''}</div></li>`;
    const line = (i<steps.length-1 && s.to) ? `<li class="handoff">${s.who===s.to?'stays with '+s.to:'hands to '+s.to}</li>` : '';
    return box+line;
  }).join('') + (opts.tail||'');
}
