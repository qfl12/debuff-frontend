// API utility functions for payment processing

import service from './request';

export const getUserInfo = async () => {
  const response = await service.get('/users/info');
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
};

export const updateUserInfo = async (userData) => {
  return service.put('/users/update', userData);
};

export const uploadAvatar = async (formData) => {
  return service.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const requestAlipayPayment = async (paymentData) => {
  // TODO: Implement actual API call to backend
  // This is a placeholder that simulates a successful payment request
  console.log('Processing Alipay payment:', paymentData);
  return {
    success: true,
    payUrl: 'https://example.com/alipay-simulator?orderId=' + Math.random().toString(36).substr(2, 9)
  };
};
// Add other API functions as needed for the application