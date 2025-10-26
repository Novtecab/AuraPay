import React from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type NavItemType = 'home' | 'scan' | 'cart' | 'profile';

export interface NavItem {
  id: NavItemType;
  label: string;
  // FIX: Replaced JSX.Element with React.ReactElement to resolve the 'Cannot find namespace JSX' error.
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}
