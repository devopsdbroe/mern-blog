import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const blogStructure = {
	title: "",
	description: "",
	content: [],
	tags: [],
	author: { personal_info: {} },
	banner: "",
	publishedAt: "",
};

const BlogPage = () => {
	const { blog_id } = useParams();

	const [blog, setBlog] = useState(blogStructure);

	const {
		title,
		content,
		banner,
		author: {
			personal_info: { fullname, username, profile_img },
		},
		publishedAt,
	} = blog;

	const fetchBlog = async () => {
		try {
			const {
				data: { blog },
			} = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/getBlogs`,
				{
					blog_id,
				}
			);

			setBlog(blog);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchBlog();
	}, [blog_id]);

	return <div>Blog page for {blog.title}</div>;
};
export default BlogPage;
