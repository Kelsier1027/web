/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Action, createReducer, on } from '@ngrx/store';
import { open, close } from './flag.actions';

export const flagKey = 'flag';
export const initialState = false;

const _flagReducer = createReducer(
  initialState,
  on(open, (state) => (state = true)),
  on(close, (state) => (state = false)),
);

export function flagReducer(state: boolean | undefined, action: Action) {
  return _flagReducer(state, action);
}
