import { TestomatPage } from './app.po';

describe('testomat App', () => {
  let page: TestomatPage;

  beforeEach(() => {
    page = new TestomatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
