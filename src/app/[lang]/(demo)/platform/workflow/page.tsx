"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WorkflowPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateWorkflow = async () => {
    // Add your workflow creation logic here
    setShowDialog(false);
    setWorkflowName("");
    setDescription("");
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <Button onClick={() => setShowDialog(true)}>Create Workflow</Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Enter the details for your new workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <Input
                id="name"
                placeholder="Enter workflow name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <Input
                id="description"
                placeholder="Enter workflow description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add your workflows list/grid here */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add workflow cards here */}
      </div>
    </div>
  );
}
