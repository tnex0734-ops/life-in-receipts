import { describe, it, expect } from 'vitest';
import { explainRelationship, buildMomentTrace } from '../src/analytics/connections';
import { Moment } from '../src/types/story';

describe('Connection Engine', () => {
  it('identifies cross-source proximity within 3 hours', () => {
    const timeA = new Date('2023-08-14T20:00:00Z').getTime();
    const timeB = new Date('2023-08-14T21:30:00Z').getTime();

    const rel = explainRelationship(
      { source: 'spotify', timestamp: timeA, title: 'The Killers' },
      { source: 'transaction', timestamp: timeB, title: 'Cinema Ticket' }
    );

    expect(rel.type).toBe('cross-source');
    expect(rel.label).toBe('Within 3 Hours');
    expect(rel.description).toContain('converged within');
  });

  it('identifies same-day temporal window', () => {
    const timeA = new Date('2023-08-14T08:00:00Z').getTime();
    const timeB = new Date('2023-08-14T18:00:00Z').getTime();

    const rel = explainRelationship(
      { source: 'spotify', timestamp: timeA, title: 'Morning Song' },
      { source: 'transaction', timestamp: timeB, title: 'Evening Dinner' }
    );

    expect(rel.type).toBe('cross-source');
    expect(rel.label).toBe('Same Day Window');
  });

  it('identifies shared category co-occurrence across distant dates', () => {
    const timeA = new Date('2023-01-01T10:00:00Z').getTime();
    const timeB = new Date('2023-03-01T10:00:00Z').getTime();

    const rel = explainRelationship(
      { source: 'transaction', timestamp: timeA, category: 'entertainment' },
      { source: 'transaction', timestamp: timeB, category: 'entertainment' }
    );

    expect(rel.type).toBe('co-occurrence');
    expect(rel.label).toBe('Shared Category');
  });

  it('identifies recurrence when events fall on the same day of week', () => {
    // Both are Fridays
    const friday1 = new Date('2023-08-11T12:00:00Z').getTime();
    const friday2 = new Date('2023-08-18T15:00:00Z').getTime();

    const rel = explainRelationship(
      { source: 'spotify', timestamp: friday1, title: 'Track A' },
      { source: 'household', timestamp: friday2, title: 'Household B' }
    );

    expect(rel.type).toBe('recurrence');
    expect(rel.label).toContain('Friday');
  });

  it('handles missing or zero timestamps gracefully without throwing', () => {
    const rel = explainRelationship(
      { source: 'spotify', title: 'No Timestamp' },
      { source: 'transaction', title: 'Also None' }
    );

    expect(rel).toBeDefined();
    expect(rel.label).toBeTruthy();
  });

  it('builds a multi-step moment trace with explicit relationship explanations', () => {
    const dummyMoment: Moment = {
      id: 'mom-test',
      date: '2023-08-14',
      title: 'Music & Cinema',
      narrative: 'Overlapping evening activity.',
      sources: ['spotify', 'transaction'],
      receiptCount: 2,
      receipts: [
        {
          id: 'sp-1',
          source: 'spotify',
          timestamp: new Date('2023-08-14T20:00:00Z').getTime(),
          timeStr: '2023-08-14 20:00:00',
          title: 'Mr. Brightside'
        },
        {
          id: 'tx-1',
          source: 'transaction',
          timestamp: new Date('2023-08-14T21:30:00Z').getTime(),
          timeStr: '8/14/2023 21:30',
          title: 'PVR Cinemas',
          amount: 450,
          currency: 'INR'
        }
      ],
      whyThisMatters: {
        observed: 'Observed text',
        connected: 'Connected text',
        story: 'Story text'
      }
    };

    const steps = buildMomentTrace(dummyMoment);
    expect(steps.length).toBe(1);
    expect(steps[0].relationType).toBe('cross-source');
    expect(steps[0].explanation).toContain('converged');
  });

  it('returns empty array when moment has fewer than 2 receipts', () => {
    const singleReceiptMoment: Moment = {
      id: 'mom-single',
      date: '2023-08-14',
      title: 'Solo',
      narrative: 'Solo receipt.',
      sources: ['spotify'],
      receiptCount: 1,
      receipts: [
        {
          id: 'sp-1',
          source: 'spotify',
          timestamp: 1692043200000,
          timeStr: '2023-08-14 20:00:00',
          title: 'Solo Track'
        }
      ],
      whyThisMatters: { observed: '', connected: '', story: '' }
    };

    expect(buildMomentTrace(singleReceiptMoment)).toEqual([]);
  });
});
