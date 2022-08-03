describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    const user2 = {
      name: 'Jon User',
      username: 'jon',
      password: 'password',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user2);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();
      cy.contains('Matti Luukkainen logged in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('login').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.contains('wrong username or password');
    });

    it('failed login message is red', function () {
      cy.contains('login').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.contains('wrong username or password').should(
        'have.css',
        'color',
        'rgb(255, 0, 0)'
      );
    });
  });
  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();
      cy.get('input[name="Title"]').type('a title by cypress');
      cy.get('input[name="Author"]').type('cypress tester');
      cy.get('input[name="Url"]').type('https://cypre.ss');
      cy.contains('button', 'create').click();

      cy.contains('a title by cypress cypress tester');
    });
  });

  describe('An existing blog', function () {
    beforeEach(function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.contains('new blog').click();
      cy.get('input[name="Title"]').type('a title by cypress');
      cy.get('input[name="Author"]').type('cypress tester');
      cy.get('input[name="Url"]').type('https://cypre.ss');
      cy.contains('button', 'create').click();
      cy.contains('added');
    });

    it('can be liked', function () {
      cy.contains('button', 'view').click();
      cy.contains('button', 'like').click();

      cy.contains('likes: 1');
    });
  });

  describe('An blog can be deleted', function () {
    beforeEach(function () {
      cy.get('#username').type('jon');
      cy.get('#password').type('password');
      cy.get('#login-button').click();

      cy.contains('button', 'new blog').click();
      cy.get('input[name="Title"]').type('jons blog');
      cy.get('input[name="Author"]').type('mr jon');
      cy.get('input[name="Url"]').type('https://j.on');
      cy.contains('button', 'create').click();
      cy.contains('jons');

      cy.contains('button', 'logout').click();

      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.contains('button', 'new blog').click();
      cy.get('input[name="Title"]').type('a title by cypress');
      cy.get('input[name="Author"]').type('cypress tester');
      cy.get('input[name="Url"]').type('https://cypre.ss');
      cy.contains('button', 'create').click();
      cy.contains('cypress');
    });

    it('can be deleted by its creator', function () {
      cy.contains('cypress cypress tester')
        .parent()
        .contains('button', 'view')
        .click();
      cy.contains('cypress cypress tester')
        .parent()
        .contains('button', 'remove')
        .click();
      cy.contains('deleted blog a title by cypress by cypress tester');
    });

    it('but not someone else', function () {
      cy.contains('jons blog').parent().contains('button', 'view').click();
      //cy.contains('jons blog').parent().should('not.contain', 'remove');
      cy.contains('jons blog')
        .parent()
        .contains('button', 'remove')
        .should('not.be.visible');
    });
  });

  describe('Blogs are ordered correctly', function () {
    beforeEach(function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.contains('button', 'new blog').click();
      cy.get('input[name="Title"]').type('most liked blog');
      cy.get('input[name="Author"]').type('cypress tester');
      cy.get('input[name="Url"]').type('https://cypre.ss/most');
      cy.contains('button', 'create').click();
      cy.contains('most liked');

      //cy.contains('button', 'new blog').click();
      cy.get('input[name="Title"]').type('middle liked blog');
      cy.get('input[name="Author"]').type('cypress tester');
      cy.get('input[name="Url"]').type('https://cypre.ss/most');
      cy.contains('button', 'create').click();
      cy.contains('middle liked');

      //cy.contains('button', 'new blog').click();
      cy.get('input[name="Title"]').type('least liked blog');
      cy.get('input[name="Author"]').type('cypress tester');
      cy.get('input[name="Url"]').type('https://cypre.ss/most');
      cy.contains('button', 'create').click();
      cy.contains('least liked');
    });

    it('by likes', function () {
      cy.contains('most liked blog cypress')
        .parent()
        .contains('button', 'view')
        .click();
      cy.contains('most liked blog cypress')
        .parent()
        .contains('button', 'like')
        .click();
      cy.contains('most liked blog cypress').parent().contains('likes: 1');

      cy.contains('middle liked blog cypress')
        .parent()
        .contains('button', 'view')
        .click();
      cy.contains('middle liked blog cypress')
        .parent()
        .contains('button', 'like')
        .click();
      cy.contains('middle liked blog cypress').parent().contains('likes: 1');

      cy.contains('least liked blog cypress')
        .parent()
        .contains('button', 'view')
        .click();
      cy.contains('least liked blog cypress')
        .parent()
        .contains('button', 'like')
        .click();
      cy.contains('least liked blog cypress').parent().contains('likes: 1');

      cy.contains('most liked').parent().contains('button', 'like').click();
      cy.contains('most liked').parent().contains('likes: 2');

      cy.contains('middle liked blog cypress')
        .parent()
        .contains('button', 'like')
        .click();
      cy.contains('middle liked blog cypress').parent().contains('likes: 2');

      cy.contains('most liked blog cypress')
        .parent()
        .contains('button', 'like')
        .click();
      cy.contains('most liked blog cypress').parent().contains('likes: 3');

      cy.contains('most liked blog cypress')
        .parent()
        .contains('button', 'like')
        .click();
      cy.contains('most liked blog cypress').parent().contains('likes: 4');

      cy.get('.blog').eq(0).should('contain', 'most liked');
      cy.get('.blog').eq(1).should('contain', 'middle liked');
      cy.get('.blog').eq(2).should('contain', 'least liked');
    });
  });
});
