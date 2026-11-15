export const accounts = [
  {id:"harbor",name:"Harbor & Pine",sector:"Specialty retail",signal:"12 new stores announced",age:8,fit:5,signalStrength:5,contact:"VP of Payments",keyword:"new stores",reply:"We already have a payment provider. What would your team add?",fact:"Announced 12 new stores.",question:"How do you compare checkout performance across stores today?",move:"Keep the existing provider in place and ask how they spot checkout issues across new locations."},
  {id:"parcel",name:"Parcel Row",sector:"Online marketplace",signal:"Payments operations job posted",age:17,fit:5,signalStrength:4,contact:"Head of Payments Operations",keyword:"operations",reply:"The role is open, but I’m stretched thin. Can you send something first?",fact:"Posted a payments operations role.",question:"Which checkout reports take the most manual work?",move:"Offer one relevant sample report and ask what the new role will own."},
  {id:"bright",name:"Bright Basket",sector:"Grocery delivery",signal:"Mobile checkout relaunched",age:27,fit:4,signalStrength:4,contact:"Director of Checkout",keyword:"checkout",reply:"We just relaunched checkout. We aren’t taking on another integration.",fact:"Relaunched mobile checkout.",question:"What checkout metrics are you watching after launch?",move:"Ask how they’re measuring the relaunch before discussing an integration."},
  {id:"north",name:"Northline Supply",sector:"B2B distribution",signal:"Payments modernization announced",age:240,fit:5,signalStrength:3,contact:"Finance Systems Director",keyword:"modernization",reply:"That announcement was months ago. The project is on hold.",fact:"Announced a payments modernization project eight months ago.",question:"When should I check back, and what would restart the project?",move:"Confirm the timeline and move the account to nurture."},
  {id:"field",name:"Fieldnote Press",sector:"Independent publishing",signal:"Opened a new brand studio",age:5,fit:1,signalStrength:2,contact:"Operations Director",keyword:"brand studio",reply:"Our new studio doesn’t handle payments. Why did you reach out?",fact:"Opened a brand studio.",question:"Who owns online checkout, if that’s an area you’re reviewing?",move:"Acknowledge the mismatch and qualify whether checkout is relevant before pursuing."},
];
export const responses = [
  ["discover","Acknowledge the reply and ask one specific discovery question"],
  ["pitch","Send the full product deck and ask for a demo"],
  ["push","Repeat the meeting request without addressing the reply"],
];
export function rankAccounts(weights, list=accounts) {
  const {fit,signal,recency}=weights;
  return list.map(account=>({...account,score:Math.round(
    100*(fit*account.fit/5+signal*account.signalStrength/5+recency*Math.max(0,1-account.age/180))/(fit+signal+recency||1)
  )})).sort((a,b)=>b.score-a.score||a.age-b.age);
}
export function checkOpener(text, account) {
  const mentionsSignal=text.toLowerCase().includes(account.keyword);
  const makesAsk=/\b(would you|could we|open to|do you|how do|what|worth|available|can we)\b/i.test(text)&&text.includes("?");
  const concise=text.trim().split(/\s+/).filter(Boolean).length<=75&&text.trim().length>0;
  return {mentionsSignal,makesAsk,concise};
}
export function handoff(account, choice) {
  return {confirmed:account.fact+" Prospect reply: "+account.reply,
    unknown:"Current process, business impact, buying authority and timeline still need discovery.",
    next:choice==="discover"?account.question:"Follow up on the prospect’s concern before scheduling a demo."};
}
