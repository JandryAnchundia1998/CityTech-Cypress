describe("Suscripcion Vehículo Usado", () => {
  beforeEach(() => {
    cy.fixture("loginData.json").then((credenciales) => {
      cy.login(credenciales.usuario, credenciales.contraseña);
    });
  });

  // Debe validar el flujo para vehículo usado con placa válida y cédula válida + accesorios + contratanteAsegurado
  it.only("Debe validar el flujo para vehículo usado con placa válida y cédula válida + accesorios + contratanteAsegurado", () => {
    cy.fixture("vehiculoUsado/suscripcion.json").then((datos) => {
      const prueba = datos[0]; // Acceder a la primera prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_1)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      //Click en nuevo
      cy.get("#ngb-nav-1 > .d-flex").click();
      //Click en Suscripcion
      cy.get('#subsQuoteYes').click()

      // Selección y llenado de campos
      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);
      //Click en no tiene placa
      cy.get("#hasNewPlateNo").click();

      cy.get(".ng-select-searchable > .ng-select-container").type(
        dato.persona.provinciaResidencia
      );
      cy.get(".ng-option-label").click();

      cy.get(
        ":nth-child(5) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container"
      )
        .type(dato.uso)
        .click();

      cy.wait(1500);
      cy.get('[style="padding-inline: 23px;"] > .btn').click();
      cy.wait(3000);

      //LENAR CAMPOS DE VEHICULO SIN PLACA
      cy.get(
        ":nth-child(2) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
      ).type("MAZDA");
      cy.get(".ng-option-label").click();

      cy.wait(1000);
      // Abre el dropdown del campo "Modelo"
      cy.get(
        ":nth-child(2) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
      ).click(); // Abre el dropdown

      // Selecciona la opción "2" del dropdown
      cy.get(".ng-option-label").contains("2").click(); // Selecciona la opción que contiene el texto "2"

      cy.get(
        ".ng-invalid.ng-dirty > .mt-3 > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input"
      ).type("2015");
      cy.get(".ng-option-label").click();

      cy.get(
        ".input-iconside > .input-group > .form-floating > .form-control"
      )
        .clear()
        .type(dato.solicitud.caso_1.valorComercial);

      // Subcaso 4: Completas campos - Solictud
        cy.get(
          ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
        )
          .invoke("text")
          .then((text) => {
            // Si el texto está vacío, llena el campo
            if (!text.trim()) {
              // Si está vacío, se puede realizar el tipo (en este caso con 'dato.persona.genero')
              cy.get(
                ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
              ).click(); // Abre el select
              cy.get(".ng-option-label").contains(dato.persona.genero).click(); // Selecciona la opción correspondiente
            }
          });

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


        //cLICK EN CONTINUAR 

        cy.get('.btn').click()
      
    });
  });
});
