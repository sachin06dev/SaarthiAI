async function check() {
  const pageRes = await fetch('http://localhost:3000');
  const html = await pageRes.text();
  const idx = html.indexOf('/_next/static/css/app/layout.css');
  if (idx !== -1) {
    const end = html.indexOf('"', idx);
    const cssUrl = html.slice(idx, end);
    console.log('Target URL:', cssUrl);
    const cssRes = await fetch('http://localhost:3000' + cssUrl);
    console.log('Status:', cssRes.status, cssRes.headers.get('content-type'));
    const t = await cssRes.text();
    console.log('Length:', t.length, 'Is HTML:', t.startsWith('<!DOCTYPE'));
  }
}
check();
