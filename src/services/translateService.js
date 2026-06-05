export async function transferirTraduccion(texto, idiomaDestino) {
  const url = '/.netlify/functions/traducir';
  
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto, idiomaDestino }),
  });

  if (!respuesta.ok) {
    throw new Error('Error en la comunicación con el servidor de traducción');
  }

  return await respuesta.json();
}