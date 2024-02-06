import { useState, Suspense } from "react";

import "./TagPicker.css";

export const TAG_NAMES = ["sales", "engineering", "product", "marketing", "support"];

type Props = {
  onChange?: (tags: string[]) => void;
};

export const TagPicker: React.FC<Props> = ({ onChange }) => {
  const [tags, setTags] = useState<{ [key: string]: boolean }>({});

  return (
    <div>
      {TAG_NAMES.map((tagName) => {
        return (
          <label key={tagName} className={"TagPicker--tag"}>
            {tagName}
            <input
              type="checkbox"
              name={`TagPicker--tag--${tagName}`}
              checked={!!tags[tagName]}
              onChange={() => {
                const newTags = {
                  ...tags,
                  [tagName]: !tags[tagName],
                };
                setTags(newTags);
                if (onChange) {
                  onChange(Object.keys(newTags).filter((k) => !!newTags[k]));
                }
              }}
            />
          </label>
        );
      })}
    </div>
  );
};
