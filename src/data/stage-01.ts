import type { StageData } from '../types'

const stage01: StageData = {
  stageNumber: 1,
  title: 'Discovery',
  subtitle: 'Before you think about solutions, earn the right to the problem.',
  scenario: {
    company: 'SkillPath',
    industry: 'EdTech / Upskilling',
    hook: `You just joined SkillPath as a Senior PM. It's an AI-powered professional upskilling platform —
B2B and B2C, 80,000 active learners, $12M ARR. The company is under pressure to ship AI features
before competitors do. Your first week: a Slack from the CPO.`,
  },
  sessions: [
    // ─── Session 1.1: Problem Framing ────────────────────────────────────────
    {
      id: '1.1',
      title: 'Problem Framing',
      totalXP: 350,

      widget: {
        type: 'brief-classifier',
        title: 'Dissect the brief',
        subtitle: 'Your CPO just sent this message. Classify each statement before anyone writes a line of code.',
        config: {
          context: `It is Monday morning. You open Slack to find this from Priya, SkillPath's CPO.`,
          message: `Hey — had a great offsite. We're going to use AI to help our learners succeed.
Completion rates are a problem, I keep hearing it from clients. A competitor just launched
personalised paths and we're going to get asked about it. I need a brief from you by EOW
on how we're going to tackle this. AI will move our NPS, I'm sure of it.
Also — the Axis Corp renewal is Q2, they flagged engagement in our last call.`,
          statements: [
            {
              id: 'completion-drop',
              text: 'Completion rates are a problem.',
              correct: 'problem',
              explanation: 'This is real — but it needs a number to be actionable. "Completion rates are a problem" tells us the direction, not the magnitude. Worth validating with data before anything else.',
            },
            {
              id: 'ai-will-help',
              text: 'We\'re going to use AI to help learners succeed.',
              correct: 'solution',
              explanation: 'AI is a tool, not a strategy. This statement skips the "what problem" and "why AI specifically" steps. It\'s a solution in search of a problem.',
            },
            {
              id: 'competitor-paths',
              text: 'A competitor just launched personalised paths and we\'re going to get asked about it.',
              correct: 'assumption',
              explanation: 'Competitive pressure is context, not a problem to solve. Their bet may not be the right one for your users. Building because a competitor shipped is how you waste a quarter.',
            },
            {
              id: 'ai-nps',
              text: 'AI will move our NPS, I\'m sure of it.',
              correct: 'assumption',
              explanation: 'There\'s no causal evidence for this claim. When someone is "sure" of a metric impact without data, it usually means they\'ve decided on the solution and are working backward to justify it.',
            },
            {
              id: 'axis-corp',
              text: 'The Axis Corp renewal is Q2. They flagged engagement in our last call.',
              correct: 'missing',
              explanation: 'This is critical — and buried. What\'s the Axis Corp contract value? Is Q2 the renewal date or the decision date? What specifically did they flag? This single thread could reframe the entire brief.',
            },
            {
              id: 'brief-eow',
              text: 'I need a brief from you by EOW on how we\'re going to tackle this.',
              correct: 'missing',
              explanation: 'A brief on what, exactly? The CPO\'s ask is so open-ended that "tackling this" could mean anything. Before writing the brief, you need to align on what question it should answer.',
            },
            {
              id: 'clients-hearing',
              text: 'I keep hearing about completion rates from clients.',
              correct: 'problem',
              explanation: 'Qualitative signal from paying customers is a legitimate pain indicator. It\'s not a measurement, but it tells you where to start looking. Pair this with quantitative data.',
            },
          ],
          insight: `You just separated 2 real problems from 2 assumptions, 1 prescribed solution, and 2 pieces of missing information — in the same message. Most teams read a brief like this and start scoping a recommendation engine. You found that the most important thread is Axis Corp's renewal, buried in the last sentence.`,
        },
      },

      concept: {
        id: 'problem-framing',
        term: 'Problem Framing',
        tagline: 'The ask on your Slack is never the real problem. Your job is to find it.',
        definition: `Problem framing is the discipline of separating observable pain from unvalidated assumptions
and solution prescriptions. A well-framed problem is specific, measurable, and solution-free.
Without it, teams build technically excellent products that solve the wrong thing — and only
discover this after they've shipped.`,
        mentalModel: `A doctor who prescribes before diagnosing isn't just inefficient — they're dangerous.
A PM who writes a PRD before framing the problem is the same thing. The patient is your product
and the team's next six months. The prescription might be right. But "might" is an expensive word
when you find out at sprint 8.`,
        pmTakeaway: `"Before I react to this ask, I need three things: the observable pain with data behind it,
who specifically experiences it, and what success looks like without naming a solution.
Everything else is assumption until proven otherwise."`,
        category: 'discovery',
      },

      decisionTree: {
        startId: 'root',
        nodes: {
          root: {
            id: 'root',
            question: `Priya asks for a brief by Friday on "how SkillPath will use AI to improve learner success."
How do you start?`,
            hint: 'Think about what you found in the brief.',
            options: [
              {
                label: 'Start scoping what an AI recommendation engine would take to build.',
                nextId: 'a1',
                consequence: 'You\'ve accepted the solution framing without questioning it.',
              },
              {
                label: '"Before I write the brief — can I get 30 minutes with you? I want to make sure I\'m solving the right problem."',
                nextId: 'b1',
                consequence: 'Good. You\'re separating diagnosis from prescription.',
              },
              {
                label: 'Pull the completion rate data and set up interviews with lapsed learners.',
                nextId: 'c1',
                consequence: 'Right instinct. You\'re going to the evidence first.',
              },
            ],
          },
          a1: {
            id: 'a1',
            question: `You spec the recommendation engine. Three weeks in, user interviews reveal the real issue:
learners know exactly what they want to learn — they can't find it in search.
The discovery problem, not a guidance problem. What do you do?`,
            options: [
              {
                label: 'Stay the course — personalised paths will still help even if search is the root cause.',
                nextId: 'end-bad',
              },
              {
                label: 'Stop the sprint. Reframe the problem. The solution space just changed entirely.',
                nextId: 'end-ok',
              },
            ],
          },
          b1: {
            id: 'b1',
            question: `Priya shares: "Completion dropped from 68% to 41% YoY. Axis Corp is a $400K account —
their renewal contact told our AE that 'learners aren't finishing anything.' Q2 is 10 weeks away."
Now what?`,
            options: [
              {
                label: '"Got it. I\'ll write the brief around building an AI-driven completion improvement feature."',
                nextId: 'b2',
              },
              {
                label: '"This is enough to know what the pain is. I want 2 weeks of discovery before we commit to any solution — user interviews with lapsed Axis Corp learners specifically."',
                nextId: 'end-good',
              },
            ],
          },
          b2: {
            id: 'b2',
            question: `You write the brief. Engineering kicks off. In week 3, the data scientist asks
why the 26–35 cohort has even lower completion than the average. You don't have an answer —
and Priya's asking for a sprint 4 update.`,
            options: [
              {
                label: 'Ask for 2 more sprints to investigate.',
                nextId: 'end-ok',
              },
              {
                label: 'Acknowledge that we built on an unvalidated assumption. Propose a pause to run targeted discovery before continuing.',
                nextId: 'end-good',
              },
            ],
          },
          c1: {
            id: 'c1',
            question: `Data shows: overall completion 41%, but Axis Corp learners are at 28%.
Lapsed learner interviews reveal: "I finish the first module, then I don't know what to do next —
there are 400 courses and no structure." What's your next move?`,
            options: [
              {
                label: 'Write the brief: "The problem is learner navigation after module 1. The solution is a guided path engine."',
                nextId: 'end-good',
              },
              {
                label: 'Send the data to the DS team and ask them what model would fix it.',
                nextId: 'end-ok',
              },
            ],
          },
        },
        outcomes: {
          'end-good': {
            type: 'good',
            title: 'Sharp PM thinking',
            explanation: `You refused to commit to a solution before validating the problem — or you caught the misframe early enough to correct course with evidence. Discovery isn't a delay. It's the cheapest risk mitigation available. Two weeks of interviews costs less than two sprints building the wrong thing.`,
            xp: 100,
          },
          'end-ok': {
            type: 'ok',
            title: 'Good recovery, expensive timing',
            explanation: `You caught the misframing — but mid-build is a costly place to catch it. The pattern to aim for: validate the problem before committing to a solution direction, not after three sprints reveal the cracks.`,
            xp: 60,
          },
          'end-bad': {
            type: 'bad',
            title: 'Building on a guess',
            explanation: `You committed the team to a direction based on an unvalidated assumption. The recommendation engine might help — or it might solve a problem your learners don't actually have. You won't know until after you've shipped, which is the most expensive moment to be wrong.`,
            xp: 20,
          },
        },
      },

      quiz: [
        {
          id: 'q1-1',
          scenario: `A logistics company's VP of Ops says: "Our drivers keep taking inefficient routes —
we lose hours every week. We need AI route optimisation software." The head of product
asks the PM to kick off vendor evaluation.`,
          question: 'What should the PM do first?',
          options: [
            {
              label: 'Begin vendor evaluation — the problem is clearly defined and the solution direction is reasonable.',
              correct: false,
              explanation: `The problem isn't clearly defined. The VP has described a symptom ("inefficient routes"), assumed a cause ("drivers choosing wrong routes"), and prescribed a solution ("AI software") in one sentence. Before evaluating vendors, you need to separate these.`,
            },
            {
              label: 'Ask: "How do we know it\'s route selection causing the inefficiency? What does the GPS and dispatch data show, and have we spoken to drivers?"',
              correct: true,
              explanation: `Correct. The VP has jumped from symptom to solution without validating the cause. Inefficiency could be bad routes, traffic data quality, dispatch timing, driver constraints, or vehicle issues. Vendor evaluation before that validation is building on a guess.`,
            },
            {
              label: 'Write a PRD for a route optimisation feature and get engineering estimates.',
              correct: false,
              explanation: `Writing a PRD locks the team into a solution before the cause is validated. A PRD based on an unverified assumption is a document of guesses — and effort estimates create pressure to continue even if discovery later reveals the wrong direction.`,
            },
          ],
          xp: 75,
        },
        {
          id: 'q1-2',
          scenario: `A healthcare startup CEO says: "Patient no-show rates are at 23% — that's killing our
revenue. We need an ML prediction model so we know which appointments will be missed."
The PM adds it to the next sprint as the primary goal.`,
          question: 'What\'s the problem framing issue here, if any?',
          options: [
            {
              label: 'None — the CEO identified a real, quantified pain (23% no-shows) with clear revenue impact.',
              correct: false,
              explanation: `The pain is real and quantified — that part is correct. But the CEO has also prescribed the solution: an ML prediction model. A well-framed problem doesn't include a solution. The PM should separate the pain from the prescription before committing to any build.`,
            },
            {
              label: 'The CEO identified real pain but embedded a solution. Before building a prediction model, the PM should ask: what action will we take on the prediction — and is ML the right tool for that action?',
              correct: true,
              explanation: `Exactly. A prediction is only useful if it drives action. If the action is "send a reminder 48 hours before," a simple rule ("patient has missed 2+ appointments before → send reminder") might outperform an ML model at a fraction of the cost and complexity. The PM should validate the intervention before validating the model.`,
            },
            {
              label: 'The problem needs more data — 23% is a single metric and doesn\'t reveal root cause.',
              correct: false,
              explanation: `More data is useful, but the core framing issue isn't data insufficiency — it\'s that the CEO has conflated the problem with the solution. Gathering more data before separating those two things won't fix the framing.`,
            },
          ],
          xp: 75,
        },
      ],
    },
  ],
}

export default stage01
