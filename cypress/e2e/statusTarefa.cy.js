describe('statusTarefa', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  
  })
  it('Alterar status da tarefa de pendente para concluída ', () => {

    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    cy.contains('#loginFormElement > .btn', 'Entrar').click()

    cy.get(':nth-child(1) > .task-header').click()
    cy.contains(':nth-child(1) > .task-header > .task-checkbox', 'Pendente').click()
    cy.get(':nth-child(1) > .task-header > .task-checkbox > input').click()

  })
  
})