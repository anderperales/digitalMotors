export const formatDateTime = (dateString: string) => {
  const optionsDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString('es-PE', optionsDate); // Formato de fecha español (Perú)
  const formattedTime = date.toLocaleTimeString('es-PE', optionsTime); // Formato de hora español (Perú)

  return `${formattedDate} ${formattedTime}`; // Retorna fecha y hora juntas
};

export const formatDate = (dateString: string) => {
  const optionsDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString('es-PE', optionsDate); // Formato de fecha español (Perú)

  return `${formattedDate}`; // Retorna fecha y hora juntas
};