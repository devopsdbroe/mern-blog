import { createContext, useState } from "react";

// Define starting state of editor
const blogStructure = {
	title: "",
	banner: "",
	content: [],
	tags: [],
	description: "",
	author: {
		personal_info: {},
	},
};

export const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
	const [editorState, setEditorState] = useState("editor");
	const [blog, setBlog] = useState(blogStructure);
	const [textEditor, setTextEditor] = useState({ isReady: false });
	const [loading, setLoading] = useState(true);

	return (
		<EditorContext.Provider
			value={{
				blog,
				setBlog,
				editorState,
				setEditorState,
				textEditor,
				setTextEditor,
				loading,
				setLoading,
			}}
		>
			{children}
		</EditorContext.Provider>
	);
};
