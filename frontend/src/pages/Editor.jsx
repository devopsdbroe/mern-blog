import { useState, useContext, createContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";

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

export const EditorContext = createContext({});

const Editor = () => {
	const [editorState, setEditorState] = useState("editor");

	const [blog, setBlog] = useState(blogStructure);

	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	return (
		<EditorContext.Provider
			value={{ blog, setBlog, editorState, setEditorState }}
		>
			{access_token === null ? (
				<Navigate to="/signin" />
			) : editorState === "editor" ? (
				<BlogEditor />
			) : (
				<PublishForm />
			)}
		</EditorContext.Provider>
	);
};
export default Editor;
