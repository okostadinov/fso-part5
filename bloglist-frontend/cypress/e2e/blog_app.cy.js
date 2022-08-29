const validUser = {
  username: 'okostadinov',
  password: 'admin',
};

const invalidUser = {
  username: 'qwerty123',
  password: '123123123',
};

const testBlog = {
  title: 'cypress',
  url: 'placeholder url',
  likes: 0,
};

const testBlog2 = {
  title: 'cypress 2',
  url: 'another placeholder url',
  likes: 10,
};

describe('Blog App', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.addTestUser(validUser);
    cy.visit('http://localhost:3000');
  });

  describe('before login', () => {
    it('login form is shown', () => {
      cy.contains('login').click();
      cy.contains('log in to application');
      cy.get('#username');
      cy.get('#password');
    });

    describe('trying to login', () => {
      it('work with correct credentials', () => {
        cy.contains('login').click();
        cy.get('#username').type(validUser.username);
        cy.get('#password').type(validUser.password);
        cy.get('#loginBtn').click();
        cy.get('.message').should('contain', 'logged in successfully');
      });

      it('fails with invalid credentials', () => {
        cy.contains('login').click();
        cy.get('#username').type(invalidUser.username);
        cy.get('#password').type(invalidUser.password);
        cy.get('#loginBtn').click();
        cy.get('.message')
          .should('contain', 'invalid username or password')
          .should('have.css', 'color', 'rgb(255, 0, 0)');
      });
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login(validUser);
    });

    it('a blog can be created', () => {
      cy.contains('add blog').click();
      cy.get('#blogForm').should('contain', 'create new');
      cy.get('#title').type(testBlog.title);
      cy.get('#url').type(testBlog.url);
      cy.get('#createBlogBtn').click();
      cy.get('.message').should('contain', 'a new blog cypress was added');
      cy.get('.blog')
        .should('contain', testBlog.title)
        .should('contain', 'Oleg Kostadinov');
    });

    beforeEach(() => {
      cy.addBlog(testBlog);
    });

    it('a blog can be liked', () => {
      cy.get('.blog').contains('view').click();
      cy.get('.like-btn').click();
      cy.get('.blog').should('contain', 'likes 1');
    });

    it('a blog can be deleted', () => {
      cy.get('.blog').contains('view').click();
      cy.get('.delete-btn').click();
      cy.get('.blog').should('not.exist');
    });

    it('blogs should be sorted by likes', () => {
      cy.addBlog(testBlog2);
      cy.get('.blog').eq(0).as('blogOne').contains('view').click();
      cy.get('.blog').eq(1).as('blogTwo').contains('view').click();
      cy.get('@blogOne').should('contain', 'likes 10');
      cy.get('@blogTwo').should('contain', 'likes 0');
      cy.get('@blogOne').get('.delete-btn').click();
      cy.get('@blogTwo').get('.delete-btn').click();
    });
  });
});
