import React from 'react';
import { ModelInfo, Hat, HatColor } from './types';
import type en from './locales/en';

// FIX: The `Translations` type is not exported from './locales/en'.
// It should be derived from the default export of the 'en' locale file.
type Translations = typeof en;

type Translator = (key: keyof Translations) => string;

export const getModelsData = (t: Translator): ModelInfo[] => [
  {
    key: 'PROS_CONS',
    title: t('prosConsTitle'),
    description: t('prosConsDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>,
  },
  {
    key: 'SWOT',
    title: t('swotTitle'),
    description: t('swotDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" /></svg>,
  },
  {
    key: 'DECISION_MATRIX',
    title: t('decisionMatrixTitle'),
    description: t('decisionMatrixDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  },
  {
    key: 'SIX_HATS',
    title: t('sixHatsTitle'),
    description: t('sixHatsDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88" /></svg>,
  },
  {
    key: 'PARETO',
    title: t('paretoTitle'),
    description: t('paretoDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  },
  {
    key: 'COST_BENEFIT',
    title: t('costBenefitTitle'),
    description: t('costBenefitDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>,
  },
  {
    key: 'FISHBONE',
    title: t('fishboneTitle'),
    description: t('fishboneDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>,
  },
    {
    key: 'STEPLADDER',
    title: t('stepladderTitle'),
    description: t('stepladderDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M4 8h16M5 12h14M6 16h12M7 20h10" /></svg>,
  },
  {
    key: 'BRAINSTORMING',
    title: t('brainstormingTitle'),
    description: t('brainstormingDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  {
    key: 'DELPHI',
    title: t('delphiTitle'),
    description: t('delphiDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V8z" /></svg>,
  },
  {
    key: 'NOMINAL_GROUP',
    title: t('nominalGroupTitle'),
    description: t('nominalGroupDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21h6m-6-1a6 6 0 00-6-6" /></svg>,
  },
  {
    key: 'MULTI_VOTING',
    title: t('multiVotingTitle'),
    description: t('multiVotingDescription'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
];

export const getHatsData = (t: Translator): Record<HatColor, Hat> => ({
  blue: {
    color: 'blue',
    name: t('hatBlueName'),
    description: t('hatBlueDescription'),
    bgColor: 'bg-blue-100 dark:bg-blue-900/50',
    textColor: 'text-blue-800 dark:text-blue-200',
    borderColor: 'border-blue-500 dark:border-blue-700',
  },
  white: {
    color: 'white',
    name: t('hatWhiteName'),
    description: t('hatWhiteDescription'),
    bgColor: 'bg-gray-100 dark:bg-gray-700/50',
    textColor: 'text-gray-800 dark:text-gray-200',
    borderColor: 'border-gray-400 dark:border-gray-500',
  },
  red: {
    color: 'red',
    name: t('hatRedName'),
    description: t('hatRedDescription'),
    bgColor: 'bg-red-100 dark:bg-red-900/50',
    textColor: 'text-red-800 dark:text-red-200',
    borderColor: 'border-red-500 dark:border-red-700',
  },
  black: {
    color: 'black',
    name: t('hatBlackName'),
    description: t('hatBlackDescription'),
    bgColor: 'bg-gray-800 dark:bg-gray-900',
    textColor: 'text-white dark:text-gray-200',
    borderColor: 'border-gray-900 dark:border-white/20',
  },
  yellow: {
    color: 'yellow',
    name: t('hatYellowName'),
    description: t('hatYellowDescription'),
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
    textColor: 'text-yellow-800 dark:text-yellow-200',
    borderColor: 'border-yellow-500 dark:border-yellow-700',
  },
  green: {
    color: 'green',
    name: t('hatGreenName'),
    description: t('hatGreenDescription'),
    bgColor: 'bg-green-100 dark:bg-green-900/50',
    textColor: 'text-green-800 dark:text-green-200',
    borderColor: 'border-green-500 dark:border-green-700',
  },
});