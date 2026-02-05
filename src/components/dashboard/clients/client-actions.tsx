/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Client } from "@/types/clients";
import { AddClientModal } from "./add-client-modal";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import { deleteClient } from "@/services/clients";
import { SuccessToast, ErrorToast } from "@/lib/utils";

interface ClientActionsProps {
  client: Client;
}

export function ClientActions({ client }: ClientActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteClient(client.id);
      if (res?.success) {
        SuccessToast("Client deleted successfully");
      } else {
        ErrorToast(res?.message || "Problem deleting client");
      }
    } catch (error) {
      ErrorToast("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <AddClientModal
        client={client}
        trigger={
          <Button variant="ghost" size="icon-sm" className="hover:text-foreground">
            <Edit  />
          </Button>
        }
      />
      <ConfirmationModal
        title="Are you sure?"
        description="This client will be permanently deleted and cannot be recovered."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        trigger={
          <Button variant="ghost" size="icon-sm" className="hover:text-destructive">
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}
