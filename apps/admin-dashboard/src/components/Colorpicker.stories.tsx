import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './Colorpicker';

const meta = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialColor: '#ff0000',
    onConfirm: (hex: string) => {
      console.log('Selected color:', hex);
      alert(`Selected color: ${hex}`);
    },
  },
};

export const BlueStart: Story = {
  args: {
    initialColor: '#0000ff',
    onConfirm: (hex: string) => {
      console.log('Selected color:', hex);
    },
  },
};

export const GreenStart: Story = {
  args: {
    initialColor: '#00ff00',
    onConfirm: (hex: string) => {
      console.log('Selected color:', hex);
    },
  },
};
