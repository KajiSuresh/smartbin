import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent,  SheetHeader,  SheetTitle,  SheetTrigger } from '@/components/ui/sheet'
import { PencilOff, } from 'lucide-react'
import React from 'react'

const EditTruck = () => {
  return (
    <div>
      <Sheet>
            <SheetTrigger asChild>
            <Button className="p-2 bg-blue-500 border rounded hover:bg-blue-500">
                      <PencilOff className="w-4 h-4" />
                    </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px]">
            <SheetHeader>
                <SheetTitle>Edit Truck Details</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Truck Name</Label>
                  <Input id="name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="license">Number Plate</Label>
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
                <Button className="mt-4 bg-[#4caf50] hover:bg-[#80d983]">Edit Truck</Button>
              </div>
            </SheetContent>
          </Sheet>
    </div>
  )
}

export default EditTruck
