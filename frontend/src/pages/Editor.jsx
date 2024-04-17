import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";

const Editor = () => {
	const [editorState, setEditorState] = useState("editor");

	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	return access_token === null ? (
		<Navigate to="/signin" />
	) : editorState === "editor" ? (
		<BlogEditor />
	) : (
		<PublishForm />
	);
};
export default Editor;
