import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, toast } from "@synth-tree/ui";
import DOMPurify from "dompurify";
import {
  AlignJustify,
  Check,
  ChevronLeft,
  Code2,
  Eye,
  GripVertical,
  Image,
  Pen,
  PlaySquare,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useAdminLessonQuizQuery,
  useDeleteQuizMutation,
  useSaveQuizMutation,
} from "@synth-tree/api-types";

import QuizEditor from "./quiz/QuizEditor";
import { quizDraftFromServer, toSaveQuizInput, type QuizDraft } from "./quiz/quizDraft";

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
  }[];
};

// ─── 3. COMPONENT ─────────────────────────────────────────────────────────────

function SortableLessonBlock({
  block,
  children,
}: {
  block: GetLessonBlocksResponse["lessonBlocksByNode"][number];
  children: React.ReactNode;
}) {
  const sortable = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <div ref={sortable.setNodeRef} style={style} className="flex">
      <button
        {...sortable.listeners}
        {...sortable.attributes}
        ref={sortable.setActivatorNodeRef}
        style={{ touchAction: "none" }}
      >
        <GripVertical />
      </button>
      <div className="flex w-full flex-col">{children}</div>
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
}: {
  controlKey: string;
  openBlockId: string | null;
  onToggle: (key: string) => void;
  onAddText: () => void;
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
            disabled
            title="Coming soon"
            leftIcon={<Image />}
            className={comingSoonClass}
            aria-label="Add image block (coming soon)"
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

function LessonEditor() {
  const { nodeId } = useParams();
  const [title, setTitle] = useState("");
  const [blockText, setBlockText] = useState<Record<string, string>>({});
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);
  const [lessonBlocks, setLessonBlocks] = useState<GetLessonBlocksResponse["lessonBlocksByNode"]>(
    [],
  );
  const [deletedBlockIds, setDeletedBlockIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  // The quiz is edited as a draft and written on Save, like the blocks. A quiz
  // the author removed is remembered here so Save can delete it.
  const [quizDraft, setQuizDraft] = useState<QuizDraft | null>(null);
  const [removedQuizId, setRemovedQuizId] = useState<string | null>(null);

  const {
    data: titleData,
    loading: titleLoading,
    error: titleError,
  } = useQuery<GetLessonTitleResponse>(GET_LESSON_TITLE, {
    variables: {
      id: nodeId,
    },
  });

  const {
    data: blockData,
    loading: blockLoading,
    error: blockError,
    refetch: refetchLessonBlocks,
  } = useQuery<GetLessonBlocksResponse>(GET_LESSON_BLOCK, {
    variables: {
      nodeId,
    },
  });

  const { data: quizData, refetch: refetchQuiz } = useAdminLessonQuizQuery({
    variables: { nodeId: nodeId ?? "" },
    skip: !nodeId,
  });

  const [saveQuiz] = useSaveQuizMutation();
  const [deleteQuiz] = useDeleteQuizMutation();

  const [saveLessonTitle] = useMutation(SAVE_LESSON_TITLE);

  const [createLessonBlock] = useMutation<{
    createLessonBlock: GetLessonBlocksResponse["lessonBlocksByNode"][number] | null;
  }>(CREATE_LESSON_BLOCK);

  const [updateLessonBlock] = useMutation(UPDATE_LESSON_BLOCK);

  const [deleteLessonBlock] = useMutation(DELETE_LESSON_BLOCK);

  const [reorderLessonBlocks] = useMutation(REORDER_LESSON_BLOCKS);

  const handleAddButtonClick = (blockId: string) => {
    setOpenBlockId((currentBlockId) => (currentBlockId === blockId ? null : blockId));
  };

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

  const handleSave = async () => {
    if (!nodeId) {
      return;
    }

    const blocksToSave = [...lessonBlocks];
    const textToSave = { ...blockText };
    const blockIdsToDelete = [...deletedBlockIds];

    setIsSaving(true);

    try {
      // 0. Persist the quiz first. The API validates the whole quiz, so an
      // invalid one stops the save here instead of after the lesson is written.
      if (removedQuizId) {
        await deleteQuiz({ variables: { id: removedQuizId } });
        setRemovedQuizId(null);
      } else if (quizDraft) {
        await saveQuiz({
          variables: {
            nodeId,
            input: toSaveQuizInput(quizDraft),
          },
        });
      }

      await refetchQuiz();

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
              type: "HTML",
              html: DOMPurify.sanitize(textToSave[block.id] ?? ""),
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
      const orderedBlockIds = blocksToSave.map((block) => tempIdToRealId.get(block.id) ?? block.id);

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
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Re-sync the quiz draft whenever the server copy changes, which is on load
  // and after each save.
  useEffect(() => {
    const quiz = quizData?.adminSkillNode?.quiz;

    setQuizDraft(quiz ? quizDraftFromServer(quiz) : null);
    setRemovedQuizId(null);
  }, [quizData]);

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

  // Removing a quiz that exists on the server also removes the attempts
  // learners have made, so it asks first. Nothing is deleted until Save.
  const handleQuizRemove = () => {
    const savedQuizId = quizData?.adminSkillNode?.quiz?.id ?? null;

    if (
      savedQuizId &&
      !window.confirm(
        "Removing this quiz also deletes learners' past attempts at it when you save. Remove it?",
      )
    ) {
      return;
    }

    setQuizDraft(null);
    setRemovedQuizId(savedQuizId);
  };

  const handleBlockChange = (blockId: string, newText: string) => {
    setBlockText((previousText) => ({
      ...previousText,
      [blockId]: newText,
    }));
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

    setLessonBlocks(reorderedBlocks);
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
  return (
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
          <Button
            className="rounded-xl"
            variant="outline"
            leftIcon={<Eye />}
            disabled
            title="Preview coming soon"
          >
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            loading={isSaving}
            className="text-primary-foreground bg-primary rounded-xl hover:brightness-[0.96]"
            leftIcon={<Check />}
          >
            {isSaving ? "Saving…" : "Save lesson"}
          </Button>
        </div>
      </div>
      <p className="mb-1">
        {titleData?.adminSkillNode?.tree.course.title} · {titleData?.adminSkillNode?.title}
      </p>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        aria-label="Lesson title"
      />
      <div className="flex flex-col justify-center align-center">
        {(() => {
          const htmlBlocks = lessonBlocks.filter((block) => block.type === "HTML");

          return (
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
              <SortableContext
                items={htmlBlocks.map((block) => block.id)}
                strategy={verticalListSortingStrategy}
              >
                {htmlBlocks.length === 0 && (
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
                />

                {htmlBlocks.map((block) => {
                  return (
                    <SortableLessonBlock block={block} key={block.id}>
                      <Button
                        onClick={() => handleBlockDelete(block.id)}
                        className="self-start rounded-xl text-foreground hover:bg-muted hover:text-foreground border-0"
                        variant="outline"
                        size="sm"
                        aria-label="Delete block"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <div
                        contentEditable
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(blockText[block.id] ?? ""),
                        }}
                        onBlur={(e) => {
                          handleBlockChange(block.id, e.currentTarget.innerHTML);
                        }}
                      ></div>
                      <AddBlockMenu
                        controlKey={block.id}
                        openBlockId={openBlockId}
                        onToggle={handleAddButtonClick}
                        onAddText={() => handleAddTextBlock(block.id)}
                      />
                    </SortableLessonBlock>
                  );
                })}
              </SortableContext>
            </DndContext>
          );
        })()}
      </div>

      <QuizEditor draft={quizDraft} onChange={setQuizDraft} onRemove={handleQuizRemove} />
    </div>
  );
}

export default LessonEditor;
