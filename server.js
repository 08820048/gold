import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('请求头:', req.headers);
  next();
});

app.use(cors({
  origin: 'http://localhost:5173', // 允许前端开发服务器的源
  credentials: true
}));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// 黄金价格接口
app.get('/api/gold-price', async (req, res) => {
  try {
    console.log('收到黄金价格请求');
    console.log('请求头:', req.headers);
    console.log('AppCode:', process.env.AppCode);
    
    if (!process.env.AppCode) {
      throw new Error('AppCode 未配置');
    }
    
    const response = await axios.get('https://tsgold2.market.alicloudapi.com/shgold', {
      headers: {
        'Authorization': `APPCODE ${process.env.AppCode}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('阿里云API响应状态:', response.status);
    console.log('阿里云API响应头:', response.headers);
    console.log('阿里云API响应数据:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('获取黄金价格时出错:', error.message);
    if (error.response) {
      console.error('阿里云API错误响应:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
        quotaError: error.response.headers['x-ca-error-message']
      });
      
      // 如果是配额超限错误，返回特定的错误信息
      if (error.response.headers['x-ca-error-message']?.includes('quota exhausted')) {
        return res.status(429).json({
          error: 'API调用次数超限',
          message: '今日API调用次数已达到限制，请明天再试',
          details: error.response.headers['x-ca-error-message']
        });
      }
    }
    res.status(error.response?.status || 500).json({
      error: '获取黄金价格失败',
      message: error.message,
      details: error.response?.data
    });
  }
});

// 白银价格接口
app.get('/api/silver-price', async (req, res) => {
  try {
    console.log('收到白银价格请求');
    console.log('请求头:', req.headers);
    console.log('AppCode:', process.env.AppCode);
    
    if (!process.env.AppCode) {
      throw new Error('AppCode 未配置');
    }
    
    const response = await axios.get('https://tssilver.market.alicloudapi.com/silver/shgold', {
      headers: {
        'Authorization': `APPCODE ${process.env.AppCode}`,
        'Content-Type': 'application/json'
      },
      params: {
        type: 'silver'  // 添加参数来指定获取白银数据
      }
    });
    
    console.log('阿里云API响应状态:', response.status);
    console.log('阿里云API响应头:', response.headers);
    console.log('阿里云API响应数据结构:', {
      code: response.data.code,
      msg: response.data.msg,
      dataStructure: response.data.data ? {
        listKeys: Object.keys(response.data.data.list || {}),
        listDetails: Object.entries(response.data.data.list || {}).map(([key, value]) => ({
          key,
          typename: value.typename,
          price: value.price
        }))
      } : null
    });
    console.log('完整响应数据:', JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error('获取白银价格时出错:', error.message);
    if (error.response) {
      console.error('阿里云API错误响应:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
    }
    res.status(error.response?.status || 500).json({
      error: '获取白银价格失败',
      message: error.message,
      details: error.response?.data
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log('环境变量加载情况:', {
    AppCode: process.env.AppCode ? '***' : '未设置',
    PORT: process.env.PORT || '3000 (默认)'
  });
}); 