export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isPrimary: boolean;
}

export interface CertificationEntry {
  id: string;
  certType: string;
  certNumber: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  documentFile: File | null;
}

export interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  farmingType: string;
  price: number;
  unit: string;
  availableQuantity: number;
  minOrderQuantity: number;
  provinceId: string;
  harvestDate: string;
  images: ImageFile[];
  certifications: CertificationEntry[];
}

export const INITIAL_DATA: ProductFormData = {
  name: "",
  description: "",
  categoryId: "",
  farmingType: "",
  price: 0,
  unit: "",
  availableQuantity: 0,
  minOrderQuantity: 0,
  provinceId: "",
  harvestDate: "",
  images: [],
  certifications: [],
};
