import {accounts,rankAccounts,checkOpener,responses,handoff} from "./engine.mjs";
const $=id=>document.getElementById(id);
const node=(tag,text)=>{const element=document.createElement(tag);element.textContent=text;return element;};
const selected=new Set();
const drafts=new Map();
let active=accounts[0], lastHandoff;
function queue(){
 const weights={};
 for(const key of ["fit","signal","recency"]){weights[key]=Number($(key).value);$(key+"-value").value=weights[key];}
 $("accounts").replaceChildren(...rankAccounts(weights).map(account=>{
  const row=node("div","");row.className="account"+(account.id===active.id?" active":"");
  const open=node("button",account.name+" · "+account.score+"/100");
  open.append(node("small",account.sector+" · "+account.signal+" · "+account.age+" days ago"));
  open.type="button";open.setAttribute("aria-pressed",String(account.id===active.id));
  open.onclick=()=>{selectAccount(account);document.getElementById("draft").focus({preventScroll:true});};
  const label=node("label"," Shortlist");
  const check=node("input","");check.type="checkbox";check.checked=selected.has(account.id);
  check.disabled=!check.checked&&selected.size>=3;
  check.setAttribute("aria-label","Shortlist "+account.name);
  check.onchange=()=>{
   if(check.checked)selected.add(account.id);else selected.delete(account.id);
   queue();
   $("accounts").querySelector('[aria-label="Shortlist '+account.name+'"]').focus();
  };
  label.prepend(check);row.append(open,label);return row;
 }));
 $("shortlist").textContent=selected.size+" / 3 shortlisted"+(selected.size?": "+accounts.filter(a=>selected.has(a.id)).map(a=>a.name).join(", "):"");
}
function selectAccount(account){
 active=account;
 $("account-context").textContent=account.name+" · Suggested contact: "+account.contact+". Signal: "+account.signal+".";
 $("draft").value=drafts.get(account.id)||"";
 $("feedback").replaceChildren();$("reply").hidden=true;$("debrief").hidden=true;
 queue();
}
for(const key of ["fit","signal","recency"])$(key).oninput=queue;
$("draft").oninput=()=>{drafts.set(active.id,$("draft").value);$("feedback").replaceChildren();$("reply").hidden=true;$("debrief").hidden=true;};
$("opener").onsubmit=event=>{
 event.preventDefault();
 const result=checkOpener($("draft").value,active);
 const hints=[
  result.mentionsSignal?"Your draft mentions the account’s signal.":"Try mentioning the signal: "+active.signal+".",
  result.makesAsk?"Your draft includes a question.":"End with one clear question the prospect can answer.",
  result.concise?"Your draft is within 75 words.":"Trim the opener to about 75 words or fewer."
 ];
 $("feedback").replaceChildren(...hints.map(hint=>node("li",hint)),node("li","Read it back: did you connect the signal to a plausible problem without assuming it exists?"));
 $("objection").textContent=active.reply;$("response").value="";$("reply").hidden=false;$("debrief").hidden=true;
};
$("response").replaceChildren(new Option("Choose a response",""),...responses.map(([id,label])=>new Option(label,id)));
$("review").onclick=()=>{
 if(!$("response").value){$("response").focus();return;}
 const choice=$("response").value;
 const reference=rankAccounts({fit:5,signal:3,recency:2}).slice(0,3).map(a=>a.name).join(", ");
 $("yours").textContent=(selected.size?"Shortlist: "+accounts.filter(a=>selected.has(a.id)).map(a=>a.name).join(", ")+". ":"No accounts shortlisted. ")+responses.find(([id])=>id===choice)[1]+".";
 $("suggestion").textContent="Default shortlist: "+reference+". For "+active.name+": "+active.move;
 lastHandoff=handoff(active,choice);
 $("handoff").replaceChildren(...Object.entries(lastHandoff).flatMap(([key,value])=>[node("dt",key[0].toUpperCase()+key.slice(1)),node("dd",value)]));
 $("debrief").hidden=false;$("debrief").scrollIntoView({block:"start"});
};
$("download").onclick=()=>{
 if(!lastHandoff)return;
 const url=URL.createObjectURL(new Blob([active.name+" · Fictional scenario\n\n",...Object.entries(lastHandoff).map(([key,value])=>key+": "+value+"\n")],{type:"text/plain"}));
 const link=node("a","");link.href=url;link.download="signaldesk-"+active.id+"-handoff.txt";link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
};
selectAccount(active);
