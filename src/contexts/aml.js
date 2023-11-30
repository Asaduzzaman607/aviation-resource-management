import React, { useContext } from "react";

const AMLContext = React.createContext({});
const AMLProvider = AMLContext.Provider;

export default function useAMLContext() {
	const aml = useContext(AMLContext);
	
	if (!aml) {
		throw new Error('useAMLContext must be used within AMLProvider');
	}
	
	return aml;
}

export {
	AMLProvider,
	useAMLContext
}