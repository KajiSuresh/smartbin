'use client';

import {BellIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileSidebar } from './mobile-sidebar';


export function Header() {
  // const { setTheme } = useTheme();

  return (
    <div className="fixed top-0 left-0 w-full z-10 border-b bg-white shadow">
    <div className="flex h-16 items-center px-4">
      <MobileSidebar />
      <div className="ml-auto flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <div className="bg-[#81c784] text-white px-4 py-2 rounded-full text-sm font-medium">
            Live Tracking
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  </div>
  );
}