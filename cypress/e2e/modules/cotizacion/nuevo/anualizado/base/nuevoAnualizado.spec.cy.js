describe("VH-Nuevo-Anualizado-General", () => {
    beforeEach(() => {
      cy.fixture("loginData.json").then((credenciales) => {
        cy.log(credenciales.usuario);
        cy.login(credenciales.usuario, credenciales.contraseña);
      });
    });
  
    it.only("VH-Nuevo-Anualizado-General", () => {
      cy.fixture("cotizacion/nuevo/anualizado/base/nuevoAnualizado.json").then(
        (datos) => {
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
          cy.get(":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container")
            .first()
            .click()
            .type(dato.persona.tipoIdentificacion);
  
          cy.get(":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control")
            .type(dato.persona.numeroIdentificacion);
  
          //El vehiculo sí tiene placa
          cy.get("#hasNewPlateYes").click();
  
          cy.get(".col-12.mt-3 > .input-group > .form-floating > .form-control")
            .type(dato.vehiculo.placa);
  
          cy.get(":nth-child(5) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container")
            .first()
            .click()
            .type(dato.uso);
  
          cy.wait(1500);
          cy.get('[style="padding-inline: 23px;"] > .btn').click();
          cy.wait(2000);
  
          cy.contains("Año").parent().find("input").click();
          cy.contains('div[role="option"]', dato.vehiculo.anio).click();
  
          cy.get(".input-iconside > .input-group > .form-floating > .form-control")
            .type(dato.solicitud.valorComercial);
  
          cy.get(":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container")
            .then(($select) => {
              const currentValue = $select.find("input").val();
              if (!currentValue.trim()) {
                cy.get(":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container")
                  .click();
                const genero = dato.persona.genero[0].toUpperCase() + dato.persona.genero.slice(1).toLowerCase();
                cy.contains('div[role="option"]', genero).click();
              }
            });
  
          cy.get(":nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input")
            .type(dato.persona.estadoCivil);
          cy.get(".ng-option-label").first().click();
  
          cy.get(":nth-child(5) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container")
            .type(dato.persona.provinciaResidencia);
          cy.get(".ng-option-label").first().click();
  
          cy.get(":nth-child(5) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container")
            .type(dato.persona.ciudadResidencia);
          cy.get(".ng-option-label").first().click();
  
          cy.get(".row.my-3 > :nth-child(1) > .input-group > .form-floating > .form-control")
            .type(dato.persona.celular);
  
          cy.get(".row.my-3 > :nth-child(2) > .input-group > .form-floating > .form-control")
            .type(dato.persona.correo);
  
          cy.get(".my-3.table-buttons > .btn").click();
  
          //Módulo Pago
          cy.contains("Bronce");
          cy.get(":nth-child(1) > .btn").click();
          cy.get(".hire-modal")
            .should("be.visible")
            .within(() => {
              cy.contains("Facturación");
              cy.contains("¿Los mismos datos del contratante van en la factura?");
            });
          cy.get(".hire-modal > :nth-child(1) > .table-buttons > .btn").click();
          cy.wait(8000);
          cy.get(".form-text-layout")
            .should("be.visible")
            .within(() => {
              cy.contains("¡Link de pago enviado!");
            });
          cy.get(".svg-funciones-copy").click();
          cy.get(".form-control")
            .invoke("val")
            .then((linkPDF) => {
              cy.visit(linkPDF);
            });
          cy.wait(8000);
          cy.fixture("pagos/planNuevoAnualizado.json").then((datos1) => {
            const prueba1 = datos1[1]; // Acceder a la segunda prueba
            const clavePrueba1 = Object.keys(prueba1)[0]; // Obtener la clave (prueba_2)
            const dato1 = prueba1[clavePrueba1];
            cy.get(".form-text-layout")
              .should("be.visible")
              .within(() => {
                cy.contains("Paga tu nuevo seguro vehicular");
              });
  
            cy.get("iframe")
              .its("0.contentDocument")
              .its("body")
              .should("be.visible")
              .within(() => {
                cy.get('input[name="card-holder"]').type("Juan Pérez");
                cy.get('input[name="card-number"]').type("4111111111111111");
                cy.get('input[name="expiry"]').type("12/25");
                cy.get('input[name="cvc"]').type("123");
              });
  
            cy.get("#pg_js_sdk_content")
              .should("be.visible")
              .within(() => {
                cy.log(dato1.pago.nombreTitular);
                cy.get('input[placeholder="Nombre del titular"]').type("Juan Pérez");
              });
          });
        }
      );
    });
  });