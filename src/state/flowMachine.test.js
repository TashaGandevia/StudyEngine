import { describe, it, expect, vi } from 'vitest';
import {
  flowReducer,
  initialFlowState,
  FLOW,
  OVERLAY,
  EVENT,
} from './flowMachine.js';

describe('flowReducer', () => {
  it('starts at TITLE', () => {
    expect(initialFlowState.flow).toBe(FLOW.TITLE);
  });

  it('walks the main path and records the selected zone', () => {
    let s = initialFlowState;
    s = flowReducer(s, { type: EVENT.START_NEW });
    expect(s.flow).toBe(FLOW.ONBOARDING);
    s = flowReducer(s, { type: EVENT.FINISH_ONBOARDING });
    expect(s.flow).toBe(FLOW.OVERWORLD);
    s = flowReducer(s, { type: EVENT.SELECT_ZONE, zoneId: 'z1' });
    expect(s).toMatchObject({ flow: FLOW.ZONE_INTRO, zoneId: 'z1' });
  });

  it('ignores invalid transitions (returns the same state)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const s = flowReducer(initialFlowState, { type: EVENT.WIN_BOSS });
    expect(s).toBe(initialFlowState);
    warn.mockRestore();
  });

  it('overlays suspend and resume without changing flow', () => {
    let s = { flow: FLOW.PLAYING, overlay: null, zoneId: 'z1' };
    s = flowReducer(s, { type: EVENT.OPEN_PAUSE });
    expect(s).toMatchObject({ flow: FLOW.PLAYING, overlay: OVERLAY.PAUSED });
    s = flowReducer(s, { type: EVENT.CLOSE_PAUSE });
    expect(s).toMatchObject({ flow: FLOW.PLAYING, overlay: null });
  });

  it('clears the zone when returning to the overworld', () => {
    const s = flowReducer(
      { flow: FLOW.RESULTS, overlay: null, zoneId: 'z1' },
      { type: EVENT.FINISH_RESULTS }
    );
    expect(s).toMatchObject({ flow: FLOW.OVERWORLD, zoneId: null });
  });
});
