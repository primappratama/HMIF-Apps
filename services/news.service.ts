export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  category: 'pengumuman' | 'berita' | 'info';
  author: string;
  publishedAt: string;
  views: number;
  featured: boolean;
}

// Mock news database
let newsList: News[] = [
  {
    id: '1',
    title: 'Pengumuman Seminar Teknologi AI 2024',
    content: 'HMIF UMMI mengadakan seminar teknologi AI dengan tema "AI for Better Future". Acara ini akan diselenggarakan pada tanggal 15 Januari 2024 di Aula Utama. Pembicara: Dr. Budi Santoso (AI Expert dari Google Indonesia).',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    category: 'pengumuman',
    author: 'Admin HMIF',
    publishedAt: new Date().toISOString(),
    views: 245,
    featured: true,
  },
  {
    id: '2',
    title: 'Workshop React Native Batch 2',
    content: 'Pendaftaran Workshop React Native Batch 2 telah dibuka! Workshop ini akan membahas tentang pembuatan aplikasi mobile menggunakan React Native. Gratis untuk anggota HMIF.',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
    category: 'berita',
    author: 'Admin HMIF',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    views: 189,
    featured: false,
  },
  {
    id: '3',
    title: 'Info Lowongan Magang di Startup',
    content: 'Terdapat lowongan magang untuk posisi Frontend Developer di beberapa startup ternama. Hubungi sekretariat HMIF untuk informasi lebih lanjut.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    category: 'info',
    author: 'Admin HMIF',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    views: 156,
    featured: false,
  },
];

export const getAllNews = async (): Promise<News[]> => {
  return newsList.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getFeaturedNews = async (): Promise<News[]> => {
  return newsList.filter(n => n.featured).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getNewsByCategory = async (category: string): Promise<News[]> => {
  return newsList.filter(n => n.category === category).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getNewsById = async (id: string): Promise<News | null> => {
  return newsList.find(n => n.id === id) || null;
};

export const createNews = async (
  title: string,
  content: string,
  image: string,
  category: 'pengumuman' | 'berita' | 'info',
  author: string,
  featured: boolean
): Promise<News> => {
  const newNews: News = {
    id: Date.now().toString(),
    title,
    content,
    image,
    category,
    author,
    publishedAt: new Date().toISOString(),
    views: 0,
    featured,
  };
  
  newsList.push(newNews);
  return newNews;
};

export const updateNews = async (
  id: string,
  updates: Partial<News>
): Promise<News> => {
  const index = newsList.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('Berita tidak ditemukan');
  }
  
  newsList[index] = { ...newsList[index], ...updates };
  return newsList[index];
};

export const deleteNews = async (id: string): Promise<void> => {
  newsList = newsList.filter(n => n.id !== id);
};

export const incrementViews = async (id: string): Promise<void> => {
  const news = newsList.find(n => n.id === id);
  if (news) {
    news.views++;
  }
};