export interface RuleRole {
  icon: string;
  name: string;
  desc: string;
  type: 'wolf' | 'special' | 'neutral';
}

export interface PhaseStep {
  label: string;
  isNight: boolean;
  title: string;
  text: string;
}

export interface Tip {
  text: string;
}
