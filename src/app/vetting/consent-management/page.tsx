import { getConsentRequests } from '@/lib/sample-data/consentRequestsSample';
import { ConsentManagementClient } from './ConsentManagementClient';

export default async function ConsentManagementPage() {
  const consentRequests = await getConsentRequests();

  return (
    <ConsentManagementClient initialData={consentRequests} />
  );
} 