import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './empty.state';
import { Button } from './button';


const meta: Meta<typeof EmptyState> = {
title: 'UI/EmptyState',
component: EmptyState,
tags: ['autodocs'],
argTypes: {
icon: { control: 'text'},
title: { control: 'text'},
description: {control:'text'},
action: { control: 'object' },
className: { control: 'text'},

},
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: '📦',
    title: 'No Orders',
    description: 'You have not placed any orders yet.',
  },
};

export const WithAction: Story = {
  render: () => (
    <EmptyState
      title="No Projects"
      description="Start by creating a new project."
      action={
        <Button onClick={() => alert('Create Project clicked!')}>
          Create Project
        </Button>
      }
    />
  ),
};
export const CustomClass: Story = {
args: {
title: 'Custom Style',
description: 'This uses a custom class for layout.',
className: 'bg-gray-100 p-8 rounded-xl',
},
};