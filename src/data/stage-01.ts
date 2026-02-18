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
              explanation: `The problem isn't clearly defined. The VP has described a symptom ("inefficient routes"), assumed a cause ("drivers choosing wrong routes"), and prescribed a solution ("AI software") in one sentence. Before evaluating vendors, you need to separate these. Vendor evaluation before that validation is building on a guess.`,
            },
            {
              label: 'Ask: "How do we know it\'s route selection causing the inefficiency? What does the GPS and dispatch data show, and have we spoken to drivers?"',
              correct: true,
              explanation: `The VP has jumped from symptom to solution without validating the cause. Inefficiency could be bad routes, traffic data quality, dispatch timing, driver constraints, or vehicle issues. Separating these is the first move before any vendor conversations.`,
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
              label: 'None — the CEO identified a real, quantified pain (23% no-shows) with clear revenue impact. The ML model is a reasonable solution.',
              correct: false,
              explanation: `The pain is real and quantified — that part is correct. But the CEO has also prescribed the solution: an ML prediction model. A well-framed problem doesn't include a solution. The PM should separate the pain from the prescription before committing to any build.`,
            },
            {
              label: 'The CEO identified real pain but embedded a solution. Before building a prediction model, ask: what action will we take on the prediction — and is ML the right tool for that action?',
              correct: true,
              explanation: `A prediction is only useful if it drives action. If the action is "send a reminder 48 hours before," a simple rule ("patient has missed 2+ appointments → send reminder") might outperform an ML model at a fraction of the cost. Validate the intervention before validating the model.`,
            },
          ],
          xp: 75,
        },
      ],
    },

    // ─── Session 1.2: User Pain Mapping ──────────────────────────────────────
    {
      id: '1.2',
      title: 'User Pain Mapping',
      totalXP: 350,

      widget: {
        type: 'interview-decoder',
        title: 'Decode the interviews',
        subtitle: 'You ran 5 interviews with lapsed Axis Corp learners. For each quote, identify the underlying job — not what they said, what they actually needed.',
        config: {
          context: `Axis Corp's $400K renewal is 10 weeks away. You spent the last 5 days interviewing learners
who enrolled through Axis Corp but stopped using SkillPath within 8 weeks. The CPO's hypothesis:
"They didn't know what to take next." Your job: find out what's really going on.`,

          quotes: [
            {
              id: 'aditya',
              speaker: 'Aditya, 31 · Data analyst at Axis Corp · Stopped after 4 weeks',
              quote: `I had three courses open at once. By week 3 I genuinely had no idea what
I was supposed to do first. So I just… stopped opening the app.`,
              cluster: 'direction',
              jobs: [
                {
                  id: 'a-recommendations',
                  label: 'Help me discover better courses I haven\'t found yet',
                  isCorrect: false,
                  explanation: `Aditya wasn't struggling to find courses — he had three open. The problem was having no structure to make progress through them. Discovery isn't the job here.`,
                },
                {
                  id: 'a-progress',
                  label: 'Give me a clear path so I can make visible progress toward something',
                  isCorrect: true,
                  explanation: `The job is structured progress, not content discovery. Aditya needed a "what's next" not a "what else exists." A recommendation engine adds more options to someone already overwhelmed by options.`,
                },
                {
                  id: 'a-reminders',
                  label: 'Remind me to come back and continue studying',
                  isCorrect: false,
                  explanation: `Reminders treat a motivation problem as a scheduling problem. Aditya stopped because he had no direction — not because he forgot the app existed.`,
                },
              ],
            },
            {
              id: 'sneha',
              speaker: 'Sneha, 26 · Product associate at Axis Corp · Completed 2 of 7 enrolled courses',
              quote: `I'd open the app on the train, look at the course list, and just close it.
There was no pull. Like, I couldn't feel myself getting anywhere.`,
              cluster: 'motivation',
              jobs: [
                {
                  id: 's-shorter',
                  label: 'Give me shorter, bite-sized content that fits into my commute',
                  isCorrect: false,
                  explanation: `Sneha was already opening the app on her commute — content length isn't the issue. The absence of "pull" is a motivation and progress signal problem, not a format problem.`,
                },
                {
                  id: 's-meaning',
                  label: 'Show me I\'m making real progress toward a goal that matters',
                  isCorrect: true,
                  explanation: `"Couldn't feel myself getting anywhere" is the clearest JTBD signal in this set. Sneha needs a feedback loop that connects daily effort to meaningful progress — not more content to choose from.`,
                },
                {
                  id: 's-recommend',
                  label: 'Recommend what I should study based on my role',
                  isCorrect: false,
                  explanation: `Role-based recommendations address content relevance. Sneha's problem is motivational — she doesn't feel progress even from the courses she is taking. Relevance won't fix that.`,
                },
              ],
            },
            {
              id: 'rahul',
              speaker: 'Rahul, 34 · Engineering manager at Axis Corp · Churned after 10 weeks',
              quote: `My company paid for this. My manager never brings it up in 1:1s.
After a while I thought — if nobody at work cares, why am I doing this?`,
              cluster: 'motivation',
              jobs: [
                {
                  id: 'r-cert',
                  label: 'Get a certificate I can show my employer',
                  isCorrect: false,
                  explanation: `Certificates address proof of completion, not the absence of workplace reinforcement. Rahul's job isn't to earn a badge — it's for learning to feel connected to something his employer values.`,
                },
                {
                  id: 'r-career',
                  label: 'Connect my learning to outcomes my employer actually recognises',
                  isCorrect: true,
                  explanation: `Rahul hired SkillPath to advance at work. When work didn't acknowledge the learning, the job stopped getting done. The solution space is manager integration and career relevance — not content quality or recommendations.`,
                },
                {
                  id: 'r-content',
                  label: 'Improve the quality and depth of course content',
                  isCorrect: false,
                  explanation: `Content quality isn't Rahul's pain — he never complained about what he was learning. The job breakdown happened at the "does this connect to my career" layer, not the "is the content good" layer.`,
                },
              ],
            },
            {
              id: 'meera',
              speaker: 'Meera, 29 · UX designer at Axis Corp · Accessed platform 3 times before churning',
              quote: `I know exactly what I want to learn — service design. I searched for it,
got twelve results with confusing titles. Clicked the first one, it wasn't right.
I gave up and went to YouTube.`,
              cluster: 'navigation',
              jobs: [
                {
                  id: 'm-discover',
                  label: 'Recommend courses I haven\'t thought of yet',
                  isCorrect: false,
                  explanation: `Meera knew exactly what she wanted. This is the opposite of a discovery problem — she had a clear intent and the product failed to fulfil it. A recommendation engine would show her things she didn't ask for.`,
                },
                {
                  id: 'm-find',
                  label: 'Find the specific content I\'m looking for without friction',
                  isCorrect: true,
                  explanation: `Classic search and findability failure. Meera had intent, search returned ambiguous results, and she abandoned the platform. The job is "locate what I already know I want" — a search UX problem, not a recommendation problem.`,
                },
                {
                  id: 'm-browse',
                  label: 'Browse a well-organised course library by topic',
                  isCorrect: false,
                  explanation: `Browsing is for exploration. Meera was on a specific mission. Organisation helps browsers; search precision helps someone who knows exactly what they want.`,
                },
              ],
            },
            {
              id: 'kiran',
              speaker: 'Kiran, 27 · Front-end developer at Axis Corp · Completed 1 of 4 enrolled courses',
              quote: `I finished the React course. It was actually good. But then I just kind of
didn't know what to do with it. There was no project, no way to prove I'd learned anything.
It felt like it disappeared.`,
              cluster: 'application',
              jobs: [
                {
                  id: 'k-path',
                  label: 'Give me a structured learning path to follow after this course',
                  isCorrect: false,
                  explanation: `Kiran completed the course fine — the learning path worked. The failure happened after completion, when there was no bridge between "I learned this" and "I can show I can do this." A next-course path doesn't solve an application problem.`,
                },
                {
                  id: 'k-apply',
                  label: 'Bridge what I\'ve learned to something real I can demonstrate',
                  isCorrect: true,
                  explanation: `"It felt like it disappeared" — Kiran needed the learning to produce an artefact: a project, a skill assessment, something tangible. The job is application and proof, not more content consumption.`,
                },
                {
                  id: 'k-next',
                  label: 'Recommend what to take next based on what I just completed',
                  isCorrect: false,
                  explanation: `Recommending the next course sends Kiran deeper into consumption without solving the application gap. More learning before the current learning has "landed" compounds the problem.`,
                },
              ],
            },
          ],

          clusters: [
            {
              id: 'direction',
              label: 'No clear direction',
              description: 'Learners have too many options and no structure to make progress through them.',
              implication: '→ Goal-setting or guided path feature — not a recommendation engine',
              color: 'accent',
            },
            {
              id: 'motivation',
              label: 'Motivation & career connection',
              description: 'Learners can\'t see how their effort connects to career progress or workplace recognition.',
              implication: '→ Progress visibility, manager integration — not content discovery',
              color: 'warning',
            },
            {
              id: 'navigation',
              label: 'Search & findability',
              description: 'Learners with clear intent can\'t find what they\'re looking for.',
              implication: '→ Search UX improvement — simpler than a recommendation engine, faster to ship',
              color: 'danger',
            },
            {
              id: 'application',
              label: 'No bridge to application',
              description: 'Learners complete content but have no way to apply or prove what they\'ve learned.',
              implication: '→ Projects, assessments, portfolio features — not more content',
              color: 'success',
            },
          ],

          insight: `The CPO's hypothesis was "learners don't know what to take next" — a discovery problem.
Your research found 4 distinct root causes, only one of which a recommendation engine addresses.
The dominant pain (3 of 5 learners) is motivation and direction — not content discovery.
Building the recommended solution would have solved 1 of 5 learners' actual jobs.`,
        },
      },

      concept: {
        id: 'user-pain-mapping',
        term: 'User Pain Mapping',
        tagline: 'What users say they want is rarely what they actually need.',
        definition: `User pain mapping is the practice of looking beneath surface complaints to identify
the underlying job a user is trying to accomplish. Users describe symptoms —
"I don't know what to take next" — but the real job is "help me feel like I'm making
progress toward something that matters in my career." The job determines the solution space.
Getting it wrong means building the right product for the wrong problem.`,
        mentalModel: `People hire products like they hire employees — to do a specific job.
When a SkillPath learner enrols, they're not hiring it for content. They're hiring it
to get better at their job and prove it to their manager. The moment the product stops
doing that job, they fire it. Churn isn't disengagement — it's a resignation letter.
Your job in discovery is to find out what role the product was hired for.`,
        pmTakeaway: `"Before we commit to any solution direction, I want to run 8-10 JTBD interviews
with lapsed users. Not 'why did you stop?' — that gets rationalisations. Instead:
'What were you trying to accomplish when you first signed up, and when did you realise
this wasn't going to do it?' That answer tells us what job we're actually solving for."`,
        category: 'discovery',
      },

      decisionTree: {
        startId: 'root',
        nodes: {
          root: {
            id: 'root',
            question: `You've run 10 interviews with lapsed Axis Corp learners. 7 of 10 describe
some version of "I couldn't see how this connected to my career." Only 2 mentioned
not knowing which course to take next. You're presenting findings to the CPO tomorrow.
What do you recommend?`,
            hint: 'The CPO already expects a recommendation engine. What does the evidence say?',
            options: [
              {
                label: 'The recommendation engine is still valid — better course matching will improve relevance, which will improve motivation.',
                nextId: 'a1',
                consequence: 'You\'ve conflated relevance and motivation. They\'re different jobs.',
              },
              {
                label: '"The dominant pain is career progress visibility — not content discovery. I recommend we test a \'learning goals\' feature before committing to an ML recommendation engine."',
                nextId: 'end-good',
                consequence: 'You let the research lead. That\'s exactly the right move.',
              },
              {
                label: 'The findings are valuable but the CPO has committed to AI. I\'ll incorporate JTBD insights into the recommendation engine PRD.',
                nextId: 'c1',
                consequence: 'You\'re letting the solution constraint override the evidence.',
              },
            ],
          },
          a1: {
            id: 'a1',
            question: `The CPO pushes back: "But aren't motivation and relevance the same thing?
If we recommend more relevant courses, won't learners be more motivated to finish them?"
How do you respond?`,
            options: [
              {
                label: '"That\'s a reasonable hypothesis — let\'s include it in the PRD and validate through the model\'s performance."',
                nextId: 'end-ok',
              },
              {
                label: '"Relevance and motivation are different jobs. A highly relevant course you never finish delivers the same business outcome as an irrelevant one. The research shows motivation is tied to career visibility — not whether the course was a good fit."',
                nextId: 'end-good',
              },
            ],
          },
          c1: {
            id: 'c1',
            question: `The recommendation engine ships 3 months later. Completion rates don't move.
Axis Corp doesn't renew the $400K contract. The CPO asks what happened.
How do you respond?`,
            options: [
              {
                label: '"The model needs more training data — we should extend the timeline and retrain."',
                nextId: 'end-bad',
              },
              {
                label: '"The research flagged this risk before we built it. The core job was career progress visibility, not content discovery. We built a solution to a problem that affected 2 of 10 lapsed learners. Here\'s what I think we need to build instead."',
                nextId: 'end-ok',
              },
            ],
          },
        },
        outcomes: {
          'end-good': {
            type: 'good',
            title: 'Sharp PM thinking',
            explanation: `You translated messy qualitative research into a directional recommendation — and had the conviction to push back on an existing solution commitment with evidence. The hardest skill in discovery is saying "the research points somewhere else" before the team has built anything. That's always cheaper than saying it after.`,
            xp: 100,
          },
          'end-ok': {
            type: 'ok',
            title: 'Right instinct, late delivery',
            explanation: `You identified the gap but either stopped short of the recommendation or delivered it too late to change the outcome. Research is only valuable if it changes the direction before the team commits — not after they've shipped and a $400K account has churned.`,
            xp: 60,
          },
          'end-bad': {
            type: 'bad',
            title: 'Misdiagnosed the failure',
            explanation: `The research gave you the answer before the build started. Attributing failure to model quality — when the root cause was solving the wrong problem — leads teams to invest another two quarters refining a solution to a problem users don't actually have.`,
            xp: 20,
          },
        },
      },

      quiz: [
        {
          id: 'q1-3',
          scenario: `A food delivery app sees order cancellations spike 22% in the first 15 minutes after
placing an order. The PM proposes "real-time AI tracking to show users exactly where their
food is at every stage." Exit interviews reveal: "I cancel because I\'m not sure if the
restaurant actually received my order."`,
          question: 'What does the JTBD framework tell you, and does it change the solution direction?',
          options: [
            {
              label: 'Real-time tracking solves both order confirmation and delivery location, so the AI solution addresses the pain.',
              correct: false,
              explanation: `These are two different jobs: "confirm my order was received" and "see where my delivery is." The first is solved by an order confirmation message — 2 days of engineering. Real-time AI tracking solves a different, less urgent job. Conflating them wastes a quarter.`,
            },
            {
              label: 'The job is "confirm my order is being prepared" — not "track my delivery in real-time." An order confirmation screen solves this in days. The AI tracking solution solves a different, less urgent job.',
              correct: true,
              explanation: `The JTBD is certainty at the moment of vulnerability — right after placing an order. Solving this is cheaper, faster, and more directly connected to the cancellation metric than real-time tracking across the full journey.`,
            },
          ],
          xp: 75,
        },
        {
          id: 'q1-4',
          scenario: `A B2B HR platform sees a 40% drop in managers completing performance reviews.
The CPO says: "Managers are probably intimidated by the blank page — let's add AI to
auto-generate review templates." The PM is asked to scope the feature.`,
          question: 'What is the right PM response before scoping begins?',
          options: [
            {
              label: 'Validate the "blank page" hypothesis with 6-8 JTBD interviews before scoping. The job isn\'t "fill in a template" — it\'s "have a useful performance conversation without it being uncomfortable."',
              correct: true,
              explanation: `The CPO has a plausible hypothesis — but it's still a hypothesis. The real job may be much broader: managers want conversations to feel worthwhile, not adversarial. An AI template might help — or the real pain might be that managers don't know what good feedback sounds like, which is a different solution entirely.`,
            },
            {
              label: 'Build the AI template generator — it\'s a reasonable hypothesis and relatively low effort to test in production.',
              correct: false,
              explanation: `Low effort to build is not the same as solving the right problem. If the job is "have a meaningful conversation" and the AI template produces generic output, completion rates may rise while review quality and manager trust fall. You'd be measuring the wrong thing.`,
            },
          ],
          xp: 75,
        },
      ],
    },
  ],
}

export default stage01
