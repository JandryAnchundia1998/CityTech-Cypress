Cypress.Commands.add("login", (usuario, contraseña) => {

    cy.visit("http://172.16.1.168:8080/login/sign");
    // cy.visit("http://172.16.1.23/login/sign");
    cy.document().its("readyState").should("eq", "complete");
    cy.get('#floatingInput').type(usuario);
    cy.get(":nth-child(3) > .col-12 > .input-group > .form-floating > .form-control")
      .type(contraseña);
   //cy.get(".login").click();
    cy.get('.btn-large').click();
    cy.get(".justify-content-start > .btn").click();
  });
  
  Cypress.Commands.add("llenarCamposVehiculoUsado", (dato) => {
    cy.get(':nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container')
      .type(dato.tipoIdentificacion).type("{enter}");
    cy.get(":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control")
      .type(dato.numeroIdentificacion);
    cy.get(":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control")
      .type(dato.placa);
    cy.get(":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container")
      .type(dato.uso).type("{enter}");
  });

  import 'cypress-iframe';



  //pagos






// Comando para realizar login
// Cypress.Commands.add('login', (usuario, contraseña) => {
//   cy.visit('http://172.16.1.168/login/sign'); // Cambia esta ruta según tu aplicación
//   cy.get('#usuario').type(usuario); // Selector del campo de usuario
//   cy.get('#contraseña').type(contraseña); // Selector del campo de contraseña
//   cy.get('button[type="submit"]').click(); // Botón de login
//   cy.url().should('not.include', '/login'); // Verificar que no sigues en la página de login
// });

// // Comando para llenar un formulario
// Cypress.Commands.add('llenarFormulario', (datos) => {
//   cy.get('#tipoIdentificacion').select(datos.tipoIdentificacion);
//   cy.get('#numeroIdentificacion').type(datos.numeroIdentificacion);
//   cy.get('#placa').type(datos.placa);
//   cy.get('#uso').select(datos.uso);
// });

// // Comando para validar un estado esperado
// Cypress.Commands.add('verificarEstado', (esperado) => {
//   cy.get('.estado').should('contain.text', esperado);
// });

// Cypress.Commands.add('getIframe', (iframeSelector) => {
//   return cy.get(iframeSelector)
//     .its('0.contentDocument.body')
//     .should('not.be.empty')
//     .then(cy.wrap);
// });

Cypress.Commands.add('clearSession', () => {
  // Limpiar cookies
  cy.clearCookies();
  
  // Limpiar localStorage
  cy.clearLocalStorage();
  
  // Limpiar caché (aunque no es directamente soportado, se puede hacer por extensión del navegador)
  cy.clearAllLocalStorage();
});

Cypress.Commands.add("genero", (etiqueta, genero) => {

  cy.get(etiqueta).should('be.visible').within(()=>{
    cy.contains('Genero').parent().invoke('text').then((text) => {
      // Verificamos si el valor del campo es vacío comparando el texto del input de búsqueda

      const generoU = genero[0].toUpperCase()+ genero.slice(1).toLowerCase();
    
      if(text.trim().replace(/ /g, '').slice(-generoU.length) === generoU){
          cy.contains('Genero').parent().invoke('text').then((el)=>{
            
              expect(el.trim().slice(-generoU.length)).to.equal(generoU);

          });

      }else{

        cy.contains('Genero').parent().invoke('text').then((text1) => {

          if(text1.trim().replace(/ /g, '').slice(-generoU.length) != generoU){

            cy.contains('Genero').parent().find('input').click(); // Abre el select
            cy.get('div[role="option"]').contains(generoU).click(); // Selecciona la opción correspondiente con dato.persona.genero
          }
        });
      }
    });
  });
});