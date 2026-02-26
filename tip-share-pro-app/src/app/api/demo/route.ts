import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Generate a random demo code (6 chars, uppercase)
function generateDemoCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No O/0/I/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/demo?code=ABC123 - Load a demo session
export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 });
    }

    const session = await prisma.demoSession.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Update last accessed
    await prisma.demoSession.update({
      where: { id: session.id },
      data: { lastAccessedAt: new Date() },
    });

    return NextResponse.json({
      code: session.code,
      userName: session.userName,
      companyName: session.companyName,
      settings: session.settings,
      employees: session.employees,
    });
  } catch (error) {
    console.error('Error loading demo session:', error);
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 });
  }
}

// POST /api/demo - Create or update a demo session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userName, companyName, settings, employees } = body;

    // If no code provided, create a new session
    if (!code) {
      // Generate unique code
      let newCode: string;
      let attempts = 0;
      do {
        newCode = generateDemoCode();
        const existing = await prisma.demoSession.findUnique({
          where: { code: newCode },
        });
        if (!existing) break;
        attempts++;
      } while (attempts < 10);

      const session = await prisma.demoSession.create({
        data: {
          code: newCode,
          userName,
          companyName,
          settings,
          employees,
        },
      });

      return NextResponse.json({
        code: session.code,
        message: 'Session created',
      });
    }

    // Update existing session
    const session = await prisma.demoSession.upsert({
      where: { code: code.toUpperCase() },
      update: {
        userName,
        companyName,
        settings,
        employees,
        lastAccessedAt: new Date(),
      },
      create: {
        code: code.toUpperCase(),
        userName,
        companyName,
        settings,
        employees,
      },
    });

    return NextResponse.json({
      code: session.code,
      message: 'Session saved',
    });
  } catch (error) {
    console.error('Error saving demo session:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}
