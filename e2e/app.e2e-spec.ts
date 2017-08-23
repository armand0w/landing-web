import { MnLandingPagePage } from './app.po';

describe('mn-landing-page App', () => {
  let page: MnLandingPagePage;

  beforeEach(() => {
    page = new MnLandingPagePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
