const { expect } = require('chai');

describe('Test suite EPAM', async () => {

  it('1. Check the title is correct', async () => {
    await browser.url('http://epam.com');
    browser.maximizeWindow();
    const pageTitle = await browser.getTitle();
    expect(pageTitle).to.equal('EPAM | Software Engineering & Product Development Services');
  });

  it('2. Switcher to dark/light mode', async () => {
    await browser.url('https://epam.com/');
    const headerElement = $(".header__inner");
    const initialHeaderColor = await headerElement.getCSSProperty("color");
    await $('.header__content > .theme-switcher-ui > .theme-switcher').click();
    await browser.pause(5000);
    const updatedHeaderColor = await headerElement.getCSSProperty("color");
      expect(updatedHeaderColor).not.equal(initialHeaderColor);
  });

  it('3. Check the Ukrainian localization', async () => {
    await browser.url('http://www.epam.com');
    await browser.maximizeWindow();
    await $('#onetrust-accept-btn-handler').click();
    await $('//*[@id="wrapper"]/div[2]/div[1]/header/div/div/ul/li[2]/div/div/button/span').click();
    await browser.pause(1000);
    await $('.location-selector__item a[href="https://careers.epam.ua"]').click();
    await browser.pause(1000);
    const currentURL = await browser.getUrl();
    const expectedUrl = 'https://careers.epam.ua/';
      expect(currentURL).to.equal(expectedUrl);
  });

  it('4. Check the policies list', async () => {
    await browser.url("https://www.epam.com/");
    await browser.maximizeWindow();
    const policiesArea = $(".policies-links-wrapper");
    await policiesArea.scrollIntoView();
    const policiesItems = await policiesArea.$$(".fat-links")
    const policiesNames = await Promise.all(policiesItems.map(async (element) => {
      return await element.getText();
    }));
    const expectedPoliciesNames = ['INVESTORS', 'OPEN SOURCE', 'PRIVACY POLICY', 'COOKIE POLICY', 'APPLICANT PRIVACY NOTICE', 'WEB ACCESSIBILITY'];
    for (let i = 0; i < policiesNames.length; i++) {
      expect(policiesNames[i]).to.equal(expectedPoliciesNames[i], `Policies Group ${i + 1} has the correct name.`);
    }
  });

  it("5. Check that allow to switch location list by region", async () => {
    const locationsArea = $(".tabs-23__ul.js-tabs-links-list");
    await locationsArea.scrollIntoView();
    const locationGroups = await locationsArea.$$(".tabs-23__ul-wrapper .tabs-23__link")
    const locationGroupsNames = await Promise.all(locationGroups.map(async (element) => {
      return await element.getText();
    }));
    const expectedLocationGroupsNames = ['AMERICAS', 'EMEA', 'APAC'];
    for (let i = 0; i < locationGroupsNames.length; i++) {
      expect(locationGroupsNames[i]).to.equal(expectedLocationGroupsNames[i], `Location Group ${i + 1} has the correct name.`);
    }
    const groupAPAC = $('#id-890298b8-f4a7-3f75-8a76-be36dc4490fd > div.js-tabs-controls > div > div > div:nth-child(3) > a');
    await groupAPAC.scrollIntoView();
    await groupAPAC.waitForClickable({ timeout: 5000 });
    await groupAPAC.click();
    const countries = await $$('div.locations-viewer-ui-23[data-item-count="8"] .locations-viewer-23__country-title.list');
    const countriesNames = await Promise.all(countries.map(async (element) => {
      return await element.getText();
    }));
    const filteredCountries = countriesNames.filter((value) => value !== null && value !== '' && value !== undefined);
    const expectedCountriesNames = ['AUSTRALIA', 'CHINA', 'HONG KONG SAR', 'INDIA'];
    for (let i = 0; i < locationGroupsNames.length; i++) {
      expect(filteredCountries[i]).to.equal(expectedCountriesNames[i], `Country ${i + 1} has the correct name.`);
    };
  });

  it('7. Check validation in fields', async () => {
    await browser.url('https://www.epam.com/about/who-we-are/contact');
    await browser.maximizeWindow();
    const elementToClick = $('.button-ui');
    elementToClick.scrollToView();
    await elementToClick.click();
    await browser.pause(2000);
    const inputFirstName = await $('input[id*="user_first_name"]')
    const attrFirstName = await inputFirstName.getAttribute('aria-invalid');
      expect(attrFirstName).to.equal("true");
    const inputLastName = await $('input[id*="user_last_name"]')
    const attrLastName = await inputLastName.getAttribute('aria-invalid');
      expect(attrLastName).to.equal("true");
    const inputEmail = await $('input[id*="user_email"]')
    const attrEmail = await inputEmail.getAttribute('aria-invalid');
      expect(attrEmail).to.equal("true");
    const inputPhone = await $('input[id*="user_phone"]')
    const attrPhone = await inputPhone.getAttribute('aria-invalid');
      expect(attrPhone).to.equal("true");
    const inputComment = await $('//*[@id="_content_epam_en_about_who-we-are_contact_jcr_content_content-container_section_section-par_form_constructor"]/div[2]/div/div/div/div/div[8]/div[1]/div/span[1]/span[1]/span')
    const attrComment = await inputComment.getAttribute('aria-invalid');
      expect(attrComment).to.equal("true");
  });

  it('8. Check the Company logo on the header lead to the main page', async () => {
    await browser.url("https://www.epam.com/about");
    await $('.header__content a[href="/"]').click();
    const currentURL = await browser.getUrl();
    const expectedURL = 'https://www.epam.com/';
      expect(currentURL).to.equal(expectedURL);
  });

  it('9. Check download', async () => {
    const path = require('path');
    const downloadsFolder = 'C://Users//ggulo//Downloads';
    await browser.url('https://www.epam.com/about');
    const downloadButton = await $('//*[@id="main"]/div[1]/div[5]/section/div[2]/div/div/div[1]/div/div[3]/div/a/span/span[1]');
    await downloadButton.scrollIntoView();
    await downloadButton.waitForClickable({ timeout: 3000 });
    await downloadButton.click();
    await browser.pause(10000);
    const expectedFileName = 'EPAM_Corporate_Overview_2023.pdf';
    const expectedFileExtension = '.pdf';
    const filePath = path.join(downloadsFolder, expectedFileName);
    const fileExists = await browser.call(async () => {
      return await browser.call(async () => require('fs-extra').pathExists(filePath));
    });
      expect(fileExists).to.be.true;
    const actualFileName = await browser.call(async () => {
      return await browser.call(async () => require('path').basename(filePath));
    });
    const actualFileExtension = actualFileName.slice(actualFileName.lastIndexOf('.'));
      expect(actualFileName).to.equal(expectedFileName);
      expect(actualFileExtension).to.equal(expectedFileExtension);
  });

});

