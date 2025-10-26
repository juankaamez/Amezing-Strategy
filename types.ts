// FIX: Import `ReactElement` to solve for missing JSX namespace.
import type { ReactElement } from 'react';

export type ModelKey =
  | 'PROS_CONS'
  | 'SWOT'
  | 'DECISION_MATRIX'
  | 'STEPLADDER'
  | 'BRAINSTORMING'
  | 'DELPHI'
  | 'COST_BENEFIT'
  | 'FISHBONE'
  | 'NOMINAL_GROUP'
  | 'MULTI_VOTING'
  | 'SIX_HATS'
  | 'PARETO';

export interface ModelInfo {
  key: ModelKey;
  title: string;
  description: string;
  // FIX: Use the imported `ReactElement` type instead of the global `JSX.Element`.
  icon: ReactElement;
}

// Types for Pros & Cons Analysis
export interface ProConItem {
    id: string;
    text: string;
    weight: number;
}

// Types for SWOT Analysis
export interface SWOTData {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

// Types for Decision Matrix
export interface Criterion {
    id: string;
    name: string;
    weight: number;
}

export interface Option {
    id: string;
    name: string;
    scores: { [criterionId: string]: number };
}

// Types for Six Thinking Hats
export type HatColor = 'blue' | 'white' | 'red' | 'black' | 'yellow' | 'green';

export const HAT_COLORS: HatColor[] = ['blue', 'white', 'red', 'black', 'yellow', 'green'];

export interface Hat {
    color: HatColor;
    name: string;
    description: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
}

export type HatNotes = Record<HatColor, string[]>;


// Types for Pareto Analysis
export interface ParetoItem {
    id: string;
    problem: string;
    impact: number;
}


// Types for Cost-Benefit Analysis
export interface CostBenefitItem {
  id: string;
  description: string;
  amount: number;
  type: 'cost' | 'benefit';
}

// Types for Fishbone Diagram
export interface FishboneCause {
  id: string;
  text: string;
}
export interface FishboneCategory {
  id: string;
  name: string;
  causes: FishboneCause[];
}

// Types for Brainstorming
export interface BrainstormingIdea {
  id: string;
  text: string;
}
export interface BrainstormingGroup {
  id: string;
  name: string;
  ideas: BrainstormingIdea[];
}

// Types for Nominal Group Technique
export interface NominalIdea {
  id: string;
  text: string;
  votes: number;
}

// Types for Multi-voting
export interface MultiVoteOption {
  id: string;
  text: string;
  votes: number;
}

// Types for Stepladder Technique
export interface StepladderPerspective {
  id: string;
  title: string;
  ideas: string[];
}

// Types for Delphi Method
export interface DelphiRound {
  id: string;
  userResponse: string;
  aiFeedback: string;
}