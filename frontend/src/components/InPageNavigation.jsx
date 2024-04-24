import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({
	children,
	routes,
	defaultHidden = [],
	defualtActiveIndex = 0,
}) => {
	const [inPageNavIndex, setInPageNavIndex] = useState(defualtActiveIndex);

	const activeTabLineRef = useRef();
	const activeTab = useRef();

	const changePageState = (btn, index) => {
		const { offsetWidth, offsetLeft } = btn;

		activeTabLineRef.current.style.width = offsetWidth + "px";
		activeTabLineRef.current.style.left = offsetLeft + "px";

		setInPageNavIndex(index);
	};

	useEffect(() => {
		changePageState(activeTab.current, defualtActiveIndex);
	}, []);

	return (
		<>
			<div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
				{routes.map((route, index) => (
					<button
						ref={index === defualtActiveIndex ? activeTab : null}
						key={index}
						className={`p-4 px-5 capitalize ${
							inPageNavIndex === index ? "text-black" : "text-dark-grey"
						} ${defaultHidden.includes(route) && "md:hidden"}`}
						onClick={(e) => {
							changePageState(e.target, index);
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
