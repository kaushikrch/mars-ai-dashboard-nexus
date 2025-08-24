'use client';

import { useEffect, useState } from 'react';

export type Insight = {
  id: string;
  persona: string;
  title: string;            // e.g., "What's Working", "Where to Act", "Executive Summary"
  text: string;             // the narrative text
  context?: Record<string, any>; // filters like category, customer, time period
  timestamp: number;
};

type StoreState = { insights: Insight[] };

const KEY = 'mars_dcom_insights_v1';
let state: StoreState = { insights: [] };
const subs = new Set<() => void>();

function notify() { subs.forEach(fn => fn()); }
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state.insights)); } catch {}
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state.insights = JSON.parse(raw);
  } catch {}
}

function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `ins_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useInsightsStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    load();
    const fn = () => setTick(t => t + 1);
    subs.add(fn);
    return () => { subs.delete(fn); };
  }, []);

  const addInsight = (input: Omit<Insight, 'id' | 'timestamp'>) => {
    state.insights.unshift({ id: uuid(), timestamp: Date.now(), ...input });
    persist(); notify();
  };

  const addPersonaTriple = (
    persona: string,
    working: string,
    action: string,
    narrative: string,
    context?: Record<string, any>
  ) => {
    if (working?.trim()) addInsight({ persona, title: "What's Working", text: working, context });
    if (action?.trim())  addInsight({ persona, title: 'Where to Act', text: action, context });
    if (narrative?.trim()) addInsight({ persona, title: 'Executive Summary', text: narrative, context });
  };

  const removeInsight = (id: string) => {
    state.insights = state.insights.filter(i => i.id !== id);
    persist(); notify();
  };

  const clearInsights = () => {
    state.insights = [];
    persist(); notify();
  };

  const insights = state.insights;

  return { insights, addInsight, addPersonaTriple, removeInsight, clearInsights };
}