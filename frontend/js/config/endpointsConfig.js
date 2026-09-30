export const API_BASE_URL = "http://127.0.0.1:8000";

export const ENDPOINTS = [
  { key: "listTeams",  name: "Listar equipos",    method: "GET",    url: "/teams/",          params: "?skip&limit", summary: "Lista con paginación", example: null },
  { key: "getTeam", name: "Detalle equipo",    method: "GET",    url: "/teams/{id}",     params: "—",           summary: "Un equipo por ID",       example: null },
  { key: "createTeam",  name: "Crear equipo",      method: "POST",   url: "/teams/",          params: "body TeamCreate", summary: "Crea un equipo", example: { name: "Real Madrid CF", founded_date: "1902-03-06", country: "Spain", titles_won: 100, uefa_ranking: 5, division: "first", head_coach: "Carlo Ancelotti", president: "Florentino Perez" } },
  { key: "updateTeam", name: "Editar equipo",     method: "PUT",    url: "/teams/{id}",     params: "body TeamUpdate", summary: "Actualiza parcialmente", example: { country: "Spain" } },
  { key: "deleteTeam", name: "Eliminar equipo",   method: "DELETE", url: "/teams/{id}",     params: "—", summary: "Borrado en cascada a jugadores", example: null },
  { key: "listPlayers", name: "Listar jugadores",  method: "GET",    url: "/players/",        params: "?skip&limit&club_id", summary: "Lista con filtro por club", example: null },
  { key: "getPlayer", name: "Detalle jugador",   method: "GET",    url: "/players/{id}",   params: "—", summary: "Un jugador por ID", example: null },
  { key: "createPlayer", name: "Crear jugador",     method: "POST",   url: "/players/",        params: "body PlayerCreate", summary: "Crea un jugador", example: { name: "Kylian Mbappe", country: "France", performance: 93, field_position: "forward", birth_date: "1998-12-20", market_value: "180000000.00", salary: "25000000.00", club_id: 1 } },
  { key: "updatePlayer", name: "Editar jugador",    method: "PUT",    url: "/players/{id}",   params: "body PlayerUpdate", summary: "Actualiza parcialmente", example: { performance: 94 } },
  { key: "deletePlayer", name: "Eliminar jugador",  method: "DELETE", url: "/players/{id}",   params: "—", summary: "Borra un jugador", example: null },
  { key: "listCompetitions", name: "Listar competiciones", method: "GET",    url: "/competitions/",    params: "?skip&limit", summary: "Lista con paginación", example: null },
  { key: "getCompetition", name: "Detalle competición",   method: "GET",    url: "/competitions/{id}", params: "—", summary: "Una competición por ID", example: null },
  { key: "createCompetition", name: "Crear competición",    method: "POST",   url: "/competitions/",    params: "body CompetitionCreate", summary: "Crea una competición", example: { name: "La Liga", country: "Spain" } },
  { key: "updateCompetition", name: "Editar competición",   method: "PUT",    url: "/competitions/{id}", params: "body CompetitionUpdate", summary: "Actualiza parcialmente", example: { country: "Spain" } },
  { key: "deleteCompetition", name: "Eliminar competición", method: "DELETE", url: "/competitions/{id}", params: "—", summary: "Borra una competición", example: null },
  { key: "health", name: "Health check",      method: "GET",    url: "/",               params: "—", summary: "Estado del servicio", example: null },
];