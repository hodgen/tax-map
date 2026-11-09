// Task cards for every stage page. One data source, one card template (Maeghan's Stage 1 format
// plus Level, Evidence, Time, Exception, Status). Fields marked by Claude are first guesses (2026-11-08).
//
// Card fields: id, name, input, action, who, tool, output, level (J|R|M|C), done (shown as Evidence: the record
// the task leaves behind; for J tasks a decision Yes/No/Other, reason, initials, date), time, exc, status, note,
// routes (list of [answer, where it goes]).

const LEVELS = {
  J:{label:"J · Judgment", cls:"lv-j", tip:"CPA only"},
  R:{label:"R · Rule",     cls:"lv-r", tip:"Admin with a checklist"},
  M:{label:"M · Machine",  cls:"lv-m", tip:"Bot candidate"},
  C:{label:"Client",       cls:"lv-c", tip:"Client action"}
};

const CARDS = {

// ---------- Stage 1, Path A (Maeghan Gershey, 2026-11-03) ----------
s1A: [
 {id:"1", name:"Review the list with the CPAs", input:"Last year's client list", action:"Send each CPA the project list. Each CPA marks who to contact, who not to contact, and any notes.", who:"Maeghan, then each CPA", tool:"Excel (project list)", output:"Reach-out list with this client marked to contact", level:"J",
  done:"Each client on the reach-out list is marked Contact, Do not contact, or Other, with a reason for Do not contact and Other, and the CPA's initials and date.", exc:"A CPA does not answer by the due date: send to Phil.",
  note:"Mixed task. Sending the list and collecting the marks is R. Deciding whom to contact is J. Candidate to split."},
 {id:"2", name:"Set the budget", input:"Reach-out list with this client marked to contact", action:"Prepare a budget estimate for this client's returns. William approves it.", who:"Maeghan prepares; William approves", tool:"Excel (reach-out list)", output:"Approved budget quote", level:"J",
  done:"The budget line shows Approved, Not approved, or Other (with a reason), with William's initials and date.", exc:"Scope changed from last year: send to the CPA before the quote goes to William.",
  note:"Mixed task. A first estimate from last year's fee plus a fixed increase is R. The approval is J. Candidate to split."},
 {id:"3", name:"Check contact rules", input:"Approved budget quote", action:"Check the client's Clio record for contact rules.", who:"Maeghan", tool:"Clio", output:"Approved quote with confirmed recipient and contact method", level:"R",
  done:"Recipient and contact method are written on the reach-out list.", exc:"The Clio record has no contact rules or conflicting rules: ask the CPA."},
 {id:"4", name:"Send the reach-out email", input:"Approved quote with confirmed recipient and contact method", action:"Email the client: do you want us to prepare your returns this year? Include the quote.", who:"Maeghan", tool:"Nutshell", output:"Reach-out email sent; lead open in the pipeline", level:"M",
  done:"Nutshell shows the email sent and a follow-up date set.", exc:"The email bounces: find the correct address in Clio, then ask the CPA."},
 {id:"5", name:"Client says yes", input:"Reach-out email sent; lead open in the pipeline", action:"Client replies promptly and agrees to the quote.", who:"Client", tool:"Email", output:"Written yes from the client", level:"C",
  done:"A written yes is saved in Nutshell.", exc:"The client asks a question or wants a different price: send to the CPA."},
 {id:"6", name:"Prepare the LSA", input:"Written yes from the client", action:"Draft the Legal Services Agreement from the approved quote and the forms in scope.", who:"Maeghan", tool:"LSA template", output:"LSA ready to send", level:"R",
  done:"Every blank in the template is filled. The fee matches the approved quote.", exc:"The scope does not fit the template: send to the CPA."},
 {id:"7", name:"Send the LSA and deposit request", input:"LSA ready to send", action:"Send the LSA for signature with the deposit request.", who:"Maeghan", tool:"E-signature tool", output:"LSA and deposit request with the client", level:"M",
  done:"The e-signature tool shows the envelope sent."},
 {id:"8", name:"Client signs and pays", input:"LSA and deposit request with the client", action:"Client signs the LSA and sends the deposit.", who:"Client", tool:"E-signature tool; trust account", output:"Signed LSA and deposit received", level:"C",
  done:"Signed LSA saved; deposit shows in the trust account.", exc:"The client signs but does not pay, or asks to change the LSA: send to the CPA."},
 {id:"9", name:"Open the project", input:"Signed LSA and deposit received", action:"Open the matter in Clio and NetDocuments, and mark the Nutshell lead won.", who:"Maeghan", tool:"Clio, NetDocuments, Nutshell", output:"Open matter in Clio and NetDocuments", level:"R",
  done:"Matter number exists in Clio and NetDocuments; the Nutshell lead is won."},
 {id:"10", name:"Request identity proof, KYC information, and POA", input:"Open matter in Clio and NetDocuments", action:"Send the KYC request. Ask the client for a passport or government-issued ID. Send Form 2848 for e-signature, prepared from the firm's POA template.", who:"Maeghan", tool:"Email; e-signature tool", output:"Identity, KYC, and POA request with the client", level:"M",
  done:"The KYC email and the Form 2848 envelope are sent."},
 {id:"11", name:"Client sends ID and KYC information, and signs POA", input:"Identity, KYC, and POA request with the client", action:"Client sends a copy of their ID, returns the KYC information, and signs Form 2848.", who:"Client", tool:"Upload; e-signature tool", output:"All engagement documents in hand", level:"C",
  done:"ID copy, KYC answers and signed Form 2848 are saved to the matter.", exc:"The ID is expired or unreadable: request a new copy."}
],

// ---------- Stage 1, Path B (Maeghan Gershey, 2026-11-03) ----------
s1B: [
 {id:"B1", name:"Wait for a decision", input:"Reach-out email sent, or a reply with no decision", action:"Watch for the client's answer. No decision arrives by the next follow-up date.", who:"Client; Maeghan watches", tool:"Nutshell", output:"No decision by the follow-up date", level:"C",
  done:"The follow-up date has passed with no decision.", note:"The watching is M: Nutshell can remind on the follow-up date."},
 {id:"B2", name:"Send a follow-up", input:"No decision by the follow-up date", action:"Send a follow-up email that restates the quote and asks for a yes or no. Set the next follow-up date.", who:"Maeghan", tool:"Nutshell", output:"Follow-up sent; next follow-up date set", level:"M",
  done:"Nutshell shows the follow-up sent and the next date set.", exc:"After the third follow-up with no answer: send to the CPA (the “silence” path, not mapped yet)."},
 {id:"B3", name:"Client replies without a decision", input:"Follow-up sent; next follow-up date set", action:"Client acknowledges the email but does not commit, or does not reply.", who:"Client", tool:"Email", output:"A reply with no decision", level:"C"},
 {id:"B4", name:"Client says yes", input:"Follow-up sent; next follow-up date set", action:"After several weeks and one or more follow-ups, the client agrees to the quote.", who:"Client", tool:"Email", output:"Written yes from the client", level:"C",
  done:"A written yes is saved in Nutshell."}
],

// ---------- Stage 2, Lane A: confirm and update (Phil, lane-a-steps-v2) ----------
s2A: [
 {id:"P0", name:"Build “Baseline of Truth” SKILL.md", input:"Prior-year return files for clients the CPA knows well", action:"Create a SKILL.md that reads a prior-year return file and writes the Baseline of Truth report in a fixed format.", who:"Preparer CPA + Project Leader", tool:"Claude Code", output:"Approved Baseline of Truth SKILL.md", level:"J",
  done:"A test log: the clients tested, the items missed, and the CPA's approval with initials and date. A change log records who changed the skill, when, and why.", exc:"The report misses an item: the CPA corrects the skill and tests again.",
  note:"Done once for the firm, not once per client."},
 {id:"A1", name:"Baseline Report (“Baseline of Truth”)", input:"Last year's NetDocs matter as a zip (return, workpapers, data files) and the Baseline skill", action:"Admin downloads the matter and gives it to the bot. The bot lists every item on last year's return and FBAR, including items with no income (FBAR accounts, dormant entities, PFICs, trusts): last year's amount, the return line, the source document. It carries forward every memo on an unusual position. One Baseline item per account, entity or source.", who:"Bot + Admin desk", tool:"NetDocuments; bot", output:"Baseline of Truth report", level:"M",
  done:"The report has one line for each account, entity and source on last year's return and FBAR.", exc:"Last year's matter is incomplete or missing: send to the CPA.",
  note:"The download is R today; the analysis is M."},
 {id:"A2", name:"Baseline of Truth Report: Quality Control", input:"Baseline of Truth report", action:"Review the report for completeness. Purpose: eliminate “I should have asked about this, but I didn't.”", who:"Admin desk or Bot", tool:"Baseline report; last year's return", output:"Baseline report checked for completeness", level:"R",
  done:"Method to be decided. Proposal: every schedule and form in last year's return maps to at least one Baseline line.", exc:"An item cannot be matched: send to the CPA."},
 {id:"A3", name:"Generate Request List", input:"Baseline report checked for completeness", action:"Decide what NOT to ask the client to deliver this year. Purpose: eliminate questions that we know for a fact no longer apply. Asking for something that does not apply makes the client think the CPA is not paying attention.", who:"Preparer CPA", tool:"Baseline report", output:"Draft Request List with the CPA's marks", level:"J",
  done:"Each Baseline line is marked Ask, Do not ask, or Other. Do not ask and Other carry a reason. Each mark has the CPA's initials and date."},
 {id:"A4", name:"Quality Control Request List (Admin/Bot)", input:"Draft Request List with the CPA's marks", action:"Identify every difference between the Baseline report and the Request List. Each item on the Baseline and not on the Request List has a written reason.", who:"Admin desk or Bot", tool:"Baseline report; Request List", output:"Request List with a written reason for each removed item", level:"R",
  done:"Number of Baseline lines = Request List items + removed items with a reason.", exc:"A removed item has no reason: send back to the CPA."},
 {id:"A5", name:"Request List: Quality Control Review (CPA)", input:"Request List with a written reason for each removed item", action:"The CPA reviews what the Admin or Bot did, and signs off. Now we know exactly what we will ask the client to provide.", who:"Preparer CPA", tool:"Request List", output:"Approved Request List", level:"J",
  done:"The Request List shows Approved, Not approved, or Other (with a reason), with the CPA's initials and date."},
 {id:"A6", name:"Create the Drop Zone", input:"Approved Request List", action:"One drop zone per Request List item, with the questionnaire and a progress meter that climbs to 100%. A watcher checks every drop zone and sends each new file to A8 at once. Then the client is told to start uploading. Until another tool is selected, use ShareFile.", who:"Bot + Admin desk", tool:"ShareFile", output:"Drop zone live; client told to upload", level:"M",
  done:"Number of drop zones = number of Request List items. One test upload reaches A8."},
 {id:"A7", name:"Client Delivers Data Items to Drop Zone", input:"Drop zone live; client told to upload", action:"One item at a time, to its drop zone. Email, text and calls also count. Each item shows last year's figure and accepts only three answers: the new document; closed (get a date from the client and accept the client's assurance unless otherwise indicated); open with no income (e.g., an account still sends its statement, for the FBAR balances). Third parties send the items they hold, with the client's permission.", who:"Client", tool:"ShareFile; email; text; phone", output:"One item answered, from any channel", level:"C",
  done:"The item has one of the three answers.", exc:"Follow-up loops with a standard escalation cycle: email, text message, phone call. Notes from calls, emails and texts are captured as files (e.g., the CPA writes a note after a call and uploads it to ShareFile)."},
 {id:"A8", name:"Tracking Number Assigned to Document", input:"One item answered, from any channel", action:"Every file that arrives, from any channel, gets a tracking number first. Think old-school Bates numbering. The original is kept unchanged.", who:"Bot", tool:"Bot (Bates stamp)", output:"File with a tracking number; original kept", level:"M",
  done:"Every file in the drop zone has a tracking number. No number is used twice."},
 {id:"A9", name:"Document Cleanup", input:"File with a tracking number; original kept", action:"Orient the pages. Split a file that holds several separate documents.", who:"Bot", tool:"Bot (PDF tools)", output:"Oriented documents, one document per file", level:"M",
  done:"All pages upright; each file holds one document.", exc:"The bot cannot tell where one document ends: send to Admin."},
 {id:"A10", name:"Document Readability Check", input:"Oriented documents, one document per file", action:"Readable and complete, or rejected and a cleaner copy is requested (A13).", who:"Bot; Admin decides", tool:"Bot; PDF viewer", output:"Readable document, or a rejection with the reason", level:"R",
  done:"Each document is marked readable or rejected.", note:"The bot can flag; a person decides. Candidate for M later."},
 {id:"A11", name:"Match Document Contents to Request List Item", input:"Readable document", action:"Check off the Request List item the document answers. A document we did not ask for is flagged to the CPA (all documents received are accounted for and either used as a source document or marked as not applicable).", who:"Bot; Admin confirms", tool:"Request List", output:"Document matched to its Request List item, or flagged", level:"R",
  done:"Every document is matched or flagged.", exc:"A document we did not ask for: send to the CPA."},
 {id:"A12", name:"Save Document to Server", input:"Document matched to its Request List item", action:"Stamp each page with the tracking number, name the file, save it to the client's folder.", who:"Bot", tool:"NetDocuments", output:"Stamped, named document in the client's folder", level:"M",
  done:"File name follows the naming rule; every page shows the tracking number."},
 {id:"A13", name:"Confirmation Email to Client", input:"Stamped, named document in the client's folder", action:"Tell the client what we have received and what we still need. Show the progress meter for encouragement. Ask for a cleaner copy when a document failed the readability check.", who:"Bot", tool:"Email", output:"Client told what is received and what is still needed", level:"M",
  done:"The email is sent and matches the Request List status."}
],

// ---------- Stage 2, Lane B: Go Fish ----------
s2B: [
 {id:"B1", name:"Build the Go Fish Checklist", input:"Approved Request List and the firm's Go Fish question bank", action:"Prepare the script for the call. Questions are asked whether or not the item was reported before.", who:"Preparer CPA", tool:"Checklist template", output:"Go Fish checklist for this client", level:"J",
  done:"Each question in the bank is marked Keep or Remove; Remove carries a reason. Added questions are marked Added. The CPA's initials and date are on the checklist.", note:"A standard question bank makes most of this R. The CPA adds client-specific questions (J)."},
 {id:"B2", name:"Get Consent to Record", input:"Go Fish checklist for this client", action:"Get consent in writing before the call; confirm it at the start of the call. The transcription vendor must be named in the §7216 consent.", who:"Admin desk", tool:"Email; e-signature tool", output:"Written consent to record; call scheduled", level:"R",
  done:"Signed consent is saved before the call date.", exc:"The client refuses: the call goes ahead without a recording; the CPA takes notes."},
 {id:"B3", name:"Go Fish Call, in January", input:"Written consent to record; call scheduled", action:"Early, because every finding starts a new chase in Lane A. The CPA annotates the checklist on screen in front of the client; the bot takes notes.", who:"Preparer CPA", tool:"Video call; transcription", output:"Annotated checklist and call transcript", level:"J",
  done:"The annotated checklist and the call transcript are saved to the matter. Each question is marked Asked.", note:"The CPA owns this call because the CPA can read hesitation."},
 {id:"B4", name:"Write an Answer for Every Question", input:"Annotated checklist and call transcript", action:"The CPA writes the answers. “No” is an answer. “Not sure” stays open until it is resolved.", who:"Preparer CPA", tool:"Checklist", output:"Checklist with an answer for every question", level:"J",
  done:"Each question shows Yes, No, or Not sure (open), with the CPA's note and initials.", note:"The bot can draft answers from the transcript (M); the CPA confirms them (J)."},
 {id:"B5", name:"Route Each Answer", input:"Checklist with an answer for every question", action:"Send each answer to its destination.", who:"Preparer CPA", tool:"Checklist", output:"Every answer routed", level:"J",
  routes:[["Does not exist in the client's life","Recorded"],["Exists","New item in Lane A"],["Not sure: more data is needed","New item in Lane A"],["Not sure: research is needed","Research queue, memo to file"],["Problem in prior years","Separate cleanup matter, own engagement and price"],["New filing, e.g. Form 709 or 3520","Price Change Notice"]],
  done:"Each answer shows its destination from the list above and the CPA's initials.", note:"Once the CPA picks the answer, the routing itself is R."},
 {id:"B6", name:"Send the Go Fish Summary", input:"Every answer routed", action:"Send the client: “We asked you all of these questions; here are your answers; here is what we decided, with your participation and consent.”", who:"Preparer CPA", tool:"Email", output:"Summary with the client", level:"R",
  done:"Summary sent; it lists every question.", note:"The bot can draft the summary from the checklist (M)."},
 {id:"B7", name:"Client Acknowledges the Summary", input:"Summary with the client", action:"The client acknowledges the summary in writing. This is the evidence for every “do nothing” decision.", who:"Client", tool:"Email; e-signature tool", output:"Written acknowledgment", level:"C",
  done:"The acknowledgment is saved to the matter.", exc:"The client disagrees with an answer: send to the CPA."},
 {id:"B8", name:"Close Lane B", input:"Written acknowledgment", action:"Every question answered, every new ticket resolved: folded into this year's return, or a memo in the workpapers that records the decision to do nothing.", who:"Preparer CPA", tool:"Workpapers", output:"Lane B closed", level:"J",
  done:"A close-out record lists every Lane B ticket with its result (in the return, or memo to file), and the CPA's initials and date."}
],

// ---------- Stage 3: Lane A, per item ----------
s3: [
 {id:"A14", name:"Extract Individual Data Item to the Workpaper", input:"Stamped, named document in the client's folder", action:"Find the relevant data items in the data file and enter them in the correct workpaper. The workpaper shows the tracking number of the source of each value.", who:"Bot + Admin desk", tool:"Workpaper (Excel); source PDF", output:"Workpaper entries with tracking numbers", level:"R",
  done:"Every entry has a tracking number.", exc:"No workpaper line fits the item: send to the CPA.",
  note:"Standard workpapers would make this M (see the #tax-prep-workflow discussion on workpaper formats)."},
 {id:"A15", name:"Preparer Check Relevant Data in Workpapers", input:"Workpaper entries with tracking numbers", action:"Check that each value moved from the source document to the workpaper correctly.", who:"Preparer CPA", tool:"Workpaper; source PDF side by side", output:"Workpaper entries checked", level:"R",
  done:"Each entry is ticked as matching its source page.",
  note:"Comparing two numbers needs no tax knowledge. Today the CPA does it; proposed: Admin."},
 {id:"A16", name:"Mark Irrelevant Data in Data File", input:"Workpaper entries checked", action:"For every data item in a data file received from the client, look at it and mark it as not needed for the return.", who:"Preparer CPA", tool:"Data file", output:"Data file with every item used or marked not needed", level:"J",
  done:"Each data item in the file is marked Used, Not needed, or Other (with a reason), with the CPA's initials."},
 {id:"A17", name:"Reviewer Check", input:"Data file with every item used or marked not needed", action:"The Reviewer CPA confirms the inclusions (A14) and the exclusions (A16) are accurate.", who:"Reviewer CPA", tool:"Workpaper; data file", output:"Inclusions and exclusions approved", level:"J",
  done:"For each item: Inclusions OK and Exclusions OK, each Yes, No, or Other (with a reason), with the Reviewer's initials and date.", exc:"An error found: back to the Preparer CPA.",
  note:"Mixed task. Re-checking the inclusions is R. Approving the exclusions is J. Candidate to split."},
 {id:"A18", name:"Close the Item", input:"Inclusions and exclusions approved", action:"Mark the item closed: received, complete, in the workpaper, and checked by both CPAs.", who:"Preparer CPA", tool:"Request List tracker", output:"Closed item", level:"M",
  done:"The item shows closed; all earlier checks are recorded.", note:"When every earlier check is recorded, closing is a status change a machine can make."}
]
};

// ---------- Rendering ----------
const esc = s => String(s==null?'':s);
function cardHTML(s, label){
  const lv = LEVELS[s.level] || {label:"?",cls:"",tip:""};
  const routes = s.routes ? `<dt>Routes</dt><dd><ul class="routes">${s.routes.map(r=>`<li>${r[0]} → <strong>${r[1]}</strong></li>`).join('')}</ul></dd>` : '';
  return `<li><article class="s1 ${s.level==='C'?'client':'firm'}" id="step-${s.id}">
    <header><span class="id">${label||('Step '+s.id)}</span><h3>${s.name}</h3><span class="lv ${lv.cls}" title="${lv.tip}">${lv.label}</span></header>
    <dl><dt>Input</dt><dd>${esc(s.input)}</dd><dt>Action</dt><dd>${esc(s.action)}</dd>${routes}<dt>Who</dt><dd>${esc(s.who)}</dd><dt>Tool</dt><dd>${esc(s.tool)}</dd><dt>Output</dt><dd class="out">${esc(s.output)}</dd>
    <dt>Evidence</dt><dd>${s.done||'<span class="guess">Not written yet.</span>'}</dd>
    <dt>Time</dt><dd class="guess">${s.time||'Not measured'}</dd>
    <dt>Exception</dt><dd>${s.exc||'<span class="guess">None recorded.</span>'}</dd>
    ${s.note?`<dt>Note</dt><dd class="note">${s.note}</dd>`:''}
    <dt>Status</dt><dd>${s.status||'Draft'}</dd></dl></article></li>`;
}
// A chain is a list of entries. A step entry is a card; other entries:
// {bound:{lab,text,sub}}, {seam:"text"}, {same:"html"}, {repeat:"text"}, {baton:"html"}, {step:card, label:"..."}.
// Between two cards that follow each other, "output becomes input" is added.
function renderCards(el, entries){
  let h = '', prevCard = false;
  entries.forEach(e=>{
    const isCard = !!(e.name || e.step);
    if(isCard && prevCard) h += `<li class="handoff">output becomes input</li>`;
    if(e.bound) h += `<li class="bound"><div class="lab">${e.bound.lab}</div><div class="txt">${e.bound.text}</div>${e.bound.sub?`<div class="sub">${e.bound.sub}</div>`:''}</li>`;
    else if(e.seam) h += `<li class="handoff">${e.seam}</li>`;
    else if(e.same) h += `<li class="same">${e.same}</li>`;
    else if(e.repeat) h += `<li class="repeat">${e.repeat}</li>`;
    else if(e.baton) h += `<li class="baton">${e.baton}</li>`;
    else if(e.step) h += cardHTML(e.step, e.label);
    else h += cardHTML(e);
    prevCard = isCard;
  });
  el.innerHTML = h;
}
// Level count for a list of cards, e.g. "4 J · 3 R · 2 M · 2 Client".
function levelKey(){
  return `<div class="levelkey"><span>Level:</span>${['J','R','M','C'].map(k=>`<span class="lv ${LEVELS[k].cls}">${LEVELS[k].label}</span>`).join('')}<a href="${PAGE.root}about/#levels" style="color:var(--link)">What the levels mean</a></div>`;
}
