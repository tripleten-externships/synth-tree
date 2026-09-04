import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import {closestCenter,DndContext,type DragEndEvent} from "@dnd-kit/core";
import {arrayMove,SortableContext,useSortable,verticalListSortingStrategy} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input } from "@synth-tree/ui";
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
      }
    }
  }
`;

const GET_LESSON_BLOCK = gql`
  query lessonBlocksByNode($nodeId: ID!) {
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

// ─── 2. TYPES ─────────────────────────────────────────────────────────────────

type GetLessonTitleResponse = {
  adminSkillNode?: {
    id: string;
    title: string;
    tree: {
      courseId: string;
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

function LessonEditor(){
  const { nodeId } = useParams();
  const [title, setTitle] = useState("");
  const [blockText, setBlockText] = useState<Record<string, string>>({});
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);
  const [lessonBlocks, setLessonBlocks] = useState<GetLessonBlocksResponse["lessonBlocksByNode"]>([]);
  const [deletedBlockIds, setDeletedBlockIds] = useState<string[]>([]);

  const { data: titleData, loading: titleLoading, error: titleError } = useQuery<GetLessonTitleResponse>(GET_LESSON_TITLE, {
    variables: {
      id: nodeId,
    },
  });

  const { data: blockData, loading: blockLoading, error: blockError } = useQuery<GetLessonBlocksResponse>(GET_LESSON_BLOCK, {
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

  const htmlToText = (html: string) => {
    const element = document.createElement("div");
    element.innerHTML = DOMPurify.sanitize(html);

    return element.textContent ?? "";
  };

  const clicked = () => {
    setOpenBlockId(null);
  };

  const handleAddButtonClick = (blockId: string) => {
    setOpenBlockId((currentBlockId) =>
      currentBlockId === blockId ? null : blockId,
    );
  }

  const handleAddTextBlock = async (afterBlockId: string) => {
    setOpenBlockId(null);

    if (!nodeId) {
      return;
    }

    const clickedBlockIndex = lessonBlocks.findIndex(
      (block) => block.id === afterBlockId,
    );
    const insertionIndex = clickedBlockIndex >= 0
      ? clickedBlockIndex + 1
      : lessonBlocks.length;

    const { data } = await createLessonBlock({
      variables: {
        input: {
          node: {
            connect: {
              id: nodeId,
            },
          },
          order: insertionIndex,
          type: "HTML",
          html: "",
        },
      },
    });

    const newBlock = data?.createLessonBlock;

    if (!newBlock) {
      return;
    }

    const reorderedBlocks = [
      ...lessonBlocks.slice(0, insertionIndex),
      newBlock,
      ...lessonBlocks.slice(insertionIndex),
    ].map((block, index) => ({
      ...block,
      order: index,
    }));

    await Promise.all(
      reorderedBlocks
        .filter((block) => block.id !== newBlock.id)
        .map((block) =>
          updateLessonBlock({
            variables: {
              input: {
                id: { set: block.id },
                order: { set: block.order },
              },
            },
          }),
        ),
    );

    setLessonBlocks(reorderedBlocks);
    setBlockText((previousText) => ({
      ...previousText,
      [newBlock.id]: "",
    }));
  };

  const handleSave = async () => {
    const blocksToSave = [...lessonBlocks];
    const textToSave = { ...blockText };
    const blockIdsToDelete = [...deletedBlockIds];

    await Promise.all([
      saveLessonTitle({
        variables: {
          updateSkillNodeId: nodeId,
          input: {
            title: title,
          },
        }
      }),
      ...blocksToSave.map((block) =>
        updateLessonBlock({
          variables: {
            input: {
              id: {
                set: block.id,
              },
              order: { set: block.order },
              ...(block.type === "HTML"
                ? { html: { set: DOMPurify.sanitize(textToSave[block.id] ?? "") } }
                : {}),
            }
          }
        }),
      ),
      ...blockIdsToDelete.map((blockId) =>
        deleteLessonBlock({
          variables: {
            id: blockId,
          },
        }),
      ),
    ]);

    setDeletedBlockIds([]);
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
        startingText[block.id] = htmlToText(block.html ?? "");
      });

    setBlockText(startingText);

  }, [titleData, blockData]);

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
          <Button className="rounded-xl" variant="outline" leftIcon={<Eye />}>
            Preview
          </Button>
          <Button onClick={handleSave} className="text-primary-foreground bg-primary rounded-xl hover:brightness-[0.96]" leftIcon={<Check />}>
            Save lesson
          </Button>
        </div>
      </div>
      <p className="mb-1">Organic Chemistry · Chapter 5: Hybridization</p>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} type="text" aria-label="Lesson title"/>
      <div className="flex flex-col justify-center align-center">
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
          <SortableContext items={lessonBlocks.filter((block) => block.type === "HTML").map((block) => block.id)} strategy={verticalListSortingStrategy}
          >
            {lessonBlocks
                .filter((block) => {
                  return block.type === "HTML"
                }).map((block) => {
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
                      <textarea
                        value={blockText[block.id] ?? ""}
                        onChange={(e) =>
                          handleBlockChange(
                            block.id,
                            e.target.value
                          )
                        }
                      ></textarea>
                      <div className="flex justify-center relative">
                        <Button
                          onClick={() => handleAddButtonClick(block.id)}
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full border border-border bg-muted text-muted-foreground opacity-40 hover:opacity-100"
                          aria-label="Add block"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>

                        {openBlockId === block.id && (
                          <div className="absolute top-8 z-10 flex gap-1 rounded-[14px] border bg-popover p-1.5 shadow-md">
                            <Button
                              onClick={clicked}
                              leftIcon={<Pen />}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-[7px] text-[13px] font-medium leading-none rounded-[10px] border border-transparent bg-transparent text-foreground transition-all duration-150"
                              aria-label="Add heading block"
                            >
                              Heading
                            </Button>
                            <Button
                              onClick={() => handleAddTextBlock(block.id)}
                              leftIcon={<AlignJustify />}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-[7px] text-[13px] font-medium leading-none rounded-[10px] border border-transparent bg-transparent text-foreground transition-all duration-150"
                              aria-label="Add Text block"
                            >
                              Text
                            </Button>
                            <Button
                              onClick={clicked}
                              leftIcon={<Image />}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-[7px] text-[13px] font-medium leading-none rounded-[10px] border border-transparent bg-transparent text-foreground transition-all duration-150"
                              aria-label="Add image block"
                            >
                              Image
                            </Button>
                            <Button
                              onClick={clicked}
                              leftIcon={<PlaySquare />}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-[7px] text-[13px] font-medium leading-none rounded-[10px] border border-transparent bg-transparent text-foreground transition-all duration-150"
                              aria-label="Add video block"
                            >
                              Video
                            </Button>
                            <Button
                              onClick={clicked}
                              leftIcon={<Code2 />}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-[7px] text-[13px] font-medium leading-none rounded-[10px] border border-transparent bg-transparent text-foreground transition-all duration-150"
                              aria-label="Add embeded block"
                            >
                              Embeded
                            </Button>
                          </div>
                        )}
                      </div>
                    </SortableLessonBlock>)
                })
              }
          </SortableContext>
        </DndContext>


      </div>
    </div>
  );
}

export default LessonEditor;
