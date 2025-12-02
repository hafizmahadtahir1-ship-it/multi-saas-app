// app/api/cron/process-templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processActiveTemplates } from '@/lib/cron/template-processor';
import { checkRequiredEnvVars } from '@/lib/env-check';

export async function GET(request: NextRequest) {
  // Environment check
  try {
    checkRequiredEnvVars();
  } catch (error) {
    return NextResponse.json(
      { error: 'Configuration error', details: (error as Error).message },
      { status: 500 }
    );
  }

  // Auth check
  const authHeader = request.headers.get('authorization');
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'CRON_SECRET not configured' },
        { status: 500 }
      );
    }
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  try {
    console.log('🚀 Starting cron job: process-templates');
    const startTime = Date.now();

    await processActiveTemplates();

    const duration = Date.now() - startTime;
    console.log(`✅ Cron job completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      duration: `${duration}ms`
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    return NextResponse.json(
      { 
        error: 'Cron job failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}