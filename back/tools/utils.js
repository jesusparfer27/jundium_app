
/**
 * Esta función convierte un string en un booleano
 * 
 *  - Truthy:  "true", true, 1, "1", "yes", "on", "enable"
 *  - Falsy:   null, undefined, "patata", "false", false, 0, "0", "no", "off", "disable", " "
 *  - else:    false
 *
 * @param {string} value 
 * @returns 
 */
export const getBoolean = (value) => {

    const trueValues = ["true", true, 1, "1", "yes", "on", "enable"];

    if (typeof value === 'boolean') { return value; }
    if (typeof value === 'string') { value = value.toLowerCase().trim(); }

    if (trueValues.includes(value)) { return true; }
    return false; // Cualquier otra cosa es false

    // if (value == 'true' || value == 'yes' || value == 'on' || value == 'enable' || value == '1') {
    //     return true;
    // }
    // if (value == 'false' || value == 'no' || value == 'off' || value == 'disable' || value == '0' || value == 0) {
    //     return false;
    // }
    // return false;
}


/**
 * 
 *  Esta función permite imprimir debugs
 * 
 *  - proximamente: solo imprimir en consola si .env DEBUG=true
 *  
 *  Métodos:
 *  - colores: [black, red, green, yellow, blue, magenta, cyan, white, crimson]
 *  - estilos: [reset, bright, dim, underscore, blink, reverse, hidden]
 *  - fondos: [bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgCrimson]
 * 
 *  Uso:
 *  - debug.underscore("msg");
 *  - debug.green("msg");
 *  - debug.bgMagenta("msg");
 * 
*/

export const debug = {
    // Methods de estilos
    reset: (...msgs) => debug.print(debug.styles.reset, ...msgs),
    bright: (...msgs) => debug.print(debug.styles.bright, ...msgs),
    dim: (...msgs) => debug.print(debug.styles.dim, ...msgs),
    underscore: (...msgs) => debug.print(debug.styles.underscore, ...msgs),
    blink: (...msgs) => debug.print(debug.styles.blink, ...msgs),
    reverse: (...msgs) => debug.print(debug.styles.reverse, ...msgs),
    hidden: (...msgs) => debug.print(debug.styles.hidden, ...msgs),
    // Methods de colores
    black: (...msgs) => debug.print(debug.colors.black, ...msgs),
    red: (...msgs) => debug.print(debug.colors.red, ...msgs),
    green: (...msgs) => debug.print(debug.colors.green, ...msgs),
    yellow: (...msgs) => debug.print(debug.colors.yellow, ...msgs),
    blue: (...msgs) => debug.print(debug.colors.blue, ...msgs),
    magenta: (...msgs) => debug.print(debug.colors.magenta, ...msgs),
    cyan: (...msgs) => debug.print(debug.colors.cyan, ...msgs),
    white: (...msgs) => debug.print(debug.colors.white, ...msgs),
    crimson: (...msgs) => debug.print(debug.colors.crimson, ...msgs),
    // Methods de fondos con colores
    bgBlack: (...msgs) => debug.print(debug.colors.bgBlack, ...msgs),
    bgMagenta: (...msgs) => debug.print(debug.colors.bgMagenta, ...msgs),
    bgRed: (...msgs) => debug.print(debug.colors.bgRed, ...msgs),
    bgGreen: (...msgs) => debug.print(debug.colors.bgGreen, ...msgs),
    bgYellow: (...msgs) => debug.print(debug.colors.bgYellow, ...msgs),
    bgBlue: (...msgs) => debug.print(debug.colors.bgBlue, ...msgs),
    bgCyan: (...msgs) => debug.print(debug.colors.bgCyan, ...msgs),
    bgWhite: (...msgs) => debug.print(debug.colors.bgWhite, ...msgs),
    bgCrimson: (...msgs) => debug.print(debug.colors.bgCrimson, ...msgs),
    // Por tipos (error, warning, success)
    error: (...msgs) => debug.print(debug.colors.red, ...msgs),
    warning: (...msgs) => debug.print(debug.colors.yellow, ...msgs),
    success: (...msgs) => debug.print(debug.colors.green, ...msgs),
    styles: {
        reset: "\x1b[0m", bright: "\x1b[1m", dim: "\x1b[2m", underscore: "\x1b[4m", blink: "\x1b[5m", reverse: "\x1b[7m", hidden: "\x1b[8m"
    },
    colors: {
        // text colors
        black: "\x1b[30m", red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", blue: "\x1b[34m", magenta: "\x1b[35m", cyan: "\x1b[36m", white: "\x1b[37m", crimson: "\x1b[38m",
        // texts backgrounds
        bgBlack: "\x1b[40m", bgRed: "\x1b[41m", bgGreen: "\x1b[42m", bgYellow: "\x1b[43m", bgBlue: "\x1b[44m", bgMagenta: "\x1b[45m", bgCyan: "\x1b[46m", bgWhite: "\x1b[47m", bgCrimson: "\x1b[48m"
    },
    print2: (msg, color) => {
        console.log(`${color}%s${debug.styles.reset}`, msg)
    },
    print: (colorCode, ...msgs) => {

        //return console.log(`${colorCode}%s${debug.styles.reset}`, ...msgs);
        // uso un map para imprimri multiples mensajes con el mismo estilo
        msgs.map((msg) => console.log(`${colorCode}%s${debug.styles.reset}`, msg))
        // realizo un return en caso de usar un console dentro de otro ej: debug.red("msg1", debug.underscore("msg2"));
        //return `${colorCode}${msgs[0]}${debug.styles.reset}`;
        return "";
    }
};

// pruebas de console.logs..

// debug.magenta("Hola Mundo!");
// debug.bgMagenta("Hola Mundo!");
// debug.underscore("Hola Mundo!");

// debug.red("Mensaje 1", "Mensaje 2", debug.bgMagenta("Mensaje 3"), "Mensaje 4");
// debug.red("msg1", debug.underscore("msg2"));

// debug.bright('This is bright text');
// debug.dim('This is dim text');
// debug.underscore('This is underscored text');
// debug.blink('This text will blink');
// debug.reverse('This text has reversed colors');
// debug.hidden('This text is hidden');

// debug.red("Hola Mundo!");
// debug.green("Hola Mundo!");
// debug.bgMagenta("Hola Mundo!");