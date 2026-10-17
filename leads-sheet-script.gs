/**
 * Recebe um lead do site e grava uma linha na planilha.
 *
 * Cole este arquivo inteiro em Extensões → Apps Script da planilha de leads,
 * depois publique em Implantar → Nova implantação → Aplicativo da Web.
 *
 * A ordem do appendRow abaixo tem que bater com a ordem das colunas:
 *   Data | Nome | Telefone | Email | Origem | Status
 * Se você mudar as colunas da planilha, mude esta lista junto.
 */

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    // Senha opcional. Enquanto não existir a propriedade SHARED_SECRET no
    // script, qualquer chamada é aceita — a URL já é secreta por si só.
    var secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (secret && body.secret !== secret) {
      return json({ ok: false, error: 'unauthorized' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    sheet.appendRow([
      new Date(),            // Data — objeto de data real, o Sheets formata sozinho
      body.nome || '',
      body.telefone || '',
      body.email || '',
      body.origem || 'Site',
      'Novo'                 // Status inicial de todo lead que chega pelo site
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
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
