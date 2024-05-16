import { useContext } from "react";
import { EditorContext } from "../context/EditorContext.jsx";

const useEditor = () => {
	return useContext(EditorContext);
};

export default useEditor;
