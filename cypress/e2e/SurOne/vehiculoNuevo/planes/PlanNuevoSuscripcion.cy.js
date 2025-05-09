describe("Nuevo Suscripcion - Planes", () => {
  beforeEach(() => {
    cy.fixture("loginData.json").then((credenciales) => {
      cy.login(credenciales.usuario, credenciales.contraseña);
    });
  });
  // Debe validar el flujo para vehículo usado con placa válida y cédula válida + accesorios + contratanteAsegurado
  it("Debe validar el flujo para vehículo usado con placa válida y cédula válida + accesorios + contratanteAsegurado", () => {
    cy.fixture("planes/planNuevoSuscripcion.json").then((datos) => {
      const prueba = datos[0]; // Acceder a la primera prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_1)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);
      
       //Click en nuevo
       cy.get("#ngb-nav-1 > .d-flex").click();
       //Click en suscripcion
       cy.get('#subsQuoteYes').click();
 
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
      cy.wait(6000);

      // Validar subcasos
      // Subcaso 1: Validar que los campos corresponden a la placa del caso
      if (
        dato.solicitud.caso_1.caso ==
        "Validar que los campos corresponden a la placa del caso"
      ) {
        cy.log(`<--Subcaso-->: ${dato.solicitud.caso_1.caso}`);

        const marcaV = dato.vehiculo.marca[0].toUpperCase() + dato.vehiculo.marca.slice(1).toLowerCase();
        cy.get(
          ":nth-child(2) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-value"
        ).should("contain.text", marcaV);

        cy.get(
          ".mt-3 > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-value"
        ).should("contain.text", dato.vehiculo.anio);

        const modeloV = dato.vehiculo.modelo[0].toUpperCase() + dato.vehiculo.modelo.slice(1).toLowerCase();
        cy.get(
          ":nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-value"
        ).should("contain.text", modeloV);

        cy.get(
          ".input-iconside > .input-group > .form-floating > .form-control"
        )
          .clear()
          .type(dato.solicitud.caso_1.valorComercial);
      }

      // Subcaso 2: Validar accesorios - caso positivo
      if (
        dato.solicitud.caso_2.caso ===
        "Validar accesorios - caso positivo [Dentro del 20% (3000)]"
      ) {
        cy.log(`<--Subcaso-->: ${dato.solicitud.caso_2.caso}`);

        cy.get(
          "div.ng-dirty > .radiocheck-content > div > .form-check-label"
        ).click();

        const accesorios = dato.solicitud.caso_2.accesorios;

        //Validar accesorios - caso positivo [Dentro del 20% (3000)]

        // Ingresar el primer accesorio (artículo 1)
        cy.get(
          ":nth-child(1) > .col-12 > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input"
        ).type(accesorios.articulo_1); // Ingresar el nombre del accesorio
        cy.get(".ng-option-label").click(); // Seleccionar el accesorio de las opciones

        // Ingresar el valor del primer accesorio
        cy.get('.custom-textbox > .form-control')
          .click()
          .type(accesorios.valor_1); // Ingresar el valor del primer accesorio

        // Hacer clic en "Añadir accesorio"
        cy.get('[formgroupname="newRisk"] > .table-buttons > .btn').click();

        // Ingresar el segundo accesorio (artículo 2)
        cy.get(
          "div.ng-pristine > .my-3 > :nth-child(1) > .col-12 > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input"
        ).type(accesorios.articulo_2); // Ingresar el nombre del accesorio
        cy.get(".ng-option-label").click(); // Seleccionar el accesorio de las opciones

        // Ingresar el valor del segundo accesorio
        cy.get(
          ".ng-invalid.ng-touched > .my-3 > .row > :nth-child(2) > .input-iconside > .custom-textbox > .form-control"
        )
          .click()
          .type(accesorios.valor_2); // Ingresar el valor del segundo accesorio

        /********* Valores coinciden correctamente***********/
        const sumaValoresIngresados =
          parseFloat(accesorios.valor_1) + parseFloat(accesorios.valor_2);

        console.log("Suma de valores ingresados:", sumaValoresIngresados);

        cy.get(':nth-child(1) > .center-items > .info-card')
          .invoke("text") // Extrae el texto completo del elemento
          .then((text) => {
            const numeroExtraido = parseFloat(text.match(/\d+/g).join("")); // Extraer todos los dígitos y convertirlos a número
            cy.log(`Número extraído: ${numeroExtraido}`); // Imprime el número completo en los logs

            // Validar que la suma coincida con el número extraído
            expect(numeroExtraido).to.equal(sumaValoresIngresados);
          });
      }

      // Subcaso 3: Validar total de precio de accesorios + valorComercial = 18000
      if (
        dato.solicitud.caso_3.caso ===
        "Validar total de precio de accesorios + valorComercial = 18000"
      ) {
        cy.log(`<--Subcaso-->: ${dato.solicitud.caso_3.caso}`);

        const accesorios = dato.solicitud.caso_2.accesorios;

        const sumaValorTotal =
          parseFloat(accesorios.valor_1) +
          parseFloat(accesorios.valor_2) +
          parseFloat(dato.solicitud.caso_1.valorComercial);
        cy.get('.col-12.center-items > .info-card')
          .invoke("text") // Extrae el texto completo del elemento
          .then((text) => {
            const numeroExtraido = parseFloat(text.match(/\d+/g).join("")); // Extraer todos los dígitos y convertirlos a número
            cy.log(`Número extraído: ${numeroExtraido}`); // Imprime el número completo en los logs
            // Validar que la suma coincida con el número extraído
            expect(numeroExtraido).to.equal(sumaValorTotal);
          });
      }

      // Subcaso 4: Completas campos - Solictud
      if (dato.contratante.caso_1.caso === "Completar campos obligatorios") {
        //Condicional clave

        cy.get(
          ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
        ).type(dato.persona.genero);
        cy.get(".ng-option-label").click();

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
        cy.get(
          ".ng-submitted > :nth-child(4) > div > .form-check-label"
        ).click();

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

        cy.get(
          '[formgroupname="InsuredPersonData"] > :nth-child(5) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container'
        ).type(dato.personaAsegurar.genero);
        cy.get(".ng-option-label").click();

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

  it("VH-Nuevo-Suscripcion - No existe plan plata ni Bronce", () => {
    cy.fixture("planes/planNuevoSuscripcion.json").then((datos) => {
      const prueba = datos[1]; // Acceder a la segunda prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso

       //Click en nuevo
       cy.get("#ngb-nav-1 > .d-flex").click();
       //Click en sus
       cy.get('#subsQuoteYes').click();
 
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

        //LENAR CAMPOS DE VEHICULO SIN PLACA
        // cy.get(
        //   ":nth-child(2) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
        // ).type("MAZDA");
        // cy.get(".ng-option-label").click();
  
        // cy.wait(1000);
        // // Abre el dropdown del campo "Modelo"
        // cy.get(
        //   ":nth-child(2) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
        // ).click(); // Abre el dropdown
  
        // // Selecciona la opción "2" del dropdown
        // cy.get(".ng-option-label").contains("2").click(); // Selecciona la opción que contiene el texto "2"
  
        // cy.get(
        //   ".ng-invalid.ng-dirty > .mt-3 > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input"
        // ).type("2015");
        // cy.get(".ng-option-label").click();
  
        cy.get(
          ".input-iconside > .input-group > .form-floating > .form-control"
        )
          .clear()
          .type(dato.solicitud.valorComercial);
  


      ////************ */

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
          const generoP = dato.persona.genero[0].toUpperCase() + dato.persona.genero.slice(1).toLowerCase();
          cy.get(
            ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
          ).click(); // Abre el select
          //cy.get(".ng-option-label").contains(dato.persona.genero).click(); // Selecciona la opción correspondiente con dato.persona.genero
          cy.contains('div[role="option"]', generoP).click();
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

  it("VH-Nuevo-Suscripcion-Oro-2", () => {
    cy.fixture("planes/planNuevoSuscripcion.json").then((datos) => {
      const prueba = datos[2]; // Acceder a la segunda prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso

       //Click en nuevo
       cy.get("#ngb-nav-1 > .d-flex").click();
       //Click en suscripcion
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
          const genero2 = dato.persona.genero[0].toUpperCase() + dato.persona.genero.slice(1).toLowerCase();
          cy.get(
            ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
          ).click(); // Abre el select
          //cy.get(".ng-option-label").contains(dato.persona.genero).click(); // Selecciona la opción correspondiente con dato.persona.genero
          cy.contains('div[role="option"]', genero2).click();
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


  // CUANDO NO TIENE TIENE PLACA

  it("VH-Usado-Suscripcion - No existe plan plata ni Bronce", () => {
    cy.fixture("planes/planNuevoSuscripcion.json").then((datos) => {
      const prueba = datos[3]; // Acceder a la segunda prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
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
          .type(dato.solicitud.valorComercial);
  


      ////************ */

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
          const genero3 = dato.persona.genero[0].toUpperCase() + dato.persona.genero.slice(1).toLowerCase();
          cy.get(
            ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
          ).click(); // Abre el select
          //cy.get(".ng-option-label").contains(dato.persona.genero).click(); // Selecciona la opción correspondiente con dato.persona.genero
          cy.contains('div[role="option"]', genero3).click();
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

  // CUANDO TIENE PLACA Y ES ORO
  it("VH-Nuevo-Suscripcion - General", () => {
    cy.fixture("planes/planNuevoSuscripcion.json").then((datos) => {
      const prueba = datos[4]; // Acceder a la segunda prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
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
          .type(dato.solicitud.valorComercial);
  


      ////************ */

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
          const genero4 = dato.persona.genero[0].toUpperCase() + dato.persona.genero.slice(1).toLowerCase();
          cy.get(
            ":nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
          ).click(); // Abre el select
          //cy.get(".ng-option-label").contains(dato.persona.genero).click(); // Selecciona la opción correspondiente con dato.persona.genero
          cy.contains('div[role="option"]', genero4).click();
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
