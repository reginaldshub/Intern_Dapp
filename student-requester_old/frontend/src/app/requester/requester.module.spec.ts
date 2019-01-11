import { RequesterModule } from './requester.module';

describe('RequesterModule', () => {
  let requesterModule: RequesterModule;

  beforeEach(() => {
    requesterModule = new RequesterModule();
  });

  it('should create an instance', () => {
    expect(requesterModule).toBeTruthy();
  });
});
