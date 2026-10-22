import { allChapters } from "../data/curriculum";
export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  level: string;
};
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function arrange(q: Question, random: () => number) {
  const a = q.options.map((text, i) => ({ text, correct: i === q.answer }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return {
    ...q,
    options: a.map((x) => x.text),
    answer: a.findIndex((x) => x.correct),
  };
}
export function questionsFor(chapterId: string): Question[] {
  const c = allChapters.find((x) => x.id === chapterId);
  if (!c) return [];
  const random = rng([...chapterId].reduce((a, x) => a + x.charCodeAt(0), 19));
  const questions: Question[] = [];
  const add = (
    prompt: string,
    options: (string | number)[],
    answer: number,
    explanation: string,
    level = "Foundation",
  ) =>
    questions.push(
      arrange(
        {
          id: chapterId + "-" + questions.length,
          prompt,
          options: options.map(String),
          answer,
          explanation,
          level,
        },
        random,
      ),
    );
  if (c.facts) {
    const pairs: number[][] = [];
    for (let a = 0; a < c.facts.length; a++)
      for (let b = a + 1; b < c.facts.length; b++) pairs.push([a, b]);
    for (let i = pairs.length - 1; i > 0; i--) {
      let j = Math.floor(random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    pairs.slice(0, 100).forEach(([a, b], i) => {
      const x = c.facts![a],
        y = c.facts![b];
      const t1 = i % 4 === 0 || i % 4 === 2,
        t2 = i % 4 === 1 || i % 4 === 2;
      add(
        "Consider the following statements:\n\n1. " +
          x[t1 ? 0 : 1] +
          "\n\n2. " +
          y[t2 ? 0 : 1] +
          "\n\nWhich of the statements given above is/are correct?",
        ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        t1 ? (t2 ? 2 : 0) : t2 ? 1 : 3,
        "Statement 1 is " +
          (t1 ? "correct" : "incorrect") +
          ". " +
          x[0] +
          "\n\nStatement 2 is " +
          (t2 ? "correct" : "incorrect") +
          ". " +
          y[0],
        i % 3 === 0 ? "Mixed concepts" : "Foundation",
      );
    });
    return questions;
  }
  for (let i = 0; i < 100; i++) {
    const n = i + 1;
    if (c.kind === "numeracy") {
      const k = i % 5,
        m = Math.floor(i / 5) + 1;
      if (k === 0) {
        const total = 200 + 40 * m,
          p = 5 + (m % 10) * 5,
          ans = (total * p) / 100;
        add(
          `A library has ${total} books. ${p}% are on history. How many history books are there?`,
          [ans, ans + 20, ans - 5, ans + 5],
          0,
          `${p}/100 × ${total} = ${ans} books.`,
        );
      }
      if (k === 1) {
        const a = m + 2,
          b = m + 3,
          u = 12,
          ans = a * u;
        add(
          `A fund of ₹${(a + b) * u} is divided between A and B in the ratio ${a}:${b}. What is A's share?`,
          [ans, b * u, ans + 24, ans - 12],
          0,
          `There are ${a + b} equal parts. Each is worth ₹12. A receives ${a} × 12 = ₹${ans}.`,
        );
      }
      if (k === 2) {
        const start = m * 3,
          ans = start + 4;
        add(
          `What is the arithmetic mean of ${start}, ${start + 2}, ${start + 4}, ${start + 6} and ${start + 8}?`,
          [ans, ans + 2, ans - 2, ans + 4],
          0,
          `The five equally spaced values are symmetric around ${ans}; their sum divided by 5 equals ${ans}.`,
        );
      }
      if (k === 3) {
        const p = 1000 + 100 * m,
          r = 5 + (m % 5),
          t = 2,
          ans = (p * r * t) / 100;
        add(
          `Find the simple interest on ₹${p} at ${r}% per year for ${t} years.`,
          [ans, ans / 2, ans + 100, ans + 50],
          0,
          `Simple interest = P × R × T / 100 = ${p} × ${r} × 2 / 100 = ₹${ans}.`,
        );
      }
      if (k === 4) {
        const speed = 30 + m * 2,
          t = 3,
          ans = speed * t;
        add(
          `A vehicle travels for ${t} hours at a constant speed of ${speed} km/h. What distance does it cover?`,
          [ans, ans + speed, ans - speed, ans + 10],
          0,
          `Distance = speed × time = ${speed} × ${t} = ${ans} km.`,
        );
      }
    } else if (c.kind === "reasoning") {
      const k = i % 5,
        m = Math.floor(i / 5) + 1;
      if (k === 0) {
        let a = 2 * m,
          d = m + 2,
          ans = a + 4 * d;
        add(
          `Find the next number: ${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, …`,
          [ans, ans + d, ans - d + 1, ans + 1],
          0,
          `Each successive term increases by ${d}. The next is ${a + 3 * d} + ${d} = ${ans}.`,
        );
      }
      if (k === 1) {
        let a = m + 1,
          ans = a * 16;
        add(
          `Find the next number: ${a}, ${a * 2}, ${a * 4}, ${a * 8}, …`,
          [ans, ans + 1, ans / 2 + 1, ans * 2],
          0,
          `Every term is twice its predecessor, so ${a * 8} × 2 = ${ans}.`,
        );
      }
      if (k === 2) {
        let count = 30 + m,
          left = m + 3,
          ans = count - left + 1;
        add(
          `In a row of ${count} students, R is ${left}th from the left. What is R's position from the right?`,
          [ans, ans + 1, ans - 1, ans + 2],
          0,
          `Position from right = total − position from left + 1 = ${count} − ${left} + 1 = ${ans}.`,
        );
      }
      if (k === 3) {
        let a = m + 3,
          b = m + 4;
        add(
          `A person walks ${a} km north, ${b} km east and then ${a} km south. Where is the person relative to the starting point?`,
          [
            `${b} km east`,
            `${b} km west`,
            `${a} km north`,
            `${a + b} km south`,
          ],
          0,
          `The north and south movements cancel. The remaining displacement is ${b} km east.`,
        );
      }
      if (k === 4) {
        const item = ["cedars", "roses", "mangoes", "lotuses", "oaks"][m % 5];
        add(
          `In collection ${m}, all ${item} are plants. All plants need resources. Which conclusion necessarily follows?`,
          [
            `All ${item} need resources.`,
            `All things needing resources are ${item}.`,
            `No ${item} need resources.`,
            `All plants are ${item}.`,
          ],
          0,
          `The inclusion chain is ${item} → plants → things needing resources. Its reverse does not follow.`,
          "Application",
        );
      }
    } else if (c.kind === "data") {
      let a = 50 + 2 * n,
        b = 60 + 3 * n,
        d = 70 + 4 * n;
      if (i % 4 === 0)
        add(
          `A district records enrolment:\nSchool A: ${a}\nSchool B: ${b}\nSchool C: ${d}\n\nWhat is total enrolment?`,
          [a + b + d, a + b, a + d, b + d],
          0,
          `Add all three entries: ${a} + ${b} + ${d} = ${a + b + d}.`,
        );
      if (i % 4 === 1)
        add(
          `A survey records ${a} households in Zone A and ${b} in Zone B. How many more households are recorded in Zone B?`,
          [b - a, b + a, b - a + 5, b - a - 5],
          0,
          `The difference is ${b} − ${a} = ${b - a}.`,
        );
      if (i % 4 === 2) {
        let v = 100 + 20 * n;
        add(
          `A centre served ${v} applicants on Monday and ${v * 1.5} on Tuesday. What was the percentage increase?`,
          ["50%", "25%", "150%", "75%"],
          0,
          `Increase = ${v / 2}. Percentage increase = (${v / 2}/${v}) × 100 = 50%.`,
        );
      }
      if (i % 4 === 3)
        add(
          `What is the area of a rectangle?\nStatement 1: Its length is ${n + 5} cm.\nStatement 2: Its breadth is ${n + 2} cm.\n\nWhich information is sufficient?`,
          [
            "Both statements together, neither alone",
            "Statement 1 alone",
            "Statement 2 alone",
            "Neither, even together",
          ],
          0,
          `Area = length × breadth. Both are needed; together they give ${(n + 5) * (n + 2)} cm².`,
          "Application",
        );
    } else if (c.kind === "comprehension") {
      const contexts = [
        ["libraries", "reading access", "book circulation"],
        ["clinics", "healthcare access", "patient visits"],
        ["buses", "mobility", "passenger trips"],
        ["schools", "education access", "attendance"],
        ["water kiosks", "water access", "water collections"],
        ["skill centres", "training access", "enrolment"],
        ["parks", "recreation access", "visitor counts"],
        ["digital kiosks", "service access", "applications"],
        ["nutrition centres", "nutrition support", "beneficiary visits"],
        ["recycling centres", "waste recovery", "material collections"],
      ];
      const [place, goal, measure] = contexts[Math.floor(i / 10)];
      const v = 10 + (i % 10) * 5;
      const passage = `A district increased its ${place}. Recorded ${measure} rose by ${v}%. Officials described this as progress in ${goal}, but the evaluation noted that distance, service quality and unequal use across neighbourhoods had not been measured. It recommended examining those factors before claiming that all residents had benefited equally.`;
      const k = i % 5;
      if (k === 0)
        add(
          passage + "\n\nWhich is the most defensible conclusion?",
          [
            "Greater recorded use alone does not establish equal benefits.",
            "Every resident benefited equally.",
            "The expansion had no benefit of any kind.",
            "Distance can never influence access.",
          ],
          0,
          "The passage reports greater use while explicitly withholding a conclusion about equal benefit.",
          "Application",
        );
      if (k === 1)
        add(
          passage + "\n\nWhich claim goes beyond the evidence?",
          [
            "Every neighbourhood gained equally.",
            "Recorded use increased.",
            "The evaluation recommends more information.",
            "Service quality was not measured.",
          ],
          0,
          "Equal gains cannot be established when unequal use and service quality were not measured.",
          "Application",
        );
      if (k === 2)
        add(
          passage + "\n\nWhat is the central message?",
          [
            "Activity indicators should be complemented by evidence about access and quality.",
            "All public investment should stop.",
            "Only the number of buildings matters.",
            "The observed increase must be false.",
          ],
          0,
          "The author accepts the increase but calls for a more complete assessment.",
          "Application",
        );
      if (k === 3)
        add(
          passage +
            "\n\nWhich additional evidence would best address the evaluation’s concern?",
          [
            "Neighbourhood-level access and service-quality measurements.",
            "The colour of the official report.",
            "Unrelated tourist arrivals in another country.",
            "The officials’ preferred newspaper.",
          ],
          0,
          "Evidence should directly measure the missing dimensions identified in the passage.",
          "Application",
        );
      if (k === 4)
        add(
          passage + "\n\nWhich assumption underlies the recommendation?",
          [
            "Overall usage figures may conceal unequal outcomes.",
            "Every resident has identical needs.",
            "Service quality never affects outcomes.",
            "No evidence can inform policy.",
          ],
          0,
          "The recommendation makes sense because aggregate counts can hide differences in access or benefit.",
          "Application",
        );
    } else {
      const services = [
        "scholarship",
        "ration",
        "pension",
        "water connection",
        "disability support",
        "housing",
        "library membership",
        "health enrolment",
        "training grant",
        "transport pass",
      ];
      const service = services[Math.floor(i / 10)];
      const count = 5 + (i % 10) * 3;
      const scenarios = [
        [
          `You receive ${count} complaints that eligible ${service} applicants were excluded. What should you do first?`,
          "Check records and eligibility, hear the applicants, and arrange lawful correction.",
          "Dismiss every complaint without checking.",
          "Publish applicants’ sensitive details publicly.",
          "Approve only applications from personal acquaintances.",
          "Verify facts, hear affected people and use a fair, lawful correction process.",
        ],
        [
          `${count} residents cannot understand the ${service} application instructions. What is the best communication response?`,
          "Explain the steps in accessible language and confirm their understanding.",
          "Repeat unexplained jargon more loudly.",
          "Refuse to explain because the form exists.",
          "Assume silence proves understanding.",
          "Accessible language and checking understanding address the actual barrier.",
        ],
        [
          `A colleague requests preferential treatment for ${count} friends in the ${service} queue. What is the best response?`,
          "Apply the published criteria equally and record any legitimate priority exceptions.",
          "Move all friends ahead without recording it.",
          "Reject every applicant to avoid deciding.",
          "Ask applicants to pay a private fee.",
          "Fairness requires consistent criteria and transparent, lawful exceptions.",
        ],
        [
          `Records for ${count} ${service} applications contain conflicting entries. What should guide the decision?`,
          "Reconcile the evidence and seek clarification before making an adverse decision.",
          "Choose entries randomly.",
          "Delete every application immediately.",
          "Treat the loudest claim as proof.",
          "Conflicting evidence calls for verification rather than arbitrary adverse action.",
        ],
        [
          `You have mistakenly sent the wrong appointment date to ${count} ${service} applicants. What should you do?`,
          "Promptly correct the message, acknowledge the error and help affected applicants.",
          "Conceal the error and blame the applicants.",
          "Keep the wrong date to avoid embarrassment.",
          "Delete the records and ignore enquiries.",
          "Accountability involves prompt correction and practical assistance.",
        ],
      ];
      const s = scenarios[i % 5];
      add(s[0], s.slice(1, 5), 0, s[5], "Application");
    }
  }
  return questions;
}
