import { FixedNavDatePipe } from './custom-date.pipe';

describe('DatePipe', () => {
  it('create an instance', () => {
    const pipe = new FixedNavDatePipe();
    expect(pipe).toBeTruthy();
  });
});
