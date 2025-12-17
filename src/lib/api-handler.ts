import { NextRequest, NextResponse } from 'next/server'

/**
 * Wrapper for API route handlers to ensure all errors are caught
 * and properly formatted for Netlify serverless functions
 */
export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('Unhandled API error:', error)
      
      // Ensure we always return a proper response
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      const errorStack = error instanceof Error ? error.stack : String(error)
      
      return NextResponse.json(
        {
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }
  }
}

