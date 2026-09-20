import { loadCoreArchiveData, loadSampleReceipts, ArchiveData } from '../analytics/storyEngine';

export { loadCoreArchiveData, loadSampleReceipts };
export type { ArchiveData };

export async function loadAllData(): Promise<ArchiveData> {
  const core = await loadCoreArchiveData();
  const sampleReceipts = await loadSampleReceipts();
  return {
    ...core,
    sampleReceipts
  };
}
