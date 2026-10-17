/**
 * Recebe um lead do site e grava uma linha na planilha.
 *
 * Cole este arquivo inteiro em Extensões → Apps Script da planilha de leads,
 * depois publique em Implantar → Nova implantação → Aplicativo da Web.
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
