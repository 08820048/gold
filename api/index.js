import axios from 'axios';

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { type } = req.query;
  const appCode = process.env.APPCODE;

  if (!appCode) {
    return res.status(500).json({ error: 'AppCode not configured' });
  }

  try {
    const response = await axios.get('https://tsgold2.market.alicloudapi.com/shgold', {
      headers: {
        'Authorization': `APPCODE ${appCode}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch data',
      message: error.message,
      details: error.response?.data
    });
  }
} 