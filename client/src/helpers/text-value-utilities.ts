export const cleanRutAndGetNumeric = (rut: string) => {
    const rutClean = rut.replace(/[^0-9kK]+/g, '');
    const rutFinal = rutClean.substring(0, rutClean.length - 1);

    return rutFinal;
}

export const cleanAndSplitRutByDv = (rut: string) => {
    const rutClean = rut.replace(/[^0-9kK]+/g, '');
    const rutFinal = rutClean.substring(0, rutClean.length - 1);
    const dv = rutClean.substring(rutClean.length - 1).toUpperCase();

    return { rut: rutFinal, dv };
}

export const formatedRut = (value: string) => {
    if (value.length < 2) return value;

    const rut = value.replace(/[^0-9kK]+/g, '');
    const rutClean = rut.substring(0, rut.length - 1);
    const dv = rut.substring(rut.length - 1).toUpperCase();
    const rutFormat = rutClean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const rutFinal = rutFormat + '-' + dv;
    return rutFinal;
}

// >> Validacion y formateo de RUT
export const checkRutField = (rut: string) => {
    let i: number, j: number, largo: number, cnt: number;
    let tmpstr: any = "";

    for (i = 0; i < rut.length; i++)
        if (rut.charAt(i) != ' ' && rut.charAt(i) != '.' && rut.charAt(i) != '-')
            tmpstr += rut.charAt(i);
    rut = tmpstr;
    largo = rut.length;
    tmpstr = "";
    for (i = 0; rut.charAt(i) == '0'; i++)
        ;
    for (; i < rut.length; i++)
        tmpstr = tmpstr + rut.charAt(i);
    rut = tmpstr;
    largo = rut.length;

    for (i = 0; i < largo; i++) {
        if (rut.charAt(i) != "0" && rut.charAt(i) != "1" && rut.charAt(i) != "2" && rut.charAt(i) != "3" && rut.charAt(i) != "4" && rut.charAt(i) != "5" && rut.charAt(i) != "6" && rut.charAt(i) != "7" && rut.charAt(i) != "8" && rut.charAt(i) != "9" && rut.charAt(i) != "k" && rut.charAt(i) != "K") {
            return '';
        }
    }
    let invertido = "";
    for (i = (largo - 1), j = 0; i >= 0; i--, j++)
        invertido = invertido + rut.charAt(i);

    let drut = "";
    drut = drut + invertido.charAt(0);
    drut = drut + '-';
    cnt = 0;

    for (i = 1, j = 2; i < largo; i++, j++) {
        if (cnt == 3) {
            drut = drut + '.';
            j++;
            drut = drut + invertido.charAt(i);
            cnt = 1;
        } else {
            drut = drut + invertido.charAt(i);
            cnt++;
        }
    }
    invertido = "";
    for (i = (drut.length - 1), j = 0; i >= 0; i--, j++)
        invertido = invertido + drut.charAt(i);

    if (checkDVGeneral(rut)) {
        return true;
    }
    else {
        return false;
    }
}

function checkDVGeneral(crut: string) {
    let largo: number;
    let rut: string = "", dv: string = "";
    let suma: any, mul: any, res: any, dvi: any;
    let i: number;

    largo = crut.length;

    if (largo < 2) {
        return false;
    }

    if (largo > 2)
        rut = crut.substring(0, largo - 1);
    else
        rut = crut.charAt(0);
    dv = crut.charAt(largo - 1);
    checkCDVGeneral(dv);
    if (rut == null || dv == null)
        return 0;
    let dvr = '0';
    suma = 0;
    mul = 2;
    for (i = rut.length - 1; i >= 0; i--) {
        suma += mul * parseInt(rut.charAt(i));
        if (mul == 7)
            mul = 2;
        else
            mul++;
    }
    res = suma % 11;
    if (res == 1)
        dvr = 'k';
    else if (res == 0)
        dvr = '0';
    else {
        dvi = 11 - res;
        dvr = dvi + "";
    }
    if (dvr != dv.toLowerCase()) {
        return false;
    }
    return true;
}
function checkCDVGeneral(dvr: string) {
    let dv: string = dvr + "";

    if (dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k' && dv != 'K') {
        alert('Debe ingresar s\xF3lo numeros');
        return false;
    }

    return true;
}
