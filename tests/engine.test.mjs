import test from "node:test";
import assert from "node:assert/strict";
import {accounts,rankAccounts,checkOpener,handoff} from "../engine.mjs";

test("default ranking favors timely evidence and weights can change it",()=>{
 assert.deepEqual(rankAccounts({fit:5,signal:3,recency:2}).slice(0,3).map(x=>x.id),["harbor","parcel","bright"]);
 assert.equal(rankAccounts({fit:0,signal:0,recency:10})[0].id,"field");
});
test("draft checks identify signal, question, and length",()=>{
 assert.deepEqual(checkOpener("Saw your new stores. How do you compare checkout performance across locations?",accounts[0]),{mentionsSignal:true,makesAsk:true,concise:true});
 assert.equal(checkOpener("Please book a demo.",accounts[0]).makesAsk,false);
});
test("handoff keeps qualification unknown and uses the real scenario reply",()=>{
 const result=handoff(accounts[0],"discover");
 assert.match(result.confirmed,/already have a payment provider/);
 assert.match(result.unknown,/timeline/);
 assert.equal(result.next,accounts[0].question);
});
