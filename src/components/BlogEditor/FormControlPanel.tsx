
import { memo } from "react";
import { Box } from "../../components";

export type FormControlItem = {
  label: string;
  icon: string;
  html: string;
};

export const formControls: FormControlItem[] = [
  {
    label: "Text input",
    icon: "T",
    html: '<label style="display:block;margin:8px 0">Text input<br/><input type="text" placeholder="Enter text" style="padding:8px;border:1px solid #ccc;border-radius:4px;max-width:100%"/></label>',
  },
  {
    label: "Email",
    icon: "@",
    html: '<label style="display:block;margin:8px 0">Email<br/><input type="email" placeholder="name@example.com" style="padding:8px;border:1px solid #ccc;border-radius:4px;max-width:100%"/></label>',
  },
  {
    label: "Number",
    icon: "#",
    html: '<label style="display:block;margin:8px 0">Number<br/><input type="number" placeholder="0" style="padding:8px;border:1px solid #ccc;border-radius:4px;max-width:100%"/></label>',
  },
  {
    label: "Password",
    icon: "*",
    html: '<label style="display:block;margin:8px 0">Password<br/><input type="password" placeholder="Enter password" style="padding:8px;border:1px solid #ccc;border-radius:4px;max-width:100%"/></label>',
  },
  {
    label: "Textarea",
    icon: "¶",
    html: '<label style="display:block;margin:8px 0">Message<br/><textarea rows="3" placeholder="Write your message" style="padding:8px;border:1px solid #ccc;border-radius:4px;width:100%;max-width:320px;box-sizing:border-box"></textarea></label>',
  },
  {
    label: "Dropdown",
    icon: "▾",
    html: '<label style="display:block;margin:8px 0">Choose an option<br/><select style="padding:8px;border:1px solid #ccc;border-radius:4px"><option value="">Select...</option><option>Option 1</option><option>Option 2</option></select></label>',
  },
  {
    label: "Checkbox",
    icon: "☑",
    html: '<label style="display:block;margin:8px 0"><input type="checkbox"/> Accept terms</label>',
  },
  {
    label: "Radio button",
    icon: "◉",
    html: '<label style="display:block;margin:8px 0"><input type="radio" name="radio-group"/> Option 1</label>',
  },
  {
    label: "Date picker",
    icon: "▦",
    html: '<label style="display:block;margin:8px 0">Date<br/><input type="date" style="padding:8px;border:1px solid #ccc;border-radius:4px"/></label>',
  },
  {
    label: "Submit button",
    icon: "↵",
    html: '<button type="button" style="padding:9px 18px;margin:8px 0;background:#2563eb;color:white;border:0;border-radius:5px;cursor:pointer">Submit</button>',
  },
];

type FormControlsPanelProps = {
  onDragStart?: (item: FormControlItem) => void;
};

const FormControlsPanel: React.FC<FormControlsPanelProps> = ({
  onDragStart,
}) => {
  return (
    <Box
      sx={{
        width: 170,
        minWidth: 170,
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        padding: 1.5,
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
          paddingBottom: 6,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        Form Controls
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#6b7280",
          marginBottom: 3,
        }}
      >
        Drag a control onto the canvas
      </div>

      {formControls.map((item) => (
        <div
          key={item.label}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.setData(
              "application/x-form-control",
              item.html
            );
            onDragStart?.(item);
          }}
          title={`Drag ${item.label} into the editor`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            background: "#fff",
            color: "#374151",
            fontSize: 12,
            cursor: "grab",
            userSelect: "none",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "#f3f4f6";
            event.currentTarget.style.borderColor = "#93c5fd";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "#fff";
            event.currentTarget.style.borderColor = "#e5e7eb";
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: 5,
              background: "#eff6ff",
              color: "#2563eb",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {item.icon}
          </span>

          {item.label}
        </div>
      ))}
    </Box>
  );
};

export default memo(FormControlsPanel);
