'use client';

import { useEffect, useState } from 'react';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PencilOff, Plus, Search, Trash2 } from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define the Driver type
type Driver = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  licenseNumber: string;
  assignedVehicleId: string;
  assignedRouteId: string;
  status: string;
  totalTrips: number;
  currentLocation: { lat: number; lng: number };
  createdAt?: Date;
  updatedAt?: Date;
};

// Define the Vehicle type
type Vehicle = {
  id: string;
  license_plate: string;
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id'>>({
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    assignedVehicleId: '',
    assignedRouteId: '',
    status: 'active',
    totalTrips: 0,
    currentLocation: { lat: 0, lng: 0 },
    createdAt: undefined,
    updatedAt: undefined,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editDriverId, setEditDriverId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteDriverId, setDeleteDriverId] = useState<string | null>(null);

  const driversCollectionRef = collection(db, 'drivers');
  const vehiclesCollectionRef = collection(db, 'vehicles');

  // Fetch drivers from Firestore
  const fetchDrivers = async () => {
    const data = await getDocs(driversCollectionRef);
    const driversList = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Driver[];
    setDrivers(driversList);
  };

  // Fetch vehicles from Firestore
  const fetchVehicles = async () => {
    const data = await getDocs(vehiclesCollectionRef);
    const vehiclesList = data.docs.map((doc) => ({
      id: doc.id,
      license_plate: doc.data().license_plate,
    })) as Vehicle[];
    setVehicles(vehiclesList);
  };

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, []);

  // Add or Update a driver
  const saveDriver = async () => {
    if (isEditing && editDriverId) {
      const driverDocRef = doc(driversCollectionRef, editDriverId);
      await updateDoc(driverDocRef, {
        ...newDriver,
        updatedAt: new Date(),
      });
    } else {
      await addDoc(driversCollectionRef, {
        ...newDriver,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    fetchDrivers(); // Refresh the list
    resetForm();
  };

  // Delete a driver
  const confirmDeleteDriver = async () => {
    if (deleteDriverId) {
      await deleteDoc(doc(driversCollectionRef, deleteDriverId));
      fetchDrivers(); // Refresh the list
      setShowDeleteConfirm(false);
      setDeleteDriverId(null);
    }
  };

  // Open edit drawer with pre-filled data
  const handleEditDriver = (driver: Driver) => {
    setNewDriver({
      name: driver.name,
      email: driver.email,
      password: driver.password,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      assignedVehicleId: driver.assignedVehicleId,
      assignedRouteId: driver.assignedRouteId,
      status: driver.status,
      totalTrips: driver.totalTrips,
      currentLocation: driver.currentLocation,
    });
    setEditDriverId(driver.id);
    setIsEditing(true);
  };

  // Reset the form and close the drawer
  const resetForm = () => {
    setNewDriver({
      name: '',
      email: '',
      password: '',
      phone: '',
      licenseNumber: '',
      assignedVehicleId: '',
      assignedRouteId: '',
      status: 'active',
      totalTrips: 0,
      currentLocation: { lat: 0, lng: 0 },
    });
    setIsEditing(false);
    setEditDriverId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Drivers Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" /> Add Driver
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px]">
              <SheetHeader>
                <SheetTitle>{isEditing ? 'Edit Driver' : 'Add New Driver'}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Driver Name</Label>
                  <Input
                    id="name"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newDriver.password}
                    onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedVehicleId">Assigned Vehicle</Label>
                  <Select
                    value={newDriver.assignedVehicleId}
                    onValueChange={(value) => setNewDriver({ ...newDriver, assignedVehicleId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.license_plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedRouteId">Assigned Route</Label>
                  <Input
                    id="assignedRouteId"
                    value={newDriver.assignedRouteId}
                    onChange={(e) => setNewDriver({ ...newDriver, assignedRouteId: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newDriver.status}
                    onValueChange={(value) => setNewDriver({ ...newDriver, status: value })}
                  >
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
                <div className="grid gap-2">
                  <Label htmlFor="totalTrips">Total Trips</Label>
                  <Input
                    id="totalTrips"
                    type="number"
                    value={newDriver.totalTrips}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, totalTrips: Number(e.target.value) })
                    }
                  />
                </div>
                <Button className="mt-4" onClick={saveDriver}>
                  {isEditing ? 'Update Driver' : 'Save Driver'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Trips</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers
              .filter((driver) =>
                driver.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>{driver.id}</TableCell>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.password}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.status}</TableCell>
                  <TableCell>{driver.totalTrips}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      <Button
                        className="p-2 bg-blue-500 border rounded hover:bg-blue-500"
                        onClick={() => handleEditDriver(driver)}
                      >
                        <PencilOff className="w-4 h-4" />
                      </Button>
                      <Button
                        className="p-2 bg-red-500 border rounded hover:bg-red-500"
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setDeleteDriverId(driver.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Are you sure you want to delete this driver?</p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                className="bg-gray-500 hover:bg-gray-600"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={confirmDeleteDriver}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
