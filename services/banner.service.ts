export interface Banner {
  id: string;
  image: string;
  order: number;
  active: boolean;
  createdAt: string;
}

// Mock banner database
let banners: Banner[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    order: 1,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800",
    order: 2,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    order: 3,
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export const getAllBanners = async (): Promise<Banner[]> => {
  return banners.sort((a, b) => a.order - b.order);
};

export const getActiveBanners = async (): Promise<Banner[]> => {
  return banners.filter((b) => b.active).sort((a, b) => a.order - b.order);
};

export const getBannerById = async (id: string): Promise<Banner | null> => {
  return banners.find((b) => b.id === id) || null;
};

export const createBanner = async (image: string): Promise<Banner> => {
  const newBanner: Banner = {
    id: Date.now().toString(),
    image,
    order: banners.length + 1,
    active: true,
    createdAt: new Date().toISOString(),
  };

  banners.push(newBanner);
  return newBanner;
};

export const updateBanner = async (
  id: string,
  updates: Partial<Banner>
): Promise<Banner> => {
  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new Error("Banner tidak ditemukan");
  }

  banners[index] = { ...banners[index], ...updates };
  return banners[index];
};

export const deleteBanner = async (id: string): Promise<void> => {
  banners = banners.filter((b) => b.id !== id);
  // Reorder remaining banners
  banners.forEach((banner, index) => {
    banner.order = index + 1;
  });
};

export const reorderBanners = async (
  bannerId: string,
  newOrder: number
): Promise<void> => {
  const banner = banners.find((b) => b.id === bannerId);
  if (!banner) throw new Error("Banner tidak ditemukan");

  const oldOrder = banner.order;

  if (newOrder > oldOrder) {
    // Moving down
    banners.forEach((b) => {
      if (b.order > oldOrder && b.order <= newOrder) {
        b.order--;
      }
    });
  } else {
    // Moving up
    banners.forEach((b) => {
      if (b.order >= newOrder && b.order < oldOrder) {
        b.order++;
      }
    });
  }

  banner.order = newOrder;
};
