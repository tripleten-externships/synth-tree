import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";

const meta: Meta<typeof Dialog> = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a dialog description. It provides additional context about
            the dialog content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const SimpleDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Simple Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simple Dialog</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>This is a simple dialog with minimal content.</p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the item
            and remove it from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input id="name" defaultValue="John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              defaultValue="john@example.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bio" className="text-right text-sm font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              defaultValue="Software developer passionate about creating great user experiences."
              className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContentDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Terms & Conditions</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
            <p>
              By accessing and using this service, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Use License</h3>
            <p>
              Permission is granted to temporarily download one copy of the
              materials on our website for personal, non-commercial transitory
              viewing only. This is the grant of a license, not a transfer of
              title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>modify or copy the materials</li>
              <li>
                use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                attempt to reverse engineer any software contained on the
                website
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Disclaimer</h3>
            <p>
              The materials on our website are provided on an 'as is' basis. We
              make no warranties, expressed or implied, and hereby disclaim and
              negate all other warranties including without limitation, implied
              warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">4. Limitations</h3>
            <p>
              In no event shall our company or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on our website, even if we or
              our authorized representative has been notified orally or in
              writing of the possibility of such damage.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Decline</Button>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AlertDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Alert</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>⚠️ Warning</DialogTitle>
          <DialogDescription>
            Your session will expire in 5 minutes. Please save your work to
            avoid losing any changes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Extend Session</Button>
          <Button>Save Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const SuccessDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Complete Action</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>✅ Success!</DialogTitle>
          <DialogDescription>
            Your changes have been saved successfully. You can now continue with
            your work.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const CustomSizeDialog: Story = {
  render: () => (
    <div className="flex gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Small Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">This is a small dialog.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Large Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>
              This dialog has more space for content and complex layouts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Left Column</h4>
                <p className="text-sm text-muted-foreground">
                  Content in the left column of this larger dialog.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Right Column</h4>
                <p className="text-sm text-muted-foreground">
                  Content in the right column of this larger dialog.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const MultiStepDialog: Story = {
  render: () => {
    const [step, setStep] = React.useState(1);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Multi-Step Process</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Wizard - Step {step} of 3</DialogTitle>
            <DialogDescription>
              {step === 1 && "Let's start by getting your basic information."}
              {step === 2 && "Now, let's configure your preferences."}
              {step === 3 && "Finally, review and confirm your settings."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Enter your name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="font-medium">Review Your Settings</h4>
                <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong> John Doe
                  </div>
                  <div>
                    <strong>Email:</strong> john@example.com
                  </div>
                  <div>
                    <strong>Theme:</strong> Light
                  </div>
                  <div>
                    <strong>Language:</strong> English
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={() => setStep(1)}>Complete</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
