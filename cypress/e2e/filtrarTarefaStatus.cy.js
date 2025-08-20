describe('filtrarTarefaStatus', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })
  it('Filtrar tarefas por status pendente ', () => {
    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    
    cy.contains('#loginFormElement > .btn', 'Entrar').click()

    cy.contains('#statusFilter', 'Todas as tarefas').select()
    cy.contains('#statusFilter', 'Pendentes').click()
  })
})