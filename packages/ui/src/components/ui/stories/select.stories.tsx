import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "../select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>
          Banana (Out of stock)
        </SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes" disabled>
          Grapes (Out of stock)
        </SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Small</label>
        <Select>
          <SelectTrigger className="w-[150px] h-8 text-sm">
            <SelectValue placeholder="Small select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Default</label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Default select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Large</label>
        <Select>
          <SelectTrigger className="w-[220px] h-12 text-base">
            <SelectValue placeholder="Large select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">
          Country
        </label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
            <SelectItem value="fr">France</SelectItem>
            <SelectItem value="jp">Japan</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="language" className="text-sm font-medium">
          Preferred Language
        </label>
        <Select defaultValue="en">
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Development</SelectLabel>
              <SelectItem value="frontend">Frontend Developer</SelectItem>
              <SelectItem value="backend">Backend Developer</SelectItem>
              <SelectItem value="fullstack">Full Stack Developer</SelectItem>
              <SelectItem value="mobile">Mobile Developer</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Design</SelectLabel>
              <SelectItem value="ux">UX Designer</SelectItem>
              <SelectItem value="ui">UI Designer</SelectItem>
              <SelectItem value="product">Product Designer</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Management</SelectLabel>
              <SelectItem value="pm">Product Manager</SelectItem>
              <SelectItem value="em">Engineering Manager</SelectItem>
              <SelectItem value="dm">Design Manager</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="af">Afghanistan</SelectItem>
        <SelectItem value="al">Albania</SelectItem>
        <SelectItem value="dz">Algeria</SelectItem>
        <SelectItem value="ar">Argentina</SelectItem>
        <SelectItem value="au">Australia</SelectItem>
        <SelectItem value="at">Austria</SelectItem>
        <SelectItem value="bd">Bangladesh</SelectItem>
        <SelectItem value="be">Belgium</SelectItem>
        <SelectItem value="br">Brazil</SelectItem>
        <SelectItem value="bg">Bulgaria</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="cl">Chile</SelectItem>
        <SelectItem value="cn">China</SelectItem>
        <SelectItem value="co">Colombia</SelectItem>
        <SelectItem value="hr">Croatia</SelectItem>
        <SelectItem value="cz">Czech Republic</SelectItem>
        <SelectItem value="dk">Denmark</SelectItem>
        <SelectItem value="eg">Egypt</SelectItem>
        <SelectItem value="fi">Finland</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="gr">Greece</SelectItem>
        <SelectItem value="in">India</SelectItem>
        <SelectItem value="id">Indonesia</SelectItem>
        <SelectItem value="ie">Ireland</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="jp">Japan</SelectItem>
        <SelectItem value="my">Malaysia</SelectItem>
        <SelectItem value="mx">Mexico</SelectItem>
        <SelectItem value="nl">Netherlands</SelectItem>
        <SelectItem value="nz">New Zealand</SelectItem>
        <SelectItem value="no">Norway</SelectItem>
        <SelectItem value="pk">Pakistan</SelectItem>
        <SelectItem value="ph">Philippines</SelectItem>
        <SelectItem value="pl">Poland</SelectItem>
        <SelectItem value="pt">Portugal</SelectItem>
        <SelectItem value="ro">Romania</SelectItem>
        <SelectItem value="ru">Russia</SelectItem>
        <SelectItem value="sa">Saudi Arabia</SelectItem>
        <SelectItem value="sg">Singapore</SelectItem>
        <SelectItem value="za">South Africa</SelectItem>
        <SelectItem value="kr">South Korea</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="se">Sweden</SelectItem>
        <SelectItem value="ch">Switzerland</SelectItem>
        <SelectItem value="th">Thailand</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="ua">Ukraine</SelectItem>
        <SelectItem value="ae">United Arab Emirates</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="vn">Vietnam</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const ControlledSelect: Story = {
  render: () => {
    const [value, setValue] = React.useState("");

    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Controlled Select
          </label>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
              <SelectItem value="option4">Option 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm">
          <strong>Selected value:</strong> {value || "None"}
        </div>

        <div className="space-x-2">
          <button
            onClick={() => setValue("option2")}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
          >
            Set to Option 2
          </button>
          <button
            onClick={() => setValue("")}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    );
  },
};

export const MultipleSelects: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Priority</label>
        <Select defaultValue="medium">
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">🟢 Low</SelectItem>
            <SelectItem value="medium">🟡 Medium</SelectItem>
            <SelectItem value="high">🟠 High</SelectItem>
            <SelectItem value="urgent">🔴 Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select defaultValue="todo">
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">📋 To Do</SelectItem>
            <SelectItem value="progress">⚡ In Progress</SelectItem>
            <SelectItem value="review">👀 In Review</SelectItem>
            <SelectItem value="done">✅ Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Assignee</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="john">👨‍💻 John Doe</SelectItem>
            <SelectItem value="jane">👩‍💻 Jane Smith</SelectItem>
            <SelectItem value="bob">👨‍🎨 Bob Johnson</SelectItem>
            <SelectItem value="alice">👩‍🎨 Alice Brown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Development</SelectLabel>
              <SelectItem value="feature">🚀 Feature</SelectItem>
              <SelectItem value="bug">🐛 Bug Fix</SelectItem>
              <SelectItem value="refactor">🔧 Refactor</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Design</SelectLabel>
              <SelectItem value="ui">🎨 UI Design</SelectItem>
              <SelectItem value="ux">💡 UX Research</SelectItem>
              <SelectItem value="prototype">📱 Prototype</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};
