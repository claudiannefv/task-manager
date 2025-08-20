describe('cadastroLogin', () => {
    beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('Cadastrar usuário com dados válidos ', () => {
    cy.contains('[data-tab="register"]' , 'Cadastro').click()
    cy.get('#registerName').click().type('maria')
    cy.get('#registerEmail').click().type('maria@gmail.com')
    cy.get('#registerPassword').click().type('123456')

    cy.contains('#registerFormElement > .btn', 'Cadastrar').click()

  })
  it('Cadastrar usuário com e-mail já existente ', () => {
    cy.contains('[data-tab="register"]' , 'Cadastro').click()
    cy.get('#registerName').click().type('maria12')
    cy.get('#registerEmail').click().type('maria@gmail.com')
    cy.get('#registerPassword').click().type('123456')

    cy.contains('#registerFormElement > .btn', 'Cadastrar').click()

  })
  it('Cadastrar usuário com campos em branco ', () => {
    cy.contains('[data-tab="register"]' , 'Cadastro').click()
    cy.get('#registerName').click().type('jose')
    cy.get('#registerEmail').click().type('aaaa')
    cy.get('#registerPassword').click().type('123456')

    cy.contains('#registerFormElement > .btn', 'Cadastrar').click()

  })
})