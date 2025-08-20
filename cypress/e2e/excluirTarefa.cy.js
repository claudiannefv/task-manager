describe('excluirTarefa', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  
  })
  it('Excluir tarefa existente', () => {

    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    cy.contains('#loginFormElement > .btn', 'Entrar').click()

    cy.contains(':nth-child(2) > .task-meta > .task-actions-buttons > .btn-danger', 'Excluir').click()
    cy.get('#confirmAction').click()
  })
})