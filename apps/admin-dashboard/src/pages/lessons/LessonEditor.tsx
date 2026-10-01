import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useRequestImageUploadUrlMutation } from "@synth-tree/api-types";
import {closestCenter,DndContext,type DragEndEvent} from "@dnd-kit/core";
import {arrayMove,SortableContext,useSortable,verticalListSortingStrategy} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, toast } from "@synth-tree/ui";
import DOMPurify from 'dompurify';
import { AlignJustify, Check, ChevronLeft, Code2, Eye, GripVertical,Image, Pen, PlaySquare, Plus, Trash} from 'lucide-react';
import { useEffect,useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// ─── 1. GRAPHQL ───────────────────────────────────────────────────────────────

const GET_LESSON_TITLE = gql`
  query adminSkillNode($id: ID!) {
    adminSkillNode(id: $id) {
      id
      title
      tree {
        courseId
        course {
          title
        }
      }
    }
  }
`;

const GET_LESSON_BLOCK = gql`
  query AdminLessonBlocksByNode($nodeId: ID!) {
    lessonBlocksByNode(nodeId: $nodeId) {
      id
      nodeId
      order
      caption
      type
      html
      url
    }
  }
`;

const SAVE_LESSON_TITLE = gql`
  mutation SaveLessonTitle($updateSkillNodeId: ID!, $input: UpdateSkillNodeInput!) {
    updateSkillNode(id: $updateSkillNodeId, input: $input) {
    id
    title
    }
  }
`;

const CREATE_LESSON_BLOCK = gql`
  mutation CreateLessonBlock($input: LessonBlocksCreateInput!) {
    createLessonBlock(input: $input) {
      id
      nodeId
      order
      caption
      type
      html
      url
    }
  }
`;

const UPDATE_LESSON_BLOCK = gql`
  mutation UpdateLessonBlock($input: LessonBlocksUpdateInput!) {
    updateLessonBlock(input: $input) {
      id
      html
    }
  }
`;

const DELETE_LESSON_BLOCK = gql`
  mutation DeleteLessonBlock($id: ID!) {
    deleteLessonBlock(id: $id) {
      id
    }
  }
`;

const REORDER_LESSON_BLOCKS = gql`
  mutation ReorderLessonBlocks($nodeId: ID!, $orderedBlockIds: [ID!]!) {
    reorderLessonBlocks(nodeId: $nodeId, orderedBlockIds: $orderedBlockIds) {
      id
      order
    }
  }
`;

// ─── 2. TYPES ─────────────────────────────────────────────────────────────────

type GetLessonTitleResponse = {
  adminSkillNode?: {
    id: string;
    title: string;
    tree: {
      courseId: string;
      course: {
        title: string;
      };
    };
  } | null;
};

type GetLessonBlocksResponse = {
  lessonBlocksByNode: {
    id: string;
    nodeId: string;
    order: number;
    caption?: string | null;
    type: string;
    html?: string | null;
    url?: string | null;
  }[];
};

// ─── 3. COMPONENT ─────────────────────────────────────────────────────────────

function SortableLessonBlock({block, children} : {block: GetLessonBlocksResponse["lessonBlocksByNode"][number]; children: React.ReactNode}) {
  const sortable = useSortable({id: block.id,});
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition
  };

  return(
    <div ref={sortable.setNodeRef} style={style} className="flex">
      <button {...sortable.listeners} {...sortable.attributes} ref={sortable.setActivatorNodeRef} style={{ touchAction: "none" }}>
        <GripVertical />
      </button>
      <div className="flex w-full flex-col">
        {children}
      </div>
    </div>
  );
}

// Sentinel key for the "insert before the first block" / empty-state add control.
const START_ADD_CONTROL_KEY = "__start__";

function AddBlockMenu({
  controlKey,
  openBlockId,
  onToggle,
  onAddText,
  onAddImage,
}: {
  controlKey: string;
  openBlockId: string | null;
  onToggle: (key: string) => void;
  onAddText: () => void;
  onAddImage: () => void;
}) {
  const comingSoonClass =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-[7px] text-[13px] font-medium leading-none rounded-[10px] border border-transparent bg-transparent text-muted-foreground opacity-50";

  return (
    <div className="flex justify-center relative">
      <Button
        onClick={() => onToggle(controlKey)}
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-full border border-border bg-muted text-muted-foreground opacity-40 hover:opacity-100"
        aria-label="Add block"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {openBlockId === controlKey && (
        <div className="absolute top-8 z-10 flex gap-1 rounded-[14px] border bg-popover p-1.5 shadow-md">
          <Button
            onClick={onAddText}
            leftIcon={<AlignJustify />}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-[7px] text-[13px] font-medium leading-none rounded-[10px] border border-transparent bg-transparent text-foreground transition-all duration-150"
            aria-label="Add Text block"
          >
            Text
          </Button>
          {/* v1 is text-only. The remaining block types are not implemented yet,
              so they are rendered visibly disabled instead of looking functional. */}
          <Button
            disabled
            title="Coming soon"
            leftIcon={<Pen />}
            className={comingSoonClass}
            aria-label="Add heading block (coming soon)"
          >
            Heading
          </Button>
          <Button
            onClick={onAddImage}
            leftIcon={<Image />}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-[7px] text-[13px] font-medium leading-none rounded-[10px] border border-transparent bg-transparent text-foreground transition-all duration-150"
            aria-label="Add image block"
          >
            Image
          </Button>
          <Button
            disabled
            title="Coming soon"
            leftIcon={<PlaySquare />}
            className={comingSoonClass}
            aria-label="Add video block (coming soon)"
          >
            Video
          </Button>
          <Button
            disabled
            title="Coming soon"
            leftIcon={<Code2 />}
            className={comingSoonClass}
            aria-label="Add embedded block (coming soon)"
          >
            Embedded
          </Button>
        </div>
      )}
    </div>
  );
}

function LessonEditor(){
  const { nodeId } = useParams();
  const [title, setTitle] = useState("");
  const [blockText, setBlockText] = useState<Record<string, string>>({});
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);
  const [lessonBlocks, setLessonBlocks] = useState<GetLessonBlocksResponse["lessonBlocksByNode"]>([]);
  const [deletedBlockIds, setDeletedBlockIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { data: titleData, loading: titleLoading, error: titleError } = useQuery<GetLessonTitleResponse>(GET_LESSON_TITLE, {
    variables: {
      id: nodeId,
    },
  });

  const { data: blockData, loading: blockLoading, error: blockError, refetch: refetchLessonBlocks } = useQuery<GetLessonBlocksResponse>(GET_LESSON_BLOCK, {
    variables: {
      nodeId,
    },
  });

  const [saveLessonTitle] = useMutation(
    SAVE_LESSON_TITLE
  );

  const [createLessonBlock] = useMutation<{
    createLessonBlock: GetLessonBlocksResponse["lessonBlocksByNode"][number] | null;
  }>(CREATE_LESSON_BLOCK);

  const [updateLessonBlock] = useMutation(
    UPDATE_LESSON_BLOCK
  );

  const [deleteLessonBlock] = useMutation(
    DELETE_LESSON_BLOCK
  );

  const [reorderLessonBlocks] = useMutation(
    REORDER_LESSON_BLOCKS
  );

  const [requestImageUploadUrl] = useRequestImageUploadUrlMutation();

  const handleAddButtonClick = (blockId: string) => {
    setOpenBlockId((currentBlockId) =>
      currentBlockId === blockId ? null : blockId,
    );
  }

  // Adding a block is a local-only edit: it inserts a temporary block into
  // state and defers the actual DB write to Save, so it is consistent with how
  // title/content/delete edits are handled. A newly added block that the user
  // abandons is never persisted. Pass `null` to insert before the first block
  // (also used for the empty-state affordance).
  const handleAddTextBlock = (afterBlockId: string | null) => {
    setOpenBlockId(null);

    if (!nodeId) {
      return;
    }

    const afterIndex = afterBlockId
      ? lessonBlocks.findIndex((block) => block.id === afterBlockId)
      : -1;
    const insertionIndex = afterIndex >= 0 ? afterIndex + 1 : 0;

    const newBlock: GetLessonBlocksResponse["lessonBlocksByNode"][number] = {
      id: `temp-${crypto.randomUUID()}`,
      nodeId,
      order: insertionIndex,
      caption: null,
      type: "HTML",
      html: "",
    };

    const reorderedBlocks = [
      ...lessonBlocks.slice(0, insertionIndex),
      newBlock,
      ...lessonBlocks.slice(insertionIndex),
    ].map((block, index) => ({
      ...block,
      order: index,
    }));

    setLessonBlocks(reorderedBlocks);
    setBlockText((previousText) => ({
      ...previousText,
      [newBlock.id]: "",
    }));
  };

  const handleAddImageBlock = (afterBlockId: string | null) => {
    setOpenBlockId(null);

    if (!nodeId) {
      return;
    }

    const afterIndex = afterBlockId
      ? lessonBlocks.findIndex((block) => block.id === afterBlockId)
      : -1;

    const insertionIndex = afterIndex >= 0 ? afterIndex + 1 : 0;

    const newBlock: GetLessonBlocksResponse["lessonBlocksByNode"][number] = {
      id: `temp-${crypto.randomUUID()}`,
      nodeId,
      order: insertionIndex,
      caption: null,
      type: "IMAGE",
      html: null,
      url: null,
    };

    const reorderedBlocks = [
      ...lessonBlocks.slice(0, insertionIndex),
      newBlock,
      ...lessonBlocks.slice(insertionIndex),
    ].map((block, index) => ({
      ...block,
      order: index,
    }));

    setLessonBlocks(reorderedBlocks);
  };

  const handleSave = async () => {
    if (!nodeId) {
      return;
    }

    const blocksToSave = [...lessonBlocks];
    const textToSave = { ...blockText };
    const blockIdsToDelete = [...deletedBlockIds];

    setIsSaving(true);

    try {
      // 1. Persist the lesson title.
      await saveLessonTitle({
        variables: {
          updateSkillNodeId: nodeId,
          input: {
            title: title,
          },
        },
      });

      // 2. Create any newly added (temporary) blocks, mapping temp id -> real id.
      const tempIdToRealId = new Map<string, string>();

      for (const block of blocksToSave) {
        if (!block.id.startsWith("temp-")) {
          continue;
        }

        const { data } = await createLessonBlock({
          variables: {
            input: {
              node: {
                connect: {
                  id: nodeId,
                },
              },
              order: block.order,
              type: block.type,
              ...(block.type === "HTML"
                ? {
                    html: DOMPurify.sanitize(textToSave[block.id] ?? ""),
                  }
                : block.type === "IMAGE"
                  ? {
                      url: block.url,
                      caption: block.caption,
                    }
                  : {}),
            },
          },
        });

        const createdBlock = data?.createLessonBlock;

        if (!createdBlock) {
          throw new Error("Failed to create a new block.");
        }

        tempIdToRealId.set(block.id, createdBlock.id);
      }

      // 3. Persist content edits for existing HTML blocks.
      await Promise.all(
        blocksToSave
          .filter((block) => !block.id.startsWith("temp-") && block.type === "HTML")
          .map((block) =>
            updateLessonBlock({
              variables: {
                input: {
                  id: { set: block.id },
                  html: { set: DOMPurify.sanitize(textToSave[block.id] ?? "") },
                },
              },
            }),
          ),
      );

      // Persist URL and caption edits for existing IMAGE blocks.
      await Promise.all(
        blocksToSave
          .filter((block) => !block.id.startsWith("temp-") && block.type === "IMAGE")
          .map((block) =>
            updateLessonBlock({
              variables: {
                input: {
                  id: { set: block.id },
                  url: { set: block.url ?? null },
                  caption: { set: block.caption ?? null },
                },
              },
            }),
          ),
      );

      // 4. Delete removed blocks.
      await Promise.all(
        blockIdsToDelete.map((blockId) =>
          deleteLessonBlock({
            variables: {
              id: blockId,
            },
          }),
        ),
      );

      // 5. Persist the final ordering atomically in a single mutation.
      const orderedBlockIds = blocksToSave.map(
        (block) => tempIdToRealId.get(block.id) ?? block.id,
      );

      if (orderedBlockIds.length > 0) {
        await reorderLessonBlocks({
          variables: {
            nodeId,
            orderedBlockIds,
          },
        });
      }

      // 6. Re-sync local state with the server (real ids + persisted order).
      await refetchLessonBlocks();

      setDeletedBlockIds([]);
      toast("Lesson saved", {
        description: "Your lesson changes were saved successfully.",
      });
    } catch (error) {
      toast("Unable to save lesson", {
        description: error instanceof Error
          ? error.message
          : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (titleData?.adminSkillNode?.title) {
      setTitle(titleData.adminSkillNode.title);
    }

    if (!blockData?.lessonBlocksByNode) {
      return;
    }

    setLessonBlocks(blockData.lessonBlocksByNode);

    const startingText: Record<string, string> = {};

    blockData.lessonBlocksByNode
      .filter((block) => block.type === "HTML")
      .forEach((block) => {
        startingText[block.id] = block.html ?? "";
      });

    setBlockText(startingText);

  }, [titleData, blockData]);

  const handleBlockChange = (blockId: string, newText: string) => {
    setBlockText((previousText) => ({
      ...previousText,
      [blockId]: newText,
    }));
  };

  const handleCaptionChange = (blockId: string, caption: string) => {
    setLessonBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === blockId
          ? { ...block, caption }
          : block
      )
    );
  };

  const handleImageSelect = async (
    blockId: string,
    file: File | undefined,
  ) => {
    if (!file) {
      return;
    }

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      toast("Invalid image type", {
        description: "Please select a JPEG, PNG, WebP, or GIF image.",
      });
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      toast("Image is too large", {
        description: "Please select an image smaller than 5 MB.",
      });
      return;
    }
    try {
      const { data } = await requestImageUploadUrl({
        variables: {
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        },
      });

      if (!data?.requestImageUploadUrl) {
        toast("Upload failed", {
          description: "Could not prepare the image upload.",
        });
        return;
      }

      const { uploadUrl, objectUrl } = data.requestImageUploadUrl;

      const uploadResponse = await fetch(
        uploadUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        },
      );

      if (!uploadResponse.ok) {
        toast("Upload failed", {
          description: "Could not upload the image.",
        });
        return;
      }

      setLessonBlocks((previousBlocks) =>
        previousBlocks.map((block) =>
          block.id === blockId
            ? { ...block, url: objectUrl }
            : block
        )
      );
    } catch (error) {
      console.error("Image upload failed:", error);

      toast("Upload failed", {
        description: "Something went wrong while uploading the image.",
      });
    }
};

  const handleBlockDelete = (blockId: string) => {
    const remainingBlocks = lessonBlocks
      .filter((block) => block.id !== blockId)
      .map((block, index) => ({
        ...block,
        order: index,
      }));

    setLessonBlocks(remainingBlocks);

    if (!blockId.startsWith("temp-")) {
      setDeletedBlockIds((previousIds) =>
        previousIds.includes(blockId) ? previousIds : [...previousIds, blockId],
      );
    }

    setBlockText((previousText) => {
      const newText = { ...previousText };
      delete newText[blockId];
      return newText;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = lessonBlocks.findIndex((block) => block.id === active.id);
    const newIndex = lessonBlocks.findIndex((block) => block.id === over.id);

    const newOrder = arrayMove(lessonBlocks, oldIndex, newIndex);

    const reorderedBlocks = newOrder.map((block, index) => ({
      ...block,
      order: index,
    }));

    setLessonBlocks(reorderedBlocks)

  };

  if (titleLoading) {
      return <p>Loading lesson...</p>;
    }

  if (blockLoading) {
    return <p>Loading lesson blocks...</p>;
  }

  if (titleError) {
    return <p>No title</p>;
  }

  if (blockError) {
    return <p>Unable to load lesson blocks.</p>;
  }
  return(
    <div className="mx-auto w-full max-w-[780px] px-6 py-6">
      <div className="flex justify-between mb-6">
        <Button
          className="rounded-xl text-foreground hover:bg-muted hover:text-foreground border-0"
          variant="outline"
          leftIcon={<ChevronLeft />}
        >
          <Link to={`/courses/${titleData?.adminSkillNode?.tree.courseId}/edit`}>
            Back to course
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button className="rounded-xl" variant="outline" leftIcon={<Eye />} disabled title="Preview coming soon">
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving} loading={isSaving} className="text-primary-foreground bg-primary rounded-xl hover:brightness-[0.96]" leftIcon={<Check />}>
            {isSaving ? "Saving…" : "Save lesson"}
          </Button>
        </div>
      </div>
      <p className="mb-1">
        {titleData?.adminSkillNode?.tree.course.title} · {titleData?.adminSkillNode?.title}
      </p>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} type="text" aria-label="Lesson title"/>
      <div className="flex flex-col justify-center align-center">
        {(() => {
          const editableBlocks = lessonBlocks.filter(
            (block) => block.type === "HTML" || block.type === "IMAGE"
          );

          return (
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
              <SortableContext items={editableBlocks.map((block) => block.id)} strategy={verticalListSortingStrategy}
              >
                {editableBlocks.length === 0 && (
                  <p className="mt-4 mb-2 text-center text-sm text-muted-foreground">
                    This lesson has no content yet. Add your first block below.
                  </p>
                )}

                {/* Insert point before the first block, and the empty-state add affordance. */}
                <AddBlockMenu
                  controlKey={START_ADD_CONTROL_KEY}
                  openBlockId={openBlockId}
                  onToggle={handleAddButtonClick}
                  onAddText={() => handleAddTextBlock(null)}
                  onAddImage={() => handleAddImageBlock(null)}
                />

                {editableBlocks.map((block) => {
                  return (
                    <SortableLessonBlock  block={block} key={block.id} >
                      <Button
                        onClick={() => handleBlockDelete(block.id)}
                        className="self-start rounded-xl text-foreground hover:bg-muted hover:text-foreground border-0" variant="outline"
                        size="sm"
                        aria-label="Delete block"
                      >
                        <Trash className="h-4 w-4"/>
                      </Button>
                      {block.type === "HTML" && (
                        <div
                          contentEditable
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(blockText[block.id] ?? ""),
                          }}
                          onBlur={(e) => {
                            handleBlockChange(
                              block.id,
                              e.currentTarget.innerHTML
                            );
                          }}
                        >
                        </div>
                      )}
                      {block.type === "IMAGE" && (
                        <div className="w-full rounded-xl border border-dashed p-8 bg-[linear-gradient(135deg,hsl(var(--accent))_0%,hsl(var(--muted))_100%)]">
                          <div className="flex flex-col items-center justify-center">
                            <input
                              id={`image-upload-${block.id}`}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              onChange={(e) =>
                                handleImageSelect(block.id, e.target.files?.[0])
                              }
                            />

                            {block.url ? (
                              <label
                                htmlFor={`image-upload-${block.id}`}
                                className="cursor-pointer"
                              >
                                <img
                                  src={block.url}
                                  alt={block.caption || "Lesson image"}
                                  className="max-h-80 max-w-full rounded-xl object-contain"
                                />
                              </label>
                            ) : (
                              <label
                                htmlFor={`image-upload-${block.id}`}
                                className="flex cursor-pointer flex-col items-center justify-center"
                              >
                                <Image className="h-8 w-8 text-muted-foreground" />
                                <p className="mt-6 text-lg font-medium">
                                  Drop image or click to upload
                                </p>
                              </label>
                            )}

                            <Input
                              type="text"
                              value={block.caption ?? ""}
                              onChange={(e) =>
                                handleCaptionChange(block.id, e.target.value)
                              }
                              placeholder="Add a caption"
                              className="mt-6 max-w-md rounded-xl text-center"
                              aria-label="Image caption"
                            />
                          </div>
                        </div>
                      )}
                      <AddBlockMenu
                        controlKey={block.id}
                        openBlockId={openBlockId}
                        onToggle={handleAddButtonClick}
                        onAddText={() => handleAddTextBlock(block.id)}
                        onAddImage={() => handleAddImageBlock(block.id)}
                      />
                    </SortableLessonBlock>)
                })}
              </SortableContext>
            </DndContext>
          );
        })()}
      </div>
    </div>
  );
}

export default LessonEditor;
