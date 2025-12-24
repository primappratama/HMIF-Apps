export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  division: string;
  photo: string;
  email: string;
  nim: string;
  phone: string;
  order: number;
}

// Mock organization database
let members: OrganizationMember[] = [
  {
    id: "1",
    name: "Ahmad Rizki",
    position: "Ketua Umum",
    division: "Ketua",
    photo:
      "https://ui-avatars.com/api/?name=Ahmad+Rizki&background=007AFF&color=fff&size=200",
    email: "ahmad.rizki@ummi.ac.id",
    nim: "2021001",
    phone: "081234567890",
    order: 1,
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    position: "Wakil Ketua",
    division: "Ketua",
    photo:
      "https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=00C853&color=fff&size=200",
    email: "siti.nurhaliza@ummi.ac.id",
    nim: "2021002",
    phone: "081234567891",
    order: 2,
  },
  {
    id: "3",
    name: "Budi Santoso",
    position: "Sekretaris",
    division: "Sekretaris",
    photo:
      "https://ui-avatars.com/api/?name=Budi+Santoso&background=FF9500&color=fff&size=200",
    email: "budi.santoso@ummi.ac.id",
    nim: "2021003",
    phone: "081234567892",
    order: 3,
  },
  {
    id: "4",
    name: "Dewi Lestari",
    position: "Bendahara",
    division: "Bendahara",
    photo:
      "https://ui-avatars.com/api/?name=Dewi+Lestari&background=9C27B0&color=fff&size=200",
    email: "dewi.lestari@ummi.ac.id",
    nim: "2021004",
    phone: "081234567893",
    order: 4,
  },
  {
    id: "5",
    name: "Eko Prasetyo",
    position: "Koordinator Acara",
    division: "Acara",
    photo:
      "https://ui-avatars.com/api/?name=Eko+Prasetyo&background=FF3B30&color=fff&size=200",
    email: "eko.prasetyo@ummi.ac.id",
    nim: "2021005",
    phone: "081234567894",
    order: 5,
  },
];

const divisions = [
  "Ketua",
  "Sekretaris",
  "Bendahara",
  "Acara",
  "Humas",
  "Multimedia",
  "Riset & Teknologi",
];

export const getAllMembers = async (): Promise<OrganizationMember[]> => {
  return members.sort((a, b) => a.order - b.order);
};

export const getMembersByDivision = async (
  division: string
): Promise<OrganizationMember[]> => {
  return members
    .filter((m) => m.division === division)
    .sort((a, b) => a.order - b.order);
};

export const getMemberById = async (
  id: string
): Promise<OrganizationMember | null> => {
  return members.find((m) => m.id === id) || null;
};

export const createMember = async (
  name: string,
  position: string,
  division: string,
  photo: string,
  email: string,
  nim: string,
  phone: string
): Promise<OrganizationMember> => {
  const newMember: OrganizationMember = {
    id: Date.now().toString(),
    name,
    position,
    division,
    photo,
    email,
    nim,
    phone,
    order: members.length + 1,
  };

  members.push(newMember);
  return newMember;
};

export const updateMember = async (
  id: string,
  updates: Partial<OrganizationMember>
): Promise<OrganizationMember> => {
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) {
    throw new Error("Anggota tidak ditemukan");
  }

  members[index] = { ...members[index], ...updates };
  return members[index];
};

export const deleteMember = async (id: string): Promise<void> => {
  members = members.filter((m) => m.id !== id);
  // Reorder remaining members
  members.forEach((member, index) => {
    member.order = index + 1;
  });
};

export const reorderMembers = async (
  memberId: string,
  newOrder: number
): Promise<void> => {
  const member = members.find((m) => m.id === memberId);
  if (!member) throw new Error("Anggota tidak ditemukan");

  const oldOrder = member.order;

  if (newOrder > oldOrder) {
    // Moving down
    members.forEach((m) => {
      if (m.order > oldOrder && m.order <= newOrder) {
        m.order--;
      }
    });
  } else {
    // Moving up
    members.forEach((m) => {
      if (m.order >= newOrder && m.order < oldOrder) {
        m.order++;
      }
    });
  }

  member.order = newOrder;
};

export const getDivisions = (): string[] => {
  return divisions;
};
