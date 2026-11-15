# SignalDesk

[Open the live simulator](https://mykeil-tzul.github.io/signaldesk/)

I started my career as a BDR. I built SignalDesk around a decision that came up all the time: with a limited amount of time, who do I work first and what can I say that’s actually relevant?

You sell a fictional checkout analytics product. Inspect five accounts, adjust the scoring weights, and shortlist three. Write an opener for one account, read a scripted reply, and choose how to respond. The debrief puts your choices beside a suggested approach and lets you download an AE handoff.

## How it works

Account scores combine product fit, signal strength, and recency. You can change how much each factor counts. The writing checks look for a reference to the account’s signal, a question, and a short draft. You decide whether your message makes a reasonable connection to the prospect’s problem. The handoff keeps facts and prospect statements separate from qualification questions.

Accounts and replies are fictional. The app runs in the browser and does not send outreach or upload drafts.

## Run locally

```sh
python3 -m http.server 8000
node --test tests/*.test.mjs
```

Photo from [Unsplash](https://unsplash.com/photos/a-person-writing-in-a-notebook-with-coffee-QK4Ov_0APVU).
