'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCheck,
  FileText,
  GitBranch,
  Layers,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react';

const CONTACT =
  'mailto:mrjoshuaability@gmail.com?subject=Let%E2%80%99s%20build%20something';
const PRODUCTS = [
  {
    name: 'Client portal',
    audience: 'Your clients',
    modules: ['Project updates', 'Shared files', 'Approvals'],
  },
  {
    name: 'Team workspace',
    audience: 'Your team',
    modules: ['Work queue', 'Team knowledge', 'Reporting'],
  },
];
const KNOWLEDGE = [
  {
    question: 'What happens before we build?',
    answer:
      'We agree on the problem, the people using the product and a clear first scope. A prototype lets you test the direction before development.',
    source: 'Discover: a shared brief, priorities and a prototype.',
  },
  {
    question: 'Can a person approve a workflow?',
    answer:
      'Yes. A workflow can pause for a person to review the details before the next action runs. You decide where that approval belongs.',
    source: 'Automation: connected tools, with your team in control.',
  },
];

export default function ServicePlayground({ service }: { service: number }) {
  const [product, setProduct] = useState(0);
  const [enabled, setEnabled] = useState([true, true, true]);
  const [route, setRoute] = useState('New project');
  const [step, setStep] = useState(0);
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState(false);
  useEffect(() => {
    if (service !== 1 || (step !== 1 && step !== 3)) return;
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : 900;
    const timer = window.setTimeout(() => setStep(step + 1), delay);
    return () => window.clearTimeout(timer);
  }, [step, service]);
  const selected = PRODUCTS[product];
  const modules = selected.modules.filter((_, i) => enabled[i]);
  const mail =
    CONTACT +
    '&body=' +
    encodeURIComponent(
      `Hi ab-tech-dev,\n\nI would like to discuss a ${selected.name.toLowerCase()} for ${selected.audience.toLowerCase()}.\n\nPriorities: ${modules.length ? modules.join(', ') : 'Help me define the first version'}.\n\nHere is some context:\n`,
    );
  return (
    <div className="service-demo playground" data-service={service}>
      <div className="playground-chrome">
        <span className="playground-mark">ab.</span>
        <span>
          {
            [
              'Shape the software',
              'Connect the workflow',
              'Make knowledge useful',
            ][service]
          }
        </span>
        <span className="example-label">Interactive example</span>
      </div>
      <div className="playground-content" key={service}>
        {service === 0 && (
          <>
            <div className="playground-title">
              <Layers size={24} strokeWidth={1.5} />
              <h3>
                A first version,
                <br />
                shaped by you.
              </h3>
            </div>
            <fieldset className="product-options">
              <legend className="sr-only">Choose a product type</legend>
              {PRODUCTS.map((item, i) => (
                <button
                  type="button"
                  key={item.name}
                  aria-pressed={product === i}
                  onClick={() => setProduct(i)}
                >
                  {item.name}
                  <ArrowRight size={16} />
                </button>
              ))}
            </fieldset>
            <div className="blueprint">
              <div className="blueprint-heading">
                <span>{selected.audience}</span>
                <span>{modules.length} priorities</span>
              </div>
              <div className="blueprint-modules">
                {selected.modules.map((module, i) => (
                  <button
                    type="button"
                    key={module}
                    aria-pressed={enabled[i]}
                    onClick={() =>
                      setEnabled((values) =>
                        values.map((value, index) =>
                          index === i ? !value : value,
                        ),
                      )
                    }
                  >
                    <span className="module-check">
                      {enabled[i] && <Check size={15} />}
                    </span>
                    {module}
                  </button>
                ))}
              </div>
              <p>Select what matters for your first version.</p>
            </div>
            <a href={mail} className="playground-action">
              Start with this brief
              <ArrowRight size={18} />
            </a>
          </>
        )}
        {service === 1 && (
          <>
            <div className="playground-title">
              <GitBranch size={24} strokeWidth={1.5} />
              <h3>
                A handoff.
                <br />
                Without the chasing.
              </h3>
            </div>
            <div className="workflow-input">
              <label htmlFor="sample-enquiry">An enquiry arrives</label>
              <select
                id="sample-enquiry"
                value={route}
                disabled={step !== 0 && step !== 4}
                onChange={(event) => {
                  setRoute(event.target.value);
                  setStep(0);
                }}
              >
                <option>New project</option>
                <option>Support request</option>
              </select>
            </div>
            <ol className="handoff-path">
              {[
                'Received',
                route === 'New project' ? 'Project team' : 'Support team',
                'Your approval',
                'Handed over',
              ].map((label, i) => (
                <li
                  key={i}
                  data-done={step > i}
                  data-current={
                    (step === 2 && i === 2) ||
                    (step === 1 && i === 1) ||
                    (step === 3 && i === 3)
                  }
                >
                  <span>{step > i ? <Check size={16} /> : i + 1}</span>
                  <strong>{label}</strong>
                </li>
              ))}
            </ol>
            <output className="handoff-result" aria-live="polite">
              <span className="result-symbol">
                {step === 4 ? <CheckCheck size={24} /> : <Send size={23} />}
              </span>
              <span>
                <strong>
                  {
                    [
                      'Ready when you are.',
                      'Finding the right team...',
                      'Your team stays in control.',
                      'Completing the handoff...',
                      'The next person has what they need.',
                    ][step]
                  }
                </strong>
                <span className="result-copy">
                  {step === 2
                    ? 'Review the enquiry, then approve the next step.'
                    : step === 4
                      ? `${route} routed with its context and approval.`
                      : 'Try a sample enquiry. No real messages are sent.'}
                </span>
              </span>
            </output>
            {step === 0 ? (
              <button
                type="button"
                className="playground-action"
                onClick={() => setStep(1)}
              >
                Run the example
                <ArrowRight size={18} />
              </button>
            ) : step === 2 ? (
              <button
                type="button"
                className="playground-action"
                onClick={() => setStep(3)}
              >
                Approve handoff
                <Check size={18} />
              </button>
            ) : step === 4 ? (
              <button
                type="button"
                className="playground-action"
                onClick={() => setStep(0)}
              >
                Try again
                <RotateCcw size={18} />
              </button>
            ) : (
              <button type="button" className="playground-action" disabled>
                Moving it forward
                <span className="activity-line" />
              </button>
            )}
          </>
        )}
        {service === 2 && (
          <>
            <div className="playground-title">
              <Sparkles size={24} strokeWidth={1.5} />
              <h3>
                Answers with
                <br />
                something behind them.
              </h3>
            </div>
            <fieldset className="knowledge-questions">
              <legend className="sr-only">Choose a sample question</legend>
              {KNOWLEDGE.map((item, i) => (
                <button
                  type="button"
                  key={item.question}
                  aria-pressed={question === i}
                  onClick={() => {
                    setQuestion(i);
                    setAnswer(false);
                  }}
                >
                  {item.question}
                  <ArrowRight size={16} />
                </button>
              ))}
            </fieldset>
            <div className="knowledge-answer" aria-live="polite">
              {answer ? (
                <>
                  <p>{KNOWLEDGE[question].answer}</p>
                  <div className="knowledge-source">
                    <FileText size={16} />
                    <span>{KNOWLEDGE[question].source}</span>
                  </div>
                </>
              ) : (
                <p className="knowledge-prompt">
                  Choose a question to explore a sample answer grounded in our
                  service notes.
                </p>
              )}
            </div>
            <button
              type="button"
              className="playground-action"
              disabled={answer}
              onClick={() => setAnswer(true)}
            >
              {answer ? 'Source shown above' : 'Show sample answer'}
              <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
