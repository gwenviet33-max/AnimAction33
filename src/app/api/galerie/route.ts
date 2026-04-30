import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    notice:
      'La galerie est gérée côté client (localStorage admin). Pour persister les photos en production, branchez un stockage objet (S3, Netlify Blobs).',
    photos: [],
  })
}
