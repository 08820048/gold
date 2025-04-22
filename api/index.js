export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // 处理OPTIONS请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const appCode = process.env.APPCODE;

  if (!appCode) {
    return new Response(
      JSON.stringify({ error: 'AppCode not configured' }), 
      { status: 500, headers }
    );
  }

  try {
    let apiUrl = 'https://tsgold2.market.alicloudapi.com/shgold';
    
    // 如果是白银价格请求，使用不同的API端点
    if (path.includes('/silver-price')) {
      apiUrl = 'https://tssilver.market.alicloudapi.com/silver/shgold';
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `APPCODE ${appCode}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response not OK:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      
      // 如果是配额超限错误，返回特定的错误信息
      if (response.headers.get('x-ca-error-message')?.includes('quota exhausted')) {
        return new Response(
          JSON.stringify({
            error: 'API调用次数超限',
            message: '今日API调用次数已达到限制，请明天再试'
          }),
          { status: 429, headers }
        );
      }

      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch data',
        message: error.message
      }),
      { status: 500, headers }
    );
  }
} 