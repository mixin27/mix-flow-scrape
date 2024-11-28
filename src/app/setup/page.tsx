import { SetupUser } from '@/actions/billing/setup-user';

async function SetupPage() {
  return await SetupUser();
}

export default SetupPage;
