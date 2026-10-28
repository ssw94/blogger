
import { memo, useCallback, useState } from "react";
import { BlogPreview } from "./BlogPreview";
import { HtmlEditor } from "./HtmlEditor";
import { Box } from "../Box";

const BlogEditor: React.FC = () => {
  const [html, setHtml] = useState("");
  const [title,setTitle] = useState('')
  const handleHtmlChange = useCallback((updatedHtml: string) => {
    setHtml(updatedHtml);
  }, []);

  const panelStyle: React.CSSProperties = {
    flex: "1 1 0",
    width: 0,
    minWidth: 0,
    height: "100%",
    minHeight: 0,
    margin: 0,
    padding: 0,
    display: "block",
    position: "relative",
    overflow: "auto",
    textAlign: "left",
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
        gap: 0,
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        margin: 0,
        padding: 0,
        textAlign: "left",
      }}
    >
      <Box
        style={{
          ...panelStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          borderRight: "1px solid #ddd",
        }}
      >
        <HtmlEditor value={html} onChange={handleHtmlChange} title={title} onTitleChange={(t:string)=> setTitle(t)}/>
      </Box>

      <div style={panelStyle}>
        <BlogPreview html={html} title={title} />
      </div>
    </Box>
  );
};

export default memo(BlogEditor);
