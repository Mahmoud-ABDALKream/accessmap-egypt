import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    try {
      const { writeFile, mkdir } = await import('fs/promises');
      const path = await import('path');

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a safe filename with timestamp
      const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}-${sanitized}`;

      // Ensure the uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);

      return NextResponse.json({ path: `/uploads/${filename}` });
    } catch {
      // Filesystem not writable (e.g., on Vercel)
      return NextResponse.json(
        { error: 'File upload is not available in demo mode.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
