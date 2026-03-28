import { useState } from 'react';

// ── Pages ─────────────────────────────────────────────────────
import { RulesPage }  from './components/rules/RulesPage';
import { SetupApp }   from './components/setup/SetupApp';

type Page = 'rules' | 'setup';

export default function App() {
  const [page, setPage] = useState<Page>('rules');

  return page === 'rules'
    ? <RulesPage onGoSetup={() => setPage('setup')} />
    : <SetupApp  onGoRules={() => setPage('rules')} />;
}
