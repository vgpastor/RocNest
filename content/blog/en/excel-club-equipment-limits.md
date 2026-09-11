---
title: "Using Excel to manage club equipment: how far it goes and when it breaks"
description: "A spreadsheet is enough for many clubs. These are the four specific points where it stops being enough, and how to tell whether you have crossed them."
date: "2026-09-11"
author: "Víctor García Pastor"
category: "management"
tags: ["excel", "tools", "organisation"]
translationKey: "excel-limits"
draft: false
---

I am going to say something that does not suit me commercially: **for many clubs, Excel is fine**.

If you have thirty items, five people who take them out and everyone knows each other, a shared spreadsheet solves the problem. Building a system on top of that is making life harder than it needs to be.

That said, there are four points where Excel stops working. It is not about size — it is about what you need the system to do.

## 1. When you need to know who had what, and when

A spreadsheet stores **state**, not **history**. The cell says "on loan to Marta" and when Marta returns it, somebody changes it to "available". The fact that Marta had it from 3 to 17 March disappears the moment the cell is overwritten.

That does not matter until the day it does: a rope with an unreported hard fall, a complaint, an insurer asking questions. That day, the history is the only possible answer, and you do not have it.

You can fake it with a movements sheet where rows are only ever appended, never edited. It works, but it demands a discipline nobody actually sustains for six months.

## 2. When two people edit at once

Cloud spreadsheets hide this, but they do not remove it: two people checking availability at the same time can promise the same rope to two different groups. The sheet cannot say "that is already booked" — it only shows what was there when you opened it.

In a club where trips get organised on Thursday night for Saturday, this happens more than you would think.

## 3. When reminders depend on somebody remembering

An annual inspection due in October does not announce itself in a spreadsheet. You can add conditional formatting that turns the row red, but somebody has to **open the file** to see it.

Expired gear does not get detected because someone checks the sheet: it gets detected when someone goes to use it. Which is too late.

## 4. When the person who runs it leaves

This is the real one, and it has nothing to do with technology. The spreadsheet usually comes with a person who can interpret it: what that column means, why those rows are greyed out, which is the good version of the file.

The day that person steps down, the club inherits a file nobody fully understands. I have seen clubs rebuild an entire inventory over this.

## How to tell whether you have crossed the line

Concrete questions. If you answer no to two or more, Excel has already fallen short:

- Can you find out who had a specific item three months ago?
- Does the system stop you lending something already booked?
- Does somebody other than you warn you when an inspection is due?
- Could another person take over tomorrow without you explaining anything?
- Do you know, without opening anything, how much gear you have retired?

## If you have not crossed it

Then stay with Excel, but do it properly: unique identifier per item, a movements tab where rows are only appended, automatic backups, and at least two people who know how to use it.

And if you have crossed it, the alternative need not cost money. [RocNest](/en) does exactly these four things — history, real availability, reminders and shared role-based access — and it is free and open source.

What matters is that you switch for a specific reason from this list, and not because someone told you spreadsheets are unprofessional. For many clubs, they are not.
