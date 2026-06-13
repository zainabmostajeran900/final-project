import React, { FC } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

const TinyEditor: FC<TinyEditorProps> = ({ initialValue, onChange }) => {
  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <Editor
    apiKey="daerjr81ozjsh5dzwev7atd8vuchgesytt2smzw254uvp0z8"
      initialValue={initialValue}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help",
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TinyEditor;
