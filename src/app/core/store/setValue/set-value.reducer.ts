/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Action, createReducer, on } from '@ngrx/store';
import { setValue } from './set-value.actions';

export const setValueKey = 'setValue';
export const initialState = {
  value: '123',
};

export const _setValueReducer = createReducer(
  initialState,
  on(setValue, (state, { value }) => ({ ...state, value })),
);

export function setValueReducer(state: { value: string } | undefined, action: Action) {
  return _setValueReducer(state, action);
}
