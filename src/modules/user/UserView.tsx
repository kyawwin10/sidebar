import React, { useState } from "react";
import api from "@/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddUserDialog from "./chunks/AddUser";

const UserView: React.FC = () => {
  const { data: users = [], isLoading } = api.user.userApi.useQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-4 py-3 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/30 shadow-md">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <Button onClick={() => setIsDialogOpen(true)}>+ Add User</Button>
      </div>

      {/* User Table */}
      <div className="p-4 rounded-xl bg-white/40 backdrop-blur-md shadow-lg">
        {isLoading && <p className="text-center">Loading...</p>}
       

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length ? (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <img
                      src={user.profileImageUrl || "https://via.placeholder.com/40"}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>{user.roleName}</TableCell>
         
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <AddUserDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </div>
  );
};

export default UserView;
