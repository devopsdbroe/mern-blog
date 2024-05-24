import { useContext } from "react";
import { EditorContext } from "../context/EditorContext.jsx";

const useEditor = () => {
	const context = useContext(EditorContext);

	if (!context) {
		throw new Error("useEditor must be used within an EditorProvider");
	}

	return context;
};

export default useEditor;
