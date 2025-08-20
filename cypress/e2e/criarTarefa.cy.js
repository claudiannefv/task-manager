describe('criarTarefa', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  
  })

  it('Criar tarefa com título e descrição válidos ', () => {

    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    cy.contains('#loginFormElement > .btn', 'Entrar').click()
    
   cy.contains('#addTaskBtn', 'Nova Tarefa').click()

    cy.get('#taskTitle').click().type('Entregar portfólio')
    cy.get('#taskDescription').click().type('Entregar portfólio pessoal da mentoria')
    cy.get('#taskDueDate').click().type('2025-08-21T22:00')
   
    cy.contains('.modal-actions > .btn-primary', 'Salvar').click()
  })
  
  it('Criar tarefa com data de vencimento inválida ', () => {

    cy.get('#loginEmail').click().type('maria@gmail.com')
    cy.get('#loginPassword').click().type('123456')
    cy.contains('#loginFormElement > .btn', 'Entrar').click()
   
    cy.contains('#addTaskBtn', 'Nova Tarefa').click()

    cy.get('#taskTitle').click().type('modulo 7')
    cy.get('#taskDescription').click().type('revisar módulo completo')
    cy.get('#taskDueDate').click().type('2025-09-31T22:00')
   
    cy.contains('.modal-actions > .btn-primary', 'Salvar').click()
  })
})
