// CAT-TAT.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe('Central de atendimento ao cliente TAT', function(){ //define a suite de teste
   
    beforeEach(()=>{
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function(){ 
        
        cy.title().should('eq','Central de Atendimento ao Cliente TATT') // fornece(yields the documents title as a string)
    })
    it('preenche os campos obrigatórios e envia formulário',()=>{
        const longText = 'testando o delay do teste do default 10 para 0, para rodar rápido'
        cy.get('#firstName')
        .type('Teste')
        
        cy.get('#lastName')
        .type('Testando')
        
        cy.get('#email')
        .type('testando@teste.com')
        
        cy.get('#open-text-area')
        .type(longText, { delay: 0}) //sobreescreve o delay de 10 para 0, diminui o tempo do teste
        
        cy.contains('button', 'Enviar') // primeiro seletor,segundo texto do elemento
        .click()
        cy.get('.success > strong')
        .should('be.visible') // sucess message
    })

    it('exibe mensagem de texto de erro ao submeter o formulário com um emai inválido',()=>{
        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Testando')
        cy.get('#email').type('testandoteste.com')
        cy.get('#open-text-area').type('testandooo')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible') // error message
    })

    it('campo telefone continua vazio quando preenchido com valor não numérico',()=>{
        cy.get('#phone').type('teste').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido',()=>{
        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Testando')
        cy.get('#email').type('testandoteste.com')
        cy.get('#phone-checkbox').check() // torna o telefone obrigatório
        cy.get('#open-text-area').type('testandooo')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible') // error message
    })

    it('preenche e limpa os campos de name,lastname, email e telefone',()=>{
        cy.get('#firstName').type('Teste').should('have.value', 'Teste').clear().should('have.value', '')
        
        cy.get('#lastName')
          .type('Testando')
          .should('have.value', 'Testando')
          .clear().should('have.value', '')
        
        cy.get('#email')
          .type('testando@teste.com')
          .should('have.value', 'testando@teste.com')
          .clear().should('have.value', '')

        cy.get('#phone').type('12345').should('have.value', '12345')
          .clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios',()=>{
        cy.get('button[type="submit"]').click();

        cy.get('.error').should('be.visible') ;// error message
    })

    it('envia o formulário através de comando customizado',()=>{
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success > strong').should('be.visible'); // sucess message
    })

    //selection em menu suspenso (options)
    it('seleciona produto (YouTube) pelo seu texto', ()=>{
        cy.get('#product').select('YouTube').should('have.value', 'youtube');
    })

    it('seleciona produto (Mentoria) pelo seu valor', ()=>{
        cy.get('#product').select('mentoria').should('have.value', 'mentoria');
    })

    it('seleciona produto (Blog) pelo seu indice', ()=>{
        cy.get('#product').select(1).should('have.value', 'blog');
    })

    it('marca o tipo de atendimento "Feedback"', ()=>{
        cy.get('[type="radio"][value="feedback"]').check().should('have.value', 'feedback');
    })

    it('marca cada tipo de atendimento', ()=>{
        cy.get('input[type="radio"]').should('have.length',3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        });
    })

     //check all input type checkbox and uncheck the last one
    
     it('marca ambos checkboxes,depois desmarca o último',()=>{
       cy.get('input[type="checkbox"')
       .as('checkboxes')
       .check()
       .should('be.checked')
       .last()
       .uncheck()
       .should('not.be.checked')
    })

    // how to check checkbox using cypress without uncheking it: 
   /*WHEN USING CLICK IF A INPUT WAS CHECKED THE SECOND CLICK WILL UNCKECK IT
   WHEN USING CHECK IF U USE CHECK 2x it will not uncked THE INPUT IN ORDER TO UNCHECK U
   NEED TO USE THE UNCKECK SO IT IS BETTER TO USE CHECK INSTEAD OF CLICK ON THOSE CASE U
   DONT WANT TO UNCHECK THE INPUT*/

   //selecting files, like when u need to add a file into somewhere
   // we can add more than one file, using an array

   it('seleciona um arquivo da pasta fixtures',()=>{
    cy.get('input[type="file"]').should('not.have.value')
    .selectFile('cypress/fixtures/example.json')
    .should(function(input){
        //console.log(input) here you have access to the obj properties
        expect(input[0].files[0].name).to.equal('example.json')
    })
})
    it('seleciona arquivo que simula drag and drop',()=>{
     cy.get('input[type="file"]')
     .should('not.have.value')
     .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
     .should(function(input){
        expect(input[0].files[0].name).to.equal('example.json')
     })
})
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias',()=>{
        // fixture you dont need to pass the path just the fixture
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
          .selectFile('@sampleFile')
          .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
          })
    })
    it('verifica que a politica de privacidade abre em outra aba sem a necessidade de um clique',()=>{
        //quando o href tem target com valor _blank ele abre o link em nova aba, sendo assim
        // o teste vê apenas se tem esse atributo com esse valor e nao precisa clicar, pois por padrao isso abre outra aba
        cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    })
    it('acessa página política de privacidade removendo o target e entao clicando no link',()=>{
        // ao remover o target e clicar vai abrir agora na mesma aba e não em uma nova e entao o 
        // cypress pode avaliar esta página
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
    })
})