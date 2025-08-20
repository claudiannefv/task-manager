describe('excluirTodasAsTarefas', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  
  })
  it('Excluir todas as tarefa existentes', () => {

    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    cy.contains('#loginFormElement > .btn', 'Entrar').click()

    cy.contains('#deleteAllBtn', 'Excluir Todas').click()
    cy.get('#confirmAction').click()
  })
  it('Excluir todas quando não houver tarefa existente', () => {

    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    cy.contains('#loginFormElement > .btn', 'Entrar').click()

    cy.contains('#deleteAllBtn', 'Excluir Todas').click()
    cy.get('#confirmAction').click()
  })
})