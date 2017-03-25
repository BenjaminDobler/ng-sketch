import { SketchPage } from './app.po';

describe('sketch App', () => {
  let page: SketchPage;

  beforeEach(() => {
    page = new SketchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
