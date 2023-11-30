import React, { useContext } from "react";

const AppContext = React.createContext({});

const AppProvider = AppContext.Provider;

const useAppContext = () => {
	const app = useContext(AppContext);
	
	if (!app) {
		throw new Error('useAppContext must be used within AppProvider');
	}
	
	return app;
}

export {
	AppProvider,
	useAppContext
}