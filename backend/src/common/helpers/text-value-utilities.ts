export const formatRut = (rut: string) => {
    // Agrega el guión antes del dígito verificador
    rut = rut.slice(0, -1) + "-" + rut.slice(-1);

    // Agrega los puntos cada tres dígitos desde la derecha
    var parts = rut.split("-");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join("-");
}