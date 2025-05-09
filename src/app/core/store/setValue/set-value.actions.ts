import { createAction, props } from '@ngrx/store';

export const setValue = createAction('[Component setValue] setValue', props<{ value: string }>());
