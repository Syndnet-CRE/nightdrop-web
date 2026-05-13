const GAS_URL =
  'https://script.google.com/macros/s/AKfycbys2x4rtCG_zMXhxIiF5rTEYUsEoobsKv3TnnnVQNoIbLhqaDSTeXDyW6S5SRiZoZDHMw/exec'

export async function POST(req) {
  const body = await req.json()

  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'follow',
  })

  if (!res.ok) {
    return Response.json({ error: 'Submission failed. Please try again.' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
