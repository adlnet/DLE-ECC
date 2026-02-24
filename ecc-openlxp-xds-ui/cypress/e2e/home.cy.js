/// <reference types="Cypress" />

describe('homepage', () => {
  beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('/')
  })

  // remote file include https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T122/
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
    cy.visit('/search?keyword=<%21--%23echo%20var%3D"DATE_LOCAL"%20-->&p=1');
    cy.contains(day).should('not.exist');
    cy.get('input').should('have.value', '<!--#echo var="DATE_LOCAL" -->');
  });

  // access authorized pages https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T84/
  // authorization https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T85/
  it('Check can not access restricted pages', () => {
    cy.request({
      // url: '/lists/owned',
      url: 'api/interest-lists/owned',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
    });
  });

  // check session https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T128/
  // check storage https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T321/
  it('Check local and session storage', () => {
    // cy.request('/');
    cy.visit('/')

    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    })  
    
    cy.window().then((win) => {
      expect(win.localStorage.length).to.eq(0);
      expect(win.sessionStorage.length).to.eq(0);
    })
    // should be empty
    // cy.getAllLocalStorage().should('be.empty');
    // cy.getAllSessionStorage().should('be.empty');
  });

  // XSS https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T89/
  // check rbac https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T2276/
  // check authentication https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T2277/
  // input validation https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T519/
  it('Check input validation', () => {
    cy.request('/');
    cy.get('input').type('?');
    cy.get('input').should('not.have.value', '?');
    cy.get('input').should('have.value', '');
  });

  // access local files https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T297/
  it('Check use image serving to access other files', () => {
    cy.request({
      url: '/_next/image?url=/package.json&w=384&q=75',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(400);
    });
  });

  // null byte check https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T127/
  it('Check using null byte to access other files', () => {
    cy.request({
      url: '/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.ed71202b.png/package.json\0/&w=256&q=75',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(400);
    });
  });

  // no-cache https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T112/
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

  // check meta tag https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T132/
  it('Check content-type headers', () => {
    cy.request('/').as('resp')
    cy.get('@resp').its('headers').its('content-type')
      .should('include', 'text/html; charset=utf-8')
  });

  // check CSP https://sdelements.il2.dso.mil/bunits/platform1/ecc/open-lxp-xds-ui/tasks/phase/testing/387-T332/
  it('Check meta tags', () => {
    cy.get(`head > meta[http-equiv="Content-Security-Policy"]`)
      .should('have.attr', 'content')
      .and('contain', 'self');
  });
});
