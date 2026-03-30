# EU AI Act Platform Status

Source gate: [`EU-AI-ACT-GATE.md`](/home/gordon/kanbien/docs/standards/EU-AI-ACT-GATE.md)

## Overall

- Current status: `Not Applicable`
- Summary:
  The current repo does not appear to implement AI features, AI workflows, or
  model integrations. The correct near-term posture is to keep the gate in the
  standards stack and activate it as soon as any AI capability is introduced.

## 1. Scope And Classification

- `Not Applicable` The team has explicitly determined whether the change is in scope for the EU AI Act.
  Current platform state appears non-AI.
- `Not Applicable` The role of the organization is understood: provider, deployer, importer, distributor, or product integrator as applicable.
  No AI role to classify yet.
- `Not Applicable` The use case has been screened for prohibited practices risk.
  No AI use case yet.
- `Not Applicable` The use case has been screened for high-risk classification risk.
  No AI use case yet.
- `Not Applicable` General-purpose AI model dependency is identified where relevant.
  No AI model dependency yet.

## 2. Use-Case Risk Understanding

- `Not Applicable` The intended purpose of the AI feature is documented.
- `Not Applicable` The system boundaries are documented: model, prompts, tools, data sources, automations, outputs, and human decision points.
- `Not Applicable` A misuse/abuse analysis exists.
- `Not Applicable` Human impact is understood, especially if the output influences eligibility, ranking, access, employment, education, credit, safety, or rights.

## 3. Human Oversight And Control

- `Not Applicable` Human oversight is defined where required by the use case.
- `Not Applicable` The design makes clear what is automated versus advisory.
- `Not Applicable` Operators can identify, challenge, or override outputs where required.
- `Not Applicable` Escalation paths exist for harmful or clearly wrong AI outputs.

## 4. Transparency And Disclosure

- `Not Applicable` The user-facing behavior makes clear when AI is being used where disclosure is required or appropriate.
- `Not Applicable` The boundaries of the system are not misleadingly represented.
- `Not Applicable` Records exist for key prompts, inputs, outputs, or decisions where needed for review and accountability.
- `Not Applicable` Documentation exists describing intended purpose, constraints, and known limitations.

## 5. Data And Model Governance

- `Not Applicable` Input data sources and major dependencies are identified.
- `Not Applicable` Material model/provider dependencies are documented.
- `Not Applicable` Safety, bias, or reliability concerns have been considered for the use case.
- `Not Applicable` Evaluation and monitoring plans exist for model-driven behavior.
- `Not Applicable` Changes to prompts, models, tools, or routing are treated as controlled changes when they materially affect behavior.

## 6. Operational Readiness

- `Not Applicable` Incident response considerations exist for harmful, unsafe, or non-compliant model behavior.
- `Not Applicable` Logging and monitoring are sufficient to investigate significant failures.
- `Not Applicable` Rollback or disablement exists for the AI capability.
- `Not Applicable` The organization knows who owns the AI behavior in production.

## 7. Legal And Policy Alignment

- `Not Applicable` The change has been checked against internal AI-use policy if one exists.
- `Not Applicable` Contractual, privacy, IP, and regulatory implications have been considered for the specific AI use case.
- `Not Applicable` AI literacy or training implications have been considered for staff using or operating the system.

## Main Gaps To Close Before AI Work Starts

- define AI feature intake and scope-determination workflow
- define provider/model dependency review expectations
- define monitoring, rollback, and accountability expectations for AI behavior
