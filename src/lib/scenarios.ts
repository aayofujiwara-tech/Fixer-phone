// シナリオテンプレート（オフライン用フォールバック）
import type { Scenario } from '../types';

// APIが失敗した場合のフォールバックシナリオ
export const fallbackScenario: Scenario = {
  scenario_title_ja: '極秘停戦交渉',
  scenario_title_en: 'Secret Ceasefire Negotiation',
  lines: [
    {
      speaker: 'leader',
      ja: 'フィクサー、緊急の案件だ。状況は極めて深刻だ。',
      en: 'Fixer, this is urgent. The situation is extremely critical.',
    },
    {
      speaker: 'fixer',
      ja: '閣下、ご安心ください。すでに状況は把握しております。',
      en: 'Your Excellency, rest assured. I am already aware of the situation.',
    },
    {
      speaker: 'leader',
      ja: '48時間以内に解決策が必要だ。何か手はあるのか？',
      en: 'I need a solution within 48 hours. Do you have any options?',
    },
    {
      speaker: 'fixer',
      ja: '3つのプランを用意しています。最も確実なのはプランBです。',
      en: 'I have three plans prepared. Plan B is the most reliable.',
    },
    {
      speaker: 'leader',
      ja: 'プランBの詳細を聞かせてくれ。リスクはどの程度だ？',
      en: 'Tell me the details of Plan B. What level of risk are we looking at?',
    },
    {
      speaker: 'fixer',
      ja: 'リスクは最小限に抑えてあります。ジュネーブの特別ルートを使います。',
      en: 'Risk has been minimized. We will use the special Geneva channel.',
    },
    {
      speaker: 'leader',
      ja: 'わかった。君に全権を委任する。必ず成功させてくれ。',
      en: 'Understood. I am giving you full authority. Make sure this succeeds.',
    },
    {
      speaker: 'fixer',
      ja: 'お任せください。24時間以内に結果をお伝えします。',
      en: 'Leave it to me. I will report results within 24 hours.',
    },
  ],
};
