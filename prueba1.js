const fs = require('fs');

fs.readFile('database.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    var cadena_split = data.split('\n');
    const top = cadena_split[0].split(',');

    // Crear archivo de registro
    const logFileName = 'validation_log.txt';
    const logStream = fs.createWriteStream(logFileName);

    for (let i = 1; i < cadena_split.length; i++) {
        var query = cadena_split[i].split(",");

        if (top.length !== query.length || query.length === 0) {
            console.log(`Datos incorrectos o incompletos en el renglón ${i}`);
            logStream.write(`Error en el renglón ${i}: Número incorrecto de columnas o datos faltantes\n`);
            continue;
        }

        console.log("Renglon " + i + ":" + cadena_split[i]);

        // Realizar validación de tipos de datos
        const typeValidations = ['alpha', 'numeric', 'alpha', 'alpha', 'numeric', 'numeric', 'email'];

        query.forEach(function(queryData, index) {
            const expectedType = typeValidations[index];

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

    console.log(`Proceso de validación completado. Se ha creado un archivo de registro: ${logFileName}`);
    logStream.end();  // Cerrar el flujo de escritura del archivo de registro
});

// Funciones de validación
function isNumeric(value) {
    return /^\d+$/.test(value);
}

function isAlpha(value) {
    return /^[a-zA-Z]+$/.test(value);
}

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
