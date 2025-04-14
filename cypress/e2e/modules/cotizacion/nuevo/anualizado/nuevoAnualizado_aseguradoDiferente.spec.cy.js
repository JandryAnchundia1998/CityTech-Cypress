describe("VH-Nuevo-Anualizado-aseguradoDiferente", () => {
    beforeEach(() => {
        cy.clearSession();
      cy.fixture("loginData.json").then((credenciales) => {
        cy.log(credenciales.usuario);
        cy.login(credenciales.usuario, credenciales.contraseña);
      });
    });
  
    it.only("VH-Nuevo-Anualizado-aseguradoDiferente", () => {
        cy.fixture("cotizacion/nuevo/anualizado/nuevoAnualizado_accesorios_aseguradoDiferente.json").then((datos) => {
            const prueba = datos[0]; // Acceder a la primera prueba
            const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_1)
            const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba
      
            cy.log(`Validando caso: ${dato.caso}`);
            
             //Click en nuevo
             cy.get("#ngb-nav-1 > .d-flex").click();
             //Click en anualizado
             cy.get("#ngb-nav-1 > .d-flex").click();
       
             // Selección y llenado de campos
             cy.get(
               ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
             )
               .type(dato.persona.tipoIdentificacion)
               .click();
       
             cy.get(
               ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
             ).type(dato.persona.numeroIdentificacion);
       
             //El vehiculo sí tiene placa
             cy.get("#hasNewPlateYes").click();
       
             cy.get(
               ".col-12.mt-3 > .input-group > .form-floating > .form-control"
             ).type(dato.vehiculo.placa);
       
             cy.get(
               ":nth-child(5) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container"
             )
               .type(dato.uso)
               .click();
      
      
            cy.wait(1500);
            cy.get('[style="padding-inline: 23px;"] > .btn').click();
            cy.wait(3000);
      
            
            // Validar subcasos
            // Subcaso 1: Validar que los campos corresponden a la placa del caso
            if (
              dato.solicitud.caso_1.caso ==
              "Validar que los campos corresponden a la placa del caso"
            ) {
              cy.log(`<--Subcaso-->: ${dato.solicitud.caso_1.caso}`)
              const marcaV = dato.vehiculo.marca[0].toUpperCase()+dato.vehiculo.marca.slice(1).toLowerCase();
              //cy.get(
                //":nth-child(2) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-value"
              //).should("contain.text", dato.vehiculo.marca);
              cy.contains('Marca').parent()
              .should('include.text', marcaV);
      
              cy.get(
                ".mt-3 > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-value"
              ).should("contain.text", dato.vehiculo.anio);
      
              //cy.get(
                //":nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-value"
              //).should("contain.text", dato.vehiculo.modelo);
              const modeloV = dato.vehiculo.modelo[0].toUpperCase()+dato.vehiculo.modelo.slice(1).toLowerCase();
              cy.contains('Modelo').parent()
              .should('include.text', modeloV);
      
              cy.get(
                ".input-iconside > .input-group > .form-floating > .form-control"
              )
                .clear()
                .type(dato.solicitud.caso_1.valorComercial);
            }
            
            // Subcaso 4: Completas campos - Solictud
            if (dato.contratante.caso_1.caso === "Completar campos obligatorios") {
              //Condicional clave
      
              //cy.get('[formgroupname="contractingPerson"]')
              
              cy.genero('[formgroupname="contractingPerson"]', dato.persona.genero);
      
              cy.get(
                '[formgroupname="contractingPerson"] > :nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container'
              ).type(dato.persona.estadoCivil);
              cy.get(".ng-option-label").click();
      
              cy.get(
                ":nth-child(5) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
              ).type(dato.persona.provinciaResidencia);
              cy.get(".ng-option-label").click();
      
              cy.get(
                ":nth-child(5) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
              ).type(dato.persona.ciudadResidencia);
              cy.get(".ng-option-label").click();
      
              cy.get(
                ".row.my-3 > :nth-child(1) > .input-group > .form-floating > .form-control"
              ).type(dato.persona.celular);
      
              cy.get(
                ".row.my-3 > :nth-child(2) > .input-group > .form-floating > .form-control"
              ).type(dato.persona.correo);
            }
      
            // Subcaso: Check -> persona asegura diferente y llenado de datos
            if (
              dato.contratante.caso_2.caso === "Check -> persona asegura diferente"
            ) {
            
              cy.get('form.ng-dirty > :nth-child(4) > div > .form-check-label').click();
      
              cy.get(
                "div.ng-pristine > .row > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
              ).type(dato.personaAsegurar.tipoIdentificacion);
              cy.get(".ng-option-label").click();
      
              cy.get(
                '[formgroupname="InsuredPersonData"] > .row > .custom-textbox > .input-group > .form-floating > .form-control'
              ).type(dato.personaAsegurar.numeroIdentificacion);
      
              cy.get(
                '[formgroupname="InsuredPersonData"] > :nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container'
              ).type(dato.personaAsegurar.nacionalidad);
              cy.get(".ng-option-label").click();
      
              cy.get(
                ":nth-child(6) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
              ).type(dato.personaAsegurar.provinciaResidencia);
              cy.get(".ng-option-label").click();
      
              cy.get(
                ":nth-child(6) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
              ).type(dato.personaAsegurar.ciudadResidencia);
              cy.get(".ng-option-label").click();
      
              
             cy.genero('form.ng-dirty > .ng-invalid.ng-touched', dato.personaAsegurar.genero);

      
              cy.get(
                ":nth-child(7) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
              ).type(dato.personaAsegurar.relacion);
              cy.get(".ng-option-label").click();
      
              cy.get(
                ":nth-child(7) > .custom-textbox > .input-group > .form-floating > .form-control"
              ).type(dato.personaAsegurar.direccion);
      
              cy.get(
                ":nth-child(8) > :nth-child(1) > .input-group > .form-floating > .form-control"
              ).type(dato.personaAsegurar.celular);
      
              cy.get(
                ":nth-child(8) > :nth-child(2) > .input-group > .form-floating > .form-control"
              ).type(dato.personaAsegurar.correo);
      
              cy.get(".my-3.table-buttons > .btn").click();
            }
          });
    });
  });