import api from '@/lib/api';

const URLS = {
  chinese: 'zh',
  english: 'en',
  japanese: 'jp',
};

export interface Hotel {
  id: number;
  name: string;
  rating: number;
  stars: number;
  address: string;
  photo: string;
  price: number;
  description: string;
  reviews?: (ReviewsEntity | null)[] | null;
}
export interface ReviewsEntity {
  user: User;
  rating: number;
  title: string;
  description: string;
}
export interface User {
  name: string;
  location: string;
}

export const getHotalChinese = () => {
  return api.get<Hotel[]>(URLS.chinese, {
    baseURL: 'https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/',
  });
};

export const getHotelEnglish = () => {
  return api.get<Hotel[]>(URLS.english, {
    baseURL: 'https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/',
  });
};

export const getHotelJapanese = () => {
  return api.get<Hotel[]>(URLS.japanese, {
    baseURL: 'https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/',
  });
};
