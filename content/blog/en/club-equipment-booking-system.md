---
title: "From WhatsApp to an equipment booking system that does not fail"
description: "Why WhatsApp bookings always break for the same three reasons, and what a minimal system needs so that they stop breaking."
date: "2026-09-11"
author: "Víctor García Pastor"
category: "management"
tags: ["bookings", "loans", "organisation"]
translationKey: "bookings-beyond-whatsapp"
draft: false
---

The equipment WhatsApp group is an institution in clubs. It is also the origin of half the Saturday-morning problems.

It is not the members' fault. It is that WhatsApp does not have the three things a booking system needs.

## Why it breaks

**There is no state.** A message saying "I'm taking the blue rope" changes nothing anywhere. The rope is still listed as available in everybody else's head. To know what is free, somebody has to scroll back and reconstruct it mentally — and each person reconstructs a different version.

**There is no concurrency.** Two people can ask for the same thing ten seconds apart and both believe they have it. The conflict does not appear on Thursday, when it could be resolved: it appears at seven on Saturday morning in the car park.

**There is no searchable history.** The data exists, it is in the chat, but it is not retrievable. "Who took the harnesses in March?" means half an hour of scrolling and an answer that is probably wrong.

On top of that, the group is used simultaneously for booking, for organising the trip and for sending photos. The signal drowns in the noise.

## The minimum a system needs

Nothing sophisticated. Four properties:

**1. Availability that is calculated, not declared.** The system must know what is free on a date without anyone maintaining it by hand. If somebody has to update an "available: yes/no" field, you are back where you started.

**2. A booking blocks.** If something is booked, it cannot be booked again. It sounds trivial and it is exactly what WhatsApp cannot do.

**3. Explicit loan states.** Booked, handed over and returned are three different things. Confusing them produces the classic "I thought you'd taken it back".

**4. A record that survives.** Every movement is stored with a date and a person, and is never overwritten.

## The part that is not technological

Here is the real reason many clubs fail when switching: they set up the tool and keep accepting bookings over WhatsApp "just this once".

A booking system with a back door is not a system. If gear can be obtained by messaging the equipment manager, everybody will message the equipment manager, because it is faster.

What works:

- **One single channel.** WhatsApp requests are answered with the link, not with the gear.
- **Booking must be easier than asking.** If your system demands registering, verifying an email and filling six fields, you have lost. It must cost less than writing a message.
- **Somebody responsible for the transition** during the first month, redirecting people patiently.

## So does the WhatsApp group get shut down?

No. It loses one function. The group is still where the trip gets organised, the forecast gets shared and a meeting time gets agreed. It simply stops being the record of who has what.

That distinction — conversation channel versus system of record — is what makes the change stick. Removing the group creates resistance; removing a job it was doing badly does not.

[RocNest](/en) covers the four properties above and is free, but what matters is that whichever system you choose has them. With a well-built spreadsheet and discipline you can also get there, if the club is small.
