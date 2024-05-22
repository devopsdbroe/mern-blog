import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";
import { EditorProvider } from "../context/EditorContext";
import useEditor from "../hooks/useEditor";

const Editor = () => {
	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	return (
		<EditorProvider>
			{access_token === null ? <Navigate to="/signin" /> : <EditorContent />}
		</EditorProvider>
	);
};

const EditorContent = () => {
	const { editorState } = useEditor();

	return editorState === "editor" ? <BlogEditor /> : <PublishForm />;
};

export default Editor;
