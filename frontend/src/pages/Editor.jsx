import { useContext, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";
import { EditorProvider } from "../context/EditorContext";
import useEditor from "../hooks/useEditor";
import Loader from "../components/Loader";
import axios from "axios";

const Editor = () => {
	const { blog_id } = useParams();

	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	return (
		<EditorProvider>
			<EditorContent
				blog_id={blog_id}
				access_token={access_token}
			/>
		</EditorProvider>
	);
};

const EditorContent = ({ blog_id, access_token }) => {
	const { setBlog, loading, setLoading } = useEditor();

	useEffect(() => {
		if (!blog_id) {
			setLoading(false);
		}

		axios
			.post(`${import.meta.env.VITE_SERVER_DOMAIN}/post/getBlogs`, {
				blog_id,
				draft: true,
				mode: "edit",
			})
			.then(({ data: { blog } }) => {
				setBlog(blog);
				setLoading(false);
			})
			.catch((error) => {
				setBlog(null);
				setLoading(false);
				console.log(error);
			});
	}, []);

	if (access_token === null) {
		return <Navigate to="/sign-in" />;
	} else if (loading) {
		return <Loader />;
	} else {
		return <EditorInnerContent />;
	}
};

const EditorInnerContent = () => {
	const { editorState } = useEditor();

	return editorState === "editor" ? <BlogEditor /> : <PublishForm />;
};

export default Editor;
