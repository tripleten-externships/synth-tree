import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  toast,
} from "@synth-tree/ui";

const GET_LESSON = gql`
  query GetLesson($nodeId: ID!) {
    adminMySkillNode(id: $nodeId) {
      id
      title
    }
    lessonBlocksByNode(nodeId: $nodeId) {
      id
      type
      html
      order
    }
  }
`;

const UPDATE_NODE = gql`
  mutation UpdateNode($id: ID!, $input: UpdateSkillNodeInput!) {
    updateSkillNode(id: $id, input: $input) {
      id
      title
    }
  }
`;

const CREATE_BLOCK = gql`
  mutation CreateBlock($input: LessonBlocksCreateInput!) {
    createLessonBlock(input: $input) {
      id
    }
  }
`;

const UPDATE_BLOCK = gql`
  mutation UpdateBlock($input: LessonBlocksUpdateInput!) {
    updateLessonBlock(input: $input) {
      id
    }
  }
`;

const DELETE_BLOCK = gql`
  mutation DeleteBlock($id: ID!) {
    deleteLessonBlock(id: $id) {
      id
    }
  }
`;

type Block = { key: string; id?: string; html: string };

type LessonData = {
  adminMySkillNode?: { title: string } | null;
  lessonBlocksByNode?: Array<{ id: string; type: string; html?: string | null; order: number }>;
};

let tempId = 0;

function BlockRow({
  block,
  onChange,
  onDelete,
}: {
  block: Block;
  onChange: (html: string) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.key,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex gap-2 border rounded-lg p-3 mb-2 bg-white"
    >
      <button type="button" className="p-1 text-gray-400" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4" />
      </button>
      <textarea
        value={block.html}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="flex-1 border rounded px-2 py-1 text-sm"
      />
      <button type="button" onClick={onDelete} className="p-1 text-gray-400">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddBlockBtn({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="py-2 text-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="text-sm border border-dashed px-3 py-1 rounded text-gray-500">
            <Plus className="w-3 h-3 inline" /> add block
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onAdd}>text</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function LessonEditor() {
  const { nodeId } = useParams();
  const { data, loading, error, refetch } = useQuery<LessonData>(GET_LESSON, {
    variables: { nodeId },
    skip: !nodeId,
  });

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [savedTitle, setSavedTitle] = useState("");
  const [savedBlocks, setSavedBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);

  const [updateNode] = useMutation(UPDATE_NODE);
  const [createBlock] = useMutation(CREATE_BLOCK);
  const [updateBlock] = useMutation(UPDATE_BLOCK);
  const [deleteBlock] = useMutation(DELETE_BLOCK);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!data?.adminMySkillNode) return;
    const loaded: Block[] = [];
    const list = [...(data.lessonBlocksByNode || [])].sort((a, b) => a.order - b.order);
    for (const b of list) {
      if (b.type !== "HTML") continue;
      loaded.push({ key: b.id, id: b.id, html: b.html || "" });
    }
    const t = data.adminMySkillNode.title || "";
    setTitle(t);
    setBlocks(loaded);
    setSavedTitle(t);
    setSavedBlocks(loaded);
  }, [data]);

  const dirty = title !== savedTitle || JSON.stringify(blocks) !== JSON.stringify(savedBlocks);

  async function save() {
    if (!nodeId) return;
    setSaving(true);
    try {
      if (title !== savedTitle) {
        await updateNode({ variables: { id: nodeId, input: { title } } });
      }
      for (const old of savedBlocks) {
        if (!old.id) continue;
        if (!blocks.find((b) => b.id === old.id)) {
          await deleteBlock({ variables: { id: old.id } });
        }
      }
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (!b.id) {
          await createBlock({
            variables: {
              input: { type: "HTML", html: b.html, order: i, node: { connect: { id: nodeId } } },
            },
          });
        } else {
          const prev = savedBlocks.find((x) => x.id === b.id);
          const prevIdx = savedBlocks.findIndex((x) => x.id === b.id);
          if (!prev || prev.html !== b.html || prevIdx !== i) {
            await updateBlock({
              variables: {
                input: { id: { set: b.id }, html: { set: b.html }, order: { set: i } },
              },
            });
          }
        }
      }
      await refetch();
      toast.success("saved");
    } catch {
      toast.error("save failed");
    }
    setSaving(false);
  }

  if (loading) return <div className="p-6">loading...</div>;
  if (error || !data?.adminMySkillNode) {
    return (
      <div className="p-6">
        <p>could not load lesson</p>
        <Link to="/courses">back</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between mb-4">
        <Link to="/courses">back</Link>
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? "saving..." : "save"}
        </Button>
      </div>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4" />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => {
          if (!e.over || e.active.id === e.over.id) return;
          const from = blocks.findIndex((b) => b.key === e.active.id);
          const to = blocks.findIndex((b) => b.key === e.over!.id);
          if (from >= 0 && to >= 0) setBlocks(arrayMove(blocks, from, to));
        }}
      >
        <SortableContext items={blocks.map((b) => b.key)} strategy={verticalListSortingStrategy}>
          <AddBlockBtn onAdd={() => { tempId++; setBlocks([{ key: "t" + tempId, html: "" }, ...blocks]); }} />
          {blocks.map((block, i) => (
            <div key={block.key}>
              <BlockRow
                block={block}
                onChange={(html) => setBlocks(blocks.map((b) => (b.key === block.key ? { ...b, html } : b)))}
                onDelete={() => setBlocks(blocks.filter((b) => b.key !== block.key))}
              />
              <AddBlockBtn onAdd={() => { tempId++; const n = [...blocks]; n.splice(i + 1, 0, { key: "t" + tempId, html: "" }); setBlocks(n); }} />
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
