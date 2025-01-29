'use client';

import { useState, useEffect } from 'react';
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
import {  Plus, Search, PencilOff, Trash2 } from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the user type
type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: Timestamp;
  password_hash: string;
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState<User>({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    role: 'public_user',
    created_at: Timestamp.now(),
    password_hash: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList as User[]);
    };

    fetchUsers();
  }, []);

  const handleSaveUser = async () => {
    try {
      const userData = {
        ...newUser,
        created_at: Timestamp.now()
      };
      await addDoc(collection(db, "users"), userData);
      toast.success("User added successfully!", {
        autoClose: 4000,
        onClose: () => window.location.reload()
      });

      setIsDrawerOpen(false);
      setNewUser({
        id: '',
        full_name: '',
        email: '',
        phone: '',
        role: 'public_user',
        created_at: Timestamp.now(),
        password_hash: '',
      });
    } catch {
      toast.error("Failed to add user.");
    }
  };

  const handleUpdateUser = async () => {
    if (selectedUserId) {
      try {
        const userDoc = doc(db, "users", selectedUserId);
        await updateDoc(userDoc, newUser);
        toast.success("User updated successfully!", {
          autoClose: 4000,
          onClose: () => window.location.reload()
        });

        setIsDrawerOpen(false);
        setIsUpdateMode(false);
        setNewUser({
          id: '',
          full_name: '',
          email: '',
          phone: '',
          role: 'public_user',
          created_at: Timestamp.now(),
          password_hash: '',
        });
      } catch {
        toast.error("Failed to update user.");
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUserId) {
      try {
        const userDoc = doc(db, "users", selectedUserId);
        await deleteDoc(userDoc);
        toast.success("User deleted successfully!", {
          autoClose: 4000,
          onClose: () => window.location.reload()
        });

        setIsDeleteModalOpen(false);
      } catch {
        toast.error("Failed to delete user.");
      }
    }
  };

  const openUpdateDrawer = (user: User) => {
    setNewUser(user);
    setSelectedUserId(user.id);
    setIsUpdateMode(true);
    setIsDrawerOpen(true);
  };

  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => { setIsDrawerOpen(true); setIsUpdateMode(false); }}>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px]">
              <SheetHeader>
                <SheetTitle>{isUpdateMode ? "Update User" : "Add New User"}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password_hash}
                    onChange={(e) => setNewUser({ ...newUser, password_hash: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="public_user">Public User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="mt-4" onClick={isUpdateMode ? handleUpdateUser : handleSaveUser}>
                  {isUpdateMode ? "Update User" : "Save User"}
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
              <TableHead>User ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.created_at.toDate().toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    <Button className="p-2 bg-blue-500 border rounded hover:bg-blue-500" onClick={() => openUpdateDrawer(user)}>
                      <PencilOff className="w-4 h-4" />
                    </Button>
                    <Button className="p-2 bg-red-500 border rounded hover:bg-red-500" onClick={() => openDeleteModal(user.id)}>
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
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this user?</h2>
            <div className="flex justify-end gap-4">
              <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button className="bg-red-500" onClick={handleDeleteUser}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

