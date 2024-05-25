const Img = ({ url, caption }) => {
	return (
		<div>
			<img
				src={url}
				alt="caption"
			/>
			{caption && caption.length > 0 && (
				<p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
					{caption}
				</p>
			)}
		</div>
	);
};

const Quote = ({ quote, caption }) => {
	return (
		<div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
			<p className="text-xl leading-10 md:text-2xl">{quote}</p>
			{caption && caption.length > 0 && (
				<p className="w-full text-purple text-base">{caption}</p>
			)}
		</div>
	);
};

const List = ({ style, items }) => {
	const renderListItems = (items, isOrdered) => {
		return items.map((item, i) => {
			if (typeof item === "object" && item.items) {
				return (
					<li
						key={i}
						className="my-4"
					>
						<span dangerouslySetInnerHTML={{ __html: item.content }}></span>
						{isOrdered ? (
							<ol className="pl-5 list-decimal">
								{renderListItems(item.items, isOrdered)}
							</ol>
						) : (
							<ul className="pl-5 list-disc">
								{renderListItems(item.items, isOrdered)}
							</ul>
						)}
					</li>
				);
			}
			return (
				<li
					key={i}
					className="my-4"
					dangerouslySetInnerHTML={{ __html: item }}
				></li>
			);
		});
	};

	return (
		<div>
			{style === "ordered" ? (
				<ol className="pl-5 list-decimal">{renderListItems(items, true)}</ol>
			) : (
				<ul className="pl-5 list-disc">{renderListItems(items, false)}</ul>
			)}
		</div>
	);
};

const BlogContent = ({ block }) => {
	const { type, data } = block;

	if (type == "paragraph") {
		return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
	}

	if (type === "header") {
		if (data.level === 3) {
			return (
				<h3
					className="text-3xl font-bold"
					dangerouslySetInnerHTML={{ __html: data.text }}
				></h3>
			);
		}
		return (
			<h2
				className="text-4xl font-bold"
				dangerouslySetInnerHTML={{ __html: data.text }}
			></h2>
		);
	}

	if (type === "image") {
		return (
			<Img
				url={data.file.url}
				caption={data.caption}
			/>
		);
	}

	if (type === "quote") {
		return (
			<Quote
				quote={data.text}
				caption={data.caption}
			/>
		);
	}

	if (type === "list") {
		return (
			<List
				style={data.style}
				items={data.items}
			/>
		);
	}

	return null; // Return null if block type is not handled
};
export default BlogContent;
