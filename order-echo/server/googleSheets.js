import { google } from 'googleapis';

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Google service account credentials are not set');
  }
  // Handle escaped newlines in env
  privateKey = privateKey.replace(/\\n/g, '\n');

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function appendLeadToSheet(lead) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const sheetName = process.env.GOOGLE_SHEETS_TAB || 'Leads';
  if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_ID not set');

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const values = [[
    new Date().toISOString(),
    lead.restaurant_name || '',
    lead.contact_name || '',
    lead.email || '',
    lead.phone || '',
    lead.current_call_volume || '',
    lead.biggest_challenge || '',
    lead.message || '',
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values },
  });

  return { ok: true };
}

