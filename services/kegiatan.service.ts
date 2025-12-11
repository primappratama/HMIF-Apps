import AsyncStorage from '@react-native-async-storage/async-storage';

const KEGIATAN_STORAGE_KEY = '@hmif_kegiatan';

export interface Kegiatan {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: 'mendatang' | 'berlangsung' | 'selesai';
  image: string;
  participants: number;
  maxParticipants: number;
  description: string;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
}

// Get all kegiatan
export const getAllKegiatan = async (): Promise<Kegiatan[]> => {
  try {
    const data = await AsyncStorage.getItem(KEGIATAN_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    
    // Initial mock data
    const initialData: Kegiatan[] = [
      {
        id: '1',
        title: 'Workshop AI & Machine Learning',
        category: 'Workshop',
        date: '15 Desember 2024',
        time: '09:00 - 16:00 WIB',
        location: 'Lab Komputer Gedung A',
        status: 'mendatang',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        participants: 45,
        maxParticipants: 50,
        description: 'Workshop intensif tentang AI dan Machine Learning untuk mahasiswa',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Seminar Nasional: Future of Technology',
        category: 'Seminar',
        date: '20 Desember 2024',
        time: '08:00 - 15:00 WIB',
        location: 'Auditorium Utama',
        status: 'mendatang',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        participants: 120,
        maxParticipants: 200,
        description: 'Seminar nasional dengan pembicara dari perusahaan tech terkemuka',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Hackathon HMIF 2025',
        category: 'Competition',
        date: '10 Januari 2025',
        time: '08:00 - 20:00 WIB',
        location: 'Kampus UMMI',
        status: 'mendatang',
        image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400',
        participants: 30,
        maxParticipants: 40,
        description: '48 jam coding marathon dengan hadiah total 10 juta rupiah',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    await AsyncStorage.setItem(KEGIATAN_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    console.error('Error getting kegiatan:', error);
    return [];
  }
};

// Create kegiatan
export const createKegiatan = async (
  kegiatan: Omit<Kegiatan, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<Kegiatan> => {
  try {
    const allKegiatan = await getAllKegiatan();
    const newKegiatan: Kegiatan = {
      ...kegiatan,
      id: Date.now().toString(),
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedKegiatan = [...allKegiatan, newKegiatan];
    await AsyncStorage.setItem(KEGIATAN_STORAGE_KEY, JSON.stringify(updatedKegiatan));
    
    return newKegiatan;
  } catch (error) {
    console.error('Error creating kegiatan:', error);
    throw error;
  }
};

// Update kegiatan
export const updateKegiatan = async (id: string, updates: Partial<Kegiatan>): Promise<Kegiatan> => {
  try {
    const allKegiatan = await getAllKegiatan();
    const index = allKegiatan.findIndex(k => k.id === id);
    
    if (index === -1) {
      throw new Error('Kegiatan tidak ditemukan');
    }
    
    const updatedKegiatan = {
      ...allKegiatan[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    allKegiatan[index] = updatedKegiatan;
    await AsyncStorage.setItem(KEGIATAN_STORAGE_KEY, JSON.stringify(allKegiatan));
    
    return updatedKegiatan;
  } catch (error) {
    console.error('Error updating kegiatan:', error);
    throw error;
  }
};

// Delete kegiatan
export const deleteKegiatan = async (id: string): Promise<void> => {
  try {
    const allKegiatan = await getAllKegiatan();
    const filteredKegiatan = allKegiatan.filter(k => k.id !== id);
    await AsyncStorage.setItem(KEGIATAN_STORAGE_KEY, JSON.stringify(filteredKegiatan));
  } catch (error) {
    console.error('Error deleting kegiatan:', error);
    throw error;
  }
};

// Get kegiatan by ID
export const getKegiatanById = async (id: string): Promise<Kegiatan | null> => {
  try {
    const allKegiatan = await getAllKegiatan();
    return allKegiatan.find(k => k.id === id) || null;
  } catch (error) {
    console.error('Error getting kegiatan by ID:', error);
    return null;
  }
};