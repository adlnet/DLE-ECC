/// <reference types="Cypress" />

describe('homepage', () => {
  beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      // cy.visit('/')
      cy.visit('/')
  })

  // remote file include
  it('Check ssi injection', () => {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const d = new Date();
    let day = weekday[d.getDay()];
    
    // encoded <!--#echo var="DATE_LOCAL" -->
    cy.visit('/login');
    // cy.contains('Sign In').click();
    cy.get('input[name="username"]').type('<!--#echo var="DATE_LOCAL" -->');
    cy.get('input[name="password"]').type('<!--#echo var="DATE_LOCAL" -->');
    cy.contains('Login').click();
    cy.contains(day).should('not.exist')
  });

  // check session/check storage
  it('Check local and session storage', () => {
    // should be empty
    cy.clearAllSessionStorage();
    cy.clearLocalStorage();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllSessionStorage().should('be.empty');
  });

  //  access authorized pages/authorization 
  it('Check can not access restricted pages', () => {
    cy.request({
      // url: '/lists/owned',
      url: 'xms-ui/api/catalogs',
      followRedirect: true,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
    });
  });

  // check authentication, input validation, rbac
  // it('Check input validation', () => {
  //   cy.contains('Sign In').click();
  //   // cy.get('input[name="username"]').click();
  //   cy.get('input[name="username"]').type('>');
  //   cy.wait('1000s');
  //   cy.get('input[name="username"]').should('not.have.value', '>');
  //   cy.get('input[name="username"]').should('have.value', '');
  // });

  // access local files
  it('Check use image serving to access other files', () => {
    cy.request({
      url: '/_next/image?url=/package.json&w=384&q=75',
      followRedirect: true,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(400);
    });
  });

  // null byte check
  it('Check using null byte to access other files', () => {
    cy.request({
      // url: '/package.json\0/_next/static/media/logo.ed71202b.png&w=384&q=75',
      url: '/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdodLogo.ed71202b.png/package.json\0/&w=64&q=75',
      followRedirect: true,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(400);
    });
  });

  // no-cache
  it('Check cache-control headers for no-cache', () => {
    // Check for cache control in header set to no-cache
    // ticket is for requests not responses????  need to figure out how to check requests
    // cy.intercept('GET', '/', (req) => {
    //   req.headers['cache-control'].should('include', 'max-age=0')
    // }).as('cacheControlHeaders');
    // cy.wait('@cacheControlHeaders')
    // cy.get('@cacheControlHeaders').then((interception) => {
    //   const requestHeaders = interception.request.headers;
    //   except(requestHeaders).to.have.property('cache-control', 'max-age=0');
    // })
    
    // cy.request('/').then((resp) => {
    //   cy.log(resp.headers);
    //   expect(resp.headers['Cache-Control']).should('include', 'no-store');
    // });

    // cy.request('/').as('resp');
    // cy.log(cy.get('@resp').its('headers'));
    // cy.get('@resp').its('headers').its('cache-control')
    //   .should('include', 'no-store');
    
    //   cy.request('/')
    //   .its('headers')
    //   .should('have.keys', 'Cache-Control')
    //   .and('deep.equal', { 'Cache-Control': 'no-cache' });
    // cy.request('/').then((response) => {
    //   expect(response.headers).to.have.property('cache-control');

    //   const cacheControlVal = response.headers['cache-control'].toLowerCase();
    //   expect(cacheControlVal).to.satisfy((value) => {
    //     return value === 'no-cache';
    //   })
  });

  // check meta tag
  it('Check content-type headers', () => {
    cy.request('/xms-ui').as('resp')
    cy.get('@resp').its('headers').its('content-type')
      .should('include', 'text/html; charset=utf-8')
  });
});
