import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({
	children,
	routes,
	defaultHidden = [],
	defualtActiveIndex = 0,
}) => {
	const [inPageNavIndex, setInPageNavIndex] = useState(defualtActiveIndex);

	activeTabLineRef = useRef();
	activeTabRef = useRef();

	const changePageState = (btn, i) => {
		const { offsetWidth, offsetLeft } = btn;

		activeTabLineRef.current.style.width = offsetWidth + "px";
		activeTabLineRef.current.style.left = offsetLeft + "px";

		setInPageNavIndex(i);
	};

	useEffect(() => {
		changePageState(activeTabRef.current, defualtActiveIndex);
	}, []);

	return (
		<>
			<div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
				{routes.map((route, i) => (
					<button
						ref={i === defualtActiveIndex ? activeTabRef : null}
						key={i}
						className={`p-4 px-5 capitalize ${
							inPageNavIndex === i ? "text-black" : "text-dark-grey"
						} ${defaultHidden.includes(route) && "md:hidden"}`}
						onClick={(e) => {
							changePageState(e.target, i);
						}}
					>
						{route}
					</button>
				))}

				<hr
					ref={activeTabLineRef}
					className="absolute bottom-0 duration-300"
				/>
			</div>

			{Array.isArray(children) ? children[inPageNavIndex] : children}
		</>
	);
};
export default InPageNavigation;
