import { useState } from 'react';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return { isOpen, toggle };
};