describe("VH-Nuevo-Anualizado-soloBronce", () => {
    beforeEach(() => {
      cy.fixture("loginData.json").then((credenciales) => {
        cy.log(credenciales.usuario);
        cy.login(credenciales.usuario, credenciales.contraseña);
      });
    });

    it.only("VH-Nuevo-Anualizado-soloBronce", () => {
        cy.fixture("cotizacion/nuevo/anualizado/nuevoAnualizado_soloBronce.json").then((datos) => {
          const prueba = datos[0]; // Acceder a la segunda prueba
          const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
          const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba
    
          cy.log(`Validando caso: ${dato.caso}`);
    
          // Implementar los pasos del caso
    
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
          cy.wait(2000);
          
          cy.contains('Año').parent().find('input').click();
          cy.contains('div[role="option"]', dato.vehiculo.anio).click();
    
          cy.get(
            ".input-iconside > .input-group > .form-floating > .form-control"
          ).type(dato.solicitud.valorComercial);
    
          cy.get(
            ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
          ).then(($select) => {
            // Verificamos si el valor del campo es vacío comparando el texto del input de búsqueda
            const currentValue = $select.find("input").val();
    
            if (!currentValue.trim()) {
              // Si el campo está vacío
              cy.get(
                ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
              ).click(); // Abre el select
              //cy.get(".ng-option-label").contains(dato.persona.genero).click(); // Selecciona la opción correspondiente con dato.persona.genero
              const genero = dato.persona.genero[0].toUpperCase()+dato.persona.genero.slice(1).toLowerCase();
              cy.contains('div[role="option"]', genero).click(); // Selecciona la opción correspondiente con dato.persona.genero
            }
          });
    
          // cy.get(
          //   ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
          // ).type(dato.persona.genero);
          // cy.get(".ng-option-label").click();
    
          cy.get(
            ":nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input"
          ).type(dato.persona.estadoCivil);
          cy.get(".ng-option-label").click();
    
          cy.get(
            ":nth-child(5) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
          ).type(dato.persona.provinciaResidencia);
          cy.get(".ng-option-label").click();
    
          cy.get(
            ":nth-child(5) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
          ).type(dato.persona.ciudadResidencia);
          cy.get(".ng-option-label").click();
    
          cy.get(
            ".row.my-3 > :nth-child(1) > .input-group > .form-floating > .form-control"
          ).type(dato.persona.celular);
    
          cy.get(
            ".row.my-3 > :nth-child(2) > .input-group > .form-floating > .form-control"
          ).type(dato.persona.correo);
    
          cy.get(".my-3.table-buttons > .btn").click();
        });
      });
  });