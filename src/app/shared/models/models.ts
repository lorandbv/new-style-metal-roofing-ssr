export interface Product {
  id?: string;
  name: string;
  description: string;
  info: string;
  materials: Material[];
  hidden?: boolean;
}

export interface Material {
  name: string;
  colors: MaterialColor[];
}

export interface MaterialColor {
  name: string;
  img: string;
  imgFile?: File;
}

export interface Image {
  ref?: string;
  url?: string;
  file?: File;
  position?: number;
  name?: string;
  id?: string;
}
