/**
 * Recebe eventos do site e grava na planilha.
 *
 * Cole este arquivo inteiro em Extensões → Apps Script da planilha de leads,
 * depois publique em Implantar → Nova implantação → Aplicativo da Web.
 *
 * São dois eventos, no MESMO aplicativo web e na MESMA URL — quem decide é o
 * campo `evento` do corpo da requisição:
 *
 *   evento ausente (ou qualquer outro) → lead do formulário, primeira aba
 *   evento === 'clique-whatsapp'       → clique no WhatsApp, aba de cliques
 *
 * O padrão é o lead de propósito: as chamadas antigas do site não mandam
 * `evento` nenhum e precisam continuar caindo na aba certa depois desta
 * atualização.
 */

/** Nome da aba de cliques. Se não existir, é criada na primeira chamada. */
var ABA_CLIQUES = 'Cliques WhatsApp';

var COLUNAS_CLIQUES = ['Data', 'Origem', 'Pagina', 'Dispositivo', 'Fonte', 'Sessao'];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    // Senha opcional. Enquanto não existir a propriedade SHARED_SECRET no
    // script, qualquer chamada é aceita — a URL já é secreta por si só.
    var secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (secret && body.secret !== secret) {
      return json({ ok: false, error: 'unauthorized' });
    }

    if (body.evento === 'clique-whatsapp') {
      gravarClique(body);
    } else {
      gravarLead(body);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/**
 * Lead do formulário, na primeira aba.
 *
 * A ordem do appendRow abaixo tem que bater com a ordem das colunas:
 *
 *   A Data | B Nome | C Telefone | D Email | E Origem | F Status
 *   G Cidade | H Tipo | I Tamanho | J Fotos | K Mensagem
 *
 * As cinco últimas foram acrescentadas à direita de propósito, em vez de
 * reordenar: assim as linhas que já estavam na planilha continuam alinhadas.
 * Se você mudar as colunas, mude esta lista junto.
 */
function gravarLead(body) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  sheet.appendRow([
    new Date(),            // A Data — objeto de data real, o Sheets formata sozinho
    body.nome || '',       // B
    body.telefone || '',   // C
    body.email || '',      // D
    body.origem || 'Site', // E
    'Novo',                // F Status inicial de todo lead que chega pelo site
    body.cidade || '',     // G
    body.tipo || '',       // H
    body.tamanho || '',    // I
    body.fotos || 0,       // J Quantidade de fotos oferecidas, não os arquivos
    body.mensagem || ''    // K
  ]);
}

/**
 * Clique num botão de WhatsApp, na aba de cliques.
 *
 *   A Data | B Origem | C Pagina | D Dispositivo | E Fonte | F Sessao
 *
 * Origem é qual botão do site foi clicado (hero, header, fab...), e Sessao é um
 * código aleatório por visita: a mesma pessoa clicando três vezes gera três
 * linhas com a mesma sessão, então dá para separar cliques de pessoas.
 */
function gravarClique(body) {
  var sheet = abaDeCliques();

  sheet.appendRow([
    new Date(),                    // A
    body.origem || 'desconhecida', // B
    body.pagina || '/',            // C
    body.dispositivo || '',        // D
    body.fonte || 'direto',        // E
    body.sessao || ''              // F
  ]);
}

/** Devolve a aba de cliques, criando-a com o cabeçalho se ainda não existir. */
function abaDeCliques() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = planilha.getSheetByName(ABA_CLIQUES);

  if (!sheet) {
    sheet = planilha.insertSheet(ABA_CLIQUES);
    sheet.appendRow(COLUNAS_CLIQUES);
    sheet.getRange(1, 1, 1, COLUNAS_CLIQUES.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/** Abrir a URL no navegador cai aqui — serve para conferir que está no ar. */
function doGet() {
  return json({ ok: true, status: 'online' });
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
