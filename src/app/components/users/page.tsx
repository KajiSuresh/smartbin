'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Eye, PencilOff, Plus, Search, Trash2 } from 'lucide-react';
import { Truck } from '@/app/types';

const trucks: Truck[] = [
  {
    id: '1',
    name: 'Truck 001',
    driver: 'John Doe',
    license_plate: 'ABC123',
    status: 'active',
    current_location: { lat: 40.7128, lng: -74.006 },
    fuel_level: 75,
    last_maintenance: '2024-03-01',
    next_maintenance: '2024-04-01',
    total_distance: 15000,
  },
  // Add more mock data as needed
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trucks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Drivers
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px]">
              <SheetHeader>
                <SheetTitle>Add New Drivers</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Driver Name</Label>
                  <Input id="name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="license">License Plate</Label>
                  <Input id="license" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="driver">Assign Driver</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="mt-4">Save Truck</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Truck ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fuel Level</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trucks.map((truck) => (
              <TableRow key={truck.id}>
                <TableCell>{truck.id}</TableCell>
                <TableCell>{truck.name}</TableCell>
                <TableCell>{truck.driver}</TableCell>
                <TableCell>{truck.license_plate}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      truck.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : truck.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {truck.status}
                  </span>
                </TableCell>
                <TableCell>{truck.fuel_level}%</TableCell>
                <TableCell>{truck.next_maintenance}</TableCell>
                <TableCell>
                <div className="flex flex-row gap-2">
                    <Button className="p-2 bg-green-500 border rounded hover:bg-green-500">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button className="p-2 bg-blue-500 border rounded hover:bg-blue-500">
                      <PencilOff className="w-4 h-4" />
                    </Button>
                    <Button className="p-2 bg-red-500 border rounded hover:bg-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

