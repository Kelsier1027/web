import { createAction, props } from '@ngrx/store';

export const clickValue = createAction('[Component profileDrop] clickValue', props<{ value: string }>());
