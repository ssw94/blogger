import { memo, useCallback, useState } from "react";
import { Box } from "../../components";
import { MenuItem, Select } from "@mui/material";
import type { RefObject, CSSProperties, MouseEvent } from "react";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react";

type EditorUtils = ReturnType<typeof editorUtils>;

function editorUtils(editorRef: RefObject<HTMLDivElement | null>) {
  const savedRange = { current: null as Range | null };

  function saveSelection() {
    const selection = window.getSelection();
    const editor = editorRef.current;

    if (
      selection &&
      selection.rangeCount > 0 &&
      editor?.contains(selection.anchorNode) &&
      editor.contains(selection.focusNode)
    ) {
      savedRange.current = selection.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const editor = editorRef.current;
    const selection = window.getSelection();
    const range = savedRange.current;

    if (!editor || !selection || !range) return false;

    if (
      !editor.contains(range.startContainer) ||
      !editor.contains(range.endContainer)
    ) {
      return false;
    }

    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();

    return true;
  }

  function executeCommand(command: string, value?: string) {
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
  }

  function bold() {
    executeCommand("bold");
  }

  function italic() {
    executeCommand("italic");
  }

  function alignLeft() {
    executeCommand("justifyLeft");
  }

  function alignRight() {
    executeCommand("justifyRight");
  }

  function alignCenter() {
    executeCommand("justifyCenter");
  }

  function numberList() {
    executeCommand("insertUnorderedList");
  }

  function orderedList() {
    executeCommand("insertOrderedList");
  }

  function colorPicker(color: string) {
    executeCommand("foreColor", color);
  }

  function fontSize(size: number) {
    const editor = editorRef.current;
    if (!editor || !restoreSelection()) return;

    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("fontSize", false, "7");

    editor.querySelectorAll('font[size="7"]').forEach((element) => {
      element.removeAttribute("size");
      (element as HTMLElement).style.fontSize = `${size}px`;
    });

    saveSelection();
  }

  return {
    fontSize,
    orderedList,
    numberList,
    alignCenter,
    alignLeft,
    alignRight,
    colorPicker,
    bold,
    italic,
    saveSelection,
  };
}

type EditorToolBarProps = {
  editorRef: RefObject<HTMLDivElement | null>;
};

const EditorToolBar: React.FC<EditorToolBarProps> = ({ editorRef }) => {
  const utils = editorUtils(editorRef);
  const [color, setColor] = useState("#1f2937");
  const [size, setSize] = useState("16");

  const preventFocusLoss = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      utils.saveSelection();
    },
    [utils],
  );

  const buttonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    minWidth: 34,
    padding: 0,
    border: "1px solid transparent",
    borderRadius: 5,
    background: "transparent",
    color: "#374151",
    cursor: "pointer",
    flexShrink: 0,
  };

  const separatorStyle: CSSProperties = {
    width: 1,
    height: 24,
    background: "#d1d5db",
    margin: "0 5px",
    flexShrink: 0,
  };

  const tools = [
    { title: "Bold", action: utils.bold, Icon: Bold },
    { title: "Italic", action: utils.italic, Icon: Italic },
    { title: "Align left", action: utils.alignLeft, Icon: AlignLeft },
    { title: "Align center", action: utils.alignCenter, Icon: AlignCenter },
    { title: "Align right", action: utils.alignRight, Icon: AlignRight },
    { title: "Bulleted list", action: utils.numberList, Icon: List },
    { title: "Numbered list", action: utils.orderedList, Icon: ListOrdered },
  ];

  return (
    <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          alignContent: "flex-start",
          flexWrap: "wrap",
          gap: "3px",
          width: "100%",
          minWidth: 0,
          height: "fit-content",
          boxSizing: "border-box",
          padding: "7px 10px",
          margin: 0,
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          alignSelf: "flex-start",
          textAlign: "left",
        }}
      >
      {tools.map(({ title, action, Icon }, index) => (
        <div
          key={title}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {(index === 2 || index === 5) && <span style={separatorStyle} />}

          <button
            type="button"
            title={title}
            aria-label={title}
            onMouseDown={preventFocusLoss}
            onClick={action}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e5e7eb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <Icon size={18} strokeWidth={1.8} />
          </button>
        </div>
      ))}

      <span style={separatorStyle} />

      <label
        title="Text color"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          height: 34,
          padding: "0 5px",
          fontSize: 12,
          color: "#374151",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <span>A</span>
        <input
          type="color"
          aria-label="Text color"
          value={color}
          onMouseDown={utils.saveSelection}
          onChange={(e) => {
            const nextColor = e.target.value;
            setColor(nextColor);
            utils.colorPicker(nextColor);
          }}
          style={{
            width: 22,
            height: 22,
            padding: 2,
            border: "1px solid #d1d5db",
            borderRadius: 4,
            background: "#fff",
            cursor: "pointer",
          }}
        />
      </label>

      <span style={separatorStyle} />

      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12,
          color: "#374151",
          flexShrink: 0,
        }}
      >
        <Select
          size="small"
          value={size}
          onMouseDown={utils.saveSelection}
          onChange={(e) => {
            const nextSize = String(e.target.value);
            setSize(nextSize);
            utils.fontSize(Number(nextSize));
          }}
          sx={{
            minWidth: 78,
            height: 32,
            fontSize: 13,
            backgroundColor: "#fff",
            borderRadius: "5px",
            "& .MuiSelect-select": {
              padding: "6px 9px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d1d5db",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#9ca3af",
            },
          }}
        >
          {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64].map(
            (fontSize) => (
              <MenuItem key={fontSize} value={String(fontSize)}>
                {fontSize}px
              </MenuItem>
            ),
          )}
        </Select>
      </label>
    </div>
  );
};

EditorToolBar.displayName = "EditorToolBar";

export default memo(EditorToolBar);
