'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Truck,
  BarChart3,
  Users,
  Settings,
  Map,
  Bell,
  LogOut,
  Trash ,
  User,
  Newspaper
} from 'lucide-react';

const routes = [
  {
    label: 'Dashboard',
    icon: BarChart3,
    href: '/components/dashboard',
    color: 'text-white',
  },
  {
    label: 'Trucks',
    icon: Truck,
    href: '/components/truck',
    color: 'text-white',
  },
  {
    label: 'Map',
    icon: Map,
    href: '/dashboard/map',
    color: 'text-white',
  },
  {
    label: 'Vehicle',
    icon: Map,
    href: '/components/Vehicle',
    color: 'text-white',
  },
  {
    label: 'Drivers',
    icon: Users,
    href: '/components/drivers',
    color: 'text-white',
  },
  {
    label: 'Users',
    icon: User,
    href: '/components/users',
    color:'text-white'
  },
  {
    label: 'Waste Collection',
    icon: Trash,
    href: '/dashboard/wastecollection',
    color:'text-white'
  },
  {
    label: 'News',
    icon: Newspaper,
    href: '/dashboard/news',
    color:'text-white'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    color:'text-white'
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#4caf50] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/components/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Truck className="h-8 w-8 text-blue-500 rotate-[-10deg]" />
          </div>
          <h1 className="text-2xl font-bold">FleetTrack</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-[#81c784] rounded-lg transition',
                pathname === route.href
                  ? 'text-white bg-[#81c784]'
                  : 'text-white'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto border-t border-gray-700">
        <div className="px-3 py-4">
          <div className="flex items-center justify-between p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span className="text-sm">Notifications</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer">
            <div className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}