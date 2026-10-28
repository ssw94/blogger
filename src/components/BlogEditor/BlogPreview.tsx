
import { Avatar, Divider } from "@mui/material";
import { Calendar } from "lucide-react";
import { memo } from "react";

type BlogPreviewProps = {
  html: string;
  title: string;
};

const currentDate = new Date()?.toDateString();

export const BlogPreview: React.FC<BlogPreviewProps> = memo(({ html,title }) => {
  return (
    <>
      <div style={{padding:'5px 15px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',placeItems:'center',gap:2}}>
        <span style={{ fontWeight: 'bold', fontSize: '24px' }}>{title}</span>
        <div className="flex flex-row gap-2 justify-center items-center">
        <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',placeItems:'center'}}><Avatar variant="rounded"/> Sachin Waghmare</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', placeItems: 'center' }}><Calendar />{currentDate}</div>
        </div>
      </div>
      <Divider/>
    <div
      style={{
        display: "block",
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        boxSizing: "border-box",
        margin: 0,
        padding: "8px",
        textAlign: "left",
        verticalAlign: "top",
        overflowWrap: "break-word",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
});

BlogPreview.displayName = "BlogPreview";
