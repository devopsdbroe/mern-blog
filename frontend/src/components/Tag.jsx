import useEditor from "../hooks/useEditor";

const Tag = ({ tag, tagIndex }) => {
	let {
		blog,
		blog: { tags },
		setBlog,
	} = useEditor();

	const addEditable = (e) => {
		e.target.setAttribute("contentEditable", true);
		e.target.focus();
	};

	const handleTagDelete = () => {
		tags = tags.filter((t) => t !== tag);

		setBlog({ ...blog, tags });
	};

	const handleTagEdit = (e) => {
		// Check for enter and comma keys
		// If it is, modify the existing tag value
		if (e.keyCode === 13 || e.keyCode === 188) {
			e.preventDefault();

			const currentTag = e.target.innerText;

			// Modify the value at tagIndex with the new value
			tags[tagIndex] = currentTag;

			setBlog({ ...blog, tags });

			e.target.setAttribute("contentEditable", false);
		}
	};

	return (
		<div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
			<p
				className="outline-none"
				onKeyDown={handleTagEdit}
				onClick={addEditable}
			>
				{tag}
			</p>
			<button
				className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
				onClick={handleTagDelete}
			>
				<i className="fi fi-br-cross text-sm pointer-events-none"></i>
			</button>
		</div>
	);
};
export default Tag;
