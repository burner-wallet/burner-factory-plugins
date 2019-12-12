export interface Item {
  name: string;
  price: string;
  image?: string;
}

export interface Vendor {
  id: string;
  name: string;
  isOpen: boolean;
  recipient: string;
  items: Item[];
}

export interface Menu {
  vendors: Vendor[];
  asset: string;
}

export interface Selection {
  [item: number]: number;
}
