import { UniqByPipe } from './uniq-by.pipe';

describe('UniqByPipe', () => {
  it('create an instance', () => {
    const pipe = new UniqByPipe();
    expect(pipe).toBeTruthy();
  });
});
