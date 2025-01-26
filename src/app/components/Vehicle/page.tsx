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
} from '@/components/ui/sheet';
import { Eye, PencilOff, Plus, Search, Trash2 } from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';

// Define the Vehicle type
type Vehicle = {
  id: string;
  name: string;
  driver: string;
  license_plate: string;
  status: string;
  fuel_level: number;
  last_maintenance: string;
  next_maintenance: string;
  total_distance: number;
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    name: '',
    driver: '',
    license_plate: '',
    status: 'active',
    fuel_level: 0,
    last_maintenance: '',
    next_maintenance: '',
    total_distance: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);

  const vehiclesCollectionRef = collection(db, 'vehicles');

  // Fetch vehicles from Firestore
  const fetchVehicles = async () => {
    const data = await getDocs(vehiclesCollectionRef);
    const vehiclesList = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vehicle[];
    setVehicles(vehiclesList);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Add or Update a vehicle
  const saveVehicle = async () => {
    if (isEditing && editVehicleId) {
      const vehicleDocRef = doc(vehiclesCollectionRef, editVehicleId);
      await updateDoc(vehicleDocRef, newVehicle);
    } else {
      await addDoc(vehiclesCollectionRef, newVehicle);
    }

    fetchVehicles(); // Refresh the list
    resetForm();
  };

  // Delete a vehicle
  const confirmDeleteVehicle = async () => {
    if (deleteVehicleId) {
      await deleteDoc(doc(vehiclesCollectionRef, deleteVehicleId));
      fetchVehicles(); // Refresh the list
      setShowDeleteConfirm(false);
      setDeleteVehicleId(null);
    }
  };

  // Open edit drawer with pre-filled data
  const handleEditVehicle = (vehicle: Vehicle) => {
    setNewVehicle({
      name: vehicle.name,
      driver: vehicle.driver,
      license_plate: vehicle.license_plate,
      status: vehicle.status,
      fuel_level: vehicle.fuel_level,
      last_maintenance: vehicle.last_maintenance,
      next_maintenance: vehicle.next_maintenance,
      total_distance: vehicle.total_distance,
    });
    setEditVehicleId(vehicle.id);
    setIsEditing(true);
  };

  // Reset the form and close the drawer
  const resetForm = () => {
    setNewVehicle({
      name: '',
      driver: '',
      license_plate: '',
      status: 'active',
      fuel_level: 0,
      last_maintenance: '',
      next_maintenance: '',
      total_distance: 0,
    });
    setIsEditing(false);
    setEditVehicleId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px]">
              <SheetHeader>
                <SheetTitle>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  />
                </div>
               
                <div className="grid gap-2">
                  <Label htmlFor="license">License Plate</Label>
                  <Input
                    id="license"
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newVehicle.status}
                    onValueChange={(value) => setNewVehicle({ ...newVehicle, status: value })}
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
                  <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    value={newVehicle.last_maintenance}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, last_maintenance: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                  <Input
                    id="nextMaintenance"
                    type="date"
                    value={newVehicle.next_maintenance}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, next_maintenance: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalDistance">Total Distance</Label>
                  <Input
                    id="totalDistance"
                    type="number"
                    value={newVehicle.total_distance}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, total_distance: Number(e.target.value) })
                    }
                  />
                </div>
                <Button className="mt-4" onClick={saveVehicle}>
                  {isEditing ? 'Update Vehicle' : 'Save Vehicle'}
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
              <TableHead>Vehicle ID</TableHead>
              <TableHead>Name</TableHead>
             
              <TableHead>License Plate</TableHead>
              <TableHead>Status</TableHead>
            
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles
              .filter((vehicle) =>
                vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.id}</TableCell>
                  <TableCell>{vehicle.name}</TableCell>
                 
                  <TableCell>{vehicle.license_plate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : vehicle.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </TableCell>
                
                  <TableCell>{vehicle.next_maintenance}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      <Button
                        className="p-2 bg-green-500 border rounded hover:bg-green-500"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <PencilOff className="w-4 h-4" />
                      </Button>
                      <Button
                        className="p-2 bg-red-500 border rounded hover:bg-red-500"
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setDeleteVehicleId(vehicle.id);
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
            <p>Are you sure you want to delete this vehicle?</p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                className="bg-gray-500 hover:bg-gray-600"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={confirmDeleteVehicle}
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
