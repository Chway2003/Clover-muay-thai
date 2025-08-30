import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Testing custom Redis connection...');
    
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return NextResponse.json({ error: 'No REDIS_URL found' }, { status: 500 });
    }
    
    // Parse the Redis URL
    const url = new URL(redisUrl);
    const hostname = url.hostname;
    const port = url.port || '6379';
    const password = url.password;
    
    console.log('Redis connection details:', { hostname, port, password: password ? '***' : 'none' });
    
    // Test with a simple HTTP request to Redis REST API
    const redisRestUrl = `https://${hostname}:${port}`;
    const auth = Buffer.from(`default:${password}`).toString('base64');
    
    // Test setting a value
    const setResponse = await fetch(`${redisRestUrl}/SET/test-key/test-value`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('SET response status:', setResponse.status);
    const setResult = await setResponse.text();
    console.log('SET result:', setResult);
    
    // Test getting the value
    const getResponse = await fetch(`${redisRestUrl}/GET/test-key`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('GET response status:', getResponse.status);
    const getResult = await getResponse.text();
    console.log('GET result:', getResult);
    
    return NextResponse.json({
      message: 'Custom Redis test complete',
      redisUrl: redisUrl.replace(password, '***'),
      hostname,
      port,
      setStatus: setResponse.status,
      setResult,
      getStatus: getResponse.status,
      getResult
    });
  } catch (error) {
    console.error('Custom Redis test error:', error);
    return NextResponse.json(
      { error: 'Custom Redis test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
