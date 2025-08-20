describe('login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })
  it('Fazer login com dados de usuário cadastrado ', () => {
    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    
    cy.contains('#loginFormElement > .btn', 'Entrar').click()
  })
  it('Fazer login com senha incorreta ', () => {
    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('654321')
    
    cy.contains('#loginFormElement > .btn', 'Entrar').click()
  })
  it('Fazer login com e-mail não cadastrado ', () => {
    cy.get('#loginEmail').click().type('lara@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    
    cy.contains('#loginFormElement > .btn', 'Entrar').click()
  })

})
