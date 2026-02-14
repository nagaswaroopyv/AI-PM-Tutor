import type { DayData } from '../types'

const day01: DayData = {
  dayNumber: 1,
  title: 'Rules vs AI',
  subtitle: 'When should you reach for machine learning — and when is it overkill?',
  scenario: {
    industry: 'Fintech / Lending',
    company: 'CreditPulse',
    hook: `CreditPulse processes 4,000 loan applications a day. Your CEO just read a TechCrunch piece about "AI-powered lending" and wants to know why you're not doing it. Before you answer — you need to figure out: does this problem actually need AI?`,
  },

  clusters: [
    // ─── Cluster 1: Deterministic vs Probabilistic ──────────────────────────
    {
      id: 'deterministic-vs-probabilistic',
      widget: {
        type: 'threshold-slider',
        title: 'Tune the loan approval system',
        subtitle: 'Drag the slider to set your approval threshold. Watch what happens to approvals, defaults, and revenue.',
        config: {
          description: 'You\'re setting the minimum credit score required for instant loan approval at CreditPulse. No model — just a rule. Move the slider and see the real-time impact.',
          sliderMin: 500,
          sliderMax: 800,
          sliderDefault: 650,
          sliderLabel: 'Minimum credit score for approval',
          outcomes: [
            { threshold: [500, 579], approvalRate: 91, defaultRate: 28, revenue: 3.1, label: 'Very Permissive', color: 'danger' },
            { threshold: [580, 619], approvalRate: 79, defaultRate: 18, revenue: 4.2, label: 'Permissive', color: 'warning' },
            { threshold: [620, 659], approvalRate: 64, defaultRate: 11, revenue: 5.8, label: 'Balanced', color: 'success' },
            { threshold: [660, 699], approvalRate: 48, defaultRate: 6,  revenue: 5.1, label: 'Conservative', color: 'warning' },
            { threshold: [700, 749], approvalRate: 31, defaultRate: 3,  revenue: 3.6, label: 'Strict', color: 'warning' },
            { threshold: [750, 800], approvalRate: 18, defaultRate: 1,  revenue: 2.2, label: 'Very Strict', color: 'danger' },
          ],
          insight: 'Notice something? You just built a decision system without any AI. Same input (credit score), same rule, same output — every single time.',
        },
      },
      concept: {
        id: 'deterministic-vs-probabilistic',
        term: 'Deterministic vs Probabilistic Systems',
        tagline: 'Can you write the rule? Or do you need a model?',
        definition: `A deterministic system follows fixed rules — the same input always produces the same output. A probabilistic system learns patterns from data and makes predictions that can vary. Most business problems start deterministic. ML is only justified when rules break down.`,
        mentalModel: `Think of a vending machine vs a sommelier. The vending machine: press B4, get Coke. Every time. No exceptions. The sommelier: tells you what wine you'll *probably* enjoy based on patterns — but they can be wrong, and two sommeliers might disagree. Both are useful. Neither is universally better.`,
        pmTakeaway: `"Before we scope any ML work — can we write the rule? If yes, let's ship the rule first and only reach for a model when rules provably break down."`,
        category: 'foundation',
      },
      decisionTree: {
        startId: 'root',
        nodes: {
          root: {
            id: 'root',
            question: `Your CEO asks: "Should we replace our credit score threshold with an AI model?" How do you respond?`,
            hint: 'Think about what you just built with the slider.',
            options: [
              { label: 'Yes — AI is always more accurate than simple rules', nextId: 'a1', consequence: 'Careful. Accuracy isn\'t the only dimension that matters.' },
              { label: 'Let me first ask: what problem is the rule failing to solve?', nextId: 'b1', consequence: 'Good instinct. You\'re framing before committing.' },
              { label: 'No — our current rules are working fine, no need for AI', nextId: 'c1', consequence: 'Partially right, but you might be leaving improvement on the table.' },
            ],
          },
          a1: {
            id: 'a1',
            question: 'The CEO pushes back: "But our approval rate feels low — isn\'t AI more flexible?" What do you say?',
            options: [
              { label: 'Agree and start scoping an ML project immediately', nextId: 'end-bad' },
              { label: '"Flexible, yes — but also more expensive, slower to build, and harder to explain to regulators. What specific failure is the rule creating?"', nextId: 'end-ok' },
            ],
          },
          b1: {
            id: 'b1',
            question: 'The data team tells you: "Our rules miss good borrowers who are young with thin credit files." What now?',
            options: [
              { label: '"Perfect — that\'s the gap. Let\'s see if ML can learn patterns rules can\'t capture, but only for that segment."', nextId: 'end-good' },
              { label: '"Got it. Let\'s rebuild the entire approval pipeline with AI."', nextId: 'end-bad' },
            ],
          },
          c1: {
            id: 'c1',
            question: 'A competitor launches "AI-powered approvals" and gets press. The CEO is worried. What do you say?',
            options: [
              { label: '"Our rules are profitable and explainable. Unless we can identify a specific business problem AI solves better, we shouldn\'t rebuild what works."', nextId: 'end-good' },
              { label: '"We should match them — let\'s build AI approvals too."', nextId: 'end-bad' },
            ],
          },
        },
        outcomes: {
          'end-good': {
            type: 'good',
            title: 'Sharp PM thinking',
            explanation: 'You identified the specific failure mode first, then evaluated whether ML solves it better than rules. That\'s the right sequence. AI should solve a real problem — not signal innovation.',
            xp: 100,
          },
          'end-ok': {
            type: 'ok',
            title: 'On the right track',
            explanation: 'You pushed back on AI-for-AI\'s-sake, which is correct. But framing it as cost/speed/explainability risk is a defensive play. Stronger move: ask what specific failure the rules are creating.',
            xp: 60,
          },
          'end-bad': {
            type: 'bad',
            title: 'Classic AI trap',
            explanation: 'Jumping to ML without identifying the rule\'s failure mode is how you spend 6 months building a model that performs the same as your existing threshold — just harder to audit and explain.',
            xp: 20,
          },
        },
      },
      quiz: [
        {
          id: 'q1-1',
          scenario: `You're PM at a hospital. The admissions team manually checks if a patient's insurance is accepted before treatment. It's a lookup in a table — insurance ID in, yes/no out.`,
          question: 'Should this be a rule-based system or a machine learning model?',
          options: [
            { label: 'Rule-based system — it\'s a deterministic lookup with no uncertainty', correct: true, explanation: 'Correct. There\'s no prediction needed here — just a table lookup. ML would be overkill and would introduce unnecessary error rates into a yes/no fact check.' },
            { label: 'ML model — patient data is complex and AI handles complexity better', correct: false, explanation: 'The complexity of the patient doesn\'t matter here. The question is just "does this insurance ID exist in our accepted list?" That\'s deterministic — same input, same output, every time.' },
            { label: 'Hybrid — use ML to check the lookup table faster', correct: false, explanation: 'A database query is already fast and deterministic. Adding ML doesn\'t speed up a lookup — it just introduces probabilistic error into what should be a guaranteed fact check.' },
          ],
          xp: 50,
        },
        {
          id: 'q1-2',
          scenario: `A logistics company wants to predict which delivery routes will experience delays tomorrow, based on historical traffic patterns, weather forecasts, and driver shift schedules.`,
          question: 'Is this a deterministic or probabilistic problem — and why?',
          options: [
            { label: 'Deterministic — traffic data is structured and rules could handle it', correct: false, explanation: 'Structured data doesn\'t make a problem deterministic. The issue is that traffic delays depend on combinations of variables (weather × time × route × driver) that interact in ways no fixed rule can fully capture.' },
            { label: 'Probabilistic — the outcome depends on uncertain combinations of variables that change daily', correct: true, explanation: 'Exactly. Tomorrow\'s delay can\'t be computed from a fixed rule — it\'s a pattern learned from thousands of past combinations. This is where ML earns its complexity.' },
            { label: 'Neither — this is just a scheduling problem', correct: false, explanation: 'Delay prediction is genuinely probabilistic. Scheduling uses the predictions — but making the predictions requires learning from uncertain, variable-combination data.' },
          ],
          xp: 50,
        },
      ],
    },

    // ─── Cluster 2: Target Variable ────────────────────────────────────────
    {
      id: 'target-variable',
      widget: {
        type: 'drag-rank',
        title: 'What should CreditPulse predict?',
        subtitle: 'Drag these candidate targets into your preferred order. Most useful at top, least useful at bottom.',
        config: {
          context: `CreditPulse's CEO says "I want AI to help us make better lending decisions." But Arjun, the data scientist, needs to know: what number or category should the model actually predict? Rank these candidates.`,
          items: [
            { id: 'default-binary',   label: 'Will the borrower default? (Yes/No)',           hint: 'Binary — clean, actionable, directly tied to risk' },
            { id: 'default-prob',     label: 'Probability of default (0–100%)',                hint: 'Probabilistic — lets you set your own risk threshold' },
            { id: 'revenue',          label: 'Expected revenue from this borrower (₹)',        hint: 'Valuable, but harder to label historically' },
            { id: 'credit-score',     label: 'The borrower\'s credit score',                   hint: 'You already have this — why predict it?' },
            { id: 'repayment-months', label: 'How many months until first missed payment?',    hint: 'Granular but complex to define and evaluate' },
            { id: 'loan-amount',      label: 'What loan amount should we offer?',              hint: 'A downstream decision, not a prediction' },
          ],
          correctOrder: ['default-prob', 'default-binary', 'revenue', 'repayment-months', 'loan-amount', 'credit-score'],
          explanations: {
            'default-prob':     'Best target. Gives you a probability you can threshold — conservative lenders set a low bar, aggressive ones set it higher. Flexibility is valuable.',
            'default-binary':   'Great target. Simple, clean, directly tied to business risk. Slightly less flexible than probability output.',
            'revenue':          'Strong target for growth-focused teams, but harder to label — you need historical revenue per borrower, not just default status.',
            'repayment-months': 'Useful for collection planning, but harder to evaluate and less directly tied to the approve/deny decision.',
            'loan-amount':      'This is a business decision downstream of the prediction, not a prediction itself. Conflating them causes confusion.',
            'credit-score':     'You already have this as an input feature. Predicting it is circular — and useless.',
          },
        },
      },
      concept: {
        id: 'target-variable',
        term: 'Target Variable',
        tagline: 'What exactly is the model trying to predict?',
        definition: `The target variable (also called label or output) is the specific thing your model learns to predict. Choosing the wrong target is one of the most common PM mistakes — it leads to a model that performs well on the wrong thing. The DS builds toward whatever you define as the target.`,
        mentalModel: `Imagine hiring a chef and saying "make something good." vs "make a vegetarian dish that takes under 30 minutes and costs under ₹200." The chef can execute either request — but only the second one will reliably get you what you actually want. The target variable is your specification.`,
        pmTakeaway: `"Before any modelling work starts, I want to align on the exact target variable — what the model will predict, how it's defined, and how we'll evaluate it. That's my job to specify, not the DS's job to guess."`,
        category: 'foundation',
      },
      quiz: [
        {
          id: 'q2-1',
          scenario: `An EdTech startup wants to "use AI to improve student outcomes." The data scientist asks: what should the model predict?`,
          question: 'Which is the best-defined target variable for this goal?',
          options: [
            { label: 'Student success', correct: false, explanation: '"Success" is undefined — the DS can\'t train a model on a concept. You need a specific, measurable outcome.' },
            { label: 'Whether a student will drop out within 30 days (Yes/No)', correct: true, explanation: 'Specific, measurable, binary, and directly actionable — the school can intervene with at-risk students before they drop. This is a well-defined target.' },
            { label: 'How engaged the student is', correct: false, explanation: '"Engagement" isn\'t a label the model can learn from without being precisely defined. What\'s the unit? A score? A category? Define it first.' },
            { label: 'The student\'s final grade', correct: false, explanation: 'This could work, but it\'s a lagging indicator — you only know the grade when it\'s too late to intervene. Drop-out prediction at 30 days is more actionable.' },
          ],
          xp: 50,
        },
      ],
    },

    // ─── Cluster 3: Features ───────────────────────────────────────────────
    {
      id: 'features',
      widget: {
        type: 'drag-rank',
        title: 'Which signals actually predict loan defaults?',
        subtitle: 'Drag features into two buckets: Useful signal vs Noise / risky to use.',
        config: {
          context: `Arjun has 14 columns of data on each CreditPulse applicant. Your job: decide which features the model should be allowed to learn from. Drag each into the right bucket.`,
          mode: 'two-bucket',
          buckets: [
            { id: 'signal',  label: 'Useful signal',      color: 'success', description: 'Predictive AND appropriate to use' },
            { id: 'noise',   label: 'Noise or risky',     color: 'danger',  description: 'Weak signal, legally risky, or causally irrelevant' },
          ],
          items: [
            { id: 'payment-history',   label: 'Payment history on previous loans',     hint: 'Most predictive feature in lending, by far' },
            { id: 'debt-to-income',    label: 'Monthly debt-to-income ratio',           hint: 'Standard underwriting signal' },
            { id: 'employment-months', label: 'Months at current employer',             hint: 'Stability signal — used by most lenders' },
            { id: 'loan-purpose',      label: 'Stated loan purpose (medical, home, etc)', hint: 'Some purposes correlate with repayment — but causation is unclear' },
            { id: 'zip-code',          label: 'Home zip code',                          hint: 'Can be a proxy for race — legally and ethically risky in India' },
            { id: 'phone-brand',       label: 'Brand of phone used to apply',           hint: 'Weak proxy; can encode socioeconomic bias' },
            { id: 'app-open-time',     label: 'Time of day the app was opened',        hint: 'Spurious — no causal relationship to repayment' },
            { id: 'gender',            label: 'Applicant gender',                       hint: 'Illegal to use in lending decisions in most jurisdictions' },
            { id: 'savings-balance',   label: 'Savings account balance',               hint: 'Strong signal — liquid assets predict repayment capacity' },
            { id: 'num-enquiries',     label: 'Number of credit enquiries in 90 days', hint: 'More enquiries can signal desperation for credit' },
          ],
          correctBuckets: {
            signal:  ['payment-history', 'debt-to-income', 'employment-months', 'savings-balance', 'num-enquiries'],
            noise:   ['zip-code', 'phone-brand', 'app-open-time', 'gender', 'loan-purpose'],
          },
          explanations: {
            'payment-history':   'The single strongest predictor of future repayment. Past behaviour is the best signal of future behaviour.',
            'debt-to-income':    'If more of your income is already committed to debt, repaying a new loan is harder. Classic underwriting signal.',
            'employment-months': 'Job stability correlates with income stability. Short tenure can signal financial volatility.',
            'loan-purpose':      'Murky — medical loans may have lower default than holidays, but the causal story is unclear. Keep out until you can validate.',
            'zip-code':          'Geographic features are often proxies for race and socioeconomic class. Legally and ethically risky — do not use.',
            'phone-brand':       'Weak proxy. Encodes socioeconomic bias without a causal story. A wealthy person with an old phone shouldn\'t be penalised.',
            'app-open-time':     'No causal link to repayment. Spurious correlation at best, embarrassing model behaviour at worst.',
            'gender':            'Illegal to use in lending decisions. Full stop.',
            'savings-balance':   'Buffer against income shocks. Strong causal case for why this predicts repayment.',
            'num-enquiries':     'Multiple credit applications in a short window can signal financial stress or predatory lending targeting.',
          },
        },
      },
      concept: {
        id: 'features',
        term: 'Features (Input Variables)',
        tagline: 'What the model learns from — and what it should never be allowed to learn from.',
        definition: `Features are the inputs the model uses to make a prediction. Good features have a causal or strong correlational relationship with the target. As PM, you're responsible for the feature list — not just the performance metrics. Bad features create biased, fragile, or legally risky models.`,
        mentalModel: `Think of features like witnesses in a court case. Some witnesses have relevant, direct knowledge (payment history). Some are biased (zip code as a proxy for race). Some just happened to be in the building but know nothing (time of day). The judge — you — decides who gets to testify.`,
        pmTakeaway: `"Can you walk me through the feature list before we start training? I want to flag anything that's a proxy for protected characteristics, and anything that might be spuriously correlated without a causal story."`,
        category: 'data',
      },
      quiz: [
        {
          id: 'q3-1',
          scenario: `A ride-hailing app wants to predict which drivers will cancel a trip after accepting it. They have access to: driver rating, trip distance, surge multiplier, driver's home neighbourhood, passenger rating, time since last completed trip, and driver's age.`,
          question: 'Which features would you flag for review before allowing into the model?',
          options: [
            { label: 'Driver\'s home neighbourhood and driver\'s age', correct: true, explanation: 'Both can be proxies for protected characteristics. Neighbourhood can encode race and class. Age is often a protected category in employment contexts. Both need careful legal review before use.' },
            { label: 'Trip distance and surge multiplier', correct: false, explanation: 'These are directly relevant to the driver\'s cancellation incentive — long trips with low surge are more likely to be cancelled. No bias concern, clear causal story.' },
            { label: 'Driver rating and passenger rating', correct: false, explanation: 'Both are direct behavioural signals with a clear causal story. Higher-rated drivers and passengers are less likely to generate friction that leads to cancellation.' },
            { label: 'Time since last completed trip', correct: false, explanation: 'A fatigued or inactive driver may behave differently. This is a relevant operational signal with no bias concern.' },
          ],
          xp: 50,
        },
      ],
    },
  ],

  totalXP: 500,
}

export default day01
