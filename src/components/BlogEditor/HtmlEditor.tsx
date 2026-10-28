
import type { DragEvent, FormEvent } from "react";
import { memo, useCallback, useEffect, useRef } from "react";
import EditorToolBar from "./EditorToolBar";
import FormControlsPanel from "./FormControlPanel";
import { Input } from "../Input";
import { Box } from "../Box";

type HtmlEditorProps = {
  onChange?: (html: string) => void;
  value?: string;
  onTitleChange?: (t: string) => void;
  title?: string;
};

export const HtmlEditor: React.FC<HtmlEditorProps> = memo(
  ({ onChange, value = "",onTitleChange,title }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const editor = editorRef.current;

      // Avoid replacing the DOM unnecessarily, preserving the caret.
      if (editor && editor.innerHTML !== value) {
        editor.innerHTML = value;
      }
    }, [value]);

    const handleInput = useCallback(
      (event: FormEvent<HTMLDivElement>) => {
        onChange?.(event.currentTarget.innerHTML);
      },
      [onChange]
    );

    const handleDragOver = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        if (
          event.dataTransfer.types.includes(
            "application/x-form-control"
          )
        ) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }
      },
      []
    );

    const handleDrop = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        const html = event.dataTransfer.getData(
          "application/x-form-control"
        );

        if (!html) return;

        event.preventDefault();
        event.stopPropagation();

        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();

        const doc = editor.ownerDocument;
        const selection = doc.getSelection();
        let range: Range | null = null;

        // Find the cursor position where the control was dropped.
        const pointDoc = doc as Document & {
          caretRangeFromPoint?: (
            x: number,
            y: number
          ) => Range | null;
          caretPositionFromPoint?: (
            x: number,
            y: number
          ) => {
            offsetNode: Node;
            offset: number;
          } | null;
        };

        if (pointDoc.caretRangeFromPoint) {
          range = pointDoc.caretRangeFromPoint(
            event.clientX,
            event.clientY
          );
        } else if (pointDoc.caretPositionFromPoint) {
          const position = pointDoc.caretPositionFromPoint(
            event.clientX,
            event.clientY
          );

          if (position) {
            range = doc.createRange();
            range.setStart(position.offsetNode, position.offset);
            range.collapse(true);
          }
        }

        // Only use a range that belongs to this editor.
        if (
          !range ||
          !editor.contains(range.startContainer) ||
          !editor.contains(range.endContainer)
        ) {
          range = doc.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);
        }

        const fragment = range.createContextualFragment(html);
        const insertedNodes = Array.from(fragment.childNodes);
        const lastNode = insertedNodes[insertedNodes.length - 1];

        range.deleteContents();
        range.insertNode(fragment);

        // Put the caret immediately after the inserted control.
        if (lastNode?.parentNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);

          selection?.removeAllRanges();
          selection?.addRange(range);
        }

        onChange?.(editor.innerHTML);
      },
      [onChange]
    );

    return (
      <Box className="flex flex-col gap-2">
        <Input placeholder="Blog title" label="Blog Title" onChange={(e) => onTitleChange?.(e?.target?.value)} value={title} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          gap: 8,
          width: "100%",
          minWidth: 0,
          minHeight: 0,
          margin: 0,
          padding: 0,
        }}
      >
        <EditorToolBar editorRef={editorRef} />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 12,
            width: "100%",
            minWidth: 0,
          }}
        >
          {/*<FormControlsPanel />*/}

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-placeholder="Start writing or drag a form control here..."
            style={{
              flex: "1 1 0",
              minWidth: 0,
              minHeight: 350,
              boxSizing: "border-box",
              padding: 12,
              margin: 0,
              textAlign: "left",
              verticalAlign: "top",
              overflowWrap: "break-word",
              whiteSpace: "normal",
              outline: "none",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
            }}
          />
        </div>
        </div>
      </Box>
    );
  }
);

HtmlEditor.displayName = "HtmlEditor";
