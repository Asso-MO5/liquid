export async function GET({ params }: { params: { id: string } }) {
  'use server'

  const caveUrl = import.meta.env.VITE_CAVE_URL

  if (!caveUrl) {
    return new Response(
      JSON.stringify({ error: 'VITE_CAVE_URL is not defined' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    const response = await fetch(`${caveUrl}/item/public/${params.id}`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch item: ${response.statusText}` }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error fetching item:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

