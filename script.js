// Horarios de atención.
// Los números son los días según Date.getDay(): 0 = domingo, 1 = lunes ... 6 = sábado.
// Cada día tiene una lista de tramos ["abre", "cierra"], en formato "HH:MM".
// Una lista vacía [] significa que ese día está cerrado.
const HORARIOS = {
  0: [],
  1: [["08:00", "12:00"], ["16:00", "22:00"]],
  2: [["08:00", "12:00"], ["16:00", "22:00"]],
  3: [["08:00", "12:00"], ["16:00", "22:00"]],
  4: [["08:00", "12:00"], ["16:00", "22:00"]],
  5: [["08:00", "12:00"], ["16:00", "22:00"]],
  6: [["08:00", "12:00"], ["16:00", "22:00"]]
};

// "16:30" -> 990 (minutos desde la medianoche)
function aMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// "08:00" -> "8:00"
function formatear(hora) {
  return hora.replace(/^0/, "");
}

function calcularEstado(fecha) {
  const tramos = HORARIOS[fecha.getDay()];
  const ahora = fecha.getHours() * 60 + fecha.getMinutes();

  if (tramos.length === 0) {
    return { abierto: false, detalle: "Hoy no abrimos" };
  }

  for (const [abre, cierra] of tramos) {
    if (ahora < aMinutos(abre)) {
      return { abierto: false, detalle: `Abrimos hoy a las ${formatear(abre)}` };
    }
    if (ahora < aMinutos(cierra)) {
      return { abierto: true, detalle: `Cerramos a las ${formatear(cierra)}` };
    }
  }

  return { abierto: false, detalle: "Ya cerramos por hoy" };
}

function mostrarEstado() {
  const elementoTexto = document.getElementById("estado-texto");
  const elementoDetalle = document.getElementById("estado-detalle");
  const elementoTurno = document.getElementById("estado-turno");
 
  if (!elementoTexto || !elementoDetalle) {
    return;
  }

  const estado = calcularEstado(new Date());

  elementoTexto.textContent = estado.abierto ? "Abierto ahora" : "Cerrado";
  elementoDetalle.textContent = estado.detalle;

  elementoTexto.classList.remove("abierto", "cerrado");
  elementoTexto.classList.add(estado.abierto ? "abierto" : "cerrado");

  // El aviso de turno solo se muestra cuando la farmacia está cerrada
  if (elementoTurno) {
    elementoTurno.hidden = estado.abierto;
  }
}

mostrarEstado();
setInterval(mostrarEstado, 60000);
