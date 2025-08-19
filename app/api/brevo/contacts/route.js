import { NextResponse } from 'next/server';

// This route must be public
export const dynamic = 'force-dynamic';

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  console.log('Brevo API route called');
  
  try {
    const body = await request.json().catch(() => ({}));
    const { email, firstName } = body;
    
    console.log('Received request:', { email, firstName });
    
    if (!email) {
      console.error('Email is required');
      return new NextResponse(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not set in environment variables');
      return new NextResponse(JSON.stringify({ 
        error: 'Server configuration error',
        details: 'BREVO_API_KEY is not configured'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const brevoPayload = {
      email,
      attributes: { 
        FIRSTNAME: firstName || '',
      },
      listIds: process.env.BREVO_LIST_ID ? [parseInt(process.env.BREVO_LIST_ID, 10)] : [],
      updateEnabled: true,
    };

    console.log('Sending to Brevo:', brevoPayload);
    
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    });

    const responseData = await brevoResponse.json().catch(() => ({}));
    
    console.log('Brevo API response:', {
      status: brevoResponse.status,
      statusText: brevoResponse.statusText,
      data: responseData
    });

    if (!brevoResponse.ok) {
      console.error('Brevo API error:', responseData);
      return new NextResponse(JSON.stringify({ 
        error: 'Failed to add contact to Brevo',
        details: responseData.message || 'Unknown error from Brevo API',
        code: responseData.code
      }), {
        status: brevoResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new NextResponse(JSON.stringify({ 
      success: true,
      message: 'Contact added to Brevo',
      data: responseData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error in Brevo API route:', error);
    
    return new NextResponse(JSON.stringify({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
