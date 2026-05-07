# Story Breakdown Story: Product Discovery Harness Adapter

## Story Narrative

**Situation**
Build chat should create the same short planning document that the existing
discovery process already produces. Without that connection, the app could
create a lookalike document that sounds familiar but does not follow the
approved planning rules.

**Goal**
The system can turn a Build chat conversation into the approved planning
document format without inventing a second version of the discovery process.

**Decisions Needed**
We need to confirm which approved discovery rules and document fields the chat
must use, and what happens when the system cannot create a valid document.

**Work That Follows**
The work will establish a narrow connection from Build chat to the existing
discovery process and define recoverable failure behavior.

**Evidence Of Success**
A reviewer can confirm the generated planning document follows the approved
format, failure does not create a bad document, and the user can recover from a
failed attempt.
