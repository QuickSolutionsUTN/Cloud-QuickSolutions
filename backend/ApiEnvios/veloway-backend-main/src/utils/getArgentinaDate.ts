function getArgentinaDate() {
  const now = new Date();

  const offset = -3 * 60; // Argentina está en UTC-3

  const argentinaDate = new Date(now.getTime() + (offset - now.getTimezoneOffset()) * 60000);

  return argentinaDate;
}

// Ejemplo de uso
const argentinaNow = getArgentinaDate();
console.log('Fecha y hora en Argentina:', argentinaNow.toLocaleString('es-AR'));
