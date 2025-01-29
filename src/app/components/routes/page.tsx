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
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the route type
type Route = {
  id: string;
  route_name: string;
  starting_point: string;
  ending_point: string;
  total_distance: number;
  created_at: Timestamp;
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newRoute, setNewRoute] = useState<Omit<Route, 'id'>>({
    route_name: '',
    starting_point: '',
    ending_point: '',
    total_distance: 0,
    created_at: Timestamp.now(),
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const routesCollectionRef = collection(db, 'routes');

  // Fetch routes from Firestore
  const fetchRoutes = async () => {
    const data = await getDocs(routesCollectionRef);
    const routesList = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Route[];
    setRoutes(routesList);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSaveRoute = async () => {
    try {
      const routeData = {
        ...newRoute,
        created_at: Timestamp.now()
      };
      await addDoc(routesCollectionRef, routeData);
      toast.success("Route added successfully!", {
        autoClose: 4000,
        onClose: () => window.location.reload()
      });

      setIsDrawerOpen(false);
      setNewRoute({
        route_name: '',
        starting_point: '',
        ending_point: '',
        total_distance: 0,
        created_at: Timestamp.now(),
      });
    } catch {
      toast.error("Failed to add route.");
    }
  };

  const handleUpdateRoute = async () => {
    if (selectedRouteId) {
      try {
        const routeDoc = doc(routesCollectionRef, selectedRouteId);
        await updateDoc(routeDoc, newRoute);
        toast.success("Route updated successfully!", {
          autoClose: 4000,
          onClose: () => window.location.reload()
        });

        setIsDrawerOpen(false);
        setIsUpdateMode(false);
        setNewRoute({
          route_name: '',
          starting_point: '',
          ending_point: '',
          total_distance: 0,
          created_at: Timestamp.now(),
        });
      } catch {
        toast.error("Failed to update route.");
      }
    }
  };

  const handleDeleteRoute = async () => {
    if (selectedRouteId) {
      try {
        const routeDoc = doc(routesCollectionRef, selectedRouteId);
        await deleteDoc(routeDoc);
        toast.success("Route deleted successfully!", {
          autoClose: 4000,
          onClose: () => window.location.reload()
        });

        setIsDeleteModalOpen(false);
      } catch {
        toast.error("Failed to delete route.");
      }
    }
  };

  const openUpdateDrawer = (route: Route) => {
    setNewRoute(route);
    setSelectedRouteId(route.id);
    setIsUpdateMode(true);
    setIsDrawerOpen(true);
  };

  const openDeleteModal = (routeId: string) => {
    setSelectedRouteId(routeId);
    setIsDeleteModalOpen(true);
  };

  // Filter routes based on search term
  const filteredRoutes = routes.filter(route =>
    route.route_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Routes Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search routes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => { setIsDrawerOpen(true); setIsUpdateMode(false); }}>
                <Plus className="mr-2 h-4 w-4" /> Add Route
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px]">
              <SheetHeader>
                <SheetTitle>{isUpdateMode ? "Update Route" : "Add New Route"}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="route_name">Route Name</Label>
                  <Input
                    id="route_name"
                    value={newRoute.route_name}
                    onChange={(e) => setNewRoute({ ...newRoute, route_name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="starting_point">Starting Point</Label>
                  <Input
                    id="starting_point"
                    value={newRoute.starting_point}
                    onChange={(e) => setNewRoute({ ...newRoute, starting_point: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ending_point">Ending Point</Label>
                  <Input
                    id="ending_point"
                    value={newRoute.ending_point}
                    onChange={(e) => setNewRoute({ ...newRoute, ending_point: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="total_distance">Total Distance</Label>
                  <Input
                    id="total_distance"
                    type="number"
                    value={newRoute.total_distance}
                    onChange={(e) => setNewRoute({ ...newRoute, total_distance: parseFloat(e.target.value) })}
                  />
                </div>
                <Button className="mt-4" onClick={isUpdateMode ? handleUpdateRoute : handleSaveRoute}>
                  {isUpdateMode ? "Update Route" : "Save Route"}
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
              <TableHead>Route ID</TableHead>
              <TableHead>Route Name</TableHead>
              <TableHead>Starting Point</TableHead>
              <TableHead>Ending Point</TableHead>
              <TableHead>Total Distance</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>{route.id}</TableCell>
                <TableCell>{route.route_name}</TableCell>
                <TableCell>{route.starting_point}</TableCell>
                <TableCell>{route.ending_point}</TableCell>
                <TableCell>{route.total_distance} Km </TableCell>
                <TableCell>{route.created_at.toDate().toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    <Button className="p-2 bg-blue-500 border rounded hover:bg-blue-500" onClick={() => openUpdateDrawer(route)}>
                      <PencilOff className="w-4 h-4" />
                    </Button>
                    <Button className="p-2 bg-red-500 border rounded hover:bg-red-500" onClick={() => openDeleteModal(route.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this route?</h2>
            <div className="flex justify-end gap-4">
              <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button className="bg-red-500" onClick={handleDeleteRoute}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
