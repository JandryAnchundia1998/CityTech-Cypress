describe("Anualizado Vehículo Usado", () => {
  beforeEach(() => {
    cy.fixture("loginData.json").then((credenciales) => {
      cy.login(credenciales.usuario, credenciales.contraseña);
    });
  });

   // Debe validar el flujo para vehículo usado con placa válida y cédula válida + accesorios + contratanteAsegurado
   it("Debe validar el flujo para vehículo usado con placa válida y cédula válida + accesorios + contratanteAsegurado", () => {
    cy.fixture("vehiculoUsado/suscripcion.json").then((datos) => {
      const prueba = datos[0]; // Acceder a la primera prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_1)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Selección y llenado de campos
      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
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
        cy.get('.custom-textbox > .form-control').click().type(accesorios.valor_1); // Ingresar el valor del primer accesorio

        // Hacer clic en "Añadir accesorio"
        cy.get('[formgroupname="newRisk"] > .table-buttons > .btn').click();

        // Ingresar el segundo accesorio (artículo 2)
        cy.get(
          "div.ng-pristine > .my-3 > :nth-child(1) > .col-12 > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input"
        ).type(accesorios.articulo_2); // Ingresar el nombre del accesorio
        cy.get(".ng-option-label").click(); // Seleccionar el accesorio de las opciones

        // Ingresar el valor del segundo accesorio
        cy.get('.ng-invalid.ng-touched > .my-3 > .row > :nth-child(2) > .input-iconside > .custom-textbox > .form-control').click().type(accesorios.valor_2); // Ingresar el valor del segundo accesorio

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
        cy.get(':nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container')
        .invoke('text')
        .then((text) => {
          // Si el texto está vacío, llena el campo
          if (!text.trim()) {
            // Si está vacío, se puede realizar el tipo (en este caso con 'dato.persona.genero') 
            cy.get(':nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container')
              .click(); // Abre el select
            cy.get(".ng-option-label").contains(dato.persona.genero).click(); // Selecciona la opción correspondiente
          }
        });
      

        cy.get('[formgroupname="contractingPerson"] > :nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container')
        .type(dato.persona.estadoCivil);
        cy.get(".ng-option-label").click();

        cy.get(':nth-child(5) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container')
        .type(dato.persona.provinciaResidencia);
        cy.get(".ng-option-label").click();

        cy.get(':nth-child(5) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container')
        .type(dato.persona.ciudadResidencia);
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

        cy.get('[formgroupname="InsuredPersonData"] > .row > .custom-textbox > .input-group > .form-floating > .form-control').type(dato.personaAsegurar.numeroIdentificacion);

        cy.get(
          ".ng-invalid.ng-touched > :nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input"
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
          ".ng-invalid.ng-dirty > :nth-child(5) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
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

      // Subcaso 3: Validar accesorios - caso negativo
      // if (
      //   dato.solicitud.caso_3.caso ===
      //   "Validar accesorios - caso negativo [supera el 20% (3001)]"
      // ) {
      //   cy.log(`<--Subcaso-->: ${dato.solicitud.caso_3.caso}`);

      //   const accesorios = dato.solicitud.caso_3.accesorios;

      //   cy.get(
      //     ':nth-child(1) > .col-12 > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input'
      //   ).type(accesorios.articulo_1);
      // }
    });
  });

  // Caso 2: Vehículo usado con placa
  it("Vehículo usado con Placa válida y Cédula válida", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[1]; // Acceder a la segunda prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso

      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
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
    });
  });

  // Caso 2:
  it("1.- Incumplimiento de Formato - Vehículo usado con Placa inválida y Cédula inválida", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[2];
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_3)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso

      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.uso)
        .click();

      cy.get(":nth-child(4) > .col-12 > .text-alert > span").should(
        "contain.text",
        "Ingresa un número de documento válido"
      );

      cy.get(":nth-child(5) > .col-12 > .text-alert > span").should(
        "contain.text",
        "Ingresa una placa válida"
      );

      cy.get('[style="padding-inline: 23px;"] > .btn').click();
    });
  });

  it("2.- Validacion de placa - Vehículo usado con Placa mayor a 20 años ->1993", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[3];
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_3)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso
      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.uso)
        .click();

      cy.get('[style="padding-inline: 23px;"] > .btn > span').click();
      cy.contains('Verificar').click();

      cy.wait(2000);
      
      cy.window().then((win) => {
        const bodyText = win.document.body.innerText;
        expect(bodyText).to.include(
          "El vehículo no cumple con las políticas para ser asegurado"
        );
        expect(bodyText).to.include("CÓDIGO: S3");
      });
    });
  });

  it.only("3.- Validacion de placa poliza vigente", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[4];
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_3)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso
      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.uso)
        .click();

      cy.get('[style="padding-inline: 23px;"] > .btn').click();
      cy.contains('Verificar').click();
      cy.wait(2000);

      cy.window().then((win) => {
        const bodyText = win.document.body.innerText;
        expect(bodyText).to.include(
          "La placa esta asociada a una póliza vigente hasta 14/09/2025. Para renovar, por favor comunícate con tu asesor comercial."
        );
        expect(bodyText).to.include("CÓDIGO: S10");
      });
    });
  });

  it("4.- Validación vehiculo riesgoso", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[5]; // Acceder a la segunda prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso

      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.uso)
        .click();

      cy.wait(1500);
      cy.get('[style="padding-inline: 23px;"] > .btn').click();
      cy.wait(2000);

      cy.get(
        ".input-iconside > .input-group > .form-floating > .form-control"
      ).type(dato.solicitud.valorComercial);

      const estadoCivil = dato.persona.estadoCivil[0].toUpperCase() + dato.persona.estadoCivil.slice(1).toLowerCase();

      cy.get(
        ":nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input"
      ).type(estadoCivil);
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

      cy.contains('Genero').parent().find('input').click();
      cy.get('div[role="option"]').contains('Masculino').click();
      
      cy.get(".my-3.table-buttons > .btn").click();
      cy.wait(2000);

      cy.window().then((win) => {
        const bodyText = win.document.body.innerText;
        expect(bodyText).to.include(
          "De acuerdo a nuestro análisis y tomando en cuenta la situación actual del país, el vehículo que deseas cotizar no cumple con las políticas asegurables de la compañía."
        );
        expect(bodyText).to.include("CÓDIGO: S12");
      });
    });
  });

  it("5.- Validacion campos vacios", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[6]; // Acceder a la segunda prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso

      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.uso)
        .click();

      cy.wait(1500);
      cy.get('[style="padding-inline: 23px;"] > .btn').click();
      cy.wait(2000);

      cy.get(".my-3.table-buttons > .btn").click();

      cy.wait(2000);

      cy.window().then((win) => {
        const bodyText = win.document.body.innerText;
        expect(bodyText).to.include("Completa todos los campos solicitados");
      });
    });
  });

  it("6.- Formulario - Incumplimiento de formato", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[7]; // Acceder a la segunda prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_2)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso

      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
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

      cy.get('.application-content').should('be.visible').within(() => {
        cy.contains("Ingrese un celular válido").should('be.visible');
        cy.contains("Ingresa un correo válido").should('be.visible');
      });

      /*cy.get(".text-alert > p").should(
        "contain.text",
        "Ingrese un celular válido"
      );*/

      /*cy.get(".row.my-3 > :nth-child(2) > .text-alert > span").should(
        "contain.text",
        "Ingresa un correo válido"
      );*/

      /*cy.get(".mt-3 > :nth-child(2) > .text-alert > span").should(
        "contain.text",
        "Ingresa un valor válido"
      );*/

      //El tema de que cuando se ahregue un accesorio extra debe tener la misma validacion
    });
  });

  it("7.- Planes - Validacion de contratante", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[8];
      const clavePrueba = Object.keys(prueba)[0];
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Implementar los pasos del caso

      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.uso)
        .click();

      cy.wait(1500);
      cy.get('[style="padding-inline: 23px;"] > .btn').click();
      cy.wait(2000);
      
      const marcaV = dato.vehiculo.marca[0].toUpperCase() + dato.vehiculo.marca.slice(1).toLowerCase();

      cy.contains('Marca').parent().invoke('text').should('include', marcaV);
      cy.contains('Modelo').parent().invoke('text').should('include', dato.vehiculo.modelo);
      cy.contains('Año').parent().invoke('text').should('include', dato.vehiculo.anio);

      cy.get(
        ".input-iconside > .input-group > .form-floating > .form-control"
      ).type(dato.solicitud.valorComercial);

      const genero11 = dato.persona.genero[0].toUpperCase() + dato.persona.genero.slice(1).toLowerCase();

      cy.get(':nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container').click();
      cy.get('div[role="option"]').contains(genero11).click();

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

      //Dar click en Continuar
      cy.wait(1500);
      cy.get(".my-3.table-buttons > .btn").click();
      cy.wait(3000);

      cy.get(':nth-child(1) > .policy-card-content > mf-security-policy-plan-card > .border-card > .card > .card-format').should('be.visible').within(()=>{
        cy.contains('Contratar').parent()
        .click();
      });
      cy.wait(2000);



      cy.window().then((win) => {
        const bodyText = win.document.body.innerText;
        expect(bodyText).to.include(
          "La cédula del contratante tiene inconvenientes, por favor comunícate con tu asesor comercial para iniciar el proceso de desbloqueo de tu cliente. Una vez desbloqueado, puedes continuar con su contratación en el módulo de negocios."
        );
        expect(bodyText).to.include("CÓDIGO: S2");
 
      });

    });
  });

  // Debe validar 8.- Planes - Validación de asegurado
  it("8.- Planes - Validación de asegurado", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[9]; // Acceder a la primera prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_1)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Selección y llenado de campos
      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);

      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.uso)
        .click();

      cy.wait(1500);
      cy.get('[style="padding-inline: 23px;"] > .btn').click();
      cy.wait(3000);

      // Llenar Valor Comercial -> Nuevo Riesgo
      cy.get(".input-iconside > .input-group > .form-floating > .form-control")
        .clear()
        .type(dato.solicitud.valorComercial);

      // Llenar Campos -> Persona Contratante

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

      const genero12 = dato.persona.genero[0].toUpperCase() + dato.persona.genero.slice(1).toLowerCase();

      cy.get(':nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container').click();
      cy.get('div[role="option"]').contains(genero12).click();

      //Click en el check de: Diferente Contratante
      cy.get("form.ng-dirty > :nth-child(4) > div > .form-check-label").click();

      //LLenar campos de: Persona a Asegurar

      cy.get(
        "div.ng-pristine > .row > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
      ).type(dato.personaAsegurar.tipoIdentificacion);
      cy.get(".ng-option-label").click();

      cy.get('[formgroupname="InsuredPersonData"] > .row > .custom-textbox > .input-group > .form-floating > .form-control').type(dato.personaAsegurar.numeroIdentificacion);

      const nacionalidad1 = dato.personaAsegurar.nacionalidad[0].toUpperCase() + dato.personaAsegurar.nacionalidad.slice(1).toLowerCase();

      cy.get('[formgroupname="InsuredPersonData"] > :nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input').click();
      cy.get('div[role="option"]').contains(nacionalidad1).click();

      cy.get(
        ":nth-child(6) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
      ).type(dato.personaAsegurar.provinciaResidencia);
      cy.get(".ng-option-label").click();

      cy.get(
        ":nth-child(6) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
      ).type(dato.personaAsegurar.ciudadResidencia);
      cy.get(".ng-option-label").click();

      

      const relacionF = dato.personaAsegurar.relacion[0].toUpperCase() + dato.personaAsegurar.relacion.slice(1).toLowerCase();

      cy.get(':nth-child(7) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container').click();
      cy.get('div[role="option"]').contains(relacionF).click();

      cy.get(
        ":nth-child(7) > .custom-textbox > .input-group > .form-floating > .form-control"
      ).type(dato.personaAsegurar.direccion);

      cy.get(
        ":nth-child(8) > :nth-child(1) > .input-group > .form-floating > .form-control"
      ).type(dato.personaAsegurar.celular);

      cy.get(
        ":nth-child(8) > :nth-child(2) > .input-group > .form-floating > .form-control"
      ).type(dato.personaAsegurar.correo);

      //Dar click en Continuar
      cy.wait(1500);
      cy.get(".my-3.table-buttons > .btn").click();
      cy.wait(3000);

            // cy.get(':nth-child(2) > .subtitle')
      // .should("contain.text", `${dato.persona.nombre} está muy cerca de asegurar su ${dato.vehiculo.marca} ${dato.vehiculo.modelo}`);

      cy.get(':nth-child(2) > .policy-card-content > mf-security-policy-plan-card > .border-card > .card > .m-4 > .text-header > .btn-content > .table-buttons > :nth-child(1) > .btn').click()

      cy.wait(2500)
      cy.window().then((win) => {c
        const bodyText = win.document.body.innerText;
        expect(bodyText).to.include(
          "La cédula del asegurado tiene inconvenientes, por favor comunícate con tu asesor comercial para iniciar el proceso de desbloqueo de tu cliente. Una vez desbloqueado, puedes continuar con su contratación en el módulo de negocios."
        );
        expect(bodyText).to.include("CÓDIGO: S7");
 
      });
    });
  });


  // 9.- Planes - Validación de 90k
  it("9.- Planes - Validación de 90k", () => {
    cy.fixture("vehiculoUsado/anualizado.json").then((datos) => {
      const prueba = datos[10]; // Acceder a la primera prueba
      const clavePrueba = Object.keys(prueba)[0]; // Obtener la clave (prueba_1)
      const dato = prueba[clavePrueba]; // Acceder a los datos de la prueba

      cy.log(`Validando caso: ${dato.caso}`);

      // Selección y llenado de campos
      cy.get(
        ":nth-child(3) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.persona.tipoIdentificacion)
        .click();

      cy.get(
        ":nth-child(4) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.persona.numeroIdentificacion);

      cy.get(
        ":nth-child(5) > .col-12 > .input-group > .form-floating > .form-control"
      ).type(dato.vehiculo.placa);


      cy.get(
        ":nth-child(6) > .col-12 > .container-ngselect-icon > .ng-select > .ng-select-container > .ng-value-container"
      )
        .type(dato.uso)
        .click();

      cy.wait(1500);
      cy.get('[style="padding-inline: 23px;"] > .btn').click();
      cy.wait(3000);

      const marcaV = dato.vehiculo.marca[0].toUpperCase() + dato.vehiculo.marca.slice(1).toLowerCase();

      cy.contains('Marca').parent().find('input').click();
      cy.get('div[role="option"]').contains(marcaV).click();

      cy.contains('Modelo').parent().find('input').click();
      cy.get('div[role="option"]').contains(dato.vehiculo.modelo).click();

      cy.contains('Año').parent().find('input').click();
      cy.get('div[role="option"]').contains(dato.vehiculo.anio).click();

      // Llenar Valor Comercial -> Nuevo Riesgo
      cy.get(".input-iconside > .input-group > .form-floating > .form-control")
        .clear()
        .type(dato.solicitud.valorComercial);

      // Llenar Campos -> Persona Contratante

      const genC = dato.persona.genero[0].toUpperCase() + dato.persona.genero.slice(1).toLowerCase();

      cy.get(':nth-child(4) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container').click();
      cy.get('div[role="option"]').contains(genC).click();

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

      //Click en el check de: Diferente Contratante
      cy.get("form.ng-dirty > :nth-child(4) > div > .form-check-label").click();

      //LLenar campos de: Persona a Asegurar

      cy.get(
        "div.ng-pristine > .row > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
      ).type(dato.personaAsegurar.tipoIdentificacion);
      cy.get(".ng-option-label").click();

      cy.get('[formgroupname="InsuredPersonData"] > .row > .custom-textbox > .input-group > .form-floating > .form-control').type(dato.personaAsegurar.numeroIdentificacion);

      const nacion1 = dato.personaAsegurar.nacionalidad[0].toUpperCase() + dato.personaAsegurar.nacionalidad.slice(1).toLowerCase();

      cy.get('[formgroupname="InsuredPersonData"] > :nth-child(4) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input').click();
      cy.get('div[role="option"]').contains(nacion1).click();

      cy.get(
        ":nth-child(6) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
      ).type(dato.personaAsegurar.provinciaResidencia);
      cy.get(".ng-option-label").click();

      cy.get(
        ":nth-child(6) > :nth-child(2) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container > .ng-value-container"
      ).type(dato.personaAsegurar.ciudadResidencia);
      cy.get(".ng-option-label").click();

      cy.get(
        ".ng-invalid.ng-dirty > :nth-child(5) > :nth-child(1) > .container-ngselect-icon > .ng-select-searchable > .ng-select-container"
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

      //Dar click en Continuar
      cy.wait(1500);
      cy.get(".my-3.table-buttons > .btn").click();
      cy.wait(3000);

            // cy.get(':nth-child(2) > .subtitle')
      // .should("contain.text", `${dato.persona.nombre} está muy cerca de asegurar su ${dato.vehiculo.marca} ${dato.vehiculo.modelo}`);

      //cy.get(':nth-child(2) > .policy-card-content > mf-security-policy-plan-card > .border-card > .card > .m-4 > .text-header > .btn-content > .table-buttons > :nth-child(1) > .btn').click()

      cy.wait(2500)
      cy.window().then((win) => {
        const bodyText = win.document.body.innerText;
        expect(bodyText).to.include(
          "El valor a asegurar del vehículo supera los $90,000, por favor comunícate con tu ejecutivo de soporte Nivel 1 para iniciar el proceso de aprobación.Una vez aprobado, puedes continuar con su contratación en el módulo de negocios"
        );
        expect(bodyText).to.include("CÓDIGO: S1");
 
      });
    });
  });


});
