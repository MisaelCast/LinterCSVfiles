// Importa el módulo 'fs' (file system) para trabajar con el sistema de archivos.
const fs = require('fs');

// Lee el contenido del archivo 'database.txt' en formato UTF-8.
fs.readFile('database.txt', 'utf8', (err, data) => {
    // Manejo de errores: si ocurre un error durante la lectura del archivo, imprímelo y sal de la función.
    if (err) {
        console.error(err);
        return;
    }

    // Divide el contenido del archivo en líneas y guarda la primera línea como encabezados (top).
    var cadena_split = data.split('\n');
    const top = cadena_split[0].split(',');

    // Crea un archivo de registro llamado 'validation_log.txt' para registrar los errores de validación.
    const logFileName = 'validation_log.txt';
    const logStream = fs.createWriteStream(logFileName);

    // Itera sobre cada línea del archivo (comenzando desde la segunda línea, ya que la primera es de encabezados).
    for (let i = 1; i < cadena_split.length; i++) {
        // Divide la línea actual en campos utilizando la coma como separador.
        var query = cadena_split[i].split(",");

        // Validación de la cantidad de columnas y la existencia de datos en las columnas requeridas.
        if (top.length !== query.length || query.length === 0) {
            console.log(`Datos incorrectos o incompletos en el renglón ${i}`);
            logStream.write(`Error en el renglón ${i}: Número incorrecto de columnas o datos faltantes\n`);
            continue;  // Salta a la próxima iteración del bucle.
        }

        // Muestra en la consola la información del renglón actual.
        console.log("Renglon " + i + ":" + cadena_split[i]);

        // Realiza la validación de tipos de datos para cada campo.
        const typeValidations = ['alpha', 'numeric', 'alpha', 'alpha', 'numeric', 'numeric', 'email'];

        query.forEach(function(queryData, index) {
            const expectedType = typeValidations[index];

            // Comprueba el tipo de dato esperado y registra errores en el archivo de registro si no coincide.
            if (expectedType === 'numeric' && !isNumeric(queryData.trim())) {
                console.log(`Error en el renglón ${i}, columna ${index + 1}: Se esperaba un valor numérico`);
                logStream.write(`Error en el renglón ${i}, columna ${index + 1}: Se esperaba un valor numérico\n`);
            } else if (expectedType === 'alpha' && !isAlpha(queryData.trim())) {
                console.log(`Error en el renglón ${i}, columna ${index + 1}: Se esperaba un valor alfabético`);
                logStream.write(`Error en el renglón ${i}, columna ${index + 1}: Se esperaba un valor alfabético\n`);
            } else if (expectedType === 'email' && !isEmail(queryData.trim())) {
                console.log(`Error en el renglón ${i}, columna ${index + 1}: Se esperaba una dirección de correo electrónico válida`);
                logStream.write(`Error en el renglón ${i}, columna ${index + 1}: Se esperaba una dirección de correo electrónico válida\n`);
            }
        });
    }

    // Muestra un mensaje en la consola indicando que el proceso de validación ha terminado.
    console.log(`Proceso de validación completado. Se ha creado un archivo de registro: ${logFileName}`);

    // Cierra el flujo de escritura del archivo de registro.
    logStream.end();
});

// Funciones de validación

// Verifica si un valor es numérico.
function isNumeric(value) {
    return /^\d+$/.test(value);
}

// Verifica si un valor es alfabético.
function isAlpha(value) {
    return /^[a-zA-Z]+$/.test(value);
}

// Verifica si un valor es una dirección de correo electrónico válida.
function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
