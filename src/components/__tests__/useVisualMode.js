import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useVisualMode from './useVisualMode.js';

const FIRST = 'FIRST';
const SECOND = 'SECOND';
const THIRD = 'THIRD';

test('useVisualMode should transition back to the previous mode', () => {
  const { result } = renderHook(() => useVisualMode(FIRST));

  act(() => result.current.transition(SECOND));

  expect(result.current.mode).toBe(SECOND);

  act(() => result.current.back());

  expect(result.current.mode).toBe(FIRST);
});

test("useVisualMode should replace the current mode", () => {
  const { result } = renderHook(() => useVisualMode(FIRST));

  act(() => result.current.transition(SECOND));
  expect(result.current.mode).toBe(SECOND);

  act(() => result.current.transition(THIRD, true));
  expect(result.current.mode).toBe(THIRD);

  act(() => result.current.back());
  expect(result.current.mode).toBe(FIRST);
});

test("useVisualMode should not return to the previous mode if already at initial", () => {
  const { result } = renderHook(() => useVisualMode(FIRST));

  act(() => result.current.back());
  expect(result.current.mode).toBe(FIRST);
});

