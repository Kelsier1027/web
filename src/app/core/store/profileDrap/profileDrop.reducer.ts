/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Action, createReducer, on } from '@ngrx/store';
import { clickValue } from './profileDrop.actions';

export const clickValueKey = 'clickValue';
export const initialState = {
  value: '',
};

export const _profileDropReducer = createReducer(
  initialState,
  on(clickValue, (state, { value }) => ({ ...state, value })),
);

export function profileDropReducer(state: { value: string } | undefined, action: Action) {
  return _profileDropReducer(state, action);
}
