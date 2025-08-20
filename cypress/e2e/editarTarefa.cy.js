describe('editarTarefa', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  
  })
  it('Editar título e descrição de tarefa existente', () => {

    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    cy.contains('#loginFormElement > .btn', 'Entrar').click()

    cy.contains(':nth-child(1) > .task-meta > .task-actions-buttons > .btn-secondary', 'Editar').click()

    cy.get('#taskTitle').click().clear().type('Entregar portfólio!')
    cy.get('#taskDescription').click().clear().type('Preciso Entregar portfólio pessoal da mentoria')
    cy.get('#taskDueDate').click().clear().type('2025-08-22T22:00')
   
    cy.contains('.modal-actions > .btn-primary', 'Salvar').click()
  })
})