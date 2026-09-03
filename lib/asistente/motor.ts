import type { Candidato } from "@/lib/db/consultas";
import type { Coincidencia } from "@/lib/data/candidatos";

/**
 * Emparejamiento determinista entre un requerimiento escrito en lenguaje
 * natural y los perfiles de la base. No hay modelo de lenguaje detrás: el
 * puntaje se calcula con reglas explicables, que es lo que se puede defender
 * ante RRHH y ante una auditoría.
 *
 * Reparto del puntaje sobre 100:
 *   60  habilidades del catálogo pedidas que el perfil sí tiene
 *   20  disponibilidad declarada
 *   10  el área del perfil aparece en el requerimiento
 *   10  completitud del perfil
 */

const PESO_HABILIDADES = 60;
const PESO_DISPONIBILIDAD = 20;
const PESO_AREA = 10;
const PESO_COMPLETITUD = 10;

const PUNTOS_DISPONIBILIDAD: Readonly<Record<string, number>> = {
  inmediata: 1,
  parcial: 0.5,
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Habilidades del catálogo mencionadas en el requerimiento. */
export function habilidadesPedidas(
  consulta: string,
  catalogo: readonly string[],
): string[] {
  const texto = normalizar(consulta);
  return catalogo.filter((habilidad) => texto.includes(normalizar(habilidad)));
}

export interface ResultadoAsistente {
  readonly consulta: string;
  readonly pedidas: string[];
  readonly coincidencias: Coincidencia[];
  readonly sintesis: string;
}

export function buscarCandidatos(
  consulta: string,
  candidatos: readonly Candidato[],
  catalogo: readonly string[],
  areas: readonly string[],
): ResultadoAsistente {
  const limpia = consulta.trim();
  const pedidas = habilidadesPedidas(limpia, catalogo);
  const texto = normalizar(limpia);
  const areasMencionadas = areas.filter((a) => texto.includes(normalizar(a)));

  const puntuados = candidatos
    // Un reclutador no se busca a sí mismo: solo perfiles con habilidades declaradas.
    .filter((candidato) => candidato.habilidades.length > 0)
    .map((candidato) => {
      const tiene = pedidas.filter((h) => candidato.habilidades.includes(h));
      const faltan = pedidas.filter((h) => !candidato.habilidades.includes(h));

      const proporcion = pedidas.length === 0 ? 0 : tiene.length / pedidas.length;
      const disponibilidad = PUNTOS_DISPONIBILIDAD[candidato.disponibilidad] ?? 0;
      const areaCoincide = areasMencionadas.includes(candidato.area) ? 1 : 0;

      const afinidad = Math.round(
        PESO_HABILIDADES * proporcion +
          PESO_DISPONIBILIDAD * disponibilidad +
          PESO_AREA * areaCoincide +
          PESO_COMPLETITUD * (candidato.completitud / 100),
      );

      return { candidato, tiene, faltan, afinidad };
    })
    .filter((fila) => fila.tiene.length > 0 || pedidas.length === 0)
    .sort((a, b) => b.afinidad - a.afinidad)
    .slice(0, 3);

  const coincidencias: Coincidencia[] = puntuados.map((fila, indice) => ({
    id: fila.candidato.id,
    nombre: fila.candidato.nombre,
    afinidad: fila.afinidad,
    tono: indice === 0 ? "accent" : "steel",
    justificacion: justificar(fila.candidato, fila.tiene, fila.faltan),
    habilidades: fila.candidato.habilidades,
    carencias: fila.faltan.map((h) => `falta: ${h}`),
    destacado: indice === 0,
  }));

  return {
    consulta: limpia,
    pedidas,
    coincidencias,
    sintesis: sintetizar(limpia, pedidas, puntuados),
  };
}

function justificar(
  candidato: Candidato,
  tiene: readonly string[],
  faltan: readonly string[],
): string {
  const partes: string[] = [`${candidato.cargo} del área de ${candidato.area}`];

  if (tiene.length > 0) {
    partes.push(`cubre ${listar(tiene)}`);
  }
  if (faltan.length > 0) {
    partes.push(`no tiene declarado ${listar(faltan)}`);
  }
  partes.push(`disponibilidad ${candidato.disponibilidad}`);
  partes.push(`perfil ${candidato.completitud}% completo`);

  return `${partes.join("; ")}.`;
}

function sintetizar(
  consulta: string,
  pedidas: readonly string[],
  puntuados: readonly { candidato: Candidato; afinidad: number; faltan: string[] }[],
): string {
  if (consulta.length === 0) {
    return "Escribe un requerimiento para que el asistente revise los perfiles internos.";
  }
  if (pedidas.length === 0) {
    return "No se reconoció ninguna habilidad del catálogo en el requerimiento. Prueba nombrando tecnologías concretas, por ejemplo BigQuery, Python o Power BI.";
  }
  if (puntuados.length === 0) {
    return `Ningún perfil interno declara ${listar(pedidas)}. Conviene revisar el catálogo de habilidades o ampliar la búsqueda a otras sedes.`;
  }

  const mejor = puntuados[0];
  if (!mejor) return "";

  const alternativas = puntuados.slice(1);
  const frases = [
    `Se ${puntuados.length === 1 ? "identificó 1 candidato" : `identificaron ${puntuados.length} candidatos`} con perfiles afines para un requerimiento de ${listar(pedidas)}.`,
    `El más adecuado es ${mejor.candidato.nombre}, con ${mejor.afinidad}% de afinidad y disponibilidad ${mejor.candidato.disponibilidad}.`,
  ];

  if (alternativas.length > 0) {
    const detalle = alternativas
      .map((a) => {
        const carencia = a.faltan.length > 0 ? ` (sin ${listar(a.faltan)})` : "";
        return `${a.candidato.nombre}${carencia}`;
      })
      .join(" y ");
    frases.push(`Como alternativas complementarias aparecen ${detalle}.`);
  }

  return frases.join(" ");
}

function listar(valores: readonly string[]): string {
  if (valores.length === 0) return "";
  if (valores.length === 1) return valores[0] ?? "";
  return `${valores.slice(0, -1).join(", ")} y ${valores[valores.length - 1]}`;
}
